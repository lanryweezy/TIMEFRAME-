import React, { useState } from 'react';
import { Move, Wind, Focus, Maximize, Diamond, Square, Activity } from 'lucide-react';
import { Section, RangeControl, SelectControl } from './Shared';
import { VideoClip, VideoTransform, VideoState, ShapeBlock, ParticleSystem, Keyframe } from '../../types';
import { KeyframeEditor } from '../KeyframeEditor';

interface TransformPropertiesProps {
  selectedClip: VideoClip | undefined;
  selectedShape: ShapeBlock | undefined;
  selectedParticle: ParticleSystem | undefined;
  state: VideoState;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  onUpdateTransformProperty: (prop: keyof VideoTransform, value: number) => void;
  onToggleKeyframe: (prop: string) => void;
  onUpdateKeyframeEasing?: (prop: string, id: string, easing: any) => void;
  onUpdateShape?: (id: string, updates: Partial<ShapeBlock>) => void;
  onUpdateParticle?: (id: string, updates: Partial<ParticleSystem>) => void;
}

export const TransformProperties: React.FC<TransformPropertiesProps> = ({
  selectedClip,
  selectedShape,
  selectedParticle,
  state,
  onUpdateClip,
  onUpdateTransformProperty,
  onToggleKeyframe,
  onUpdateKeyframeEasing,
  onUpdateShape,
  onUpdateParticle,
}) => {
  const [activeKeyframeProp, setActiveKeyframeProp] = useState<string | null>(null);

  const blendModeOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Screen', value: 'screen' },
    { label: 'Multiply', value: 'multiply' },
    { label: 'Overlay', value: 'overlay' },
    { label: 'Add', value: 'add' },
    { label: 'Difference', value: 'difference' },
    { label: 'Exclusion', value: 'exclusion' },
    { label: 'Color Dodge', value: 'color_dodge' },
    { label: 'Color Burn', value: 'color_burn' },
    { label: 'Hard Light', value: 'hard_light' },
    { label: 'Soft Light', value: 'soft_light' },
    { label: 'Vivid Light', value: 'vivid_light' },
    { label: 'Pin Light', value: 'pin_light' },
  ];

  const handleUpdateKeyframes = (prop: string, kfs: Keyframe[]) => {
    if (!selectedClip) return;
    onUpdateClip(selectedClip.id, {
        transform: {
            ...(selectedClip.transform || {
                scale: 1,
                positionX: 0,
                positionY: 0,
                rotation: 0,
                opacity: 100,
                keyframes: {},
            }),
            keyframes: {
                ...(selectedClip.transform?.keyframes || {}),
                [prop]: kfs
            }
        }
    });
  };

  const KeyframeToggle = ({ prop }: { prop: string }) => (
    <button 
        onClick={() => setActiveKeyframeProp(activeKeyframeProp === prop ? null : prop)}
        className={`p-1 rounded transition-colors ${activeKeyframeProp === prop ? 'text-studio-accent' : 'text-zinc-600 hover:text-white'}`}
    >
        <Activity className="w-3 h-3" />
    </button>
  );

  return (
    <>
      {selectedClip && (
        <>
          <Section icon={Move} title="Transform & Blending">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Opacity</span>
                <KeyframeToggle prop="opacity" />
              </div>
              <RangeControl
                label="Level"
                value={selectedClip.transform?.opacity ?? 100}
                min={0}
                max={100}
                step={1}
                onChange={(val) =>
                  onUpdateClip(selectedClip.id, {
                    transform: {
                      ...(selectedClip.transform || {
                        scale: 1,
                        positionX: 0,
                        positionY: 0,
                        rotation: 0,
                        opacity: 100,
                        keyframes: {},
                      }),
                      opacity: val,
                    },
                  })
                }
              />
              {activeKeyframeProp === 'opacity' && (
                  <KeyframeEditor 
                    selectedClip={selectedClip} 
                    property="opacity" 
                    onUpdateKeyframes={handleUpdateKeyframes} 
                  />
              )}
              <SelectControl
                label="Blend Mode"
                value={selectedClip.blendMode || 'normal'}
                options={blendModeOptions}
                onChange={(val) => onUpdateClip(selectedClip.id, { blendMode: val as any })}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                      Sub-frame Motion Blur
                    </label>
                    <span className="text-[5px] text-zinc-600 font-mono tracking-wider">
                      Shutter-sync velocity
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedClip.motionBlur}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, { motionBlur: e.target.checked })
                    }
                    className="accent-blue-500 w-3 h-3 cursor-pointer"
                  />
                </div>

                {selectedClip.motionBlur && (
                  <div className="p-3 bg-zinc-950/50 rounded border border-white/5 space-y-3">
                    <RangeControl
                      label="Shutter Angle"
                      value={selectedClip.shutterAngle || 180}
                      min={0}
                      max={720}
                      step={10}
                      onChange={(val) => onUpdateClip(selectedClip.id, { shutterAngle: val })}
                    />
                    <RangeControl
                      label="Samples"
                      value={selectedClip.samples || 16}
                      min={4}
                      max={64}
                      step={4}
                      onChange={(val) => onUpdateClip(selectedClip.id, { samples: val })}
                    />
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section icon={Maximize} title="Spatial Controls">
            <div className="space-y-6">
              {[
                { label: 'Scale', prop: 'scale', min: 0.1, max: 2, step: 0.01 },
                { label: 'Rotate', prop: 'rotation', min: -180, max: 180, step: 1 },
                { label: 'PosX', prop: 'positionX', min: -500, max: 500, step: 1 },
                { label: 'PosY', prop: 'positionY', min: -500, max: 500, step: 1 },
              ].map((item) => (
                <div key={item.prop} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                      {item.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <KeyframeToggle prop={item.prop} />
                      <span className="text-[9px] font-mono text-white">
                        {((selectedClip.transform?.[item.prop as keyof VideoTransform] as number) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={(selectedClip.transform?.[item.prop as keyof VideoTransform] as number) || 0}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        transform: {
                          ...(selectedClip.transform || {
                            scale: 1,
                            positionX: 0,
                            positionY: 0,
                            rotation: 0,
                            opacity: 100,
                            keyframes: {},
                          }),
                          [item.prop]: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-studio-accent"
                  />
                  {activeKeyframeProp === item.prop && (
                      <KeyframeEditor 
                        selectedClip={selectedClip} 
                        property={item.prop} 
                        onUpdateKeyframes={handleUpdateKeyframes} 
                      />
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Wind} title="Speed & Transitions">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                  Playback Speed
                </span>
                <span className="text-[9px] font-mono text-blue-400">
                  {(selectedClip.speed * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4"
                step="0.1"
                value={selectedClip.speed}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, { speed: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-500"
              />

              <div className="grid grid-cols-5 gap-1 mt-2">
                {[0.25, 0.5, 1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateClip(selectedClip.id, { speed: s })}
                    className={`py-1 text-[7px] font-mono border rounded ${selectedClip.speed === s ? 'bg-blue-500 border-blue-500 text-white' : 'bg-black border-[#1a1a1a] hover:border-slate-500'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                    Transition In
                  </label>
                  <select
                    value={selectedClip.transitionIn || 'none'}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, { transitionIn: e.target.value as any })
                    }
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none"
                  >
                    <option value="none">None</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="blur">Blur</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                    Transition Out
                  </label>
                  <select
                    value={selectedClip.transitionOut || 'none'}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, { transitionOut: e.target.value as any })
                    }
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none"
                  >
                    <option value="none">None</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="blur">Blur</option>
                  </select>
                </div>
              </div>
            </div>
          </Section>

          <Section icon={Focus} title="Auto Resize">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                  Smart Crop
                </span>
                <input
                  type="checkbox"
                  checked={selectedClip?.autoReframeEnabled}
                  onChange={(e) =>
                    onUpdateClip(selectedClip!.id, { autoReframeEnabled: e.target.checked })
                  }
                  className="accent-white w-3 h-3 cursor-pointer"
                />
              </div>
              {selectedClip?.autoReframeEnabled && (
                <div className="grid grid-cols-3 gap-1">
                  {(['center', 'subject', 'dynamic'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdateClip(selectedClip!.id, { reframeFocus: mode })}
                      className={`py-1 text-[7px] font-bold uppercase rounded border transition-all ${selectedClip.reframeFocus === mode ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/40'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Section>
        </>
      )}

      {selectedShape && (
        <Section icon={Square} title="Procedural Shape">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Shape Type
              </label>
              <select
                value={selectedShape.type}
                onChange={(e) =>
                  onUpdateShape?.(selectedShape.id, { type: e.target.value as any })
                }
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
                <option value="star">Star</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Fill Color
              </label>
              <input
                type="color"
                value={selectedShape.color}
                onChange={(e) => onUpdateShape?.(selectedShape.id, { color: e.target.value })}
                className="w-full h-8 bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Blend Mode
              </label>
              <select
                value={selectedShape.blendMode}
                onChange={(e) =>
                  onUpdateShape?.(selectedShape.id, { blendMode: e.target.value as any })
                }
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none focus:border-green-500/50"
              >
                <option value="normal">Normal</option>
                <option value="screen">Screen</option>
                <option value="multiply">Multiply</option>
                <option value="overlay">Overlay</option>
                <option value="add">Linear Add</option>
                <option value="difference">Difference</option>
              </select>
            </div>
          </div>
        </Section>
      )}

      {selectedParticle && (
        <Section icon={Activity} title="Particle Simulations">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                System Type
              </label>
              <span className="text-[10px] text-white font-bold block bg-[#0a0a0a] p-2 rounded uppercase">
                {selectedParticle.type}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                  Emission Intensity
                </label>
                <span className="text-[9px] font-mono text-white">
                  {selectedParticle.intensity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedParticle.intensity}
                onChange={(e) =>
                  onUpdateParticle?.(selectedParticle.id, { intensity: parseInt(e.target.value) })
                }
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </Section>
      )}
    </>
  );
};
