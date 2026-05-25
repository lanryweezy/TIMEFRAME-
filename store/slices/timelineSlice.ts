import { StateCreator } from 'zustand';
import { addTime, subTime, normalizeToTick } from '../../lib/time';
import { loadTimelineRange } from '../../services/persistenceService';
import { 
  VideoClip, 
  SubtitleBlock, 
  TextBlock, 
  AudioBlock, 
  EffectBlock, 
  ShapeBlock, 
  ParticleSystem,
  EditorMode,
  VideoState,
  TimelineMarker
} from '../../types';

export interface TimelineSlice {
  videoClips: VideoClip[];
  subtitleTrack: SubtitleBlock[];
  textTrack: TextBlock[];
  audioTrack: AudioBlock[];
  effectTrack: EffectBlock[];
  shapeTrack: ShapeBlock[];
  particleTrack: ParticleSystem[];
  spatialIndex: Record<string, string[]>; // Time bucket -> Clip IDs
  
  // VIRTUALIZATION METADATA (Item #14)
  isGraphVirtualized: boolean;
  loadedRanges: { start: number; end: number }[];
  isHydrating: boolean;
  
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  
  selectedIds: string[];
  selectedClipId?: string;
  selectedTextId?: string;
  activeMode: EditorMode;

  hydrateTimelineRange: (startTime: number, endTime: number) => Promise<void>;
  addClip: (clip: VideoClip) => void;
  updateClip: (id: string, updates: Partial<VideoClip>) => void;
  removeClip: (id: string) => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  togglePlayback: () => void;
  
  splitClip: () => void;
  trimClip: (trackName: keyof VideoState, id: string, startTime: number, duration: number, mode?: 'trim' | 'ripple' | 'roll' | 'slip' | 'slide') => void;
  moveClip: (trackName: keyof VideoState, id: string, startTime: number, trackId?: number) => void;
  deleteSelected: () => void;
  
  addAudio: (audio: AudioBlock) => void;
  updateAudio: (id: string, updates: Partial<AudioBlock>) => void;
  
  addText: (text: TextBlock) => void;
  updateText: (
    id: string,
    updates: Partial<TextBlock> | { style: Partial<TextBlock['style']> },
  ) => void;

  selectItems: (ids: string[], multiSelect?: boolean) => void;
  clearSelection: () => void;
  setMode: (mode: EditorMode) => void;
  
  addMarkers: (newMarkers: TimelineMarker[]) => void;
  setRippleEdit: (enabled: boolean) => void;
  addAdjustmentLayer: () => void;
  duplicateSelected: () => void;
}

export const createTimelineSlice: StateCreator<any, [], [], TimelineSlice> = (set, get) => ({
  videoClips: [],
  subtitleTrack: [],
  textTrack: [],
  audioTrack: [],
  effectTrack: [],
  shapeTrack: [],
  particleTrack: [],
  spatialIndex: {},

  // VIRTUALIZATION INITIAL STATE (Item #14)
  isGraphVirtualized: false,
  loadedRanges: [],
  isHydrating: false,
  
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  
  selectedIds: [],
  activeMode: 'media',

  hydrateTimelineRange: async (startTime: number, endTime: number) => {
    const { loadedRanges, isHydrating } = get();
    
    // Check if range is already covered
    const isAlreadyLoaded = loadedRanges.some(r => startTime >= r.start && endTime <= r.end);
    if (isAlreadyLoaded || isHydrating) return;

    set({ isHydrating: true });
    
    try {
        const { clips, audio } = await loadTimelineRange(startTime, endTime);
        
        set((state: VideoState) => {
            const existingClipIds = new Set(state.videoClips.map(c => c.id));
            const newClips = clips.filter(c => !existingClipIds.has(c.id));
            
            const existingAudioIds = new Set(state.audioTrack.map(a => a.id));
            const newAudio = audio.filter(a => !existingAudioIds.has(a.id));

            return {
                videoClips: [...state.videoClips, ...newClips].sort((a, b) => a.startTime - b.startTime),
                audioTrack: [...state.audioTrack, ...newAudio].sort((a, b) => a.startTime - b.startTime),
                loadedRanges: [...state.loadedRanges, { start: startTime, end: endTime }],
                isHydrating: false,
            };
        });
    } catch (e) {
        console.error('Graph: Hydration failed:', e);
        set({ isHydrating: false });
    }
  },

  addClip: (clip) => set((state: VideoState) => ({ 
    videoClips: [...state.videoClips, clip].sort((a, b) => a.startTime - b.startTime) 
  })),
  updateClip: (id, updates) => set((state: VideoState) => {
    const index = state.videoClips.findIndex(c => c.id === id);
    if (index === -1) return state;
    const newClips = [...state.videoClips];
    newClips[index] = { ...newClips[index], ...updates };
    // Re-sort if startTime changed
    if (updates.startTime !== undefined) {
        newClips.sort((a, b) => a.startTime - b.startTime);
    }
    return { videoClips: newClips };
  }),
  removeClip: (id) => set((state: VideoState) => ({
    videoClips: state.videoClips.filter((c: VideoClip) => c.id !== id)
  })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  togglePlayback: () => set((state: VideoState) => ({ isPlaying: !state.isPlaying })),

  splitClip: () => set((state: VideoState) => {
    const currentTime = normalizeToTick(state.currentTime);
    
    const splitTrack = <T extends { id: string; startTime: number; duration: number; contentStartOffset?: number }>(
      track: T[]
    ) => {
      const index = track.findIndex(
        (m) => currentTime > m.startTime && currentTime < addTime(m.startTime, m.duration),
      );
      if (index === -1) return track;
      
      const original = track[index];
      const newId = crypto.randomUUID().slice(0, 8);
      
      const firstPart = { ...original, duration: subTime(currentTime, original.startTime) };
      const secondPart = {
        ...original,
        id: newId,
        startTime: currentTime,
        duration: subTime(original.duration, subTime(currentTime, original.startTime)),
        contentStartOffset: addTime((original.contentStartOffset || 0), subTime(currentTime, original.startTime))
      };
      
      const newTrack = [...track];
      newTrack.splice(index, 1, firstPart, secondPart);
      return newTrack;
    };

    return {
      videoClips: splitTrack(state.videoClips),
      audioTrack: splitTrack(state.audioTrack),
      subtitleTrack: splitTrack(state.subtitleTrack),
      textTrack: splitTrack(state.textTrack),
    };
  }),

  trimClip: (trackName, id, startTime, duration, mode = 'trim') => set((state: VideoState) => {
    const track = (state as any)[trackName] as any[];
    if (!Array.isArray(track)) return state;

    const oldClip = track.find((c) => c.id === id);
    if (!oldClip) return state;

    // SANITIZATION: Prevent negative duration (Item #115)
    const preciseStartTime = Math.max(0, normalizeToTick(startTime));
    const preciseDuration = Math.max(0.01, normalizeToTick(duration));

    // COLLISION DETECTION: Prevent overlaps on the same track (Item #114)
    const hasOverlap = track.some(c => 
      c.id !== id && 
      c.trackId === oldClip.trackId &&
      Math.max(c.startTime, preciseStartTime) < Math.min(c.startTime + c.duration, preciseStartTime + preciseDuration)
    );

    if (hasOverlap && !state.rippleEdit) {
        console.warn('Timeline: Collision detected. Action blocked.');
        return state; 
    }

    const diffStart = subTime(preciseStartTime, oldClip.startTime);
    const diffDuration = subTime(preciseDuration, oldClip.duration);
    const totalDiff = addTime(diffStart, diffDuration);

    const newState: any = {};
    const tracksToUpdate: (keyof VideoState)[] = [
      'videoClips', 'audioTrack', 'textTrack', 'subtitleTrack',
      'shapeTrack', 'particleTrack', 'effectTrack',
    ];

    if (mode === 'ripple' || (state.rippleEdit && mode === 'trim')) {
      tracksToUpdate.forEach((tn) => {
        const t = (state as any)[tn];
        if (Array.isArray(t)) {
          newState[tn] = t.map((item: any) => {
            if (item.id === id && tn === trackName) return { ...item, startTime: preciseStartTime, duration: preciseDuration };
            if (item.startTime >= addTime(oldClip.startTime, oldClip.duration)) {
              return { ...item, startTime: addTime(item.startTime, totalDiff) };
            }
            return item;
          });
        }
      });
    } else if (mode === 'roll') {
      const adjacent = track.find((item) => 
        item.id !== id &&
        item.trackId === oldClip.trackId &&
        Math.abs(item.startTime - addTime(oldClip.startTime, oldClip.duration)) < 0.001
      );
      newState[trackName] = track.map((item) => {
        if (item.id === id) return { ...item, startTime: preciseStartTime, duration: preciseDuration };
        if (adjacent && item.id === adjacent.id) {
          const newAdjDuration = Math.max(0.001, subTime(item.duration, diffDuration));
          return {
            ...item,
            startTime: addTime(item.startTime, diffDuration),
            duration: newAdjDuration,
          };
        }
        return item;
      });
    } else {
      newState[trackName] = track.map((item) =>
        item.id === id ? { ...item, startTime: preciseStartTime, duration: preciseDuration } : item
      );
    }

    return newState;
  }),

  moveClip: (trackName, id, startTime, trackId) => set((state: VideoState) => {
    const track = (state as any)[trackName] as any[];
    if (!Array.isArray(track)) return state;

    const oldClip = track.find((c) => c.id === id);
    if (!oldClip) return state;

    const preciseStartTime = Math.max(0, normalizeToTick(startTime));
    const targetTrackId = trackId ?? oldClip.trackId;

    // COLLISION DETECTION (Item #114)
    const hasOverlap = track.some(c => 
        c.id !== id && 
        c.trackId === targetTrackId &&
        Math.max(c.startTime, preciseStartTime) < Math.min(c.startTime + c.duration, preciseStartTime + oldClip.duration)
    );

    if (hasOverlap) {
        console.warn('Timeline: Collision detected on target track. Move blocked.');
        return state;
    }

    const newState: any = {};
    const isSelected = state.selectedIds.includes(id);

    if (isSelected) {
      const diff = subTime(preciseStartTime, oldClip.startTime);
      const tracksToUpdate: (keyof VideoState)[] = [
        'videoClips', 'audioTrack', 'textTrack', 'subtitleTrack',
        'shapeTrack', 'particleTrack', 'effectTrack',
      ];
      tracksToUpdate.forEach((tn) => {
        const t = (state as any)[tn];
        if (Array.isArray(t)) {
          newState[tn] = t.map((item: any) => {
            if (state.selectedIds.includes(item.id)) {
              return {
                ...item,
                startTime: Math.max(0, addTime(item.startTime, diff)),
                trackId: item.id === id ? targetTrackId : item.trackId,
              };
            }
            return item;
          });
        }
      });
    } else {
      newState[trackName] = track.map((item) =>
        item.id === id ? { ...item, startTime: preciseStartTime, trackId: targetTrackId } : item
      );
    }

    return newState;
  }),

  deleteSelected: () => set((state: VideoState) => {
    const idsToDelete = new Set(state.selectedIds);
    if (state.selectedTextId) idsToDelete.add(state.selectedTextId);
    if (state.selectedClipId) idsToDelete.add(state.selectedClipId);

    const filterItem = (item: { id: string }) => !idsToDelete.has(item.id);
    
    return {
      videoClips: state.videoClips.filter(filterItem),
      audioTrack: state.audioTrack.filter(filterItem),
      textTrack: state.textTrack.filter(filterItem),
      subtitleTrack: state.subtitleTrack.filter(filterItem),
      shapeTrack: (state.shapeTrack || []).filter(filterItem),
      particleTrack: (state.particleTrack || []).filter(filterItem),
      effectTrack: (state.effectTrack || []).filter(filterItem),
      selectedIds: [],
      selectedClipId: undefined,
      selectedTextId: undefined,
    };
  }),

  addAudio: (audio) => set((state: VideoState) => ({
    audioTrack: [...state.audioTrack, audio],
  })),

  updateAudio: (id, updates) => set((state: VideoState) => ({
    audioTrack: state.audioTrack.map((a: AudioBlock) => (a.id === id ? { ...a, ...updates } : a)),
  })),

  addText: (text) => set((state: VideoState) => ({
    textTrack: [...state.textTrack, text],
  })),

  updateText: (id, updates) => set((state: VideoState) => ({
    textTrack: state.textTrack.map((t: TextBlock) => {
      if (t.id !== id) return t;
      const mergedStyle = updates.style ? { ...t.style, ...updates.style } : t.style;
      return { ...t, ...updates, style: mergedStyle } as TextBlock;
    }),
  })),

  selectItems: (ids, multiSelect) => set((state: VideoState) => {
    let newSelectedIds = multiSelect ? [...state.selectedIds] : [];
    ids.forEach((id) => {
      if (newSelectedIds.includes(id)) {
        if (multiSelect) newSelectedIds = newSelectedIds.filter((i) => i !== id);
      } else {
        newSelectedIds.push(id);
      }
    });
    return { 
      selectedIds: newSelectedIds,
      selectedClipId: ids.length === 1 ? ids[0] : state.selectedClipId,
    };
  }),

  clearSelection: () => set({ selectedIds: [], selectedClipId: undefined, selectedTextId: undefined }),
  setMode: (mode) => set({ activeMode: mode }),
  addMarkers: (newMarkers) => set((state: VideoState) => ({ markers: [...state.markers, ...newMarkers] })),
  setRippleEdit: (enabled) => set({ rippleEdit: enabled }),
  addAdjustmentLayer: () => set((state: VideoState) => {
    const id = `adj-${crypto.randomUUID().slice(0, 8)}`;
    const newClip: VideoClip = {
      id,
      name: 'Adjustment Layer',
      url: '',
      thumbnail: '',
      startTime: normalizeToTick(state.currentTime),
      duration: 5,
      trackId: 2,
      speed: 1.0,
      isAdjustmentLayer: true,
      adjustment: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hue: 0,
        filterIntensity: 100,
        vignetteIntensity: 0,
        vignetteSize: 50,
      },
    };
    return { videoClips: [...state.videoClips, newClip] };
  }),
  duplicateSelected: () => set((state: VideoState) => {
    // Basic duplication logic
    const newClips = state.videoClips
      .filter(c => state.selectedIds.includes(c.id))
      .map(c => ({ ...c, id: `${c.id}-copy`, startTime: addTime(c.startTime, c.duration) }));
    return { videoClips: [...state.videoClips, ...newClips] };
  }),
});
