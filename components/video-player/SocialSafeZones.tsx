import React from 'react';
import { VideoState } from '../../types';

interface SocialSafeZonesProps {
  state: VideoState;
}

export const SocialSafeZones: React.FC<SocialSafeZonesProps> = ({ state }) => {
  if (state.socialPlatform === 'none') return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none border border-white/5">
      {state.socialPlatform === 'tiktok' && (
        <div className="absolute inset-0">
          <div className="absolute right-2 bottom-24 w-12 flex flex-col gap-4 items-center opacity-40">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40" />
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <div className="w-6 h-6 rounded-full bg-white/10" />
          </div>
          <div className="absolute left-4 bottom-8 flex flex-col gap-1 w-48 opacity-40">
            <div className="h-2 w-32 bg-white/20 rounded" />
            <div className="h-2 w-48 bg-white/10 rounded" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      {state.socialPlatform === 'reels' && (
        <div className="absolute inset-0">
          <div className="absolute left-4 bottom-8 flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 rounded-full bg-white/20" />
            <div className="h-2 w-24 bg-white/20 rounded" />
          </div>
        </div>
      )}
      <div className="absolute inset-0 border border-dashed border-red-500/20 m-4 flex items-center justify-center">
        <span className="text-[6px] font-mono text-red-500/20 uppercase">Safe Zone</span>
      </div>
    </div>
  );
};
