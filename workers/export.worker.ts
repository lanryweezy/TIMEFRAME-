/// <reference lib="webworker" />
import * as PIXI from 'pixi.js';
import { VideoState } from '../types';

let app: PIXI.Application | null = null;
let encoder: VideoEncoder | null = null;
let decoderWorker: Worker | null = null;

const frameCache = new Map<string, VideoFrame>();

const interpolate = (keyframes: any[], time: number, defaultValue: number) => {
    if (!keyframes || keyframes.length === 0) return defaultValue;
    const sorted = [...keyframes].sort((a, b) => a.time - b.time);
    if (time <= sorted[0].time) return sorted[0].value;
    if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;

    for (let i = 0; i < sorted.length - 1; i++) {
        const k1 = sorted[i];
        const k2 = sorted[i + 1];
        if (time >= k1.time && time <= k2.time) {
            const t = (time - k1.time) / (k2.time - k1.time);
            return k1.value + (k2.value - k1.value) * t;
        }
    }
    return defaultValue;
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'START_EXPORT') {
    const { state, exportRange } = payload as { state: VideoState, exportRange?: { start: number; end: number } };
    const { width, height } = state.projectSettings.resolution;
    const fps = state.projectSettings.fps;
    
    const startTime = exportRange?.start ?? 0;
    const endTime = exportRange?.end ?? state.duration;
    const startFrame = Math.floor(startTime * fps);
    const endFrame = Math.ceil(endTime * fps);
    const totalFrames = endFrame - startFrame;

    console.log(`ExportWorker: 🎞️ Rendering ${totalFrames} frames from ${startTime.toFixed(2)}s to ${endTime.toFixed(2)}s`);

    // 1. Initialize Decoder Worker (Deterministic Source)
    decoderWorker = new Worker(new URL('./decoder.worker.ts', import.meta.url), { type: 'module' });
    decoderWorker.onmessage = (de) => {
        if (de.data.type === 'FRAME_READY') {
            const { clipId, timestamp, frame } = de.data.payload;
            frameCache.set(`${clipId}-${timestamp.toFixed(2)}`, frame);
        }
    };

    // 2. Initialize Offscreen Renderer
    app = new PIXI.Application();
    await app.init({ width, height, backgroundAlpha: 0, antialias: true, preference: 'webgpu' });

    // 3. Configure WebCodecs Encoder
    encoder = new VideoEncoder({
      output: (chunk) => {
        self.postMessage({ type: 'ENCODED_CHUNK', payload: { chunk } });
      },
      error: (e) => self.postMessage({ type: 'EXPORT_ERROR', payload: e.message })
    });

    encoder.configure({
      codec: 'avc1.640028',
      width, height,
      bitrate: 12_000_000, 
      framerate: fps,
    });

    // 4. Sequential Render Loop
    for (let i = 0; i < totalFrames; i++) {
      const currentTime = (startFrame + i) / fps;
      
      const activeClips = state.videoClips.filter(
        (c) => currentTime >= c.startTime && currentTime <= c.startTime + c.duration
      ).sort((a, b) => (a.trackId || 0) - (b.trackId || 0));

      app.stage.removeChildren();
      
      for (const clip of activeClips) {
          const cacheKey = `${clip.id}-${currentTime.toFixed(2)}`;
          
          if (!frameCache.has(cacheKey)) {
              // Create a one-time listener for this specific frame
              const framePromise = new Promise<VideoFrame>((resolve) => {
                  const check = () => {
                      if (frameCache.has(cacheKey)) {
                          resolve(frameCache.get(cacheKey)!);
                      } else {
                          // Still waiting, but we've already sent the message
                          requestAnimationFrame(check);
                      }
                  };
                  decoderWorker!.postMessage({ type: 'REQUEST_FRAME', payload: { clipId: clip.id, timestamp: currentTime } });
                  check();
              });
              await framePromise;
          }

          const frame = frameCache.get(cacheKey)!;
          const texture = PIXI.Texture.from(frame);
          const sprite = new PIXI.Sprite(texture);
          
          const timeInClip = Math.max(0, currentTime - clip.startTime);
          const scale = interpolate(clip.transform?.keyframes?.scale || [], timeInClip, clip.transform?.scale ?? 100) / 100;
          const rotation = interpolate(clip.transform?.keyframes?.rotation || [], timeInClip, clip.transform?.rotation ?? 0) * (Math.PI / 180);
          const posX = interpolate(clip.transform?.keyframes?.positionX || [], timeInClip, clip.transform?.positionX ?? 0);
          const posY = interpolate(clip.transform?.keyframes?.positionY || [], timeInClip, clip.transform?.positionY ?? 0);
          const opacity = interpolate(clip.transform?.keyframes?.opacity || [], timeInClip, clip.transform?.opacity ?? 100) / 100;

          sprite.anchor.set(0.5);
          sprite.scale.set(scale);
          sprite.rotation = rotation;
          sprite.position.set(width / 2 + posX, height / 2 + posY);
          sprite.alpha = opacity;
          
          app.stage.addChild(sprite);
          
          // We keep frames in cache if they might be reused by predictive lookahead 
          // (though in sequential export we can close immediately)
          frame.close();
          frameCache.delete(cacheKey);
      }

      app.renderer.render({ container: app.stage });
      
      const frame = new VideoFrame(app.canvas as unknown as OffscreenCanvas, { timestamp: i * (1_000_000 / fps) });
      encoder.encode(frame, { keyFrame: i % 30 === 0 });
      frame.close();

      self.postMessage({ type: 'EXPORT_PROGRESS', payload: i / totalFrames });
    }

    await encoder.flush();
    self.postMessage({ type: 'EXPORT_COMPLETE' });
    
    decoderWorker.terminate();
    app.destroy(true);
  }
};
