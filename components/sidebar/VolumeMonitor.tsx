import React from 'react';

interface VolumeMonitorProps {
  peak?: number[];
}

export const VolumeMonitor: React.FC<VolumeMonitorProps> = ({ peak = [65, 72] }) => {
  return (
    <div className="p-4 border-t border-[#1a1a1a] bg-black/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-sans text-slate-500 uppercase tracking-widest">
          Volume Level
        </span>
        <span className="text-[10px] font-sans text-emerald-400">-3.2dB</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-100" 
            style={{ width: `${peak[0]}%` }}
          />
          <div className="h-full bg-emerald-500/20 w-[10%]" />
        </div>
        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-100" 
            style={{ width: `${peak[1]}%` }}
          />
          <div className="h-full bg-emerald-500/20 w-[8%]" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[9px] font-mono text-slate-500">48kHz / 32-bit</span>
      </div>
    </div>
  );
};
