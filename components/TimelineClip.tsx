
import React from 'react';
import { Sparkles } from 'lucide-react';
import { VideoState } from '../types';
import { Waveform } from './ui/Waveform';

interface TimelineClipProps {
  item: any;
  trackName: string;
  className?: string;
  duration: number;
  selectedIds: string[];
  currentTime: number;
  sessionUsers: any[];
  onSelectItems?: (ids: string[], multiSelect: boolean) => void;
  onSelectClip?: (id: string) => void;
  onSelectShape?: (id: string) => void;
  onSelectParticle?: (id: string) => void;
  onStartMove: (e: React.MouseEvent, trackName: string, id: string, startTime: number, duration: number) => void;
  onStartTrim: (e: React.MouseEvent, trackName: string, id: string, edge: 'start' | 'end', startTime: number, duration: number) => void;
  onStartFadeDrag: (e: React.MouseEvent, id: string, type: 'fade-in' | 'fade-out', initialFade: number) => void;
  onContextMenu?: (e: React.MouseEvent, item: any, trackName: string) => void;
  children?: React.ReactNode;
}

export const TimelineClip = React.memo<TimelineClipProps>(({ 
  item, trackName, className, duration, selectedIds, currentTime, sessionUsers,
  onSelectItems, onSelectClip, onSelectShape, onSelectParticle, 
  onStartMove, onStartTrim, onStartFadeDrag, onContextMenu, children 
}) => {
  const left = (item.startTime / duration) * 100;
  const width = (item.duration / duration) * 100;
  const isClipSelected = selectedIds.includes(item.id);
  const isHoveredActive = currentTime >= item.startTime && currentTime <= item.startTime + item.duration;
  const activeCollaborators = (sessionUsers || []).filter(u => u.activeClipId === item.id);

  return (
    <div 
      data-id={item.id}
      onClick={(e) => { 
        e.stopPropagation(); 
        if (onSelectItems) {
          onSelectItems([item.id], e.shiftKey);
        } else {
          if (trackName === 'videoClips' || trackName === 'audioTrack' || trackName === 'textTrack') onSelectClip?.(item.id);
          if ((trackName as string) === 'shapeTrack') onSelectShape?.(item.id);
          if ((trackName as string) === 'particleTrack') onSelectParticle?.(item.id);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, item, trackName);
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        onStartMove(e, trackName, item.id, item.startTime, item.duration);
      }}
      className={`absolute top-1 bottom-1 rounded-md border backdrop-blur-sm cursor-pointer group transition-all duration-200 overflow-hidden ${
        isClipSelected 
            ? 'z-30 shadow-[0_0_15px_rgba(var(--studio-accent-rgb),0.3)] bg-zinc-800/90 border-studio-accent' 
            : isHoveredActive 
                ? 'bg-zinc-800/80 border-zinc-600' 
                : activeCollaborators.length > 0 
                    ? 'bg-indigo-950/40 border-indigo-500/50' 
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'
      } ${className}`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      {isClipSelected && <div className="absolute inset-0 bg-studio-accent/5 pointer-events-none" />}
      
      {activeCollaborators.length > 0 && (
          <div className="absolute -top-1.5 -right-1.5 p-0.5 flex -space-x-1">
              {activeCollaborators.map(u => (
                  <div key={u.id} className="w-4 h-4 rounded-full border-2 border-zinc-900 bg-zinc-700 flex items-center justify-center overflow-hidden z-20 shadow-sm" title={`${u.name} is editing`}>
                      {u.avatar ? <img src={u.avatar} alt="" /> : <div className="text-[6px] font-bold text-white">{u.name[0]}</div>}
                  </div>
              ))}
          </div>
      )}
      
      {trackName === 'videoClips' && (item.motionIntensity !== undefined || item.audioEnergy !== undefined) && (
        <div className="absolute left-0 bottom-0 right-0 h-1 flex opacity-50">
          {item.motionIntensity !== undefined && (
            <div className="flex-1 bg-red-500" style={{ height: `${Math.min(100, item.motionIntensity * 100)}%` }} title={`Motion: ${item.motionIntensity}`} />
          )}
          {item.audioEnergy !== undefined && (
            <div className="flex-1 bg-cyan-500" style={{ height: `${Math.min(100, item.audioEnergy * 100)}%` }} title={`Audio: ${item.audioEnergy}`} />
          )}
        </div>
      )}
      
      {/* Improved Trimming Handles */}
      <div className="timeline-item-handle absolute left-0 top-0 bottom-0 w-4 hover:bg-studio-accent/60 cursor-ew-resize group-hover:opacity-100 opacity-0 transition-all z-10" onMouseDown={(e) => onStartTrim(e, trackName, item.id, 'start', item.startTime, item.duration)}>
        <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>
      
      {trackName === 'videoClips' && (
        <>
          <div className="timeline-item-handle absolute left-1 top-1 w-3 h-3 bg-white/10 hover:bg-studio-accent/50 cursor-ew-resize z-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onMouseDown={(e) => onStartFadeDrag(e, item.id, 'fade-in', item.fadeInDuration || 0)}>
             <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className="timeline-item-handle absolute right-1 top-1 w-3 h-3 bg-white/10 hover:bg-studio-accent/50 cursor-ew-resize z-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onMouseDown={(e) => onStartFadeDrag(e, item.id, 'fade-out', item.fadeOutDuration || 0)}>
             <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          {item.isEnhanced && <div className="absolute top-1 right-5 z-20"><Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /></div>}
        </>
      )}
      
      <div className="flex items-center h-full px-3 overflow-hidden pointer-events-none gap-2">
          {children}
          <div className="flex gap-1 ml-auto shrink-0 opacity-0 group-hover:opacity-60 transition-opacity">
              {item.blendMode && item.blendMode !== 'normal' && <div className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-md text-white font-mono">{item.blendMode}</div>}
              {item.motionBlur && <div className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-md text-white font-mono">MB</div>}
              {item.tracking && <div className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-md text-white font-mono">TR</div>}
          </div>
      </div>

      <div className="timeline-item-handle absolute right-0 top-0 bottom-0 w-4 hover:bg-studio-accent/60 cursor-ew-resize group-hover:opacity-100 opacity-0 transition-all z-10" onMouseDown={(e) => onStartTrim(e, trackName, item.id, 'end', item.startTime, item.duration)}>
        <div className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        {children}
      </div>
    </div>
  );
});
