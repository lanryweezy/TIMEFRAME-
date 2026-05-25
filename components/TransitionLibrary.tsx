// @ts-nocheck
/**
 * Transition Library Component (#53)
 * Library of video transitions (crossfade, wipe, dip to black)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Play, Plus, Search } from 'lucide-react';

export interface Transition {
  id: string;
  name: string;
  type: 'crossfade' | 'wipe' | 'dip' | 'slide' | 'zoom' | 'rotate' | 'blur';
  duration: number; // seconds
  direction?: 'left' | 'right' | 'up' | 'down' | 'in' | 'out';
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  preview?: string; // Preview image/video URL
}

interface TransitionLibraryProps {
  onApplyTransition: (transition: Transition) => void;
  selectedTransition?: Transition | null;
}

const defaultTransitions: Transition[] = [
  // Crossfade
  { id: 'crossfade-1', name: 'Crossfade', type: 'crossfade', duration: 1, easing: 'ease-in-out' },
  { id: 'crossfade-2', name: 'Quick Crossfade', type: 'crossfade', duration: 0.5, easing: 'ease-out' },
  { id: 'crossfade-3', name: 'Slow Crossfade', type: 'crossfade', duration: 2, easing: 'ease-in-out' },

  // Wipes
  { id: 'wipe-left', name: 'Wipe Left', type: 'wipe', duration: 1, direction: 'left', easing: 'ease-in-out' },
  { id: 'wipe-right', name: 'Wipe Right', type: 'wipe', duration: 1, direction: 'right', easing: 'ease-in-out' },
  { id: 'wipe-up', name: 'Wipe Up', type: 'wipe', duration: 1, direction: 'up', easing: 'ease-in-out' },
  { id: 'wipe-down', name: 'Wipe Down', type: 'wipe', duration: 1, direction: 'down', easing: 'ease-in-out' },

  // Dips
  { id: 'dip-black', name: 'Dip to Black', type: 'dip', duration: 1, easing: 'ease-in-out' },
  { id: 'dip-white', name: 'Dip to White', type: 'dip', duration: 1, easing: 'ease-in-out' },

  // Slides
  { id: 'slide-left', name: 'Slide Left', type: 'slide', duration: 1, direction: 'left', easing: 'ease-out' },
  { id: 'slide-right', name: 'Slide Right', type: 'slide', duration: 1, direction: 'right', easing: 'ease-out' },
  { id: 'slide-up', name: 'Slide Up', type: 'slide', duration: 1, direction: 'up', easing: 'ease-out' },
  { id: 'slide-down', name: 'Slide Down', type: 'slide', duration: 1, direction: 'down', easing: 'ease-out' },

  // Zooms
  { id: 'zoom-in', name: 'Zoom In', type: 'zoom', duration: 1, direction: 'in', easing: 'ease-out' },
  { id: 'zoom-out', name: 'Zoom Out', type: 'zoom', duration: 1, direction: 'out', easing: 'ease-in' },

  // Rotates
  { id: 'rotate-left', name: 'Rotate Left', type: 'rotate', duration: 1, direction: 'left', easing: 'ease-in-out' },
  { id: 'rotate-right', name: 'Rotate Right', type: 'rotate', duration: 1, direction: 'right', easing: 'ease-in-out' },

  // Blur
  { id: 'blur-in', name: 'Blur In', type: 'blur', duration: 1, direction: 'in', easing: 'ease-out' },
  { id: 'blur-out', name: 'Blur Out', type: 'blur', duration: 1, direction: 'out', easing: 'ease-in' },
];

export const TransitionLibrary: React.FC<TransitionLibraryProps> = ({
  onApplyTransition,
  selectedTransition,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTransition, setPreviewTransition] = useState<Transition | null>(null);

  const categories = [
    { id: 'all', name: 'All Transitions' },
    { id: 'crossfade', name: 'Crossfade' },
    { id: 'wipe', name: 'Wipes' },
    { id: 'dip', name: 'Dips' },
    { id: 'slide', name: 'Slides' },
    { id: 'zoom', name: 'Zoom' },
    { id: 'rotate', name: 'Rotate' },
    { id: 'blur', name: 'Blur' },
  ];

  const filteredTransitions = defaultTransitions.filter(transition => {
    const matchesSearch = transition.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transition.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const TransitionPreview: React.FC<{ transition: Transition }> = ({ transition }) => {
    return (
      <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ 
            duration: transition.duration,
            ease: transition.easing || 'ease-in-out',
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.5
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-4 h-4 text-white/80" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-studio-accent" />
          <h3 className="font-medium text-studio-text-high">Transitions</h3>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-studio-text" />
          <input
            type="text"
            placeholder="Search transitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-studio-bg border border-studio-border rounded text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedCategory === category.id
                  ? 'bg-studio-accent text-white'
                  : 'bg-studio-border text-studio-text hover:bg-studio-border/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transition Grid */}
      <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto studio-scrollbar">
        <AnimatePresence>
          {filteredTransitions.map(transition => (
            <motion.div
              key={transition.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 border rounded cursor-pointer transition-all hover:border-studio-accent ${
                selectedTransition?.id === transition.id
                  ? 'border-studio-accent bg-studio-accent/10'
                  : 'border-studio-border'
              }`}
              onClick={() => onApplyTransition(transition)}
              onMouseEnter={() => setPreviewTransition(transition)}
              onMouseLeave={() => setPreviewTransition(null)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-studio-text-high">
                    {transition.name}
                  </span>
                  <span className="text-xs text-studio-text">
                    {transition.duration}s
                  </span>
                </div>

                {/* Preview */}
                {previewTransition?.id === transition.id ? (
                  <TransitionPreview transition={transition} />
                ) : (
                  <div className="w-full h-16 bg-studio-border/20 rounded flex items-center justify-center">
                    <span className="text-xs text-studio-text capitalize">
                      {transition.type} {transition.direction && `• ${transition.direction}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-studio-text">
                  <span className="capitalize">{transition.easing}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyTransition(transition);
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-studio-accent/20 hover:bg-studio-accent/30 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTransitions.length === 0 && (
        <div className="text-center py-8 text-studio-text">
          <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No transitions found</p>
          <p className="text-xs mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Custom Transition Builder */}
      <div className="border-t border-studio-border pt-4">
        <button className="w-full p-3 border-2 border-dashed border-studio-border hover:border-studio-accent rounded transition-colors text-studio-text hover:text-studio-text-high">
          <Plus className="w-4 h-4 mx-auto mb-1" />
          <span className="text-sm">Create Custom Transition</span>
        </button>
      </div>
    </div>
  );
};