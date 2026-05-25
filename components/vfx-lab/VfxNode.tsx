import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface VfxNodeProps {
  id: string;
  x: number;
  y: number;
  label: string;
  icon: LucideIcon;
  active: boolean;
  value: number;
  onChange: (value: number) => void;
  onSelect: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  isSelected: boolean;
}

export const VfxNode: React.FC<VfxNodeProps> = ({
  id,
  x,
  y,
  label,
  icon: Icon,
  active,
  value,
  onChange,
  onSelect,
  onDrag,
  isSelected,
}) => (
  <motion.div
    drag
    dragMomentum={false}
    initial={{ x, y }}
    onDrag={(e, info) => onDrag(id, info.point.x, info.point.y)}
    onClick={() => onSelect(id)}
    className={`absolute w-48 p-4 bg-zinc-900/90 backdrop-blur-xl border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 cursor-grab active:cursor-grabbing transition-all ${
      isSelected
        ? 'border-studio-accent ring-2 ring-studio-accent/20'
        : 'border-white/10 hover:border-white/20'
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl ${
            active ? 'bg-studio-accent/20 text-studio-accent' : 'bg-zinc-800 text-zinc-500'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${
          active ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-zinc-700'
        }`}
      />
    </div>

    <div className="space-y-2">
      <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
        <span>Mix</span>
        <span className="text-zinc-300">{Math.round(value)}%</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-studio-accent"
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    {/* Port System */}
    <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <div 
          className="w-4 h-4 bg-zinc-950 border-2 border-white/20 rounded-full hover:border-studio-accent transition-colors cursor-crosshair"
          title="Input Port"
        />
    </div>
    
    <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <div 
          className="w-4 h-4 bg-zinc-950 border-2 border-white/20 rounded-full hover:border-studio-accent transition-colors cursor-crosshair"
          title="Output Port"
        />
    </div>
  </motion.div>
);
