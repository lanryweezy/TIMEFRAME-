import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getWaveformData } from '../../lib/waveform';
import { workerPool } from '../../services/workerPool';

interface WaveformProps {
  id?: string;
  url?: string;
  data?: number[];
  transients?: number[]; // Added
  duration?: number; // Added
  progress: number;
  color: string;
}

const cache = new Map<string, number[]>();

export const Waveform: React.FC<WaveformProps> = ({ id, url, data, transients, duration, progress, color }) => {
  const [bars, setBars] = useState<number[]>(data || []);

  useEffect(() => {
    if (data) {
      setBars(data);
      return;
    }
    
    const key = url || id;
    if (!key) return;

    if (cache.has(key)) {
      setBars(cache.get(key)!);
      return;
    }

    if (url) {
      getWaveformData(url).then(result => {
        cache.set(url, result);
        setBars(result);
      });
      return;
    }

    const worker = workerPool.getWorker('waveform');
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data.id === id) {
        cache.set(id!, e.data.bars);
        setBars(e.data.bars);
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({ id });

    return () => worker.removeEventListener('message', handleMessage);
  }, [id, url, data]);

  return (
    <div className="relative h-full w-full flex items-center group">
      <div className="flex items-center gap-[1px] h-full w-full opacity-60">
        {bars.map((height, i) => {
          const isActive = (i / bars.length) * 100 <= progress;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-300"
              style={{
                height: `${Math.max(4, height)}%`,
                backgroundColor: isActive ? color : 'rgba(255,255,255,0.1)',
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

