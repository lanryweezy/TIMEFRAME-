// @ts-nocheck
/**
 * Virtualized Timeline Component (#19)
 * Using react-window for performance with large numbers of clips
 */

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';
import { VideoClip, AudioTrack, TextOverlay } from '../types';

interface TimelineItem {
  id: string;
  type: 'video' | 'audio' | 'text';
  startTime: number;
  duration: number;
  trackIndex: number;
  data: VideoClip | AudioTrack | TextOverlay;
}

interface VirtualizedTimelineProps {
  clips: VideoClip[];
  audioTracks: AudioTrack[];
  textOverlays: TextOverlay[];
  duration: number;
  currentTime: number;
  zoomLevel: number;
  onClipSelect: (id: string) => void;
  onClipMove: (id: string, newTime: number) => void;
  onUpdateClip: (id: string, updates: any) => void;
  onSeek: (time: number) => void;
  // VIRTUALIZATION PROPS (Item #14)
  onHydrateRange?: (start: number, end: number) => void;
  isGraphVirtualized?: boolean;
  isHydrating?: boolean;
}

const TRACK_HEIGHT = 60;
const PIXELS_PER_SECOND = 100;
export const VirtualizedTimeline: React.FC<VirtualizedTimelineProps> = ({
  clips,
  audioTracks,
  textOverlays,
  duration,
  currentTime,
  zoomLevel,
  onClipSelect,
  onClipMove,
  onSeek,
  onHydrateRange,
  isGraphVirtualized,
  isHydrating,
}) => {
  const listRef = useRef<VariableSizeList>(null);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const timelineWidth = duration * PIXELS_PER_SECOND * zoomLevel;

  // ELITE PERFORMANCE: Calculate visible time range to cull clips
  const visibleTimeRange = useMemo(() => {
    const start = Math.max(0, (scrollLeft - 100) / (PIXELS_PER_SECOND * zoomLevel));
    const end = (scrollLeft + viewportWidth + 100) / (PIXELS_PER_SECOND * zoomLevel);
    return { start, end };
  }, [scrollLeft, viewportWidth, zoomLevel]);

  // VIRTUALIZED PROJECT GRAPH HYDRATION (Item #14)
  useEffect(() => {
    if (isGraphVirtualized && onHydrateRange) {
        // Predictive hydration: Fetch 60 seconds around viewport to minimize pops
        onHydrateRange(Math.max(0, visibleTimeRange.start - 30), visibleTimeRange.end + 30);
    }
  }, [visibleTimeRange, isGraphVirtualized, onHydrateRange]);

  // Combine all timeline items and organize by tracks
  const timelineData = useMemo(() => {
    const tracks: TimelineItem[][] = [];
    
    // Video clips (track 0)
    tracks[0] = clips.map(clip => ({
      id: clip.id,
      type: 'video' as const,
      startTime: clip.startTime,
      duration: clip.duration,
      trackIndex: 0,
      data: clip,
    }));

    // Audio tracks (tracks 1+)
    audioTracks.forEach((track, index) => {
      const trackIndex = index + 1;
      if (!tracks[trackIndex]) tracks[trackIndex] = [];
      tracks[trackIndex].push({
        id: track.id,
        type: 'audio' as const,
        startTime: track.startTime,
        duration: track.duration,
        trackIndex,
        data: track,
      });
    });

    // Text overlays (last track)
    const textTrackIndex = Math.max(tracks.length, 2);
    tracks[textTrackIndex] = textOverlays.map(text => ({
      id: text.id,
      type: 'text' as const,
      startTime: text.startTime,
      duration: text.duration,
      trackIndex: textTrackIndex,
      data: text,
    }));

    return tracks.filter(track => track && track.length > 0);
  }, [clips, audioTracks, textOverlays]);

  // Get track height (variable for different track types)
  const getTrackHeight = useCallback((index: number) => {
    const track = timelineData[index];
    if (!track || track.length === 0) return TRACK_HEIGHT;
    
    const trackType = track[0].type;
    switch (trackType) {
      case 'video': return TRACK_HEIGHT + 20; // Larger for video
      case 'audio': return TRACK_HEIGHT;
      case 'text': return TRACK_HEIGHT - 20; // Smaller for text
      default: return TRACK_HEIGHT;
    }
  }, [timelineData]);

  // Render individual track
  const TrackRenderer = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const track = timelineData[index];
    if (!track) return null;

    const trackType = track[0].type;
    const trackColor = {
      video: 'bg-blue-500/20 border-blue-500/50',
      audio: 'bg-green-500/20 border-green-500/50',
      text: 'bg-purple-500/20 border-purple-500/50',
    }[trackType];

    // ELITE CULLING: Only render clips that intersect with the visible viewport
    const visibleClips = track.filter(item => 
      (item.startTime + item.duration) >= visibleTimeRange.start && 
      item.startTime <= visibleTimeRange.end
    );

    return (
      <div style={style} className="relative">
        <div className="h-full border-b border-studio-border/30 relative overflow-hidden">
          {/* Track label */}
          <div className="absolute left-0 top-0 w-24 h-full bg-panel-elevated backdrop-blur-md border-r border-panel-border flex items-center px-2 z-10">
            <span className="text-xs font-medium text-studio-text capitalize">
              {trackType} {trackType !== 'video' ? track[0].trackIndex : ''}
            </span>
          </div>

          {/* Timeline items */}
          <div className="ml-24 h-full relative">
            <div 
              className="absolute top-0 left-0 h-full will-change-transform"
              style={{ transform: `translateX(${-visibleTimeRange.start * PIXELS_PER_SECOND * zoomLevel}px)` }}
            >
              {visibleClips.map(item => {
                const left = item.startTime * PIXELS_PER_SECOND * zoomLevel;
                const width = item.duration * PIXELS_PER_SECOND * zoomLevel;
                
                return (
                  <TimelineClip
                    key={item.id}
                    item={item}
                    left={left}
                    width={width}
                    height={getTrackHeight(index) - 8}
                    trackColor={trackColor}
                    onSelect={() => onClipSelect(item.id)}
                    onMove={(newTime) => onClipMove(item.id, newTime)}
                    zoomLevel={zoomLevel}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }, [timelineData, zoomLevel, getTrackHeight, onClipSelect, onClipMove, visibleTimeRange]);

  // Scroll to current time
  useEffect(() => {
    const scrollPosition = currentTime * PIXELS_PER_SECOND * zoomLevel;
    // Auto-scroll logic would go here
  }, [currentTime, zoomLevel]);

  const handleScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    setScrollLeft(scrollOffset);
  };

  return (
    <div className="h-full bg-app-bg relative">
       {/* HYDRATION OVERLAY (Item #14) */}
       <AnimatePresence>
        {isHydrating && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl hardware-shadow"
          >
            <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 bg-studio-accent rounded-full"
                    />
                ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
                Hydrating Project Graph...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AutoSizer onResize={({ width }) => setViewportWidth(width)}>
        {({ height, width }) => (
          <div className="relative">
            {/* Timeline ruler */}
            <TimelineRuler
              width={width}
              duration={duration}
              currentTime={currentTime}
              zoomLevel={zoomLevel}
              onSeek={onSeek}
              scrollLeft={scrollLeft}
            />
            
            {/* Virtualized track list */}
            <VariableSizeList
              ref={listRef}
              height={height - 40} // Account for ruler
              itemCount={timelineData.length}
              itemSize={getTrackHeight}
              width={width}
              onScroll={handleScroll}
              overscanCount={2}
            >
              {TrackRenderer}
            </VariableSizeList>
          </div>
        )}
      </AutoSizer>
    </div>
  );
};

// Individual timeline clip component
interface TimelineClipProps {
  item: TimelineItem;
  left: number;
  width: number;
  height: number;
  trackColor: string;
  onSelect: () => void;
  onMove: (newTime: number) => void;
  zoomLevel: number;
}

const TimelineClip: React.FC<TimelineClipProps> = ({
  item,
  left,
  width,
  height,
  trackColor,
  onSelect,
  onMove,
  zoomLevel,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, time: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      time: item.startTime,
    });
    onSelect();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaTime = deltaX / (PIXELS_PER_SECOND * zoomLevel);
    const newTime = Math.max(0, dragStart.time + deltaTime);
    
    onMove(newTime);
  }, [isDragging, dragStart, zoomLevel, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Don't render if too small
  if (width < 2) return null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`absolute border rounded cursor-move select-none shadow-md backdrop-blur-md ${trackColor} ${
        isDragging ? 'opacity-80 z-50 ring-2 ring-white/50' : 'hover:brightness-110 hover:shadow-lg hover:border-white/40 transition-all duration-200'
      }`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 20)}px`,
        height: `${height}px`,
        top: '4px',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-1 h-full overflow-hidden">
        <div className="text-xs font-medium text-white truncate">
          {item.type === 'video' && (item.data as VideoClip).src?.split('/').pop()}
          {item.type === 'audio' && (item.data as AudioTrack).src?.split('/').pop()}
          {item.type === 'text' && (item.data as TextOverlay).content}
        </div>
        {width > 60 && (
          <div className="text-xs text-white/70">
            {item.duration.toFixed(1)}s
          </div>
        )}
      </div>
      
      {/* Resize handles */}
      {width > 40 && (
        <>
          <div className="absolute left-0 top-0 w-1 h-full bg-white/50 cursor-w-resize" />
          <div className="absolute right-0 top-0 w-1 h-full bg-white/50 cursor-e-resize" />
        </>
      )}
    </motion.div>
  );
};

import { readSharedTime, readSharedPlaying } from '../lib/sharedState';

// Timeline ruler component
interface TimelineRulerProps {
  width: number;
  duration: number;
  currentTime: number;
  zoomLevel: number;
  onSeek: (time: number) => void;
  scrollLeft: number;
}

const TimelineRuler: React.FC<TimelineRulerProps> = ({
  width,
  duration,
  currentTime,
  zoomLevel,
  onSeek,
  scrollLeft,
}) => {
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const updatePlayhead = () => {
      if (playheadRef.current) {
         const isPlaying = readSharedPlaying();
         const time = isPlaying ? readSharedTime() : currentTime;
         // Adjust playhead position based on scrollLeft
         const playheadPosition = 96 + (time * PIXELS_PER_SECOND * zoomLevel) - scrollLeft;
         playheadRef.current.style.transform = `translateX(${playheadPosition}px)`;
         
         // Hide playhead if scrolled out of view
         playheadRef.current.style.opacity = playheadPosition < 96 ? '0' : '1';
      }
      animationFrameId = requestAnimationFrame(updatePlayhead);
    };

    updatePlayhead();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentTime, zoomLevel, scrollLeft]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 96 + scrollLeft; // Account for scroll
    const time = x / (PIXELS_PER_SECOND * zoomLevel);
    onSeek(Math.max(0, Math.min(duration, time)));
  };

  return (
    <div 
      className="h-10 bg-panel-base border-b border-panel-border relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Track labels area */}
      <div className="absolute left-0 top-0 w-24 h-full bg-panel-elevated border-r border-panel-border z-20" />
      
      {/* Time markers */}
      <div className="ml-24 h-full relative overflow-hidden">
        <div 
          className="h-full relative will-change-transform"
          style={{ transform: `translateX(${-scrollLeft}px)` }}
        >
          {Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => {
            const x = i * PIXELS_PER_SECOND * zoomLevel;
            // Only render visible markers for extra performance
            if (x < scrollLeft - 100 || x > scrollLeft + width + 100) return null;
            
            return (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-studio-border/50"
                style={{ left: `${x}px` }}
              >
                <span className="text-xs text-studio-text ml-1 mt-1 block">
                  {i}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playhead (Direct DOM Manipulated) */}
      <div
        ref={playheadRef}
        className="absolute top-0 left-0 w-0.5 h-full bg-red-500 z-10 pointer-events-none will-change-transform"
      >
        <div className="absolute -top-1 -left-2 w-4 h-3 bg-red-500 clip-path-triangle" />
      </div>
    </div>
  );
};