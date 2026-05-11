import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { VideoState } from '../types';

export const ViralityWindTunnel = ({ state }: { state: VideoState }) => {
  // Simple simulation calculation
  const viralScore = state.videoClips.reduce((acc, clip) => 
    acc + (clip.motionIntensity || 0) * 0.5 + (clip.audioEnergy || 0) * 0.5, 0) / (state.videoClips.length || 1);
    
  return (
    <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> Virality Wind Tunnel</h3>
        <span className="text-xl font-black text-orange-500">{Math.round(viralScore * 100)}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${Math.min(100, viralScore * 100)}%` }} />
      </div>
      <p className="text-[10px] text-zinc-500">Predicted engagement based on pacing and motion intensity.</p>
    </div>
  );
};
