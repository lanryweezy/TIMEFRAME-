
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Zap, Box, Brain, Terminal, Activity, Palette, Users, Settings, Filter, ArrowRight, CornerDownLeft, Globe } from 'lucide-react';
import { VideoState, EditorMode } from '../types';

interface CommandPaletteProps {
  state: VideoState;
  handleSendMessage: (message: string) => void;
  onClose: () => void;
  onModeChange: (mode: EditorMode) => void;
  onToggleDebugger?: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ state, handleSendMessage, onClose, onModeChange, onToggleDebugger }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'm-agents', icon: Brain, label: 'Consult Core Agents', category: 'Nav', action: () => onModeChange('agents') },
    { id: 'm-color', icon: Palette, label: 'Opening Neural Color Grade', category: 'Nav', action: () => onModeChange('color') },
    { id: 'm-collab', icon: Users, label: 'Team Collaboration Hub', category: 'Nav', action: () => onModeChange('collaboration') },
    { id: 'f-optimize', icon: Zap, label: 'AI: Optimize rendering pipeline', category: 'AI', action: () => handleSendMessage('Optimize the rendering pipeline for maximum throughput.') },
    { id: 'f-scene', icon: Terminal, label: 'AI: Detect cinematic scenes', category: 'AI', action: () => handleSendMessage('Detect cinematic scenes and prepare chapters.') },
    { id: 'f-grade', icon: Filter, label: 'AI: Apply cinematic mood grade', category: 'AI', action: () => handleSendMessage('Apply a cinematic mood grade based on the narrative.') },
    { id: 'sys-export', icon: ArrowRight, label: 'Open Export Module', category: 'System', action: () => handleSendMessage('Open export dialog.') },
    { id: 'sys-settings', icon: Settings, label: 'Global Project Settings', category: 'System', action: () => handleSendMessage('Show project settings.') },
  ];

  const filtered = query.trim() === '' 
    ? actions 
    : actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      }
      if (e.key === 'Enter') {
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, filtered, selectedIndex]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Palette Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-xl bg-studio-card border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Input Area */}
          <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-white/[0.02]">
            <Search className="w-5 h-5 text-zinc-500" />
            <input 
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="What are we building today? Type a command..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 font-medium"
            />
            <div className="flex items-center gap-1.5 px-1.5 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase text-zinc-500 tracking-tighter">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filtered.length > 0 ? (
              <div className="space-y-1">
                {filtered.map((item, index) => (
                  <button 
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => { item.action(); onClose(); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all group ${selectedIndex === index ? 'bg-studio-accent/20 border border-studio-accent/30' : 'border border-transparent hover:bg-white/5'}`}
                  >
                    <div className={`p-1.5 rounded-md ${selectedIndex === index ? 'bg-studio-accent text-white shadow-[0_0_15px_rgba(var(--studio-accent-rgb),0.5)]' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'}`}>
                       <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                       <span className={`text-[11px] font-black uppercase tracking-tight ${selectedIndex === index ? 'text-white' : 'text-zinc-400'}`}>{item.label}</span>
                       <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{item.category}</span>
                    </div>
                    {selectedIndex === index && (
                      <div className="ml-auto flex items-center gap-1.5 text-studio-accent animate-pulse">
                         <span className="text-[7px] font-black uppercase tracking-widest">Execute</span>
                         <CornerDownLeft className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-600">
                 <Terminal className="w-8 h-8 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No matching commands found in logic fabric</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                   <div className="px-1 py-0.5 bg-zinc-800 rounded text-[7px] text-zinc-500 font-mono">↑↓</div>
                   <span className="text-[7px] font-black uppercase text-zinc-600 tracking-tighter">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="px-1 py-0.5 bg-zinc-800 rounded text-[7px] text-zinc-500 font-mono">↵</div>
                   <span className="text-[7px] font-black uppercase text-zinc-600 tracking-tighter">Enter</span>
                </div>
             </div>
             <span className="text-[7px] font-black uppercase text-studio-accent tracking-widest animate-pulse">ORÌ Engine v1.0 PRO</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
