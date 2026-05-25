import { TimelineMarker, TimelineRegion } from './common';
import {
  AspectRatio,
  FilterPreset,
  VideoClip,
  SubtitleBlock,
  TextBlock,
  EffectBlock,
  ShapeBlock,
  ParticleSystem,
  VideoTransform,
  VideoAdjustment,
  Sequence,
  BeatSyncSettings,
  ChromaKey,
  StyleProfile,
} from './video';
import { AudioBlock, AudioSettings } from './audio';
import {
  SocialPlatform,
  AnalyticsData,
  BrandKit,
  CollaborationState,
  CloudProject,
} from './collaboration';
import { AssetManagerState, DistributionState } from './ecosystem';
import { AgentLayerState, AIActionSandbox } from './ai';

export interface NeuralMetadata {
  edgeProcessingEnabled: boolean;
  localComputeLoad: number;
  neuralCacheSize: number;
  styleDNA: string; // Base64 or serialized model weights/bias
}

export interface DebateMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
}

export interface DebateState {
  isActive: boolean;
  topic: string;
  messages: DebateMessage[];
}

export interface MoodBoard {
  colors: string[];
  vibe: string;
  referenceImages: string[];
  typographySuggestions: string[];
}

export interface ProjectDNA {
  narrativeWeight: number; // 0-1
  aestheticWeight: number; // 0-1
  rhythmicWeight: number; // 0-1
  emotionalTone: string[];
  signatureElements: string[];
}

export interface NeuralTelemetry {
  synapticLatency: number; // ms
  quantumEntropy: number; // 0-1
  neuralCacheEfficiency: number; // 0-1
  activeHeuristics: string[];
}

export interface PanelState {
  id: string;
  isVisible: boolean;
  isFloating: boolean;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  zIndex: number;
  dockArea?: 'left' | 'right' | 'bottom' | 'top' | 'center';
}

export interface UIState {
  panels: Record<string, PanelState>;
  customLayout: boolean;
  touchMode: boolean;
  ghostMode: boolean;
  activeWorkspace: 'editing' | 'color' | 'audio' | 'vfx' | 'custom' | 'review' | 'export';
  highContrast: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  zenMode: boolean;
  searchQuery: string;
}

export interface VideoState {
  ui: UIState;
  markers: TimelineMarker[];
  regions: TimelineRegion[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  projectName: string;
  projectSettings: {
    resolution: { width: number; height: number };
    fps: number;
    colorSpace: 'rec709' | 'aces' | 'srgb';
    bitDepth: 8 | 10 | 12 | 16;
    proxyEnabled: boolean;
  };
  activeMode: EditorMode;
  showCommandPalette: boolean;
  playbackSpeed: number;
  aspectRatio: AspectRatio;
  activeFilter: FilterPreset;
  videoClips: VideoClip[];
  subtitleTrack: SubtitleBlock[];
  textTrack: TextBlock[];
  audioTrack: AudioBlock[];
  effectTrack: EffectBlock[];
  shapeTrack: ShapeBlock[];
  particleTrack: ParticleSystem[];
  audioSettings: AudioSettings;
  transform: VideoTransform;
  adjustment: VideoAdjustment;
  sequences: Sequence[];
  activeSequenceId?: string; // Currently edited sequence
  exportRange?: { start: number; end: number } | null;
  parentState?: VideoState; // For nesting
  lastSaved?: number;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isEnhancing: boolean;
  isStabilizing: boolean;
  generationProgress: number;
  zoomLevel: number;
  socialPlatform: SocialPlatform;
  isAutoCaptioning: boolean;
  isRemovingBackground: boolean;
  isGeneratingAvatar: boolean;
  isTrackingFace: boolean;
  isAutoCutting: boolean;
  isRemovingSilence: boolean;
  isDetectingScenes: boolean;
  isOptimizingPacing: boolean;
  isRemovingObject: boolean;
  isSmoothingMotion: boolean;
  isDubbing: boolean;
  isGeneratingClips: boolean;
  isStabilizingFootage: boolean;
  isStoryboarding: boolean;
  isCloningVoice: boolean;
  isTranslating: boolean;
  isCleaningAudio: boolean;
  isReframing: boolean;
  isStyleTransferring: boolean;
  isGeneratingMusic: boolean;
  isGeneratingSFX: boolean;
  isGeneratingBroll: boolean;
  isGeneratingScene: boolean;
  isGeneratingCharacter: boolean;
  isGeneratingEnvironment: boolean;
  isGeneratingAnimation: boolean;
  isGeneratingLighting: boolean;
  isGeneratingCamera: boolean;
  isGeneratingThumbnails: boolean;
  isGeneratingVariants: boolean;
  isAnalyzingNarrative: boolean;
  isGeneratingScript: boolean;
  isGeneratingSocialCaption: boolean;
  isGeneratingHashtags: boolean;
  beatSync: BeatSyncSettings;
  selectedTextId?: string;
  selectedClipId?: string;
  selectedAudioId?: string;
  selectedShapeId?: string;
  selectedParticleId?: string;
  selectedAssetId?: string; // For Source Monitor
  previewTime: number; // Playhead for Source Monitor
  isGraphVirtualized: boolean;
  isHydrating: boolean;
  selectedIds: string[];
  chromaKey: ChromaKey;
  environmentUrl?: string;
  magneticTimeline: boolean;
  rippleEdit: boolean;
  snapSettings: {
    playhead: boolean;
    clips: boolean;
    markers: boolean;
  };
  lockedTracks: number[];
  trackNames: Record<number, string>;
  trackHeights: Record<number, number>;
  proxyMode: boolean;
  multiCamMode: boolean;
  analytics?: AnalyticsData;
  brandKit?: BrandKit;
  styleProfile: StyleProfile;
  narrativeContext?: string; // For long-term memory of the project vibe
  neuralMetadata: NeuralMetadata;
  activeCreatorTemplateId?: string;
  isPlatformOptimizing: boolean;
  isTrackingTrends: boolean;
  isGeneratingBrandAssets: boolean;
  isRotoscoping: boolean;
  isTrackingMotion: boolean;
  isGeneratingParticles: boolean;
  isApplyingAudioFX: boolean;
  isAnalyzingAudio: boolean;
  audioMetering: {
    peak: number[];
    integrated: number;
    shortTerm: number;
  };
  showCreatorHub: boolean;
  showViralHeatmap: boolean;
  engagementResizing: boolean;
  collaboration: CollaborationState;
  currentProject?: CloudProject;
  assetManager: AssetManagerState;
  agentLayer: AgentLayerState;
  aiActionSandbox: AIActionSandbox;
  distribution: DistributionState;
  debateState?: DebateState;
  moodBoard?: MoodBoard;
  projectDNA: ProjectDNA;
  neuralTelemetry: NeuralTelemetry;
  history: {
    past: VideoState[];
    future: VideoState[];
  };
}

export type EditorMode =
  | 'media'
  | 'text'
  | 'audio'
  | 'filters'
  | 'effects'
  | 'generator'
  | 'templates'
  | 'ratio'
  | 'motion'
  | 'color'
  | 'assistant'
  | 'agents'
  | 'collaboration'
  | 'history'
  | 'vfx'
  | 'gen-lab';
export type RightPanelTab = 'properties' | 'assistant' | 'shortcuts';
