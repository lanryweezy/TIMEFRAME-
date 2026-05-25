import {
  VideoState,
  VideoTransform,
  VideoAdjustment,
  ChromaKey,
  TextBlock,
  VideoClip,
} from '../../types';

export interface PropertiesPanelProps {
  state: VideoState;
  onChangeTransform: (transform: VideoTransform) => void;
  onUpdateTransformProperty: (prop: keyof VideoTransform, value: number) => void;
  onChangeAdjustment: (adj: VideoAdjustment) => void;
  onToggleKeyframe: (prop: string) => void;
  onChangeChromaKey: (chroma: ChromaKey) => void;
  onUpdateText: (
    id: string,
    updates: Partial<TextBlock> | { style: Partial<TextBlock['style']> },
  ) => void;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  onEnhance: (clipId: string) => void;
  onStabilize: (clipId: string) => void;
  onUpdateShape?: (id: string, updates: any) => void;
  onUpdateParticle?: (id: string, updates: any) => void;
  onUpdateKeyframeEasing?: (prop: string, id: string, easing: any) => void;
}
