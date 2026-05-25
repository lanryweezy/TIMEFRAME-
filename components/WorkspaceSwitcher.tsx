import React from 'react';
import { motion } from 'motion/react';
import { 
  Video, 
  Palette, 
  Zap, 
  Music, 
  Share2, 
  Layout,
  Maximize2,
  Undo2,
  Redo2,
  Smartphone,
  Ghost,
  Layers,
  Globe,
  MessageSquare
} from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';
import { UIState } from '@/types';
import { useVideoEditor } from '@/hooks/useVideoEditor';

const WORKSPACES: { id: UIState['activeWorkspace']; label: string; icon: any; color: string }[] = [
  { id: 'editing', label: 'Edit', icon: Video, color: 'text-blue-400' },
  { id: 'color', label: 'Color', icon: Palette, color: 'text-amber-400' },
  { id: 'vfx', label: 'VFX', icon: Zap, color: 'text-purple-400' },
  { id: 'audio', label: 'Audio', icon: Music, color: 'text-emerald-400' },
  { id: 'review', label: 'Review', icon: MessageSquare, color: 'text-indigo-400' },
  { id: 'export', label: 'Export', icon: Share2, color: 'text-rose-400' },
];

export const WorkspaceSwitcher: React.FC = () => {
  const store = useVideoStore();
  const { ui, applyLayoutPreset, touchMode, ghostMode, customLayout } = store;
  const { handleUndo, handleRedo, state } = useVideoEditor();
  const activeWorkspace = ui.activeWorkspace;

  return (
    <div className="h-12 bg-black border-b border-white/5 flex items-center justify-between px-4 relative z-[100]">
      {/* Left side: Project Info & History */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-studio-accent rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-black" />
          </div>
          <div className="hidden lg:flex flex-col">
              <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">Timeframe</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">{state.projectName || 'Untitled'}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/5 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={state.history.past.length === 0}
            className="p-2 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-lg disabled:opacity-20"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={state.history.future.length === 0}
            className="p-2 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-lg disabled:opacity-20"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Workspace Switcher */}
      <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
        {WORKSPACES.map((ws) => {
          const Icon = ws.icon;
          const isActive = activeWorkspace === ws.id;

          return (
            <button
              key={ws.id}
              onClick={() => applyLayoutPreset(ws.id)}
              className={`relative px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all group ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeWS"
                  className="absolute inset-0 bg-white/10 rounded-lg shadow-inner"
                />
              )}
              <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? ws.color : 'group-hover:text-zinc-300'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest relative z-10 hidden sm:inline">
                {ws.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right side: Tools & Global Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5 mr-2">
            <button
                onClick={() => store.toggleTouchMode()}
                className={`p-1.5 rounded transition-all ${touchMode ? 'text-orange-400 bg-orange-400/10' : 'text-zinc-600 hover:text-white'}`}
                title="Touch Mode"
            >
                <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => store.toggleGhostMode()}
                className={`p-1.5 rounded transition-all ${ghostMode ? 'text-studio-accent bg-studio-accent/10' : 'text-zinc-600 hover:text-white'}`}
                title="Ghost Frames"
            >
                <Ghost className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => store.toggleCustomLayout()}
                className={`p-1.5 rounded transition-all ${customLayout ? 'text-purple-400 bg-purple-400/10' : 'text-zinc-600 hover:text-white'}`}
                title="Layout Config"
            >
                <Layers className="w-3.5 h-3.5" />
            </button>
        </div>

        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 text-zinc-400 text-[9px] font-black uppercase rounded-lg border border-white/5 hover:text-white transition-all">
            <Globe className="w-3 h-3" />
            Live Share
        </button>

        <button className="px-4 py-1.5 bg-studio-accent text-black text-[10px] font-black uppercase rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--studio-accent-rgb),0.3)]">
            Export
        </button>
      </div>
    </div>
  );
};
