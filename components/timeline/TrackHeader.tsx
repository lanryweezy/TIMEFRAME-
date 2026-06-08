import React from 'react';
import { Lock, Unlock } from 'lucide-react';

export const TrackHeader = React.memo(
  ({
    icon: Icon,
    label,
    isLocked,
    onToggleLock,
  }: {
    icon: any;
    label: string;
    isLocked: boolean;
    onToggleLock: () => void;
  }) => (
    <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center bg-studio-bg border-r border-studio-border z-20 group">
      <Icon className="w-2.5 h-2.5 text-zinc-500 mb-1 group-hover:text-studio-accent transition-colors" />
      <span className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase whitespace-nowrap rotate-90">
        {label}
      </span>
      <button
        onClick={onToggleLock}
        className="absolute top-1 right-0.5 p-0.5 rounded hover:bg-white/10 z-30"
        aria-label={isLocked ? 'Unlock track' : 'Lock track'}
        title={isLocked ? 'Unlock track' : 'Lock track'}
      >
        {isLocked ? (
          <Lock className="w-2 h-2 text-red-500" />
        ) : (
          <Unlock className="w-2 h-2 text-zinc-500" />
        )}
      </button>
    </div>
  ),
);
