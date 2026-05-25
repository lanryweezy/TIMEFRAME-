import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SliderViewProps {
  sliders: {
    id: string;
    label: string;
    icon: LucideIcon;
    value: number;
    onChange: (v: number) => void;
  }[];
}

export const SliderView: React.FC<SliderViewProps> = ({ sliders }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 studio-scrollbar">
      <div className="max-w-2xl mx-auto space-y-8">
        {sliders.map((s) => (
          <div key={s.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-studio-accent/10 rounded-lg text-studio-accent">
                  <s.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">{Math.round(s.value)}%</span>
            </div>
            <input
              type="range"
              value={s.value}
              onChange={(e) => s.onChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
