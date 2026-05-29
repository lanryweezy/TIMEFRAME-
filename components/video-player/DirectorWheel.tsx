import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Scissors, 
  Plus, 
  Maximize2, 
  SkipBack, 
  SkipForward,
  RotateCcw,
  Volume2
} from 'lucide-react';

import { VideoState } from '../../types';

interface DirectorWheelProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (delta: number) => void;
  onSplit: () => void;
  onAddMarker: () => void;
  state: VideoState;
}

export const DirectorWheel: React.FC<DirectorWheelProps> = ({
  isPlaying,
  onTogglePlay,
  onSeek,
  onSplit,
  onAddMarker,
  state,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { icon: Scissors, label: 'Split', action: onSplit, color: 'bg-red-500' },
    { icon: Plus, label: 'Mark', action: onAddMarker, color: 'bg-studio-accent' },
    { icon: RotateCcw, label: 'Reset', action: () => onSeek(-state.currentTime), color: 'bg-zinc-700' },
    { icon: Volume2, label: 'Mute', action: () => {}, color: 'bg-zinc-700' },
  ];

  return (
    <div className="fixed bottom-12 right-12 z-[150]">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Tool Ring */}
            {tools.map((tool, i) => {
              const angle = (i / tools.length) * Math.PI * 2;
              const x = Math.cos(angle) * 80;
              const y = Math.sin(angle) * 80;

              return (
                <motion.button
                  key={tool.label}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x, y }}
                  exit={{ scale: 0, x: 0, y: 0 }}
                  onClick={() => {
                    tool.action();
                    setIsOpen(false);
                  }}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl border border-white/20 ${tool.color}`}
                  aria-label={tool.label}
                >
                  <tool.icon className="w-5 h-5" />
                </motion.button>
              );
            })}

            {/* Playback Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/90 backdrop-blur-xl p-3 rounded-full border border-white/10"
            >
              <button onClick={() => onSeek(-1)} className="p-2 hover:bg-white/5 rounded-full" aria-label="Seek Backward"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={onTogglePlay} className="p-4 bg-studio-accent rounded-full text-black" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button onClick={() => onSeek(1)} className="p-2 hover:bg-white/5 rounded-full" aria-label="Seek Forward"><ChevronRight className="w-5 h-5" /></button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Wheel Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 transition-all ${isOpen ? 'bg-zinc-900 border-studio-accent rotate-45' : 'bg-studio-accent border-white/20 text-black'}`}
      >
        <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
            <Maximize2 className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
        </div>
      </motion.button>
      
      {/* Label */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Director Wheel</span>
      </div>
    </div>
  );
};
