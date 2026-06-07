import React from 'react';
import { TimelineClip } from '../TimelineClip';
import { TrackHeader } from './TrackHeader';
import { Waveform } from '../ui/Waveform';
import { VideoState } from '../../types';

interface TrackConfig {
  trackName: keyof VideoState;
  icon: any;
  label: string;
  height: string;
  bg?: string;
  color?: string;
  renderItem?: (item: any) => React.ReactNode;
}

interface TimelineTrackProps {
  config: TrackConfig;
  state: VideoState;
  viewport: { start: number; end: number };
  dragState?: any; // Add dragState prop
  onStartMove: (
    e: React.MouseEvent,
    trackName: keyof VideoState,
    id: string,
    startTime: number,
    duration: number,
  ) => void;
  onStartTrim: (
    e: React.MouseEvent,
    trackName: keyof VideoState,
    id: string,
    edge: 'start' | 'end',
    startTime: number,
    duration: number,
  ) => void;
  onStartFadeDrag: (
    e: React.MouseEvent,
    id: string,
    type: 'fade-in' | 'fade-out',
    initialFade: number,
  ) => void;
  onSelectItems?: (ids: string[], multiSelect: boolean) => void;
  onSelectClip?: (id: string) => void;
  onSelectShape?: (id: string) => void;
  onSelectParticle?: (id: string) => void;
  onContextMenuClip: (e: React.MouseEvent, item: any, trackName: keyof VideoState) => void;
  onToggleLock: (trackId: number) => void;
  onRenameTrack: (trackId: number, name: string) => void;
  onUpdateTrackHeight: (trackId: number, height: number) => void;
  activeMode: string;
  onMoveKeyframe?: (prop: string, id: string, time: number) => void;
}

/**
 * HIGH-PERFORMANCE WINDOWING ENGINE
 * Uses binary search to find visible clips in O(log n) time.
 */
const getVisibleItems = (items: any[], viewport: { start: number; end: number }) => {
  if (items.length === 0) return [];
  
  // 1. Binary Search for start index
  let low = 0;
  let high = items.length - 1;
  let startIndex = 0;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (items[mid].startTime + items[mid].duration >= viewport.start) {
      startIndex = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // 2. Linear scan from start for end index (usually very few items)
  const visible = [];
  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];
    if (item.startTime > viewport.end) break;
    // Strict overlap check
    if (item.startTime + item.duration >= viewport.start) {
      visible.push(item);
    }
  }
  
  return visible;
};

export const TimelineTrackComponent = ({
  config,
  state,
  viewport,
  dragState,
  onStartMove,
  onStartTrim,
  onStartFadeDrag,
  onSelectItems,
  onSelectClip,
  onSelectShape,
  onSelectParticle,
  onContextMenuClip,
  onToggleLock,
  onRenameTrack,
  onUpdateTrackHeight,
  activeMode,
  onMoveKeyframe,
}: TimelineTrackProps) => {
  // Memoize grouping and sorting to avoid O(N) recalculations on scroll/frequent updates
  const { tracks, trackIds } = React.useMemo(() => {
    const items = (state[config.trackName] as any[]) || [];
    const tracksObj: Record<number, any[]> = {};
    items.forEach((item: any) => {
      const tid = item.trackId || 1;
      if (!tracksObj[tid]) tracksObj[tid] = [];
      tracksObj[tid].push(item);
    });

    // Sort items by startTime in each track for binary search
    Object.values(tracksObj).forEach(trackItems => {
      trackItems.sort((a, b) => a.startTime - b.startTime);
    });

    const ids = Object.keys(tracksObj)
      .map(Number)
      .sort((a, b) => a - b);
    if (ids.length === 0) ids.push(1); // Default track

    return { tracks: tracksObj, trackIds: ids };
  }, [state, config.trackName]);

  return (
    <div className="space-y-1 mb-2">
      {trackIds.map((tid) => {
        const trackItems = tracks[tid] || [];
        const visibleItems = getVisibleItems(trackItems, viewport);

        return (
          <div
            key={`${config.trackName}-${tid}`}
            className={`relative ${config.height} w-[calc(100%-16px)] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-lg mx-2 ${state.lockedTracks.includes(tid) ? 'border border-red-500/20 opacity-70' : ''}`}
          >
            <TrackHeader
              icon={config.icon}
              label={state.trackNames?.[tid] || config.label}
              isLocked={state.lockedTracks.includes(tid)}
              onToggleLock={() => onToggleLock(tid)}
            />
            <div className="absolute inset-0 ml-10">
              {visibleItems.map((item: any) => (
                <TimelineClip
                  key={item.id}
                  item={item}
                  trackName={config.trackName}
                  className={`border-none ${config.bg || ''} rounded-lg`}
                  duration={state.duration}
                  selectedIds={state.selectedIds}
                  currentTime={state.currentTime}
                  sessionUsers={state.collaboration?.sessionUsers || []}
                  dragState={dragState}
                  onSelectItems={onSelectItems}
                  onSelectClip={onSelectClip}
                  onSelectShape={onSelectShape}
                  onSelectParticle={onSelectParticle}
                  onStartMove={onStartMove}
                  onStartTrim={onStartTrim}
                  onStartFadeDrag={onStartFadeDrag}
                  onContextMenu={onContextMenuClip}
                  activeMode={activeMode}
                  onMoveKeyframe={onMoveKeyframe}
                >
                  {config.renderItem?.(item) || null}
                </TimelineClip>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
