import {
  VideoState,
  EditorMode,
  FilterPreset,
  AspectRatio,
  EffectType,
  AudioBlock,
  SocialPlatform,
  BeatSyncSettings,
} from '../../types';

export interface EditorSidebarProps {
  state: VideoState;
  onSetMode: (mode: EditorMode) => void;
  onAddText: (style: string) => void;
  onAddAudio: (track: string) => void;
  onUpdateAudio: (id: string, updates: Partial<AudioBlock>) => void;
  onSetFilter: (filter: FilterPreset) => void;
  onAddSubtitle: () => void;
  onAddClip: () => void;
  onAddEffect: (type: EffectType) => void;
  onFabricate: (prompt: string, type: 'video' | 'image') => void;
  handleSendMessage: (message: string) => void;
  onUpdateDucking?: (enabled: boolean, ratio: number) => void;
  onSetAspectRatio?: (ratio: AspectRatio) => void;
  onSetSocialPlatform?: (platform: SocialPlatform) => void;
  onApplyTemplate?: (name: string) => void;
  onUpdateBeatSync?: (settings: Partial<BeatSyncSettings>) => void;
  onGenerateAvatar?: () => void;
  onToggleFaceTracking?: () => void;
  onAIStoryteller?: () => void;
  onAutoResize?: () => void;
  onAddAdjustmentLayer?: () => void;
  onToggleProxy?: () => void;
  onToggleMultiCam?: () => void;
  onOptimizeForPlatform?: (platform: string) => void;
  onTrackTrends?: (platform: string) => void;
  onSearchViralSounds?: (platform: string) => void;
  onToggleDebugger?: () => void;
  onUpdateClip?: (id: string, updates: any) => void;
  onJumpToHistory?: (index: number) => void;
}
