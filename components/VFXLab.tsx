import React from 'react';
import { motion } from 'motion/react';
import { Network, Atom, Wand2, Orbit, Target, Scissors, Box, Camera, Sparkles } from 'lucide-react';
import { VideoState } from '../types';

const VFX_FEATURES = [
  { id: 'particles', name: 'Particle Systems', icon: Atom },
  { id: 'compositing', name: 'Node Compositing', icon: Network },
  { id: 'procedural', name: 'Procedural Animation', icon: Wand2 },
  { id: 'motion', name: 'Motion Graphics', icon: Orbit },
  { id: 'tracking', name: 'Tracking', icon: Target },
  { id: 'rotoscoping', name: 'Rotoscoping', icon: Scissors },
  { id: 'physics', name: 'Physics Simulation', icon: Box },
  { id: 'camera', name: 'Camera Systems', icon: Camera },
];

export const VFXLab = ({ state }: { state: VideoState }) => {
  return (
    <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> Motion & VFX Lab
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {VFX_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.button
              key={feature.id}
              whileHover={{ backgroundColor: 'rgba(50, 50, 60, 0.8)', borderColor: 'rgba(168, 85, 247, 0.5)' }}
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col items-center gap-2 text-center transition-all"
            >
              <Icon className="w-6 h-6 text-purple-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{feature.name}</span>
            </motion.button>
          );
        })}
      </div>
      
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center">
        <p className="text-[10px] text-purple-300 italic">
          High-performance spatial compute nodes active.
        </p>
      </div>
    </div>
  );
};
