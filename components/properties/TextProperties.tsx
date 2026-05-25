import React from 'react';
import { Type, Layers, Palette } from 'lucide-react';
import { Section } from './Shared';
import { TextBlock } from '../../types';

interface TextPropertiesProps {
  selectedText: TextBlock;
  onUpdateText: (
    id: string,
    updates: Partial<TextBlock> | { style: Partial<TextBlock['style']> },
  ) => void;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ selectedText, onUpdateText }) => {
  return (
    <>
      <Section icon={Type} title="Typography">
        <div className="space-y-3 pb-4">
          <div className="space-y-1.5 px-1 pb-2">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              Your Text
            </label>
            <textarea
              value={selectedText.text}
              onChange={(e) => onUpdateText(selectedText.id, { text: e.target.value })}
              className="w-full bg-white/[0.03] rounded-xl p-4 text-[13px] text-white h-32 resize-none transition-all font-sans placeholder:opacity-20 focus:bg-white/[0.05] focus:outline-none"
              placeholder="Type something..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3 px-1">
            <div className="space-y-1">
              <label className="text-[8px] text-zinc-500 uppercase">Scale</label>
              <input
                type="number"
                value={selectedText.style.fontSize}
                onChange={(e) =>
                  onUpdateText(selectedText.id, {
                    style: { fontSize: parseInt(e.target.value) },
                  })
                }
                className="w-full bg-white/[0.03] rounded-lg px-4 py-3 text-[12px] text-white font-mono focus:bg-white/[0.05] focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] text-zinc-500 uppercase">Color</label>
              <div className="relative">
                <input
                  type="color"
                  value={selectedText.style.color}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, { style: { color: e.target.value } })
                  }
                  className="w-full h-11 bg-white/[0.03] rounded-lg p-1.5 cursor-pointer focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-studio-border/50 space-y-4">
          <div className="flex items-center justify-between group/field">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/field:text-studio-text-high transition-colors px-1">
              3D Effect
            </label>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={selectedText.is3D}
                onChange={(e) => onUpdateText(selectedText.id, { is3D: e.target.checked })}
              />
              <div className="w-7 h-3.5 bg-zinc-800 rounded-full peer peer-checked:bg-studio-accent/60 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-zinc-400 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-3.5 peer-checked:after:bg-white transition-colors"></div>
            </div>
          </div>
          {selectedText.is3D && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[7px] text-zinc-500 uppercase font-black font-sans tracking-widest px-1">
                  Depth
                </label>
                <span className="text-[10px] font-sans text-studio-accent">
                  {selectedText.depth || 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedText.depth || 0}
                onChange={(e) => onUpdateText(selectedText.id, { depth: parseInt(e.target.value) })}
                className="studio-range"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="text-[7px] text-slate-500 uppercase font-sans tracking-widest">
              Mix Mode
            </label>
            <select
              value={selectedText.style.blendMode || 'normal'}
              onChange={(e) =>
                onUpdateText(selectedText.id, { style: { blendMode: e.target.value as any } })
              }
              className="bg-white/[0.03] rounded-lg px-3 py-1.5 text-[11px] text-zinc-300 outline-none focus:bg-white/[0.08] transition-all"
            >
              <option value="normal">Normal</option>
              <option value="screen">Screen</option>
              <option value="multiply">Multiply</option>
              <option value="overlay">Overlay</option>
              <option value="add">Add</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="color_dodge">Color Dodge</option>
              <option value="color_burn">Color Burn</option>
              <option value="hard_light">Hard Light</option>
              <option value="soft_light">Soft Light</option>
            </select>
          </div>
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                  Motion Blur
                </label>
              </div>
              <div className="flex items-center gap-4">
                {selectedText.motionBlur && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={selectedText.motionBlurIntensity || 50}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        motionBlurIntensity: parseInt(e.target.value),
                      })
                    }
                    className="w-24 accent-purple-500 h-1.5"
                  />
                )}
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selectedText.motionBlur}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, { motionBlur: e.target.checked })
                    }
                  />
                  <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:bg-purple-500/60 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-400 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white transition-colors"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                Mask Shape
              </label>
              <select
                value={selectedText.mask?.type || 'none'}
                onChange={(e) =>
                  onUpdateText(selectedText.id, {
                    mask:
                      e.target.value === 'none'
                        ? undefined
                        : {
                            id: 'm-1',
                            type: e.target.value as any,
                            feather: 10,
                            invert: false,
                            expansion: 0,
                          },
                  })
                }
                className="bg-white/[0.03] rounded-lg px-3 py-1.5 text-[11px] text-zinc-400 outline-none focus:bg-white/[0.08] transition-all"
              >
                <option value="none">Inherit</option>
                <option value="rectangle">Rect</option>
                <option value="circle">Ellipse</option>
                <option value="alpha">Alpha Matte</option>
                <option value="luminance">Luma Matte</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <label className="text-[7px] text-zinc-500 uppercase font-bold tracking-wider">
                  Motion Style
                </label>
                <span className="text-[6px] text-zinc-600 font-medium tracking-tight">
                  Kinetic feel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-7 bg-zinc-950 border border-white/5 rounded overflow-hidden relative group/curve cursor-pointer">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {selectedText.easing === 'bounce' ? (
                      <path
                        d="M 0 100 Q 20 0 40 100 Q 60 30 80 100 Q 90 70 100 100"
                        stroke="#6366f1"
                        strokeWidth="4"
                        fill="none"
                      />
                    ) : selectedText.easing === 'elastic' ? (
                      <path
                        d="M 0 100 C 10 140 20 60 40 120 C 60 80 80 110 100 100"
                        stroke="#6366f1"
                        strokeWidth="4"
                        fill="none"
                      />
                    ) : selectedText.easing === 'linear' ? (
                      <path d="M 0 100 L 100 0" stroke="#6366f1" strokeWidth="4" fill="none" />
                    ) : (
                      <path
                        d="M 0 100 C 40 100 60 0 100 0"
                        stroke="#6366f1"
                        strokeWidth="4"
                        fill="none"
                      />
                    )}
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {['linear', 'ease_in_out', 'elastic', 'bounce', 'backOut', 'anticipate'].map(
                    (curve) => (
                      <button
                        key={curve}
                        onClick={() => onUpdateText(selectedText.id, { easing: curve as any })}
                        className={`py-1 rounded text-[6px] font-bold border transition-all ${selectedText.easing === curve ? 'bg-studio-accent/10 border-studio-accent/30 text-studio-accent' : 'bg-zinc-900/50 border-white/5 text-zinc-600 hover:text-zinc-400'}`}
                      >
                        {curve
                          .replace(/_([a-z])/g, ' ')
                          .replace('Out', '')
                          .toUpperCase()}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[7px] text-slate-500 uppercase font-sans tracking-widest">
                Movement Path
              </label>
              <select
                value={selectedText.motionPath || 'linear'}
                onChange={(e) =>
                  onUpdateText(selectedText.id, { motionPath: e.target.value as any })
                }
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[8px] text-white outline-none focus:border-purple-500/50"
              >
                <option value="linear">Straight Line</option>
                <option value="bezier">Smooth Curve</option>
                <option value="orbital">Circle</option>
                <option value="sine">Wave</option>
                <option value="infinite_loop">Infinity</option>
                <option value="magnetic_point">Snap to Point</option>
                <option value="geometric_snapping">Grid Snap</option>
                <option value="turbulence_field">Natural Float</option>
              </select>
            </div>

            {selectedText.is3D && (
              <div className="p-2 bg-[#050505] border border-[#1a1a1a] rounded space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[6px] text-zinc-500 uppercase font-mono">
                    3D Material Engine
                  </label>
                  <Palette className="w-2.5 h-2.5 text-blue-500/50" />
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded">
                  {['matte', 'metallic', 'neon', 'glass', 'iridescent', 'brushed'].map((m) => (
                    <button
                      key={m}
                      onClick={() => onUpdateText(selectedText.id, { material: m as any })}
                      className={`py-1 rounded text-[4px] font-black uppercase border transition-all ${selectedText.material === m ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.2)]' : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-400 font-mono">Extrude</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={selectedText.extrude || 0}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, { extrude: parseInt(e.target.value) })
                      }
                      className="w-full h-1 accent-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-400 font-mono">Lighting</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={selectedText.lightingIntensity || 50}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          lightingIntensity: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 accent-yellow-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-400 font-mono">Reflection</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={selectedText.reflection || 0}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          reflection: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 accent-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-400 font-mono">Perspective</label>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="10"
                      value={selectedText.perspective || 1000}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          perspective: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                  Kinetic Engine
                </label>
                <span className="text-[5px] text-purple-500/50 font-mono">Procedural Motion</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="space-y-1">
                  <label className="text-[6px] text-zinc-600 font-mono">Mass</label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={selectedText.mass || 1}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, { mass: parseFloat(e.target.value) })
                    }
                    className="w-full h-0.5 accent-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[6px] text-zinc-600 font-mono">Damping</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={selectedText.damping || 10}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, { damping: parseInt(e.target.value) })
                    }
                    className="w-full h-0.5 accent-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-1 mb-2">
                <label className="text-[6px] text-zinc-600 font-mono">Stiffness</label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  step="10"
                  value={selectedText.stiffness || 100}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, { stiffness: parseInt(e.target.value) })
                  }
                  className="w-full h-0.5 accent-purple-500"
                />
              </div>
              <select
                value={selectedText.typographyPreset || 'none'}
                onChange={(e) =>
                  onUpdateText(selectedText.id, { typographyPreset: e.target.value as any })
                }
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[8px] text-white outline-none focus:border-purple-500/50 transition-colors"
              >
                <option value="none">Static Rendering</option>
                <option value="glitch">Digital Glitch (Pro)</option>
                <option value="kinetic">Staggered Spacing</option>
                <option value="floating">Zero-G Turbulence</option>
                <option value="flicker">Cinema Neon Flicker</option>
                <option value="scatter">Kinetic Scatter</option>
                <option value="reveal">Optical Reveal</option>
                <option value="matrix_cascade">Matrix Cascade</option>
                <option value="voxel_build">Voxel Build (3D)</option>
                <option value="nebula_glow">Nebula Glow</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <label className="text-[7px] text-zinc-500 uppercase font-bold tracking-wider">
                  Motion Blur
                </label>
                <span className="text-[6px] text-zinc-600 font-medium tracking-tight">
                  Pixel velocity
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedText.motionBlur && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={selectedText.motionBlurIntensity || 50}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        motionBlurIntensity: parseInt(e.target.value),
                      })
                    }
                    className="w-16 accent-studio-accent h-1"
                  />
                )}
                <input
                  type="checkbox"
                  checked={selectedText.motionBlur}
                  onChange={(e) => onUpdateText(selectedText.id, { motionBlur: e.target.checked })}
                  className="accent-studio-accent w-3 h-3 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Layers} title="Background">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
              Shape Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedText.style.backgroundColor || '#000000'}
                onChange={(e) =>
                  onUpdateText(selectedText.id, {
                    style: { backgroundColor: e.target.value },
                  })
                }
                className="w-8 h-8 bg-transparent border-none cursor-pointer"
              />
              <span className="text-[8px] font-mono text-slate-400 uppercase">
                {selectedText.style.backgroundColor || 'Transparent'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Opacity
              </label>
              <span className="text-[9px] font-mono text-white">
                {Math.round((selectedText.style.backgroundOpacity ?? 0) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedText.style.backgroundOpacity ?? 0}
              onChange={(e) =>
                onUpdateText(selectedText.id, {
                  style: { backgroundOpacity: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Padding
              </label>
              <span className="text-[9px] font-mono text-white">
                {selectedText.style.padding ?? 0}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={selectedText.style.padding ?? 0}
              onChange={(e) =>
                onUpdateText(selectedText.id, {
                  style: { padding: parseInt(e.target.value) },
                })
              }
              className="w-full accent-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Border Radius
              </label>
              <span className="text-[9px] font-mono text-white">
                {selectedText.style.borderRadius ?? 0}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={selectedText.style.borderRadius ?? 0}
              onChange={(e) =>
                onUpdateText(selectedText.id, {
                  style: { borderRadius: parseInt(e.target.value) },
                })
              }
              className="w-full accent-white"
            />
          </div>
        </div>
      </Section>
    </>
  );
};
