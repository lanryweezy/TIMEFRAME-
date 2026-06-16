import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { EditorMode } from '@/types';

interface NavButtonProps {
  mode: EditorMode;
  activeMode: EditorMode;
  icon: LucideIcon;
  label: string;
  badge?: string;
  onClick: (mode: EditorMode) => void;
}

export const NavButton: React.FC<NavButtonProps> = ({
  mode,
  activeMode,
  icon: Icon,
  label,
  badge,
  onClick,
}) => {
  const isActive = activeMode === mode;

  return (
    <button
      onClick={() => onClick(mode)}
      className={`relative w-12 h-12 mx-auto flex flex-col items-center justify-center transition-all group rounded-xl hover:bg-white/5 active:scale-95 ${
        isActive ? 'text-white bg-white/[0.02]' : 'text-zinc-500 hover:text-zinc-300'
      }`}
      title={label}
      aria-label={label}
    >
      {isActive && (
        <motion.div
          layoutId="navActive"
          className="absolute left-[-16px] w-1 h-6 bg-studio-accent rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
      )}
      <div className="relative">
        <Icon
          className={`w-5 h-5 transition-all ${
            isActive ? 'text-studio-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'group-hover:scale-105'
          }`}
        />
        {badge && (
          <div className="absolute -top-2 -right-2 px-1 py-0.5 bg-studio-accent text-black text-[9px] font-bold rounded-full shadow-lg border border-black/20">
            {badge}
          </div>
        )}
      </div>
      <span className="sr-only">{label}</span>
    </button>
  );
};
