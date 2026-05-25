import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, RotateCcw, RotateCw, GitBranch, Clock, Save, Trash2 } from 'lucide-react';
import { VideoState } from '../types';

interface HistoryPanelProps {
  state: VideoState;
  onUndo: () => void;
  onRedo: () => void;
  onJumpToHistory?: (index: number) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ state, onUndo, onRedo, onJumpToHistory }) => {
  const { past, future } = state.history;

  return (
    <div className="flex flex-col h-full bg-studio-bg text-white select-none studio-scrollbar overflow-hidden border-l border-studio-border">
      <div className="p-4 border-b border-studio-border bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-4 h-4 text-studio-accent" />
          <h2 className="text-[12px] font-black uppercase tracking-widest">History Tree</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onUndo}
            disabled={past.length === 0}
            className="p-1.5 rounded bg-white/5 border border-white/10 disabled:opacity-30 hover:text-studio-accent transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onRedo}
            disabled={future.length === 0}
            className="p-1.5 rounded bg-white/5 border border-white/10 disabled:opacity-30 hover:text-studio-accent transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto studio-scrollbar p-4 space-y-2">
        <div className="flex flex-col gap-1 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-zinc-800" />

          {/* Past States */}
          {past.map((snap, i) => (
            <button
              key={`past-${i}`}
              onClick={() => onJumpToHistory?.(i)}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group relative z-10"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center group-hover:border-studio-accent transition-all">
                 <Clock className="w-3 h-3 text-zinc-600 group-hover:text-studio-accent" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white">
                  State Change #{i + 1}
                </span>
                <span className="text-[8px] font-mono text-zinc-600">
                  {snap.videoClips.length} clips • {snap.currentTime.toFixed(2)}s
                </span>
              </div>
            </button>
          ))}

          {/* Current State Indicator */}
          <div className="flex items-start gap-4 p-3 rounded-xl bg-studio-accent/10 border border-studio-accent/20 relative z-10">
            <div className="w-8 h-8 rounded-full bg-studio-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <Save className="w-3.5 h-3.5 text-black" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-black uppercase text-studio-accent">
                Current Active State
              </span>
              <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                Latest Workspace Version
              </span>
            </div>
          </div>

          {/* Future States (Redo Stack) */}
          {future.map((snap, i) => (
            <button
              key={`future-${i}`}
              className="flex items-start gap-4 p-3 rounded-xl opacity-40 hover:opacity-100 hover:bg-white/5 transition-all group relative z-10"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
                 <GitBranch className="w-3.5 h-3.5 text-zinc-700" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] font-black uppercase text-zinc-600">
                  Potential Path #{i + 1}
                </span>
                <span className="text-[8px] font-mono text-zinc-700">
                   {snap.videoClips.length} clips • {snap.currentTime.toFixed(2)}s
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="p-4 bg-zinc-950/50 border-t border-studio-border">
        <div className="flex items-center justify-between text-[9px] font-black uppercase text-zinc-500">
          <span>{past.length + future.length + 1} Versions</span>
          <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
