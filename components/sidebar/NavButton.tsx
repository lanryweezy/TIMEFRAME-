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
      className={`relative w-full flex flex-col items-center justify-center py-5 transition-colors group ${
        isActive ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'
      }`}
      title={label}
      aria-label={label}
    >
      {isActive && (
        <motion.div
          layoutId="navActive"
          className="absolute right-0 w-1 h-8 bg-studio-accent rounded-l-full shadow-[0_0_10px_rgba(var(--studio-accent-rgb),0.4)]"
        />
      )}
      <div className="relative">
        <Icon
          className={`w-6 h-6 mb-2 transition-transform ${
            isActive ? 'scale-110 text-studio-accent' : 'group-hover:scale-105'
          }`}
        />
        {badge && (
          <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-studio-accent text-black text-[8px] font-black rounded-full shadow-lg">
            {badge}
          </div>
        )}
      </div>
      <span className="sr-only">{label}</span>
    </button>
  );
};
