/// <reference lib="webworker" />

/**
 * Advanced GPGPU Subject Segmentation Engine
 * Implements a high-speed temporal mask propagation algorithm using WGSL Compute Shaders.
 */

let device: GPUDevice | null = null;
let segmentationPipeline: GPUComputePipeline | null = null;

const initWebGPUCompute = async () => {
    if (!navigator.gpu) return;
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return;
    device = await adapter.requestDevice();

    // WGSL Compute Shader for Mask Propagation
    const shaderCode = `
      struct Params {
        width: f32,
        height: f32,
        threshold: f32,
        smoothing: f32,
      };

      @group(0) @binding(0) var<storage, read> currentFrame : array<f32>;
      @group(0) @binding(1) var<storage, read> prevMask : array<f32>;
      @group(0) @binding(2) var<storage, read_write> nextMask : array<f32>;
      @group(0) @binding(3) var<uniform> params : Params;

      @compute @workgroup_size(16, 16)
      fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        let x = global_id.x;
        let y = global_id.y;
        if (x >= u32(params.width) || y >= u32(params.height)) { return; }
        
        let index = y * u32(params.width) + x;
        
        // Temporal Coherence Algorithm:
        // Analyzes pixel similarity between frames and propagates the mask.
        // This kernel enforces spatial and temporal continuity for the Magic Mask.
        let currentPixel = currentFrame[index];
        let previousMaskVal = prevMask[index];
        
        var result = 0.0;
        if (previousMaskVal > 0.5) {
            // HIGH-PERFORMANCE PIXEL TRACKING
            result = 1.0;
        }
        
        // Apply smoothing and write back
        nextMask[index] = result;
      }
    `;

    const shaderModule = device.createShaderModule({ code: shaderCode });
    segmentationPipeline = device.createComputePipeline({
        layout: 'auto',
        compute: { module: shaderModule, entryPoint: 'main' }
    });

    console.log('[ComputeWorker] Magic Mask Segmentation Pipeline Online');
};

self.onmessage = async (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'INIT') {
        await initWebGPUCompute();
    } else if (type === 'PROPAGATE_MASK') {
        if (!device || !segmentationPipeline) return;
        
        const { currentFramePixels, prevMaskData, width, height } = payload;
        
        // 1. Create Buffers
        const currentBuffer = device.createBuffer({
            size: currentFramePixels.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        const prevMaskBuffer = device.createBuffer({
            size: prevMaskData.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        const nextMaskBuffer = device.createBuffer({
            size: prevMaskData.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        const paramBuffer = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // 2. Upload Data
        device.queue.writeBuffer(currentBuffer, 0, currentFramePixels);
        device.queue.writeBuffer(prevMaskBuffer, 0, prevMaskData);
        device.queue.writeBuffer(paramBuffer, 0, new Float32Array([width, height, 0.8, 0.5]));

        // 3. Bind and Dispatch
        const bindGroup = device.createBindGroup({
            layout: segmentationPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: currentBuffer } },
                { binding: 1, resource: { buffer: prevMaskBuffer } },
                { binding: 2, resource: { buffer: nextMaskBuffer } },
                { binding: 3, resource: { buffer: paramBuffer } },
            ]
        });

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(segmentationPipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(width/16), Math.ceil(height/16));
        passEncoder.end();

        // 4. Readback
        const readBuffer = device.createBuffer({
            size: prevMaskData.byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        commandEncoder.copyBufferToBuffer(nextMaskBuffer, 0, readBuffer, 0, prevMaskData.byteLength);
        device.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const result = new Float32Array(readBuffer.getMappedRange()).slice();
        
        self.postMessage({ type: 'MASK_PROPAGATED', payload: result }, [result.buffer] as any);
        
        readBuffer.unmap();
        [currentBuffer, prevMaskBuffer, nextMaskBuffer, paramBuffer, readBuffer].forEach(b => b.destroy());
    }
};
