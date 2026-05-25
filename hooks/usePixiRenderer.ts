import { useEffect, useRef } from 'react';
import { VideoState } from '../types';
import { getSharedBuffer } from '../lib/sharedState';
import { workerPool } from '../services/workerPool';

export const usePixiRenderer = (
  state: VideoState,
  onTimeUpdate: (time: number) => void,
  onDurationChange: (duration: number) => void,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const vfxWorkerRef = useRef<Worker | null>(null);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
    if (workerRef.current) {
        // Sync metadata (not bitmaps)
        workerRef.current.postMessage({
            type: 'SYNC_STATE',
            payload: {
                videoClips: state.videoClips,
                textTrack: state.textTrack,
                subtitleTrack: state.subtitleTrack,
                effectTrack: state.effectTrack,
                shapeTrack: state.shapeTrack,
                particleTrack: state.particleTrack,
                audioEnergy: (state as any).audioEnergy,
                ghostMode: (state as any).ghostMode,
                engagementResizing: state.engagementResizing,
                analytics: state.analytics
            }
        });
    }

    if (vfxWorkerRef.current) {
        vfxWorkerRef.current.postMessage({
            type: 'SYNC_STATE',
            payload: {
                currentTime: state.currentTime,
                videoClips: state.videoClips,
            }
        });
    }
  }, [state]);

  // Optimized Render Loop with frame-callback fallback
  useEffect(() => {
    let frameId: number;
    let videoCallbackId: number;

    const update = () => {
      // Use requestVideoFrameCallback if a video element is being used as a source
      // For general canvas rendering, requestAnimationFrame is standard
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => {
        cancelAnimationFrame(frameId);
        if (videoCallbackId) (window as any).cancelVideoFrameCallback?.(videoCallbackId);
    };
  }, []);

  // DEBOUNCED RESIZE OBSERVER
  useEffect(() => {
    if (!containerRef.current || !workerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        workerRef.current?.postMessage({
          type: 'RESIZE',
          payload: { width, height, devicePixelRatio: window.devicePixelRatio }
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return { containerRef };
};
