import React from 'react';
import { motion } from 'motion/react';
import { Music, Mic, Bot, Headphones, Waves, Zap, Sparkles } from 'lucide-react';
import { VideoState } from '../types';

const AUDIO_FEATURES = [
  { id: 'mastering', name: 'AI Mastering', icon: Sparkles },
  { id: 'beat', name: 'Beat Intelligence', icon: Waves },
  { id: 'matching', name: 'Emotion Matching', icon: Bot },
  { id: 'cleanup', name: 'Voice Cleanup', icon: Mic },
  { id: 'spatial', name: 'Spatial Audio', icon: Headphones },
  { id: 'podcast', name: 'Podcast Workflows', icon: Music },
  { id: 'design', name: 'AI Sound Design', icon: Zap },
];

export const AudioLab = ({ state }: { state: VideoState }) => {
  return (
    <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-cyan-500" /> Audio Neural Lab
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {AUDIO_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.button
              key={feature.id}
              whileHover={{ backgroundColor: 'rgba(50, 50, 60, 0.8)', borderColor: 'rgba(6, 182, 212, 0.5)' }}
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col items-center gap-2 text-center transition-all"
            >
              <Icon className="w-6 h-6 text-cyan-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{feature.name}</span>
            </motion.button>
          );
        })}
      </div>
      
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center">
        <p className="text-[10px] text-cyan-300 italic">
          AI-driven audio mastering enabled.
        </p>
      </div>
    </div>
  );
};
