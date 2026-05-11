
import React from 'react';
import { Activity, Smartphone, Zap, HardDrive, Boxes, Sparkles, Shield, Target } from 'lucide-react';
import { VideoState, VideoClip } from '../../types';

interface MonitoringHUDProps {
  state: VideoState;
  activeClip: VideoClip | undefined;
}

export const MonitoringHUD: React.FC<MonitoringHUDProps> = React.memo(({ state, activeClip }) => {
  return (
    <>
      {/* Top Monitoring Bar */}
      <div className="w-full h-10 flex justify-between px-6 items-center font-sans text-[9px] text-zinc-700 uppercase tracking-[0.3em] font-black pointer-events-none">
          <div className="flex items-center gap-6">
              {state.socialPlatform !== 'none' && (
                <span className="flex items-center gap-1.5 opacity-20">
                    <Smartphone className="w-3 h-3" /> {state.socialPlatform}
                </span>
              )}
          </div>
          <div className="flex items-center gap-4">
              {state.proxyMode && <span className="opacity-40">Proxy</span>}
              {activeClip?.isEnhanced && <span className="opacity-40">Upscaled</span>}
          </div>
      </div>

      {/* Basic Info Panel */}
      <div className="absolute left-8 top-12 z-40 pointer-events-none flex flex-col gap-4 opacity-20">
          <div className="flex flex-col gap-2">
              <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-2">
                  <span>{state.projectSettings?.resolution.width}x{state.projectSettings?.resolution.height}</span>
              </div>
              <div className="flex items-center gap-2">
                   <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono text-zinc-500 font-bold">
                           {Math.floor(state.currentTime / 60).toString().padStart(2, '0')}:{Math.floor(state.currentTime % 60).toString().padStart(2, '0')}
                       </span>
                   </div>
              </div>
          </div>
      </div>
    </>
  );
});
