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
  onStartMove: (e: React.MouseEvent, trackName: keyof VideoState, id: string, startTime: number, duration: number) => void;
  onStartTrim: (e: React.MouseEvent, trackName: keyof VideoState, id: string, edge: 'start' | 'end', startTime: number, duration: number) => void;
  onStartFadeDrag: (e: React.MouseEvent, id: string, type: 'fade-in' | 'fade-out', initialFade: number) => void;
  onSelectItems?: (ids: string[], multiSelect: boolean) => void;
  onSelectClip?: (id: string) => void;
  onSelectShape?: (id: string) => void;
  onSelectParticle?: (id: string) => void;
  onContextMenuClip: (e: React.MouseEvent, item: any, trackName: keyof VideoState) => void;
  onToggleLock: (trackId: number) => void;
  onRenameTrack: (trackId: number, name: string) => void;
  onUpdateTrackHeight: (trackId: number, height: number) => void;
}

export const TimelineTrackComponent = ({ config, state, viewport, onStartMove, onStartTrim, onStartFadeDrag, onSelectItems, onSelectClip, onSelectShape, onSelectParticle, onContextMenuClip, onToggleLock, onRenameTrack, onUpdateTrackHeight }: TimelineTrackProps) => {
    const items = (state[config.trackName] as any[]) || [];
    
    // Group items by trackId
    const tracks: Record<number, any[]> = {};
    items.forEach((item: any) => {
        const tid = item.trackId || 1;
        if (!tracks[tid]) tracks[tid] = [];
        tracks[tid].push(item);
    });

    const trackIds = Object.keys(tracks).map(Number).sort((a,b) => a - b);
    if (trackIds.length === 0) trackIds.push(1); // Default track

    return (
        <div className="space-y-1 mb-2">
            {trackIds.map(tid => (
                <div key={`${config.trackName}-${tid}`} className={`relative ${config.height} w-[calc(100%-16px)] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-lg mx-2 ${state.lockedTracks.includes(tid) ? 'border border-red-500/20 opacity-70' : ''}`}>
                    <TrackHeader 
                        icon={config.icon} 
                        label={state.trackNames?.[tid] || config.label} 
                        isLocked={state.lockedTracks.includes(tid)}
                        onToggleLock={() => onToggleLock(tid)}
                    />
                    <div className="absolute inset-0 ml-10">
                        {(tracks[tid] || [])
                            .filter((item: any) => (item.startTime + item.duration) >= viewport.start && item.startTime <= viewport.end)
                            .map((item: any) => (
                                <TimelineClip 
                                    key={item.id}
                                    item={item}
                                    trackName={config.trackName}
                                    className={`border-none ${config.bg || ''} rounded-lg`}
                                    duration={state.duration}
                                    selectedIds={state.selectedIds}
                                    currentTime={state.currentTime}
                                    sessionUsers={state.collaboration?.sessionUsers || []}
                                    onSelectItems={onSelectItems}
                                    onSelectClip={onSelectClip}
                                    onSelectShape={onSelectShape}
                                    onSelectParticle={onSelectParticle}
                                    onStartMove={onStartMove}
                                    onStartTrim={onStartTrim}
                                    onStartFadeDrag={onStartFadeDrag}
                                    onContextMenu={onContextMenuClip}
                                >
                                    {config.renderItem?.(item) || null}
                                </TimelineClip>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
