
import React from 'react';
import { ChevronLeft, ChevronRight, Share2, Download, Undo2, Redo2, Trash2, User, Search } from 'lucide-react';
import { TeamMember } from '../types';

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
  projectName, activeUsers, onProjectNameChange, onExport, 
  onUndo, onRedo, onReset, onToggleCreatorHub, onToggleCommandPalette, onOptimize, canUndo, canRedo 
}) => (
  <header className="h-10 bg-transparent flex items-center justify-between px-6 z-40 border-b border-white/5 relative">
    <div className="flex items-center gap-6">
      <div className="flex items-center">
        <h1 className="font-display font-black text-[9px] text-zinc-700 tracking-[0.4em] uppercase leading-none opacity-50">Studio</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center h-7 bg-white/5 pl-3 pr-2 gap-3 rounded-md border border-white/5">
          <input 
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-transparent border-none text-[9px] font-black uppercase text-zinc-500 focus:text-white focus:outline-none w-40 tracking-widest transition-all"
            placeholder="PROJECT_ID"
          />
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-0.5">
          <button 
                onClick={onUndo} 
                className={`p-1.5 text-zinc-700 hover:text-white transition-all hover:bg-white/5 rounded-md ${!canUndo && 'opacity-10 pointer-events-none'}`}
          >
                <Undo2 className="w-3 h-3" />
          </button>
          <button 
                onClick={onRedo} 
                className={`p-1.5 text-zinc-700 hover:text-white transition-all hover:bg-white/5 rounded-md ${!canRedo && 'opacity-10 pointer-events-none'}`}
          >
                <Redo2 className="w-3 h-3" />
          </button>
      </div>

      <button 
        onClick={onExport}
        className="px-3 py-1 bg-white/5 text-zinc-400 text-[8px] font-black tracking-[0.2em] rounded border border-white/10 hover:bg-studio-accent hover:text-white hover:border-studio-accent active:scale-95 transition-all uppercase"
      >
        Export
      </button>
    </div>
  </header>
);

export default Header;
