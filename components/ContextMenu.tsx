import React, { useEffect, useRef } from 'react';
import { 
  Copy, 
  Scissors, 
  Lock, 
  Settings, 
  Sparkles, 
  VolumeX, 
  ShieldCheck, 
  Maximize2,
  Zap
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: y, left: x });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('click', handleClick);

    if (menuRef.current) {
      const { offsetWidth, offsetHeight } = menuRef.current;
      let newX = x;
      let newY = y;
      if (newX + offsetWidth > window.innerWidth) newX = window.innerWidth - offsetWidth;
      if (newY + offsetHeight > window.innerHeight) newY = window.innerHeight - offsetHeight;
      setPosition({ top: newY, left: newX });
    }

    return () => document.removeEventListener('click', handleClick);
  }, [onClose, x, y]);

  return (
    <div
      ref={menuRef}
      className="absolute bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-[150] py-1.5 w-48 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.top, left: position.left }}
    >
      {/* Standard Actions */}
      <button
        onClick={() => { onAction('split'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-300 hover:bg-white/5 gap-3 transition-colors"
      >
        <Scissors size={12} className="text-zinc-500" /> Split Clip
      </button>
      <button
        onClick={() => { onAction('duplicate'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-300 hover:bg-white/5 gap-3 transition-colors"
      >
        <Copy size={12} className="text-zinc-500" /> Duplicate
      </button>
      <button
        onClick={() => { onAction('lock'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-300 hover:bg-white/5 gap-3 transition-colors"
      >
        <Lock size={12} className="text-zinc-500" /> Lock Track
      </button>

      <div className="h-px bg-white/5 my-1" />

      {/* NEURAL ACTIONS (ELITE) */}
      <div className="px-4 py-1.5 flex items-center gap-2">
         <Zap size={8} className="text-studio-accent fill-studio-accent" />
         <span className="text-[7px] font-black text-studio-accent uppercase tracking-widest">Neural Tools</span>
      </div>

      <button
        onClick={() => { onAction('ai_remove_bg'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-black text-studio-accent hover:bg-studio-accent/10 gap-3 transition-all group"
      >
        <Sparkles size={12} className="group-hover:scale-110 transition-transform" /> Remove Background
      </button>
      <button
        onClick={() => { onAction('ai_auto_silence'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-300 hover:bg-white/5 gap-3 transition-colors"
      >
        <VolumeX size={12} className="text-red-400" /> Auto-Silence
      </button>
      <button
        onClick={() => { onAction('ai_stabilize'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-300 hover:bg-white/5 gap-3 transition-colors"
      >
        <ShieldCheck size={12} className="text-emerald-400" /> Stabilize Footage
      </button>
      <button
        onClick={() => { onAction('ai_reframe'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-300 hover:bg-white/5 gap-3 transition-colors"
      >
        <Maximize2 size={12} className="text-blue-400" /> Smart Re-frame
      </button>

      <div className="h-px bg-white/5 my-1" />

      <button
        onClick={() => { onAction('properties'); onClose(); }}
        className="flex items-center w-full px-4 py-2 text-[10px] font-bold text-zinc-400 hover:bg-white/5 gap-3 transition-colors"
      >
        <Settings size={12} /> Clip Properties
      </button>

      <div className="h-px bg-white/5 my-1" />

      {/* Label Colors (#4) */}
      <div className="px-4 py-2">
        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Label Color</span>
        <div className="grid grid-cols-5 gap-2">
          {[
            { color: '#ef4444', label: 'Action' },
            { color: '#22c55e', label: 'Good' },
            { color: '#3b82f6', label: 'Sync' },
            { color: '#a855f7', label: 'VFX' },
            { color: '#f59e0b', label: 'B-Roll' },
          ].map((c) => (
            <button
              key={c.color}
              title={c.label}
              onClick={() => { onAction(`set_color:${c.color}`); onClose(); }}
              className="w-4 h-4 rounded-full border border-white/10 hover:scale-125 hover:border-white transition-all shadow-lg"
              style={{ backgroundColor: c.color }}
            />
          ))}
          <button
            title="Reset"
            onClick={() => { onAction('set_color:reset'); onClose(); }}
            className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 flex items-center justify-center bg-zinc-800"
          >
            <div className="w-2 h-0.5 bg-zinc-600 rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};
