
import React from 'react';
import { motion } from 'motion/react';

interface VideoScopesProps {
  currentTime: number;
}

export const VideoScopes: React.FC<VideoScopesProps> = React.memo(({ currentTime }) => {
  return (
    <div className="absolute right-4 top-20 z-40 flex flex-col gap-4 pointer-events-none opacity-80 scale-75 origin-top-right">
        {/* Waveform Scope */}
        <div className="w-48 h-32 bg-black/80 border border-zinc-700 p-2 rounded shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-tighter">Waveform_Monitor</span>
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
                        d={`M ${Array.from({length: 20}, (_, i) => `${i*5},${40 + Math.sin(i*0.5 + currentTime)*20 + Math.random()*10}`).join(' L ')}`} 
                        fill="none" 
                        stroke="rgba(255,255,255,0.7)" 
                        strokeWidth="0.5" 
                    />
                    <path 
                        d={`M ${Array.from({length: 20}, (_, i) => `${i*5},${50 + Math.cos(i*0.3 + currentTime)*15 + Math.random()*5}`).join(' L ')}`} 
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
                <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-tighter">RGB_Parade_Histogram</span>
            </div>
            <div className="flex gap-1 h-14">
                {['#ef4444', '#22c55e', '#3b82f6'].map((color, idx) => (
                    <div key={idx} className="flex-1 h-full bg-zinc-900/50 relative overflow-hidden">
                        <div 
                            className="absolute bottom-0 w-full bg-current opacity-40 transition-all duration-300"
                            style={{ color, height: `${40 + Math.sin(currentTime + idx)*30}%` }}
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
