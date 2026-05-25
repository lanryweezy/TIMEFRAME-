import React from 'react';
import { Target, Scissors, Sparkles, Activity, Shield } from 'lucide-react';
import { Section } from './Shared';
import { VideoClip } from '../../types';

interface AIPropertiesProps {
  selectedClip: VideoClip;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  onEnhance: (clipId: string) => void;
  onStabilize: (clipId: string) => void;
}

export const AIProperties: React.FC<AIPropertiesProps> = ({
  selectedClip,
  onUpdateClip,
  onEnhance,
  onStabilize,
}) => {
  return (
    <>
      <Section icon={Target} title="Object Tracking">
        <div className="space-y-4">
          <div className="flex gap-2">
            {['Point', 'Region', 'Full'].map((t) => (
              <button
                key={t}
                onClick={() =>
                  onUpdateClip(selectedClip.id, {
                    tracking: {
                      id: 'tr-1',
                      type:
                        t.toLowerCase() === 'point'
                          ? 'point'
                          : t.toLowerCase() === 'region'
                            ? 'planar'
                            : 'camera',
                      status: 'idle',
                      confidence: 0,
                      points: [],
                      searchRange: 20,
                      featureQuality: 0.8,
                      occlusionHandling: 'linear_prediction',
                      smoothing: 0.5,
                    },
                  })
                }
                className={`flex-1 py-1.5 text-[8px] font-bold rounded border transition-all ${(selectedClip.tracking?.type === 'point' && t === 'Point') || (selectedClip.tracking?.type === 'planar' && t === 'Region') || (selectedClip.tracking?.type === 'camera' && t === 'Full') ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-black border-[#222] text-amber-500/50'}`}
              >
                {t}
              </button>
            ))}
          </div>
          {selectedClip.tracking && (
            <div className="space-y-4">
              <div className="p-2 bg-amber-500/5 rounded border border-amber-500/20 space-y-2">
                <div className="flex justify-between items-center text-[6px] font-mono text-amber-500/70">
                  <span>STATUS: {selectedClip.tracking.status.toUpperCase()}</span>
                  <span>CONFIDENCE: {(selectedClip.tracking.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-1.5 bg-amber-500 text-black text-[8px] font-black uppercase rounded hover:bg-amber-400 transition-colors">
                    Solve Fwd
                  </button>
                  <button className="py-1.5 bg-zinc-800 text-amber-500 text-[8px] font-black uppercase rounded border border-amber-500/30 hover:bg-zinc-700 transition-colors">
                    Solve Bwd
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                    <span>SEARCH RANGE</span>
                    <span>{selectedClip.tracking.searchRange}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={selectedClip.tracking.searchRange}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        tracking: {
                          ...selectedClip.tracking!,
                          searchRange: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500 h-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                    <span>FEATURE QUALITY</span>
                    <span>{(selectedClip.tracking.featureQuality * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.01"
                    value={selectedClip.tracking.featureQuality}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        tracking: {
                          ...selectedClip.tracking!,
                          featureQuality: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500 h-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[6px] text-zinc-500 uppercase font-mono">
                    Occlusion Strategy
                  </label>
                  <select
                    value={selectedClip.tracking.occlusionHandling}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        tracking: {
                          ...selectedClip.tracking!,
                          occlusionHandling: e.target.value as any,
                        },
                      })
                    }
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[7px] text-white outline-none"
                  >
                    <option value="none">None (Fail)</option>
                    <option value="linear_prediction">Linear Extrapolate</option>
                    <option value="smart_fill">Content-Aware Fill</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section icon={Scissors} title="Clip Out Person">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                Smart Select
              </label>
              <span className="text-[5px] text-zinc-600 font-sans italic">
                Remove background automatically
              </span>
            </div>
            <input
              type="checkbox"
              checked={selectedClip.rotoscope?.enabled}
              onChange={(e) =>
                onUpdateClip(selectedClip.id, {
                  rotoscope: {
                    enabled: e.target.checked,
                    points: [],
                    feather: 10,
                    autoKeyframe: true,
                    mode: 'smart_segmentation',
                    refinement: 0.5,
                    propagation: true,
                  },
                })
              }
              className="accent-fuchsia-500"
            />
          </div>
          {selectedClip.rotoscope?.enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-1">
                {(['smart_segmentation', 'manual_spline', 'magic_edge'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      onUpdateClip(selectedClip.id, {
                        rotoscope: { ...selectedClip.rotoscope!, mode: m },
                      })
                    }
                    className={`py-1 text-[5px] font-black uppercase rounded border transition-all ${selectedClip.rotoscope?.mode === m ? 'bg-fuchsia-500 border-fuchsia-400 text-white' : 'bg-black border-[#1a1a1a] text-zinc-600'}`}
                  >
                    {m.split('_')[0]}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                    <span>EDGE FEATHER</span>
                    <span className="text-fuchsia-400">{selectedClip.rotoscope.feather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={selectedClip.rotoscope.feather}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        rotoscope: {
                          ...selectedClip.rotoscope!,
                          feather: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-fuchsia-500 h-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                    <span>REFINEMENT</span>
                    <span className="text-fuchsia-400">
                      {(selectedClip.rotoscope.refinement * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedClip.rotoscope.refinement}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        rotoscope: {
                          ...selectedClip.rotoscope!,
                          refinement: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-fuchsia-500 h-0.5"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[6px] text-zinc-500 uppercase font-mono">
                    Bidirectional Prop
                  </label>
                  <input
                    type="checkbox"
                    checked={selectedClip.rotoscope.propagation}
                    onChange={(e) =>
                      onUpdateClip(selectedClip.id, {
                        rotoscope: {
                          ...selectedClip.rotoscope!,
                          propagation: e.target.checked,
                        },
                      })
                    }
                    className="accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-fuchsia-500 text-white text-[8px] font-black uppercase rounded hover:bg-fuchsia-400 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                  Analyze Mask
                </button>
                <button className="flex-1 py-1.5 bg-zinc-800 text-fuchsia-500 text-[8px] font-bold uppercase rounded border border-fuchsia-500/20 hover:bg-zinc-700 transition-colors">
                  Clean Plate
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section icon={Sparkles} title="Auto Fix">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Optimization
            </span>
            {selectedClip.isEnhanced ? (
              <span className="text-[7px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-sm font-black animate-pulse">
                BEST QUALITY
              </span>
            ) : (
              <span className="text-[7px] text-slate-600 uppercase font-black">ORIGINAL</span>
            )}
          </div>

          {!selectedClip.isEnhanced && (
            <button
              onClick={() => onEnhance(selectedClip.id)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[8px] font-black uppercase rounded tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <Activity className="w-3 h-3" /> Make Video Better
            </button>
          )}
        </div>
      </Section>

      <Section icon={Shield} title="Fix Shaky Video">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Stability
            </span>
            {selectedClip.isStabilized ? (
              <span className="text-[7px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-sm font-black">
                STABLE
              </span>
            ) : (
              <span className="text-[7px] text-slate-600 uppercase font-black">NORMAL</span>
            )}
          </div>

          {!selectedClip.isStabilized && (
            <button
              onClick={() => onStabilize(selectedClip.id)}
              className="w-full py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white text-[8px] font-black uppercase rounded tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <Shield className="w-3 h-3" /> Smooth Out Shakes
            </button>
          )}
        </div>
      </Section>
    </>
  );
};
