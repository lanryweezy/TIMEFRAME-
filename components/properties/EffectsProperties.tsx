import React from 'react';
import { Zap, Focus, BoxSelect, Brain } from 'lucide-react';
import { Section } from './Shared';
import { VideoClip, VideoAdjustment, VideoState } from '../../types';

interface EffectsPropertiesProps {
  selectedClip: VideoClip | undefined;
  state: VideoState;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  handleAdjustmentChange: (prop: keyof VideoAdjustment, value: number) => void;
}

export const EffectsProperties: React.FC<EffectsPropertiesProps> = ({
  selectedClip,
  state,
  onUpdateClip,
  handleAdjustmentChange,
}) => {
  const activeAdjustment = selectedClip?.adjustment || state.adjustment;

  return (
    <>
      {selectedClip && (
        <>
          <Section icon={Zap} title="Glow & Effects">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                  <span>Edge Color</span>
                  <span className="text-blue-400">
                    {(selectedClip.effects?.chromaticAberration || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedClip.effects?.chromaticAberration || 0}
                  onChange={(e) =>
                    onUpdateClip(selectedClip.id, {
                      effects: {
                        ...(selectedClip.effects || {}),
                        chromaticAberration: parseFloat(e.target.value),
                      } as any,
                    })
                  }
                  className="w-full accent-blue-500 h-0.5"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                  <span>Glitch</span>
                  <span className="text-purple-400">
                    {(selectedClip.effects?.glitchIntensity || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedClip.effects?.glitchIntensity || 0}
                  onChange={(e) =>
                    onUpdateClip(selectedClip.id, {
                      effects: {
                        ...(selectedClip.effects || {}),
                        glitchIntensity: parseFloat(e.target.value),
                      } as any,
                    })
                  }
                  className="w-full accent-purple-500 h-0.5"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                  <span>Glow</span>
                  <span className="text-yellow-400">
                    {(selectedClip.effects?.bloom || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedClip.effects?.bloom || 0}
                  onChange={(e) =>
                    onUpdateClip(selectedClip.id, {
                      effects: {
                        ...(selectedClip.effects || {}),
                        bloom: parseFloat(e.target.value),
                      } as any,
                    })
                  }
                  className="w-full accent-yellow-400 h-0.5"
                />
              </div>
            </div>
          </Section>

          <Section icon={Focus} title="Advanced Masking">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {['None', 'Rect', 'Circle', 'Smart', 'Alpha', 'Luma'].map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      onUpdateClip(selectedClip.id, {
                        mask:
                          m === 'None'
                            ? undefined
                            : {
                                id: 'mask-1',
                                type: m.toLowerCase() as any,
                                feather: 10,
                                invert: false,
                                expansion: 0,
                                opacity: 1,
                              },
                      })
                    }
                    className={`px-3 py-1 text-[7px] font-black rounded border transition-all ${selectedClip.mask?.type === m.toLowerCase() ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-black border-[#222] text-slate-500 hover:text-white'}`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
              {selectedClip.mask && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 py-2 px-3 bg-blue-500/5 rounded border border-blue-500/20">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center text-[6px] font-mono text-blue-400/70">
                        <span>MASK_PREVIEW</span>
                        <span>SMOOTH</span>
                      </div>
                      <div className="h-4 bg-black/40 rounded overflow-hidden flex items-end">
                        <div className="w-full h-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        onUpdateClip(selectedClip.id, {
                          mask: { ...selectedClip.mask!, invert: !selectedClip.mask?.invert },
                        })
                      }
                      className={`px-2 py-1 text-[6px] font-mono border rounded transition-colors ${selectedClip.mask.invert ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-500 border-white/10'}`}
                    >
                      INVERT
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                          Expansion
                        </label>
                        <span className="text-[8px] font-mono text-white">
                          {selectedClip.mask.expansion}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={selectedClip.mask.expansion}
                        onChange={(e) =>
                          onUpdateClip(selectedClip.id, {
                            mask: {
                              ...selectedClip.mask!,
                              expansion: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-blue-500 h-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                          Opacity
                        </label>
                        <span className="text-[8px] font-mono text-white">
                          {Math.round((selectedClip.mask.opacity ?? 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={selectedClip.mask.opacity ?? 1}
                        onChange={(e) =>
                          onUpdateClip(selectedClip.id, {
                            mask: {
                              ...selectedClip.mask!,
                              opacity: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-blue-500 h-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                        Edge Feathering
                      </label>
                      <span className="text-[8px] font-mono text-white">
                        {selectedClip.mask.feather}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      step="1"
                      value={selectedClip.mask.feather}
                      onChange={(e) =>
                        onUpdateClip(selectedClip.id, {
                          mask: { ...selectedClip.mask!, feather: parseInt(e.target.value) },
                        })
                      }
                      className="w-full accent-blue-500 h-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section icon={BoxSelect} title="3D Depth">
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                  Extra Dimension
                </span>
                <input
                  type="checkbox"
                  checked={selectedClip.depth?.enabled}
                  onChange={(e) =>
                    onUpdateClip(selectedClip.id, {
                      depth: {
                        ...(selectedClip.depth || {
                          enabled: false,
                          near: 0,
                          far: 100,
                          focalLength: 35,
                        }),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="accent-blue-500"
                />
              </div>
              {selectedClip.depth?.enabled && (
                <div className="space-y-4">
                  <div className="h-24 bg-zinc-900 rounded border border-white/10 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-black opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-white/20 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-[6px] font-sans text-zinc-500">DEPTH_MAP</span>
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 text-[5px] font-sans text-zinc-600">
                      SMART_DEPTH_READY
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[6px] font-sans">
                        <span className="text-zinc-500">NEAR</span>
                        <span className="text-white">0m</span>
                      </div>
                      <input type="range" className="w-full accent-blue-500 h-0.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[6px] font-sans">
                        <span className="text-zinc-500">FAR</span>
                        <span className="text-white">100m</span>
                      </div>
                      <input type="range" className="w-full accent-blue-500 h-0.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[6px] font-sans">
                      <span className="text-zinc-500">LENS_FOCUS</span>
                      <span className="text-white">35.0 mm</span>
                    </div>
                    <input type="range" className="w-full accent-blue-500 h-0.5" />
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-3.5 h-3.5 text-studio-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Neural Denoise</span>
                      </div>
                      <span className="text-white text-[10px] font-mono">{selectedClip.adjustment?.neuralDenoise || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedClip.adjustment?.neuralDenoise || 0}
                      onChange={(e) => handleAdjustmentChange('neuralDenoise' as any, parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-studio-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Edge Enhancement</span>
                      </div>
                      <span className="text-white text-[10px] font-mono">{selectedClip.adjustment?.edgeEnhancement || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedClip.adjustment?.edgeEnhancement || 0}
                      onChange={(e) => handleAdjustmentChange('edgeEnhancement' as any, parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent"
                    />
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section icon={Zap} title="Custom GLSL Transitions">
            <div className="space-y-3">
              <div className="p-3 bg-black border border-white/5 rounded-lg flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Shader Library</span>
                    <span className="text-[6px] font-mono text-studio-accent animate-pulse">LIVE_COMPILER_READY</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {['LIQUID', 'DISSOLVE', 'GLITCH', 'ZOOM'].map(s => (
                        <button key={s} className="px-2 py-1.5 bg-zinc-900 border border-white/10 rounded text-[7px] font-mono text-zinc-500 hover:text-white hover:border-studio-accent transition-all text-left">
                            {s}_TRANSITION.GLSL
                        </button>
                    ))}
                </div>
                <button className="w-full py-2 bg-studio-accent/10 border border-studio-accent/20 rounded text-[7px] font-black uppercase text-studio-accent hover:bg-studio-accent/20 transition-all">
                    Open Shader Editor
                </button>
              </div>
            </div>
          </Section>
        </>
      )}

      <Section icon={Focus} title="Creative Focus (Vignette)">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Intensity
              </label>
              <span className="text-[9px] font-mono text-white">
                {activeAdjustment.vignetteIntensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={activeAdjustment.vignetteIntensity}
              onChange={(e) =>
                handleAdjustmentChange('vignetteIntensity', parseFloat(e.target.value))
              }
              className="w-full accent-slate-400"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Softness (Size)
              </label>
              <span className="text-[9px] font-mono text-white">
                {activeAdjustment.vignetteSize}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={activeAdjustment.vignetteSize}
              onChange={(e) => handleAdjustmentChange('vignetteSize', parseFloat(e.target.value))}
              className="w-full accent-slate-400"
            />
          </div>
        </div>
      </Section>
    </>
  );
};
