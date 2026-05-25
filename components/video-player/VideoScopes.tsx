import React, { useEffect, useRef } from 'react';
import { readHistogram, readWaveform } from '../../lib/sharedState';

interface VideoScopesProps {
  currentTime: number;
}

export const VideoScopes: React.FC<VideoScopesProps> = React.memo(({ currentTime }) => {
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const histoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      // 1. Update Waveform Paths
      if (pathRef1.current) {
        const points = Array.from({ length: 20 }, (_, i) => {
            const val = readHistogram(3, i * 12); // Luma histogram sampling
            return `${i * 10},${80 - (val / 15)}`;
        });
        pathRef1.current.setAttribute('d', `M ${points.join(' L ')}`);
      }
      if (pathRef2.current) {
        const points = Array.from({ length: 20 }, (_, i) => {
            const val = readWaveform(i * 12);
            return `${i * 10},${50 + (val * 30)}`;
        });
        pathRef2.current.setAttribute('d', `M ${points.join(' L ')}`);
      }

      // 2. Update RGB Histogram Bars
      histoRefs.current.forEach((ref, idx) => {
          if (ref) {
              const val = readHistogram(idx, 128); // Sample middle of histogram
              ref.style.height = `${Math.min(100, (val / 200) * 100)}%`;
          }
      });

      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="absolute right-4 top-20 z-40 flex flex-col gap-4 pointer-events-none opacity-80 scale-75 origin-top-right">
      {/* Waveform Scope */}
      <div className="w-48 h-32 bg-black/80 border border-zinc-700 p-2 rounded shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-tighter">
            Waveform_Monitor
          </span>
          <span className="text-[6px] font-mono text-blue-500">IRE_100</span>
        </div>
        <div className="relative h-24 border-l border-zinc-800 flex items-end">
          <div className="absolute inset-0 grid grid-rows-4">
            <div className="border-t border-zinc-800/50" />
            <div className="border-t border-zinc-800/50" />
            <div className="border-t border-zinc-800/50" />
            <div className="border-t border-zinc-800/50" />
          </div>
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path
              ref={pathRef1}
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="0.5"
            />
            <path
              ref={pathRef2}
              fill="none"
              stroke="rgba(59,130,246,0.5)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>

      {/* RGB Histogram */}
      <div className="w-48 h-24 bg-black/80 border border-zinc-700 p-2 rounded shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-tighter">
            RGB_Parade_Histogram
          </span>
        </div>
        <div className="flex gap-1 h-14">
          {['#ef4444', '#22c55e', '#3b82f6'].map((color, idx) => (
            <div key={idx} className="flex-1 h-full bg-zinc-900/50 relative overflow-hidden">
              <div
                ref={el => histoRefs.current[idx] = el}
                className="absolute bottom-0 w-full bg-current opacity-40 transition-all duration-300"
                style={{ color, height: '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[5px] font-mono text-zinc-600">
          <span>0</span>
          <span>128</span>
          <span>255</span>
        </div>
      </div>
    </div>
  );
});
