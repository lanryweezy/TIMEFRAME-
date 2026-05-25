import React from 'react';
import { Search, X } from 'lucide-react';
import { useUIStore } from '../store/videoStore';
import {
  VideoState,
  VideoTransform,
  VideoAdjustment,
  ChromaKey,
  TextBlock,
  VideoClip,
} from '../types';
import { TextProperties } from './properties/TextProperties';
import { ColorProperties } from './properties/ColorProperties';
import { EffectsProperties } from './properties/EffectsProperties';
import { AIProperties } from './properties/AIProperties';
import { TransformProperties } from './properties/TransformProperties';
import { AudioProperties } from './properties/AudioProperties';
import { HotspotProperties } from './properties/HotspotProperties';

interface PropertiesPanelProps {
  state: VideoState | any; // allow any for now to bypass strict state typings
  onChangeTransform?: (t: VideoTransform) => void;
  onUpdateTransformProperty: (updates: any) => void;
  onChangeAdjustment?: (a: VideoAdjustment) => void;
  onToggleKeyframe: (property: string) => void;
  onChangeChromaKey: (c: ChromaKey) => void;
  onUpdateText: (
    id: string,
    updates: Partial<TextBlock> | { style: Partial<TextBlock['style']> },
  ) => void;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  onEnhance: () => void;
  onStabilize: () => void;
  onUpdateShape: (id: string, updates: any) => void;
  onUpdateParticle: (id: string, updates: any) => void;
  onUpdateKeyframeEasing: (property: string, id: string, easing: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  state,
  onUpdateTransformProperty,
  onChangeAdjustment,
  onToggleKeyframe,
  onChangeChromaKey,
  onUpdateText,
  onUpdateClip,
  onEnhance,
  onStabilize,
  onUpdateShape,
  onUpdateParticle,
  onUpdateKeyframeEasing,
}) => {
  const { ui, setState: setStoreState } = useUIStore();
  const searchQuery = ui.searchQuery || '';

  const selectedClip = state.videoClips?.find((c: any) => c.id === state.selectedClipId);
  const selectedText = state.textTrack?.find((t: any) => t.id === state.selectedTextId);
  const selectedShape = state.shapeTrack?.find((s: any) => s.id === state.selectedShapeId);
  const selectedParticle = state.particleTrack?.find((p: any) => p.id === state.selectedParticleId);

  const handleAdjustmentChange = (key: keyof VideoAdjustment, value: number) => {
    if (onChangeAdjustment) {
      onChangeAdjustment({ ...(state.adjustment || {}), [key]: value });
    }
  };

  return (
    <div className="h-full bg-[#050505] flex flex-col overflow-hidden">
      {/* Search Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-white/2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-studio-accent transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setStoreState({ ui: { ...ui, searchQuery: e.target.value } })}
            placeholder="Search properties..."
            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-9 text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-studio-accent/50 focus:bg-white/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setStoreState({ ui: { ...ui, searchQuery: '' } })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 custom-scrollbar overflow-y-auto">
        <div className="p-4 space-y-8 pb-20">
          {(selectedText && (!searchQuery || 'text typography font style'.includes(searchQuery.toLowerCase()))) && (
            <TextProperties selectedText={selectedText} onUpdateText={onUpdateText} />
          )}

          {(!searchQuery || 'transform scale position rotation opacity keyframe'.includes(searchQuery.toLowerCase())) && (
            <TransformProperties
              selectedClip={selectedClip}
              selectedShape={selectedShape}
              selectedParticle={selectedParticle}
              state={state}
              onUpdateClip={onUpdateClip}
              onUpdateTransformProperty={onUpdateTransformProperty}
              onToggleKeyframe={onToggleKeyframe}
              onUpdateKeyframeEasing={onUpdateKeyframeEasing}
              onUpdateShape={onUpdateShape}
              onUpdateParticle={onUpdateParticle}
            />
          )}

          {(!searchQuery || 'color chroma brightness contrast saturation adjustment'.includes(searchQuery.toLowerCase())) && (
            <ColorProperties
              selectedClip={selectedClip}
              state={state}
              onUpdateClip={onUpdateClip}
              onChangeChromaKey={onChangeChromaKey}
              handleAdjustmentChange={handleAdjustmentChange}
            />
          )}

          {(!searchQuery || 'effects filters vfx neural denoise vignette'.includes(searchQuery.toLowerCase())) && (
            <EffectsProperties
              selectedClip={selectedClip}
              state={state}
              onUpdateClip={onUpdateClip}
              handleAdjustmentChange={handleAdjustmentChange}
            />
          )}

          {selectedClip && (
            <>
              {(!searchQuery || 'ai enhance stabilize neural'.includes(searchQuery.toLowerCase())) && (
                <AIProperties
                  selectedClip={selectedClip}
                  onUpdateClip={onUpdateClip}
                  onEnhance={onEnhance}
                  onStabilize={onStabilize}
                />
              )}
              {(!searchQuery || 'audio volume pan eq voice'.includes(searchQuery.toLowerCase())) && (
                <AudioProperties selectedClip={selectedClip} onUpdateClip={onUpdateClip} />
              )}
              {(!searchQuery || 'hotspot url link duration'.includes(searchQuery.toLowerCase())) && (
                <HotspotProperties selectedClip={selectedClip} onUpdateClip={onUpdateClip} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
