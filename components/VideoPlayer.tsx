import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState, FilterPreset, VideoAdjustment, VideoClip } from '../types';
import { usePixiRenderer } from '../hooks/usePixiRenderer';
import { Play, Pause, MousePointer2 } from 'lucide-react';

import { ProcessingOverlay } from './video-player/ProcessingOverlay';
import { MonitoringHUD } from './video-player/MonitoringHUD';
import { SocialSafeZones } from './video-player/SocialSafeZones';

interface VideoPlayerProps {
  state: VideoState;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onTogglePlay: () => void;
  onSelectText: (id: string) => void;
  onMultiCamSelect?: (id: string) => void;
}

const getAspectRatioClasses = (aspectRatio: string) => {
    switch(aspectRatio) {
        case '9:16': return 'aspect-[9/16] h-[75vh]';
        case '1:1': return 'aspect-square h-[60vh]';
        case '4:5': return 'aspect-[4/5] h-[65vh]';
        case '2.35:1': return 'aspect-[2.35/1] w-full';
        default: return 'aspect-video w-full';
    }
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ state, onTimeUpdate, onDurationChange, onTogglePlay, onSelectText, onMultiCamSelect }) => {
  const { containerRef } = usePixiRenderer(state, onTimeUpdate, onDurationChange);

  const activeClip = useMemo(() => {
    const clips = state.videoClips || [];
    const active = clips
      .filter(c => !c.isAdjustmentLayer && state.currentTime >= c.startTime && state.currentTime <= c.startTime + c.duration)
      .sort((a, b) => (b.trackId || 0) - (a.trackId || 0))[0];
    
    return active || clips.find(c => !c.isAdjustmentLayer);
  }, [state.videoClips, state.currentTime]);

  const activeTexts = useMemo(() => {
    return (state.textTrack || []).filter(t => state.currentTime >= t.startTime && state.currentTime <= t.startTime + t.duration);
  }, [state.textTrack, state.currentTime]);

  const activeSubtitles = useMemo(() => {
    return (state.subtitleTrack || []).filter(s => state.currentTime >= s.startTime && state.currentTime <= s.startTime + s.duration);
  }, [state.subtitleTrack, state.currentTime]);

  const multiCamClips = useMemo(() => {
    if (!state.multiCamMode) return [];
    return (state.videoClips || []).filter(c => !c.isAdjustmentLayer && state.currentTime >= c.startTime && state.currentTime <= c.startTime + c.duration);
  }, [state.videoClips, state.currentTime, state.multiCamMode]);

  const activeEffects = useMemo(() => {
    return (state.effectTrack || []).filter(e => state.currentTime >= e.startTime && state.currentTime <= e.startTime + e.duration);
  }, [state.effectTrack, state.currentTime]);

  const vignetteStyle = useMemo(() => {
    const adj = activeClip?.adjustment || state.adjustment;
    const intensity = adj.vignetteIntensity / 100;
    const size = adj.vignetteSize;
    return {
      background: `radial-gradient(circle, transparent ${size}%, rgba(0,0,0,${intensity}) 100%)`,
    };
  }, [activeClip, state.adjustment]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <MonitoringHUD state={state} activeClip={activeClip} />

      <div className={`relative overflow-hidden bg-black transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,1)] border ${getAspectRatioClasses(state.aspectRatio)} ${state.isAnalyzing || state.isGenerating || state.isEnhancing || state.isStabilizing || state.isGeneratingAvatar ? 'border-blue-500/50 active-glow' : 'border-[#1a1a1a]'}`}>
         {/* Pixi Renderer Container */}
         <div ref={containerRef} className="absolute inset-0 z-10" />

         {state.multiCamMode && multiCamClips.length > 1 && (
            <div className="absolute inset-0 z-[45] bg-black/80 backdrop-blur-sm p-4 grid grid-cols-2 gap-2">
                {multiCamClips.map(clip => (
                    <div 
                        key={clip.id} 
                        className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${state.selectedClipId === clip.id ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onMultiCamSelect) onMultiCamSelect(clip.id);
                        }}
                    >
                        <video src={clip.url} className="w-full h-full object-cover opacity-60" muted playsInline />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[6px] font-mono text-white uppercase tracking-widest border border-white/10">
                            Track {clip.trackId}
                        </div>
                    </div>
                ))}
            </div>
         )}

         {(activeEffects || []).some(e => e.type === 'film_grain') && (
            <div className="absolute inset-0 z-[12] pointer-events-none opacity-[0.08] mix-blend-screen bg-[url('https://media.giphy.com/media/oEI9uWUicVQCk/giphy.gif')] bg-repeat"></div>
         )}

         {(activeEffects || []).some(e => e.type === 'chromatic_aberration') && (
            <div className="absolute inset-0 z-[13] pointer-events-none animate-pulse bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10 mix-blend-screen transition-all duration-75"></div>
         )}

          {/* AI Processing and HUD Overlay */}
          <ProcessingOverlay state={state} />

          <SocialSafeZones state={state} />

         {/* Vignette Overlay Layer */}
         <div className="absolute inset-0 z-[15] pointer-events-none transition-all duration-300" style={vignetteStyle}></div>

         {/* Subtitle Overlay Layer */}
         <div className="absolute inset-x-0 bottom-24 z-50 pointer-events-none flex flex-col items-center">
            {activeSubtitles.map((sub) => (
                <div key={sub.id} className="animate-[scale-in_0.15s_ease-out] select-none">
                    <span 
                      className="bg-yellow-400 text-black px-6 py-2 rounded-lg text-lg font-black tracking-tighter uppercase italic shadow-[0_10px_30px_rgba(250,204,21,0.3)] border-b-4 border-yellow-600 block"
                      style={{ transform: 'skewX(-5deg)' }}
                    >
                        {sub.text}
                    </span>
                </div>
            ))}
         </div>

         {/* Text Overlay Layer */}
         <div className="absolute inset-0 z-20 pointer-events-none">
            {activeTexts.map((text) => (
                <div 
                    key={text.id} 
                    className={`absolute pointer-events-auto cursor-pointer transition-opacity duration-300 ${state.selectedTextId === text.id ? 'ring-1 ring-white/50 ring-offset-2 ring-offset-black/50' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onSelectText(text.id); }}
                    style={{
                        left: `${text.style.x}%`,
                        top: `${text.style.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontFamily: text.style.fontFamily,
                        fontSize: `${text.style.fontSize}px`,
                        color: text.style.color,
                        opacity: text.style.opacity,
                    }}
                >
                    <div style={{
                        backgroundColor: text.style.backgroundColor || 'transparent',
                        padding: `${text.style.padding || 0}px`,
                        opacity: text.style.backgroundOpacity ?? 1,
                        display: 'inline-block',
                    }}>
                        {text.text}
                    </div>
                </div>
            ))}
         </div>

          {/* Global Pipeline Progress Overlay */}
          {state.isAnalyzing && (
            <div className="absolute inset-x-0 top-0 h-1 z-[100] flex gap-1 px-4 pt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-1 h-full bg-studio-accent/20 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.5, ease: "linear", repeat: Infinity, delay: i * 0.2 }}
                            className="h-full bg-studio-accent shadow-[0_0_10px_rgba(var(--studio-accent-rgb),0.8)]"
                        />
                    </div>
                ))}
            </div>
          )}
          
          {/* Live Multiplayer Cursors */}
          <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden">
              {(state.collaboration?.sessionUsers || []).filter(u => u.isOnline && u.cursor && u.id !== '1').map(user => (
                  <div 
                    key={user.id}
                    className="absolute transition-all duration-300 ease-out flex flex-col items-start gap-1"
                    style={{ left: `${user.cursor?.x}%`, top: `${user.cursor?.y}%` }}
                  >
                      <MousePointer2 className="w-4 h-4 text-studio-accent drop-shadow-lg" />
                      <div className="bg-studio-accent px-1.5 py-0.5 rounded-full shadow-lg">
                          <span className="text-[6px] font-black uppercase text-white whitespace-nowrap">{user.name}</span>
                      </div>
                  </div>
              ))}
          </div>

         <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10 cursor-pointer z-[40]" onClick={onTogglePlay}>
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
                {state.isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
            </div>
         </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
