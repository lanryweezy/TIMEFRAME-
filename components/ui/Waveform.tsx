import React, { useState, useEffect, useRef } from 'react';
import { getWaveformData } from '../../lib/waveform';
import { workerPool } from '../../services/workerPool';
import { readSharedTime } from '../../lib/sharedState';

interface WaveformProps {
  id?: string;
  url?: string;
  data?: number[];
  transients?: number[]; // Added
  duration?: number; // Added
  progress?: number;
  color: string;
  progress?: number;
}

const cache = new Map<string, number[]>();

export const Waveform: React.FC<WaveformProps> = ({ id, url, data, transients, duration, progress, color, startTime }) => {
  const [bars, setBars] = useState<number[]>(data || []);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevData = useRef(data);

  useEffect(() => {
    // Reactivity for data prop changes - using a timeout or checking to ensure we don't trigger cascading renders synchronously inside the same effect
    // But since the cache and worker handle data asynchronously it's ok. We just avoid direct synchronous setState.
    let isMounted = true;

    if (data && data !== prevData.current) {
        prevData.current = data;
        // Schedule the state update to avoid React's synchronous state update in effect warning
        setTimeout(() => {
          if (isMounted) setBars(data);
        }, 0);
        return;
    }
    
    const key = url || id;
    if (!key) return;

    if (cache.has(key)) {
      setTimeout(() => {
        if (isMounted) setBars(cache.get(key)!);
      }, 0);
      return;
    }

    if (url) {
      getWaveformData(url).then(result => {
        if (isMounted) {
            cache.set(url, result);
            setBars(result);
        }
      });
      return;
    }

    const worker = workerPool.getWorker('waveform');
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data.id === id && isMounted) {
        cache.set(id!, e.data.bars);
        setBars(e.data.bars);
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({ id });

    return () => {
        isMounted = false;
        worker.removeEventListener('message', handleMessage);
    };
  }, [id, url, data]);

  // High-performance direct DOM update for progress
  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (duration && startTime !== undefined) {
        const time = readSharedTime();
        const currentProgress = ((time - startTime) / duration) * 100;
        const numBars = bars.length;
        const activeCount = Math.floor((currentProgress / 100) * numBars);

        for (let i = 0; i < numBars; i++) {
          const bar = barsRef.current[i];
          if (bar) {
            const isActive = i <= activeCount;
            const newColor = isActive ? color : 'rgba(255,255,255,0.1)';
            if (bar.dataset.active !== (isActive ? '1' : '0')) {
              bar.style.backgroundColor = newColor;
              bar.dataset.active = isActive ? '1' : '0';
            }
          }
        }
      }
      frameId = requestAnimationFrame(update);
    };

    if (duration !== undefined && startTime !== undefined) {
      frameId = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(frameId);
  }, [duration, startTime, color, bars.length]);

  const initialTime = typeof readSharedTime === 'function' ? readSharedTime() : 0;
  const initialProgress = duration && startTime !== undefined ? ((initialTime - startTime) / duration) * 100 : (progress !== undefined ? progress : 0);

  return (
    <div className="relative h-full w-full flex items-center group">
      <div className="flex items-center gap-[1px] h-full w-full opacity-60">
        {bars.map((height, i) => {
          const isActive = (i / bars.length) * 100 <= initialProgress;
          return (
            <div
              key={i}
              ref={el => barsRef.current[i] = el}
              data-active={isActive ? '1' : '0'}
              className="flex-1 rounded-sm transition-all duration-300"
              style={{
                height: `${Math.max(4, height)}%`,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            />
          );
        })}
      </div>
      
      {/* Transient Markers (Visual Snap Points) */}
      {transients && duration && transients.map((t, i) => (
        <div 
          key={`transient-${i}`}
          className="absolute top-0 bottom-0 w-[1px] bg-cyan-400/40 shadow-[0_0_5px_rgba(34,211,238,0.5)] pointer-events-none group-hover:bg-cyan-300/80 transition-all"
          style={{ left: `${(t / duration) * 100}%` }}
        />
      ))}
    </div>
  );
};
