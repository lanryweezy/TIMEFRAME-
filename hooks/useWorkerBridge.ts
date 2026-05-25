import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import { workerPool } from '../services/workerPool';
import { opfsService } from '../services/opfsService';

export const useWorkerBridge = () => {
  const workerRef = useRef<Worker | null>(null);
  const chunksRef = useRef<Map<string, Uint8Array[]>>(new Map());
  const updateClip = useVideoStore(state => state.updateClip);
  const setOptimizingPacing = useVideoStore(state => state.setOptimizingPacing);
  const addMarkers = useVideoStore(state => state.addMarkers);

  useEffect(() => {
    workerRef.current = workerPool.getWorker('video');

    const handleMessage = async (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'PACING_OPTIMIZED') {
        setOptimizingPacing(false);
        addMarkers(payload.map((s: any) => ({
          id: crypto.randomUUID().slice(0, 8),
          time: s.time,
          label: 'Suggested Cut',
          color: '#3b82f6',
        })));
      } else if (type === 'PROXY_CHUNK') {
        const { clipId, chunk } = payload;
        if (!chunksRef.current.has(clipId)) chunksRef.current.set(clipId, []);
        chunksRef.current.get(clipId)!.push(chunk);
      } else if (type === 'PROXY_COMPLETE') {
        const { clipId } = payload;
        const chunks = chunksRef.current.get(clipId) || [];
        const blob = new Blob(chunks, { type: 'video/mp4' });
        
        // Quantum OPFS Ingestion
        const proxyUrl = await opfsService.ingestFile(blob, `proxy_${clipId}.mp4`);

        updateClip(clipId, { proxyUrl });
        chunksRef.current.delete(clipId);
      }
    };

    workerRef.current.addEventListener('message', handleMessage);
    return () => workerRef.current?.removeEventListener('message', handleMessage);
  }, [updateClip, setOptimizingPacing, addMarkers]);

  return {
    postMessage: (msg: any) => workerRef.current?.postMessage(msg)
  };
};
