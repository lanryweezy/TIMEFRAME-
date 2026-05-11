
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { VideoState, Keyframe, VideoClip, AudioBlock } from '../types';
import { Scissors, Trash2, Magnet, ZoomIn, ZoomOut, Type, Music, FolderOpen, Zap, Diamond, Subtitles, Sparkles, ChevronRight, Square, Activity, Layers, VolumeX, Volume2, MoreVertical, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Waveform } from './ui/Waveform';

interface TimelineProps {
  state: VideoState;
  onSeek: (time: number) => void;
  onSplit: () => void;
  onDelete: () => void;
  onDuplicate: (id: string, mode: 'end' | 'playhead') => void;
  onLockTrack: (trackId: number) => void;
  onRenameTrack: (trackId: number, name: string) => void;
  onUpdateTrackHeight: (trackId: number, height: number) => void;
  onTrim: (trackName: keyof VideoState, id: string, startTime: number, duration: number) => void;
  onMove: (trackName: keyof VideoState, id: string, startTime: number, trackId?: number) => void;
  onMoveKeyframe?: (prop: string, id: string, time: number) => void;
  onSelectClip?: (id: string) => void;
  onSelectItems?: (ids: string[], multiSelect: boolean) => void;
  onSelectShape?: (id: string) => void;
  onSelectParticle?: (id: string) => void;
  onCommitHistory?: () => void;
  onUpdateClipFade?: (id: string, updates: { fadeInDuration?: number, fadeOutDuration?: number }) => void;
  onUpdateVolume?: (id: string, volume: number) => void;
  onZoom: (level: number) => void;
  onFitAll: () => void;
  onFitSelection: () => void;
  onToggleMagnetic: () => void;
  onUpdateSnapSettings: (settings: { playhead: boolean, clips: boolean, markers: boolean }) => void;
  onToggleRipple: () => void;
  onSyncAudio: () => void;
  onGroupSelected: () => void;
  onAddMarker: (time: number, label: string, color: string) => void;
  onAddRegion: (startTime: number, endTime: number, label: string, color: string) => void;
  onAnalyzeTimeline?: () => void;
  onSummarizeTimeline?: () => void;
  onGenerateRoughCut?: () => void;
  onEnterSequence?: (id: string) => void;
  onExitSequence?: () => void;
}

import { TimeRuler } from './timeline/TimeRuler';
import { Playhead } from './timeline/Playhead';
import { TrackHeader } from './timeline/TrackHeader';
import { TimelineTrackComponent } from './timeline/TimelineTrack'; 
import { TimelineClip } from './TimelineClip';
import { useTimelineDrag } from '../hooks/useTimelineDrag';
import { ContextMenu } from './ContextMenu';

const Timeline: React.FC<TimelineProps> = ({ state, onSeek, onSplit, onDelete, onDuplicate, onLockTrack, onRenameTrack, onUpdateTrackHeight, onTrim, onMove, onMoveKeyframe, onSelectClip, onSelectItems, onSelectShape, onSelectParticle, onCommitHistory, onUpdateClipFade, onUpdateVolume, onZoom, onFitAll, onFitSelection, onToggleMagnetic, onUpdateSnapSettings, onToggleRipple, onSyncAudio, onGroupSelected, onAddMarker, onAddRegion, onAnalyzeTimeline, onSummarizeTimeline, onGenerateRoughCut, onEnterSequence, onExitSequence }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item: any, trackName: keyof VideoState } | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - initialDistance;
      const zoomDelta = delta / 5; // Adjustment factor
      onZoom(Math.max(10, Math.min(200, state.zoomLevel + zoomDelta)));
      setInitialDistance(distance);
    }
  };

  const onContextMenuClip = (e: React.MouseEvent, item: any, trackName: keyof VideoState) => {
    setContextMenu({ x: e.clientX, y: e.clientY, item, trackName });
  };
    
  const handleContextMenuAction = (action: string) => {
      if (!contextMenu) return;
      const { item, trackName } = contextMenu;
      switch (action) {
          case 'split': onSplit(); break;
          case 'duplicate': onDuplicate(item.id, 'end'); break;
          case 'duplicate_playhead': onDuplicate(item.id, 'playhead'); break;
          case 'lock': onLockTrack(item.trackId || 1); break;
          case 'properties': onSelectClip?.(item.id); break;
      }
      setContextMenu(null);
  };

  const zoomFactor = state.zoomLevel / 100;
  const pixelsPerSecond = 20 * zoomFactor; // Base scale
  const totalWidthPx = state.duration * pixelsPerSecond;
  
  const percentage = (state.currentTime / state.duration) * 100;
  
  const selectedClip = useMemo(() => {
    if (state.selectedIds.length !== 1) return null;
    const id = state.selectedIds[0];
    return [...state.videoClips, ...state.audioTrack, ...state.textTrack, ...state.subtitleTrack].find(item => item.id === id);
  }, [state.selectedIds, state.videoClips, state.audioTrack, state.textTrack, state.subtitleTrack]);
  
  const { 
      dragState, setDragState, selectionBox, setSelectionBox, snapGuide, setSnapGuide, handleMouseMove, handleMouseUp 
  } = useTimelineDrag(state, onTrim, onMove, onMoveKeyframe, onUpdateClipFade, onCommitHistory, onSelectItems);
  const [viewport, setViewport] = useState({ start: 0, end: 30 }); // in seconds

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.clientWidth;
        const start = scrollLeft / pixelsPerSecond;
        const end = (scrollLeft + width) / pixelsPerSecond;
        setViewport({ start: start - 5, end: end + 5 }); // 5s buffer
      }
    };
    
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call
    }
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [pixelsPerSecond, state.duration]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -10 : 10;
        onZoom(Math.max(10, Math.min(200, state.zoomLevel + zoomDelta)));
    } else if (e.shiftKey) {
        e.preventDefault();
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
        }
    }
  };

  const onFitAllClick = () => {
    if (!timelineRef.current) return;
    const containerWidth = timelineRef.current.clientWidth;
    const newZoom = (containerWidth / state.duration) * 5; // Simplified
    onZoom(Math.max(10, Math.min(200, newZoom)));
  };

  const onFitSelectionClick = () => {
    if (!timelineRef.current || state.selectedIds.length === 0) return;
    const selectedClips = [...state.videoClips, ...state.audioTrack, ...state.textTrack, ...state.subtitleTrack].filter(c => state.selectedIds.includes(c.id));
    if (selectedClips.length === 0) return;
    
    let minTime = Infinity;
    let maxTime = -Infinity;
    selectedClips.forEach(c => {
        minTime = Math.min(minTime, c.startTime);
        maxTime = Math.max(maxTime, c.startTime + c.duration);
    });
    
    const containerWidth = timelineRef.current.clientWidth;
    const duration = maxTime - minTime;
    const newZoom = (containerWidth / duration) * 5; 
    onZoom(Math.max(10, Math.min(200, newZoom)));
  };

  useEffect(() => {
    if (scrollRef.current && state.currentTime !== undefined) {
        const playheadPos = (state.currentTime / state.duration) * totalWidthPx;
        const containerWidth = scrollRef.current.clientWidth;
        if (playheadPos < scrollRef.current.scrollLeft || playheadPos > scrollRef.current.scrollLeft + containerWidth) {
            scrollRef.current.scrollLeft = playheadPos - containerWidth / 2;
        }
    }
  }, [state.currentTime, totalWidthPx]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.timeline-item-handle')) return;
    
    // Add logic for markers/regions if clicking with a modifier key?
    // For now, simple seek.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPercentage = x / rect.width;
    const newTime = Math.max(0, Math.min(state.duration, clickPercentage * state.duration));
    onSeek(newTime);
  };

  const onStartTrim = (e: React.MouseEvent, trackName: keyof VideoState, id: string, edge: 'start' | 'end', startTime: number, duration: number) => {
    e.stopPropagation();
    setDragState({ trackName, id, type: 'trim', edge, initialMouseX: e.clientX, initialMouseY: e.clientY, initialStartTime: startTime, initialDuration: duration });
  };

  const onStartMove = (e: React.MouseEvent, trackName: keyof VideoState, id: string, startTime: number, duration: number) => {
    e.stopPropagation();
    setDragState({ trackName, id, type: 'move', initialMouseX: e.clientX, initialMouseY: e.clientY, initialStartTime: startTime, initialDuration: duration });
  };

  const onStartFadeDrag = (e: React.MouseEvent, id: string, type: 'fade-in' | 'fade-out', initialFade: number) => {
    e.stopPropagation();
    const clip = state.videoClips.find(c => c.id === id);
    if (!clip) return;
    setDragState({ trackName: 'videoClips', id, type, initialMouseX: e.clientX, initialMouseY: e.clientY, initialStartTime: clip.startTime, initialDuration: clip.duration, initialFadeIn: clip.fadeInDuration, initialFadeOut: clip.fadeOutDuration });
  };

  const onStartKeyframeMove = (e: React.MouseEvent, prop: string, id: string, time: number) => {
    e.stopPropagation();
    setDragState({ prop, id, type: 'keyframe', initialMouseX: e.clientX, initialMouseY: e.clientY, initialStartTime: time });
  };

  useEffect(() => {
    const mm = (e: MouseEvent) => handleMouseMove(e, timelineRef);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

    const TrackHeader = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center bg-studio-bg border-r border-studio-border z-20 group">
      <Icon className="w-2.5 h-2.5 text-zinc-500 mb-1 group-hover:text-studio-accent transition-colors" />
      <span className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase whitespace-nowrap rotate-90">{label}</span>
      <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/5 group-hover:bg-studio-accent/40" />
    </div>
  );

  const trackConfigs = useMemo(() => [
    { 
        trackName: 'videoClips' as const, 
        icon: FolderOpen, 
        label: 'Video', 
        height: 'h-16',
        renderItem: (item: any) => (
            <div className="flex items-center gap-2 w-full h-full relative">
                <img src={item.thumbnail} className="h-full aspect-video object-cover rounded-sm opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="flex flex-col min-w-0">
                    <span className="truncate text-[10px] font-black uppercase tracking-wider text-studio-text-high opacity-80">{item.isAdjustmentLayer ? `FIX: ${item.name}` : item.name}</span>
                </div>
            </div>
        )
    },
    { 
        trackName: 'audioTrack' as const, 
        icon: Music, 
        label: 'Audio', 
        height: 'h-14',
        renderItem: (item: any) => (
            <div className="flex flex-col w-full h-full justify-center p-1">
                <span className="truncate text-[9px] uppercase tracking-wider text-cyan-400 font-bold mb-1">{item.name}</span>
                <div className="flex-1 overflow-hidden opacity-30">
                    <Waveform id={item.id} progress={((state.currentTime - item.startTime) / item.duration) * 100} color="#06b6d4" />
                </div>
            </div>
        )
    },
    { trackName: 'textTrack' as const, icon: Type, label: 'Text', height: 'h-10', bg: 'bg-purple-500/10', color: 'text-purple-400', renderItem: (item: any) => <span className="truncate text-[7px] font-black uppercase tracking-widest">{item.text}</span> },
    { trackName: 'shapeTrack' as const, icon: Square, label: 'Shapes', height: 'h-10', bg: 'bg-yellow-500/10', color: 'text-yellow-400', renderItem: (item: any) => <span className="truncate text-[7px] font-black uppercase tracking-widest">{item.type}</span> },
    { trackName: 'subtitleTrack' as const, icon: Subtitles, label: 'Captions', height: 'h-10', bg: 'bg-emerald-500/10', color: 'text-emerald-400', renderItem: (item: any) => <span className="truncate text-[7px] font-black tracking-widest leading-none">{item.text}</span> },
    { trackName: 'effectTrack' as const, icon: Sparkles, label: 'Effects', height: 'h-10', bg: 'bg-orange-500/10', color: 'text-orange-400', renderItem: (item: any) => <span className="truncate text-[7px] font-black uppercase tracking-widest">{item.type}</span> },
  ], [state.currentTime, state.duration]);

  const pulseIndicator = React.useMemo(() => (
    <div className="absolute inset-0 ml-8 flex items-end gap-[2px] opacity-20 pointer-events-none px-2 py-1">
        {/* Mock Pacing/Retention Insight Visualization */}
        {Array.from({ length: 80 }).map((_, i) => {
            // Simulated engagement curve (retention)
            const base = 50 + Math.sin(i * 0.15) * 30;
            const engagement = base + (Math.random() - 0.5) * 10;
            const color = engagement > 60 ? '#10b981' : engagement < 40 ? '#ef4444' : '#6366f1';
            return (
              <div 
                key={i} 
                className="flex-1 rounded-t-sm"
                style={{ 
                  height: `${engagement}%`,
                  backgroundColor: color,
                }}
              />
            );
        })}
    </div>
  ), []);

  return (
    <div className="w-full h-full flex flex-col bg-studio-bg select-none">
      <div className="h-12 bg-transparent flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-2">
            <button onClick={onSplit} className="h-8 px-4 text-[12px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all flex items-center gap-2 active:scale-95 hover:bg-white/5 rounded-lg"><Scissors className="w-3.5 h-3.5" /> Split</button>
            <button onClick={onDelete} className="h-8 px-4 text-[12px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-500 transition-all flex items-center gap-2 active:scale-95 hover:bg-white/5 rounded-lg"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
            
            <div className="w-[1px] h-4 bg-white/5 mx-2" />
            
            <button 
              onClick={onToggleMagnetic}
              className={`h-8 px-4 text-[12px] font-bold uppercase tracking-wider transition-all rounded-lg ${state.magneticTimeline ? 'text-studio-accent bg-studio-accent/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
              Magnetic
            </button> 
            
            <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={state.snapSettings?.playhead ?? false} onChange={e => onUpdateSnapSettings({ ...state.snapSettings, playhead: e.target.checked })} />
                    <span className="text-[10px] text-zinc-400">Snap Playhead</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={state.snapSettings?.clips ?? false} onChange={e => onUpdateSnapSettings({ ...state.snapSettings, clips: e.target.checked })} />
                    <span className="text-[10px] text-zinc-400">Snap Clips</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={state.snapSettings?.markers ?? false} onChange={e => onUpdateSnapSettings({ ...state.snapSettings, markers: e.target.checked })} />
                    <span className="text-[10px] text-zinc-400">Snap Markers</span>
                </label>
            </div>
            
            <div className="w-[1px] h-4 bg-white/5 mx-2" />
            
            <button 
              onClick={onToggleRipple}
              className={`h-8 px-4 text-[12px] font-bold uppercase tracking-wider transition-all rounded-lg ${state.rippleEdit ? 'text-orange-400 bg-orange-400/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
              Ripple
            </button>
            
            <div className="w-[1px] h-4 bg-white/5 mx-2" />
            
            <button 
              onClick={() => onSelectClip?.('detect-scenes-trigger')}
              className={`h-8 px-4 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${state.isDetectingScenes ? 'bg-studio-accent/20 text-white animate-pulse' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
              title="Find scenes in your video"
            >
              <Sparkles className={`w-3.5 h-3.5 ${state.isDetectingScenes ? 'text-studio-accent' : ''}`} /> 
              Find Scenes
            </button>
            
            <div className="w-[1px] h-4 bg-white/5 mx-2" />
            
            <button onClick={onSyncAudio} className="h-8 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg active:scale-95 transition-all" title="Sync Audio to nearest Video"><Music className="w-3.5 h-3.5" /> Sync</button>
            <button onClick={onGroupSelected} className="h-8 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg active:scale-95 transition-all" title="Group into Sequence"><FolderOpen className="w-3.5 h-3.5" /> Group</button>
          </div>
          <div className="flex items-center gap-3">
            {state.activeSequenceId && (
                <button onClick={onExitSequence} className="h-8 px-4 bg-yellow-500/10 rounded-lg text-yellow-500 hover:bg-yellow-500/20 text-[9px] font-black uppercase flex items-center gap-2 transition-all">
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" /> CLOSE
                </button>
            )}
            <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <button onClick={() => {onAddMarker(state.currentTime, "New Marker", "#ff0000")}} title="Add Marker Here" className="p-1.5 text-zinc-400 hover:text-white transition-colors">
                    <MapPin className="w-3 h-3" />
                </button>
                <button onClick={() => {onAddRegion(state.currentTime, state.currentTime + 5, "New Region", "#00ff00")}} title="Add Region Here" className="p-1.5 text-zinc-400 hover:text-white transition-colors">
                    <Tag className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                <button onClick={() => onGenerateRoughCut?.()} title="Generate Rough Cut" className="p-1.5 text-zinc-400 hover:text-white transition-colors">
                    <Scissors className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                <button onClick={() => onAnalyzeTimeline?.()} title="Ask AI about timeline" className="p-1.5 text-zinc-400 hover:text-white transition-colors">
                    <Sparkles className="w-3 h-3" />
                </button>
                <button onClick={() => onSummarizeTimeline?.()} title="Summarize timeline" className="p-1.5 text-zinc-400 hover:text-white transition-colors">
                    <Activity className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                <button onClick={onFitAllClick} className="p-1.5 text-zinc-600 hover:text-white transition-colors" title="Fit All">All</button>
                <button onClick={onFitSelectionClick} className="p-1.5 text-zinc-600 hover:text-white transition-colors" title="Fit Selection">Sel</button>
                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                <button onClick={() => onZoom(Math.max(10, state.zoomLevel - 10))} className="p-1.5 text-zinc-600 hover:text-white transition-colors"><ZoomOut className="w-3 h-3" /></button>
                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <input type="range" min="10" max="200" value={state.zoomLevel} onChange={(e) => onZoom(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                    <div className="h-full bg-studio-accent" style={{ width: `${(state.zoomLevel / 200) * 100}%` }} />
                </div>
                <button onClick={() => onZoom(Math.min(200, state.zoomLevel + 10))} className="p-1.5 text-zinc-600 hover:text-white transition-colors"><ZoomIn className="w-3 h-3" /></button>
            </div>
                <div className="text-[13px] font-mono text-zinc-400 bg-white/5 rounded-lg px-4 py-1 tracking-[0.1em] flex items-center gap-2">
                <div>
                  <span className="text-zinc-600">0:</span>
                  {new Date(state.currentTime * 1000).toISOString().substr(14, 5)}
                  <span className="text-zinc-600">.</span>
                  <span className="text-studio-accent">{Math.floor((state.currentTime % 1) * 30).toFixed(0).padStart(2, '0')}</span>
                </div>
                <div className="w-[1px] h-3 bg-white/10" />
                <span className="text-zinc-500 text-[10px]">F:{Math.floor(state.currentTime * 30).toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-auto studio-scrollbar relative bg-[#020202]"
        onWheel={handleWheel}
        onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onSeek(Math.max(0, state.currentTime - 1/30));
            if (e.key === 'ArrowRight') onSeek(Math.min(state.duration, state.currentTime + 1/30));
        }}
        tabIndex={0}
      >
        <div 
            className="relative min-h-[500px]" 
            ref={timelineRef} 
            onClick={handleTimelineClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onMouseDown={(e) => {
                if (e.button === 0 && !(e.target as HTMLElement).closest('.timeline-item-handle')) {
                    setSelectionBox({ x1: e.clientX, y1: e.clientY, x2: e.clientX, y2: e.clientY });
                }
            }}
            style={{ width: `${totalWidthPx}px` }}
        >
            <TimeRuler 
                duration={state.duration} 
                pixelsPerSecond={pixelsPerSecond} 
                viewportStart={viewport.start} 
                viewportEnd={viewport.end} 
                markers={state.markers}
                regions={state.regions}
            />
            <Playhead percentage={percentage} />
            
            {snapGuide !== null && (
              <div className="absolute top-0 bottom-0 w-[1px] bg-studio-accent/60 z-[45] pointer-events-none border-l border-dashed border-studio-accent" style={{ left: `${(snapGuide / state.duration) * 100}%` }}>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-studio-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
            )}

            {selectionBox && (
              <div 
                className="fixed border-2 border-studio-accent bg-studio-accent/10 z-[100] pointer-events-none"
                style={{
                  left: Math.min(selectionBox.x1, selectionBox.x2),
                  top: Math.min(selectionBox.y1, selectionBox.y2),
                  width: Math.abs(selectionBox.x1 - selectionBox.x2),
                  height: Math.abs(selectionBox.y1 - selectionBox.y2),
                }}
              />
            )}

            {state.isDetectingScenes && (
              <div className="absolute inset-0 z-[60] bg-studio-accent/5 backdrop-blur-[2px] pointer-events-none flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                <div className="relative flex flex-col items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-8 bg-studio-accent rounded-full animate-studio-pulse" 
                        style={{ animationDelay: `${i * 0.1}s` }} 
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase mb-1">AI is looking...</span>
                    <span className="text-[7px] font-sans text-studio-accent uppercase animate-pulse">Finding where scenes change...</span>
                  </div>
                </div>
                {/* Scanning line */}
                <div className="absolute inset-x-0 h-[2px] bg-studio-accent/50 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan-line top-0" />
              </div>
            )}

            <div className="pt-2">
                <div className="mb-1 relative h-6 w-full bg-white/[0.02] rounded-lg mx-2 w-[calc(100%-16px)]">
                    <TrackHeader icon={Activity} label="Clips" />
                    <div className="absolute inset-0 ml-10">
                       {state.videoClips.map((clip, i) => (
                         <div 
                           key={`scene-${clip.id}`}
                           className="absolute top-0 bottom-0 border-l border-white/5 group"
                           style={{ left: `${(clip.startTime / state.duration) * 100}%` }}
                         >
                            <div className="absolute left-1.5 top-1 flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                               <Square className="w-1.5 h-1.5 text-zinc-700" />
                               <span className="text-[5px] font-mono text-zinc-700 uppercase">S{i + 1}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                </div>

                <div className="mb-1 relative h-6 w-full bg-white/[0.02] rounded-lg mx-2 w-[calc(100%-16px)]">
                    <TrackHeader icon={Zap} label="Animation" />
                    <div className="absolute inset-0 ml-10">
                        {Object.entries(state.transform.keyframes || {}).map(([prop, keys]) => 
                            (keys as Keyframe[]).map(k => (
                                <div 
                                    key={k.id} 
                                    onMouseDown={(e) => onStartKeyframeMove(e, prop, k.id, k.time)}
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-studio-accent rotate-45 z-40 shadow-[0_0_8px_rgba(var(--studio-accent-rgb),0.4)] cursor-ew-resize hover:bg-white hover:scale-125 transition-transform group" 
                                    style={{ left: `${(k.time / state.duration) * 100}%` }}
                                >
                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-[6px] font-black text-studio-accent rounded-sm border border-white/5 whitespace-nowrap shadow-2xl">
                                        {prop}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {trackConfigs.map(config => (
                    <TimelineTrackComponent 
                        key={config.trackName}
                        config={config}
                        state={state}
                        viewport={viewport}
                        onStartMove={onStartMove}
                        onStartTrim={onStartTrim}
                        onStartFadeDrag={onStartFadeDrag}
                        onSelectItems={onSelectItems}
                        onSelectClip={onSelectClip}
                        onSelectShape={onSelectShape}
                        onSelectParticle={onSelectParticle}
                        onContextMenuClip={onContextMenuClip}
                        onToggleLock={onLockTrack}
                        onRenameTrack={onRenameTrack}
                        onUpdateTrackHeight={onUpdateTrackHeight}
                    />
                ))}
                
                <div className="mb-1 relative h-10 w-full bg-white/[0.02] border-none rounded-lg mx-2 w-[calc(100%-16px)]">
                    <TrackHeader icon={Activity} label="Pulse" />
                    {pulseIndicator}
                </div>

                {contextMenu && (
                    <ContextMenu 
                        x={contextMenu.x} 
                        y={contextMenu.y} 
                        onClose={() => setContextMenu(null)}
                        onAction={handleContextMenuAction}
                    />
                )}

                <AnimatePresence>
                  {selectedClip && (
                    <motion.div 
                      key={`toolbar-${selectedClip.id}`}
                      initial={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
                      animate={{ opacity: 1, y: -45, scale: 1, x: '-50%' }}
                      exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute z-50 flex items-center gap-1 p-1 bg-zinc-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] hardware-shadow pointer-events-auto"
                      style={{ 
                        left: `${(selectedClip.startTime / state.duration) * 100}%`,
                        top: '50%' // Calculate this more dynamically if possible, for now keep it visible
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                        <div className="px-2 py-0.5 border-r border-white/10 mr-1">
                            <span className="text-[7px] font-black uppercase text-zinc-500 tracking-tighter">Edit Mode</span>
                        </div>
                        <button 
                          onClick={() => onSplit()}
                          className="p-1.5 hover:bg-white/10 rounded-md transition-colors group relative"
                          title="Split Clip (B)"
                        >
                            <Scissors className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                        </button>
                        {(selectedClip as any).audio?.volume !== undefined || (selectedClip as any).volume !== undefined ? (
                          <button 
                            onClick={() => {
                              const currentVol = (selectedClip as any).audio?.volume ?? (selectedClip as any).volume ?? 1;
                              const newVol = currentVol === 0 ? 0.8 : 0;
                              onUpdateVolume?.(selectedClip.id, newVol);
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors group"
                            title="Mute/Unmute"
                          >
                              {((selectedClip as any).audio?.volume === 0 || (selectedClip as any).volume === 0) ? 
                                <VolumeX className="w-3.5 h-3.5 text-red-400" /> : 
                                <Volume2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400" />
                              }
                          </button>
                        ) : null}
                        <button 
                          onClick={() => onDelete()}
                          className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors group"
                          title="Delete Clip (Del)"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500" />
                        </button>
                        <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
                        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors group">
                            <MoreVertical className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
