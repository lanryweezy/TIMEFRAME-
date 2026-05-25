import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { 
  VideoState, 
  PanelState,
  UIState
} from '../types';
import { createTimelineSlice, TimelineSlice } from './slices/timelineSlice';
import { createAiSlice, AiSlice } from './slices/aiSlice';
import { createVfxSlice, VfxSlice } from './slices/vfxSlice';
import { createHistorySlice, HistorySlice } from './slices/historySlice';
import { writeSharedTime, writeSharedPlaying, readSharedTime, readSharedPlaying, writeSharedSpeed, readSharedSpeed } from '../lib/sharedState';

import { createAgentSlice, AgentSlice } from './slices/agentSlice';
import { createAudioSlice, AudioSlice } from './slices/audioSlice';
import { performanceMonitor } from '../lib/performanceMonitor';

// CombinedState must fulfill the entire VideoState interface to satisfy App.tsx and hooks
export type CombinedState = VideoState & TimelineSlice & AiSlice & VfxSlice & HistorySlice & AgentSlice & AudioSlice & {
  setState: (update: Partial<CombinedState> | ((prev: CombinedState) => Partial<CombinedState>)) => void;
  toggleTouchMode: () => void;
  toggleGhostMode: () => void;
  toggleCustomLayout: () => void;
  toggleZenMode: () => void;
  setPanelState: (panelId: string, updates: Partial<PanelState>) => void;
  setActiveWorkspace: (workspace: UIState['activeWorkspace']) => void;
  applyLayoutPreset: (preset: UIState['activeWorkspace']) => void;
  // Top-level aliases for backward compatibility
  touchMode: boolean;
  ghostMode: boolean;
  customLayout: boolean;
};

export const useVideoStore = create<CombinedState>()(
  devtools(
    subscribeWithSelector((set, get, ...a) => ({
      // UI Initial State
      ui: {
        panels: {
          'sidebar-left': { id: 'sidebar-left', isVisible: true, isFloating: false, x: 0, y: 0, width: 224, height: '100%', zIndex: 30, dockArea: 'left' },
          'sidebar-right': { id: 'sidebar-right', isVisible: true, isFloating: false, x: 0, y: 0, width: 224, height: '100%', zIndex: 30, dockArea: 'right' },
          'timeline': { id: 'timeline', isVisible: true, isFloating: false, x: 0, y: 0, width: '100%', height: 224, zIndex: 20, dockArea: 'bottom' },
          'player': { id: 'player', isVisible: true, isFloating: false, x: 0, y: 0, width: '100%', height: '100%', zIndex: 1, dockArea: 'center' },
        },
        customLayout: false,
        touchMode: false,
        ghostMode: false,
        activeWorkspace: 'editing',
        highContrast: false,
        colorBlindMode: 'none',
        zenMode: false,
        searchQuery: '',
        selectedAssetId: undefined,
        previewTime: 0,
        },

        // Default values for missing properties in VideoState
        markers: [],
        regions: [],
        volume: 0.8,
        projectName: 'Untitled Project',
        playbackSpeed: 1.0,
        aspectRatio: '16:9',
        showCommandPalette: false,
        showViralHeatmap: false,
        engagementResizing: false,
        selectedAssetId: undefined,
        previewTime: 0,      
      // Top-level aliases for backward compatibility (synced with ui property)
      touchMode: false,
      ghostMode: false,
      customLayout: false,

      toggleTouchMode: () => set((state: any) => ({ 
        touchMode: !state.touchMode,
        ui: { ...state.ui, touchMode: !state.ui.touchMode }
      } as any)),
      toggleGhostMode: () => set((state: any) => ({ 
        ghostMode: !state.ghostMode,
        ui: { ...state.ui, ghostMode: !state.ui.ghostMode }
      } as any)),
      toggleCustomLayout: () => set((state: any) => ({ 
        customLayout: !state.customLayout,
        ui: { ...state.ui, customLayout: !state.ui.customLayout }
      } as any)),
      toggleZenMode: () => set((state: any) => ({
        ui: { ...state.ui, zenMode: !state.ui.zenMode }
      } as any)),
      setPanelState: (panelId, updates) => set((state: any) => ({
        ui: {
          ...state.ui,
          panels: {
            ...state.ui.panels,
            [panelId]: { ...state.ui.panels[panelId], ...updates }
          }
        }
      } as any)),
      setActiveWorkspace: (workspace) => set((state: any) => ({
        ui: { ...state.ui, activeWorkspace: workspace }
      } as any)),
      applyLayoutPreset: (preset) => set((state: any) => {
        const panels = { ...state.ui.panels };
        if (preset === 'editing') {
          panels['sidebar-left'] = { ...panels['sidebar-left'], isVisible: true, isFloating: false };
          panels['sidebar-right'] = { ...panels['sidebar-right'], isVisible: true, isFloating: false };
          panels['timeline'] = { ...panels['timeline'], isVisible: true, isFloating: false, height: 224 };
        } else if (preset === 'color') {
          panels['sidebar-left'] = { ...panels['sidebar-left'], isVisible: false };
          panels['sidebar-right'] = { ...panels['sidebar-right'], isVisible: true, isFloating: false };
          panels['timeline'] = { ...panels['timeline'], isVisible: true, isFloating: false, height: 180 };
        } else if (preset === 'audio') {
          panels['sidebar-left'] = { ...panels['sidebar-left'], isVisible: true, isFloating: false };
          panels['sidebar-right'] = { ...panels['sidebar-right'], isVisible: false };
          panels['timeline'] = { ...panels['timeline'], isVisible: true, isFloating: false, height: 320 };
        } else if (preset === 'vfx') {
          panels['sidebar-left'] = { ...panels['sidebar-left'], isVisible: true, isFloating: false };
          panels['sidebar-right'] = { ...panels['sidebar-right'], isVisible: true, isFloating: false };
          panels['timeline'] = { ...panels['timeline'], isVisible: true, isFloating: false, height: 224 };
        }
        return {
          ui: {
            ...state.ui,
            activeWorkspace: preset,
            panels,
          }
        };
      }),

      audioSettings: { duckingEnabled: true, duckingRatio: 0.6 },
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
      sequences: [],
      lastSaved: Date.now(),
      zoomLevel: 100,
      socialPlatform: 'none',
      isAutoCaptioning: false,
      isRemovingBackground: false,
      isGeneratingAvatar: false,
      isTrackingFace: false,
      isAutoCutting: false,
      isRemovingSilence: false,
      isDetectingScenes: false,
      isRemovingObject: false,
      isSmoothingMotion: false,
      isDubbing: false,
      isGeneratingClips: false,
      isStabilizingFootage: false,
      isStoryboarding: false,
      isCloningVoice: false,
      isTranslating: false,
      isCleaningAudio: false,
      isReframing: false,
      isStyleTransferring: false,
      isGeneratingMusic: false,
      isGeneratingSFX: false,
      isGeneratingBroll: false,
      isGeneratingScene: false,
      isGeneratingCharacter: false,
      isGeneratingEnvironment: false,
      isGeneratingAnimation: false,
      isGeneratingLighting: false,
      isGeneratingCamera: false,
      isGeneratingThumbnails: false,
      isGeneratingVariants: false,
      isAnalyzingNarrative: false,
      isGeneratingScript: false,
      isGeneratingSocialCaption: false,
      isGeneratingHashtags: false,
      isPlatformOptimizing: false,
      isTrackingTrends: false,
      isGeneratingBrandAssets: false,
      isApplyingAudioFX: false,
      isAnalyzingAudio: false,
      isGeneratingParticles: false,
      showCreatorHub: false,
      projectSettings: {
        resolution: { width: 1920, height: 1080 },
        fps: 24,
        colorSpace: 'rec709',
        bitDepth: 10,
        proxyEnabled: false,
      },
      transform: {
        scale: 1,
        positionX: 0,
        positionY: 0,
        rotation: 0,
        opacity: 100,
        keyframes: {},
      },
      beatSync: { enabled: false, intensity: 50, syncType: 'cut' },
      chromaKey: { enabled: false, color: '#00ff00', intensity: 30, shadow: 20 },
      magneticTimeline: true,
      rippleEdit: true,
      snapSettings: { playhead: true, clips: true, markers: true },
      lockedTracks: [],
      trackNames: {},
      trackHeights: {},
      proxyMode: false,
      multiCamMode: false,
      styleProfile: {
        favoriteFilters: {},
        averagePacing: 4,
        preferredTransitions: {},
        colorVibeBias: { warmth: 0, vibrancy: 0, contrast: 0 },
      },
      neuralMetadata: {
        edgeProcessingEnabled: true,
        localComputeLoad: 0,
        neuralCacheSize: 0,
        styleDNA: '',
      },
      audioMetering: { peak: [0, 0], integrated: -70, shortTerm: -70 },
      collaboration: {
        sessionUsers: [],
        isMultiplayerActive: false,
        lastSyncTime: Date.now(),
        liveComments: [],
        activeAgents: [],
      },
      assetManager: {
        library: [],
        collections: [],
        searchQuery: '',
        isSearching: false,
        selectedAssetIds: [],
        storageUsage: { total: 0, used: 0 },
      },
      addAsset: (asset: CloudAsset) => set((state: any) => ({
        assetManager: {
          ...state.assetManager,
          library: [...state.assetManager.library, asset],
          storageUsage: {
            ...state.assetManager.storageUsage,
            used: state.assetManager.storageUsage.used + asset.size
          }
        }
      } as any)),
      updateAssetManager: (updates: Partial<AssetManagerState>) => set((state: any) => ({
        assetManager: { ...state.assetManager, ...updates }
      } as any)),
      agentLayer: { agents: [], tasks: [], skills: [], suggestions: [] },
      aiActionSandbox: { actions: [] },
      distribution: { schedules: [], abTests: [], connectedAccounts: [] },
      projectDNA: {
        narrativeWeight: 0.5,
        aestheticWeight: 0.5,
        rhythmicWeight: 0.5,
        emotionalTone: [],
        signatureElements: [],
      },
      neuralTelemetry: {
        synapticLatency: 0,
        quantumEntropy: 0,
        neuralCacheEfficiency: 0,
        activeHeuristics: [],
      },
      history: { past: [], future: [] },

      // Slices (spread these last to ensure they overwrite defaults if needed)
      ...createTimelineSlice(set, get, ...a),
      ...createAiSlice(set, get, ...a),
      ...createVfxSlice(set, get, ...a),
      ...createHistorySlice(set, get, ...a),
      ...createAgentSlice(set, get, ...a),
      ...createAudioSlice(set, get, ...a),
      
      setState: (update) => set((state) => {
        const next = typeof update === 'function' ? update(state as any) : update;
        return { ...state, ...next };
      }),
    })),
    { name: 'TimeframeVideoStore' }
  )
);

// Alias for backward compatibility
export const useUIStore = useVideoStore;

// Sync Shared Memory for Worker threads
useVideoStore.subscribe(
  (state) => [state.currentTime, state.isPlaying, state.playbackSpeed] as const,
  ([currentTime, isPlaying, playbackSpeed]) => {
    if (!isPlaying) {
      writeSharedTime(currentTime);
    }
    writeSharedPlaying(isPlaying);
    writeSharedSpeed(playbackSpeed);
  }
);

// High-frequency UI sync loop for the playhead
if (typeof window !== 'undefined') {
  // Initialize shared speed
  writeSharedSpeed(1.0);

  // ADAPTIVE ENGINE SCALING: Item #34
  // Automatically downscales engine quality if performance bottlenecks are detected.
  let lowFpsCount = 0;
  performanceMonitor.subscribe((metrics) => {
      const state = useVideoStore.getState();
      if (state.isPlaying && metrics.fps < 24) {
          lowFpsCount++;
          if (lowFpsCount > 3 && !state.proxyMode) {
              console.warn('Adaptive Engine: Low performance detected. Engaging Proxy-Only mode to preserve stability.');
              state.setState({ proxyMode: true });
          }
      } else {
          lowFpsCount = 0;
      }
  });

  const syncLoop = () => {
    const isPlaying = readSharedPlaying();
    if (isPlaying) {
      const sharedTime = readSharedTime();
      useVideoStore.getState().setCurrentTime(sharedTime);
    }
    requestAnimationFrame(syncLoop);
  };
  requestAnimationFrame(syncLoop);
}
