import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  Undo2,
  Redo2,
  Trash2,
  User,
  Search,
  Sun,
  Moon,
  Layers,
  Ghost,
  Smartphone,
} from 'lucide-react';
import { TeamMember } from '../types';
import { useTheme } from '../hooks/useTheme';
import { LanguageSelector } from './LanguageSelector';
import { useUIStore } from '../store/videoStore';

interface HeaderProps {
  projectName: string;
  activeUsers?: TeamMember[];
  onProjectNameChange: (name: string) => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onToggleCreatorHub?: () => void;
  onToggleCommandPalette?: () => void;
  onOptimize?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  projectName,
  activeUsers,
  onProjectNameChange,
  onExport,
  onUndo,
  onRedo,
  onReset,
  onToggleCreatorHub,
  onToggleCommandPalette,
  onOptimize,
  canUndo,
  canRedo,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { customLayout, toggleCustomLayout, ghostMode, toggleGhostMode, touchMode, toggleTouchMode } = useUIStore();

  return (
  <header className="h-10 bg-transparent flex items-center justify-between px-6 z-40 border-b border-white/5 relative">
    <div className="flex items-center gap-6">
      <div className="flex items-center">
        <h1 className="font-display font-black text-xs text-zinc-700 tracking-[0.4em] uppercase leading-none opacity-50">
          Studio
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center h-8 bg-white/5 pl-3 pr-2 gap-3 rounded-md border border-white/5">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-transparent border-none text-[11px] font-black uppercase text-zinc-500 focus:text-white focus:outline-none w-48 tracking-widest transition-all"
            placeholder="PROJECT_ID"
          />
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          className={`p-2 text-zinc-700 hover:text-white transition-all hover:bg-white/5 rounded-md ${!canUndo && 'opacity-10 pointer-events-none'}`}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          className={`p-2 text-zinc-700 hover:text-white transition-all hover:bg-white/5 rounded-md ${!canRedo && 'opacity-10 pointer-events-none'}`}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stealth Theme Active Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-md cursor-default transition-all" title="Stealth Mode (Permanent Dark Mode)">
        <span className="w-1.5 h-1.5 rounded-full bg-studio-accent animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Stealth Active</span>
      </div>

      <div className="w-[1px] h-4 bg-white/10 mx-1" />

      {/* Touch Mode Toggle */}
      <button
        onClick={toggleTouchMode}
        className={`p-2 transition-all rounded-md ${touchMode ? 'text-orange-500 bg-orange-500/10' : 'text-zinc-700 hover:text-white hover:bg-white/5'}`}
        title="Toggle Touch-Optimized Layout"
        aria-label="Toggle Touch Mode"
      >
        <Smartphone className="w-4 h-4" />
      </button>

      {/* Ghost Mode Toggle */}
      <button
        onClick={toggleGhostMode}
        className={`p-2 transition-all rounded-md ${ghostMode ? 'text-studio-accent bg-studio-accent/10' : 'text-zinc-700 hover:text-white hover:bg-white/5'}`}
        title="Toggle Ghost Frames (Onion Skinning)"
        aria-label="Toggle Ghost Mode"
      >
        <Ghost className="w-4 h-4" />
      </button>

      {/* Custom Layout Toggle */}
      <button
        onClick={toggleCustomLayout}
        className={`p-2 transition-all rounded-md ${customLayout ? 'text-purple-400 bg-purple-400/10' : 'text-zinc-700 hover:text-white hover:bg-white/5'}`}
        title="Customize Panel Layout"
        aria-label="Toggle Custom Layout"
      >
        <Layers className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-white/10 mx-1" />

      <LanguageSelector />

      {/* Active Team */}
      <div className="flex -space-x-2 overflow-hidden">
        {[
          { name: 'Sulaiman', color: 'bg-emerald-500' },
          { name: 'Adewale', color: 'bg-blue-500' },
          { name: 'Tope', color: 'bg-purple-500' }
        ].map((u, i) => (
          <div key={i} className={`w-6 h-6 rounded-full border border-[#0a0a0a] ${u.color} flex items-center justify-center text-[8px] font-black text-white cursor-pointer hover:-translate-y-0.5 transition-transform`} title={u.name}>
            {u.name[0]}
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 px-4 py-1.5 bg-studio-accent/10 text-studio-accent text-[10px] font-black tracking-[0.2em] rounded border border-studio-accent/20 hover:bg-studio-accent hover:text-white transition-all uppercase">
        <Share2 className="w-4 h-4" />
        Live Share
      </button>

      <button
        onClick={onExport}
        className="px-4 py-1.5 bg-white/5 text-zinc-400 text-[10px] font-black tracking-[0.2em] rounded border border-white/10 hover:bg-studio-accent hover:text-white hover:border-studio-accent active:scale-95 transition-all uppercase"
      >
        Export
      </button>
    </div>
  </header>
);
};

export default Header;
