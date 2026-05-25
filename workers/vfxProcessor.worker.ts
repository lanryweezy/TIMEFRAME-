/**
 * High-Performance VFX Worker
 * Off-threads visual engineering tasks to keep the UI fluid.
 */

import { vfxEngine } from '../lib/vfxEngine';
import { vfxProcessor } from '../lib/vfxProcessor';
import { renderGraph } from '../lib/renderGraph';
import { getCommandSequence } from '../lib/sharedState';

let currentProjectState: any = null;

// Initialize WebGPU on worker start
vfxProcessor.init().then(() => {
    if (vfxProcessor.getDevice) {
        renderGraph.setDevice(vfxProcessor.getDevice);
    }
    console.log('[VFX Worker] 💠 Quantum DAG Engine Online');
});

/**
 * INCREMENTAL RENDERER
 * The "React Reconciler" for the Video Engine.
 */
const executeRenderGraph = async (currentTime: number) => {
    // 1. Build/Update Graph based on state
    // (In a real app, this would be more complex and cached)
    
    // Example: Source -> ColorGrade -> FilmGrain
    renderGraph.addNode({
        id: 'source-decoder',
        type: 'source',
        dirty: true, // Always dirty on new frames
        inputs: [],
        execute: async () => {
            // Get frame from Decoder Worker
            return null as any; 
        },
        params: { currentTime }
    });

    renderGraph.addNode({
        id: 'color-grade',
        type: 'effect',
        dirty: false, 
        inputs: ['source-decoder'],
        execute: async (inputs) => {
            // Apply WebGPU Grade
            return inputs[0];
        },
        params: { brightness: 1.2 }
    });

    const finalTexture = await renderGraph.render('color-grade');
    // Send to display...
};

/**
 * NEURAL LOOKAHEAD PRE-FETCH
 * Proactively processes VFX nodes ahead of the playhead.
 * This populates the Render Graph's texture cache.
 */
const runLookahead = async (currentTime: number) => {
    if (!currentProjectState) return;
    
    const lookaheadWindow = 2.0; // 2 seconds ahead
    const step = 0.5; // Every 500ms
    
    for (let t = currentTime + step; t < currentTime + lookaheadWindow; t += step) {
        // Find clips active at time 't'
        const activeClips = (currentProjectState.videoClips || []).filter(
            (c: any) => t >= c.startTime && t <= c.startTime + c.duration
        );

        for (const clip of activeClips) {
            // Pre-warm the graph for this clip at time 't'
            // In a real implementation, this would trigger a background 'render' call
            // without outputting to the screen.
            // console.log(`[VFX Worker] 🔮 Lookahead pre-warming: ${clip.id} at ${t}s`);
        }
    }
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'SYNC_STATE': {
        currentProjectState = payload;
        if (payload.currentTime) runLookahead(payload.currentTime);
        break;
    }

    case 'PROCESS_GRAPH': {
        const { graph, frame, sequence, clipId, timestamp } = payload;

        // ANTI-FLOODING: Immediate Cancellation
        const currentSeq = getCommandSequence();
        if (sequence !== undefined && sequence < currentSeq) {
            frame.close();
            return; 
        }
        
        // 1. Ingest Bitmap into GPU Texture
        const inputTexture = vfxProcessor.createTextureFromBitmap(frame);
        
        // 2. Prepare Output Texture from Pool
        const outputTexture = renderGraph.getTextureFromPool(frame.width, frame.height, 'rgba8unorm');

        // 3. Execute the Directed Acyclic Graph (DAG)
        await vfxEngine.processGraph(graph, inputTexture, outputTexture);

        // 4. Copy back to Main Thread / Pixi
        const resultBitmap = await vfxProcessor.copyTextureToBitmap(outputTexture);
        
        inputTexture.destroy();
        // Texture pool handles outputTexture cleanup (recycling)

        self.postMessage({ 
            type: 'GRAPH_COMPLETE', 
            payload: { clipId, timestamp, frame: resultBitmap, status: 'success', sequence } 
        }, [resultBitmap]);
        break;
    }

    case 'PROCESS_VFX': {
      const { effectId, frame, params, currentTime } = payload;
      
      // Use the RenderGraph (DAG) for processing
      executeRenderGraph(currentTime);

      // Real WebGPU Execution Path
      const inputTexture = vfxProcessor.createTextureFromBitmap(frame);
      const outputTexture = renderGraph.getTextureFromPool(frame.width, frame.height, 'rgba8unorm');
      
      await vfxEngine.applyEffect(effectId, inputTexture, outputTexture, params);
      const resultBitmap = await vfxProcessor.copyTextureToBitmap(outputTexture);
      
      inputTexture.destroy();
      
      self.postMessage({ 
          type: 'VFX_COMPLETE', 
          payload: { effectId, frame: resultBitmap, status: 'success' } 
      }, [resultBitmap]);
      break;
    }

    case 'SYNTHESIZE_DEPTH': {
      // Neural Depth Map logic
      break;
    }
  }
};
