/**
 * Enhanced Command Palette (#38)
 * Fuzzy search and contextual actions
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Command, Zap, Play, Save, Trash2, Share2, Download } from 'lucide-react';

interface Command {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
  category?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query
  const filteredCommands = commands.filter(cmd => {
    const searchQuery = query.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(searchQuery) ||
      cmd.description.toLowerCase().includes(searchQuery) ||
      (cmd.keywords && cmd.keywords.some(k => k.toLowerCase().includes(searchQuery)))
    );
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const category = command.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        className="bg-studio-panel border border-studio-border rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-studio-border">
          <Command className="w-5 h-5 text-studio-accent" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-none text-studio-text-high focus:outline-none text-lg"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto studio-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-studio-text">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No commands found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category} className="border-b border-studio-border/20">
                <div className="px-4 py-2 text-xs font-medium text-studio-text/70 uppercase tracking-wider">
                  {category}
                </div>
                {categoryCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                      index === selectedIndex ? 'bg-studio-accent/20' : 'hover:bg-white/5'
                    }`}
                  >
                    {command.icon && (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === selectedIndex ? 'bg-studio-accent text-white' : 'bg-studio-border text-studio-text'
                      }`}>
                        {command.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${index === selectedIndex ? 'text-studio-accent' : 'text-studio-text-high'}`}>
                        {command.name}
                      </div>
                      <div className="text-xs text-studio-text/70">
                        {command.description}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <div className="text-xs text-studio-accent font-mono">
                        Enter
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-studio-bg border-t border-studio-border flex items-center justify-between text-xs text-studio-text/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-studio-border rounded">↑↓</span>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-studio-border rounded">Enter</span>
              to select
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-studio-border rounded">Esc</span>
              to close
            </span>
          </div>
          <span>{filteredCommands.length} results</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Default commands for the palette
export const defaultCommands: Command[] = [
  {
    id: 'export',
    name: 'Export Video',
    description: 'Export your project to video file',
    icon: <Download className="w-4 h-4" />,
    action: () => console.log('Export video'),
    category: 'File',
    keywords: ['render', 'save', 'video', 'export'],
  },
  {
    id: 'save',
    name: 'Save Project',
    description: 'Save current project state',
    icon: <Save className="w-4 h-4" />,
    action: () => console.log('Save project'),
    category: 'File',
    keywords: ['save', 'save project', 'store'],
  },
  {
    id: 'undo',
    name: 'Undo',
    description: 'Undo last action',
    icon: <Zap className="w-4 h-4" />,
    action: () => console.log('Undo'),
    category: 'Edit',
    keywords: ['undo', 'back', 'previous'],
  },
  {
    id: 'redo',
    name: 'Redo',
    description: 'Redo last undone action',
    icon: <Zap className="w-4 h-4" />,
    action: () => console.log('Redo'),
    category: 'Edit',
    keywords: ['redo', 'forward', 'next'],
  },
  {
    id: 'delete',
    name: 'Delete Selected',
    description: 'Delete selected clip or item',
    icon: <Trash2 className="w-4 h-4" />,
    action: () => console.log('Delete selected'),
    category: 'Edit',
    keywords: ['delete', 'remove', 'trash'],
  },
  {
    id: 'play',
    name: 'Play/Pause',
    description: 'Play or pause video playback',
    icon: <Play className="w-4 h-4" />,
    action: () => console.log('Play/Pause'),
    category: 'Playback',
    keywords: ['play', 'pause', 'start', 'stop'],
  },
  {
    id: 'share',
    name: 'Share Project',
    description: 'Share project with team members',
    icon: <Share2 className="w-4 h-4" />,
    action: () => console.log('Share project'),
    category: 'File',
    keywords: ['share', 'collaborate', 'team'],
  },
];