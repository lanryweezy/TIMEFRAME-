import React, { useEffect, useRef } from 'react';
import { Copy, Scissors, Lock, Settings } from 'lucide-react';

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
      className="absolute bg-[#1a1a1a] border border-white/10 rounded shadow-2xl z-50 py-1 w-40"
      style={{ top: position.top, left: position.left }}
    >
      <button onClick={() => { onAction('split'); onClose(); }} className="flex items-center w-full px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/10 gap-2"><Scissors size={12} /> Split</button>
      <button onClick={() => { onAction('duplicate'); onClose(); }} className="flex items-center w-full px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/10 gap-2"><Copy size={12} /> Duplicate (End)</button>
      <button onClick={() => { onAction('duplicate_playhead'); onClose(); }} className="flex items-center w-full px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/10 gap-2"><Copy size={12} /> Duplicate (Playhead)</button>
      <button onClick={() => { onAction('lock'); onClose(); }} className="flex items-center w-full px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/10 gap-2"><Lock size={12} /> Lock Track</button>
      <button onClick={() => { onAction('properties'); onClose(); }} className="flex items-center w-full px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/10 gap-2"><Settings size={12} /> Properties</button>
    </div>
  );
};
