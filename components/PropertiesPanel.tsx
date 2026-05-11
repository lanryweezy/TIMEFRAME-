
import React from 'react';
import { VideoState, VideoTransform, VideoAdjustment, ChromaKey, TextBlock, VideoClip } from '../types';
import { Maximize, Diamond, Palette, Scissors, Type, AlignLeft, AlignCenter, AlignRight, Bold, Play, Image as ImageIcon, Wind, Sparkles, Activity, Sliders, Shield, Layers, Focus, AudioWaveform as WaveformIcon, Square, Move, GitBranch, Zap, Target, Mic2, AudioLines, BoxSelect, Cpu } from 'lucide-react';

interface PropertiesPanelProps {
  state: VideoState;
  onChangeTransform: (transform: VideoTransform) => void;
  onUpdateTransformProperty: (prop: keyof VideoTransform, value: number) => void;
  onChangeAdjustment: (adj: VideoAdjustment) => void;
  onToggleKeyframe: (prop: string) => void;
  onChangeChromaKey: (chroma: ChromaKey) => void;
  onUpdateText: (id: string, updates: Partial<TextBlock> | { style: Partial<TextBlock['style']> }) => void;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  onEnhance: (clipId: string) => void;
  onStabilize: (clipId: string) => void;
  onUpdateShape?: (id: string, updates: any) => void;
  onUpdateParticle?: (id: string, updates: any) => void;
  onUpdateKeyframeEasing?: (prop: string, id: string, easing: any) => void;
}

const RangeControl = ({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (val: number) => void }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
            <span>{label}</span>
            <span className="text-white">{value.toFixed(0)}</span>
        </div>
        <input 
            type="range" min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-studio-accent h-0.5"
        />
    </div>
);

const SelectControl = ({ label, value, options, onChange }: { label: string, value: string, options: { label: string, value: string }[], onChange: (val: string) => void }) => (
    <div className="flex items-center justify-between">
        <label className="text-[7px] text-zinc-500 uppercase font-sans tracking-widest">{label}</label>
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[8px] text-white outline-none focus:border-blue-500/50"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

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
    onUpdateKeyframeEasing
}) => {
    
    // ... inside PropertiesPanel
    
    // Blend Mode Options for SelectControl
    const blendModeOptions = [
        { label: 'Normal', value: 'normal' },
        { label: 'Screen', value: 'screen' },
        { label: 'Multiply', value: 'multiply' },
        { label: 'Overlay', value: 'overlay' },
        { label: 'Add', value: 'add' },
        { label: 'Difference', value: 'difference' },
        { label: 'Exclusion', value: 'exclusion' }
    ];
  
  const selectedId = state.selectedIds[0];
  const selectedText = state.textTrack.find(t => t.id === selectedId) || state.textTrack.find(t => t.id === state.selectedTextId);
  const selectedClip = state.videoClips.find(c => c.id === selectedId) || state.videoClips.find(c => c.id === state.selectedClipId);
  const selectedShape = state.shapeTrack.find(s => s.id === selectedId) || state.shapeTrack.find(s => s.id === state.selectedShapeId);
  const selectedParticle = state.particleTrack.find(p => p.id === selectedId) || state.particleTrack.find(p => p.id === state.selectedParticleId);

  const handleUpdateColorGrading = (key: 'lift' | 'gamma' | 'gain' | 'offset', channel: 'r' | 'g' | 'b' | 'w', val: number) => {
      if (!selectedClip) return;
      const current = selectedClip.colorGrading || { 
          lift: {r:0, g:0, b:0, w:0}, 
          gamma: {r:0, g:0, b:0, w:0}, 
          gain: {r:0, g:0, b:0, w:0}, 
          offset: {r:0, g:0, b:0, w:0}, 
          colorSpace: 'rec709' 
      };
      const updated = {
          ...current,
          [key]: { ...current[key], [channel]: val }
      };
      onUpdateClip(selectedClip.id, { colorGrading: updated });
  };

  const ColorWheel = ({ label, targetKey }: { label: string, targetKey: 'lift' | 'gamma' | 'gain' }) => {
      const values = selectedClip?.colorGrading?.[targetKey] || { r: 0, g: 0, b: 0, w: 0 };
      
      return (
          <div className="flex flex-col items-center gap-2">
              <div 
                  className="relative w-16 h-16 rounded-full border border-white/5 bg-zinc-950 flex items-center justify-center group cursor-crosshair overflow-hidden"
                  onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const update = (moveEvent: MouseEvent) => {
                            const x = (moveEvent.clientX - rect.left) / rect.width * 2 - 1;
                            const y = (moveEvent.clientY - rect.top) / rect.height * 2 - 1;
                            handleUpdateColorGrading(targetKey, 'r', Math.max(-1, Math.min(1, x)));
                            handleUpdateColorGrading(targetKey, 'g', Math.max(-1, Math.min(1, -y)));
                        };
                        const stop = () => {
                            window.removeEventListener('mousemove', update);
                            window.removeEventListener('mouseup', stop);
                        };
                        window.addEventListener('mousemove', update);
                        window.addEventListener('mouseup', stop);
                  }}
              >
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] opacity-[0.03]" />
                  <div 
                      className="absolute w-1 h-1 rounded-full bg-white shadow-lg pointer-events-none"
                      style={{ transform: `translate(${values.r * 24}px, ${-values.g * 24}px)` }}
                  />
                  <div className="absolute inset-0 border border-white/[0.02] rounded-full pointer-events-none" />
              </div>
              <div className="flex flex-col items-center">
                  <span className="text-[7px] font-bold text-zinc-500 tracking-wider uppercase">{label}</span>
              </div>
          </div>
      );
  };

  const Section = ({ icon: Icon, title, children }: { icon: any, title: string, children?: React.ReactNode }) => (
      <div className="space-y-6 pt-8 first:pt-0">
          <div className="flex items-center gap-3 px-1">
              <div className="w-6 h-6 rounded-lg bg-studio-accent/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-studio-accent" />
              </div>
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  {title}
              </h3>
          </div>
          <div className="space-y-6 px-1">
              {children}
          </div>
      </div>
  );

  const handleAdjustmentChange = (prop: keyof VideoAdjustment, value: number) => {
    if (selectedClip) {
      // Update per-clip adjustment
      const currentAdj = selectedClip.adjustment || state.adjustment;
      onUpdateClip(selectedClip.id, {
        adjustment: { ...currentAdj, [prop]: value }
      });
    } else {
      // Update global adjustment
      onChangeAdjustment({
        ...state.adjustment,
        [prop]: value
      });
    }
  };

  const activeAdjustment = selectedClip?.adjustment || state.adjustment;

  return (
    <div className="h-full bg-black flex flex-col custom-scrollbar overflow-y-auto">
        <div className="p-4 space-y-8 pb-20">
            
            {selectedText && (
                <>
                    <Section icon={Type} title="Typography">
                            <div className="space-y-3 pb-4">
                                <div className="space-y-1.5 px-1 pb-2">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Your Text</label>
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
                                            onChange={(e) => onUpdateText(selectedText.id, { style: { fontSize: parseInt(e.target.value) } })}
                                            className="w-full bg-white/[0.03] rounded-lg px-4 py-3 text-[12px] text-white font-mono focus:bg-white/[0.05] focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] text-zinc-500 uppercase">Color</label>
                                        <div className="relative">
                                            <input 
                                                type="color" 
                                                value={selectedText.style.color} 
                                                onChange={(e) => onUpdateText(selectedText.id, { style: { color: e.target.value } })}
                                                className="w-full h-11 bg-white/[0.03] rounded-lg p-1.5 cursor-pointer focus:bg-white/[0.05] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-studio-border/50 space-y-4">
                                <div className="flex items-center justify-between group/field">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/field:text-studio-text-high transition-colors px-1">3D Effect</label>
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
                                            <label className="text-[7px] text-zinc-500 uppercase font-black font-sans tracking-widest px-1">Depth</label>
                                            <span className="text-[10px] font-sans text-studio-accent">{selectedText.depth || 0}px</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" step="1"
                                            value={selectedText.depth || 0}
                                            onChange={(e) => onUpdateText(selectedText.id, { depth: parseInt(e.target.value) })}
                                            className="studio-range"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <label className="text-[7px] text-slate-500 uppercase font-sans tracking-widest">Mix Mode</label>
                                    <select 
                                        value={selectedText.style.blendMode || 'normal'}
                                        onChange={(e) => onUpdateText(selectedText.id, { style: { blendMode: e.target.value as any } })}
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
                                            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Motion Blur</label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {selectedText.motionBlur && (
                                                <input 
                                                    type="range" min="0" max="100" step="1"
                                                    value={selectedText.motionBlurIntensity || 50}
                                                    onChange={(e) => onUpdateText(selectedText.id, { motionBlurIntensity: parseInt(e.target.value) })}
                                                    className="w-24 accent-purple-500 h-1.5"
                                                />
                                            )}
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer"
                                                    checked={selectedText.motionBlur} 
                                                    onChange={(e) => onUpdateText(selectedText.id, { motionBlur: e.target.checked })}
                                                />
                                                <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:bg-purple-500/60 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-400 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white transition-colors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Mask Shape</label>
                                        <select 
                                            value={selectedText.mask?.type || 'none'}
                                            onChange={(e) => onUpdateText(selectedText.id, { mask: e.target.value === 'none' ? undefined : { id: 'm-1', type: e.target.value as any, feather: 10, invert: false, expansion: 0 } })}
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
                                            <label className="text-[7px] text-zinc-500 uppercase font-bold tracking-wider">Motion Style</label>
                                            <span className="text-[6px] text-zinc-600 font-medium tracking-tight">Kinetic feel</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-7 bg-zinc-950 border border-white/5 rounded overflow-hidden relative group/curve cursor-pointer">
                                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                    {selectedText.easing === 'bounce' ? (
                                                        <path d="M 0 100 Q 20 0 40 100 Q 60 30 80 100 Q 90 70 100 100" stroke="#6366f1" strokeWidth="4" fill="none" />
                                                    ) : selectedText.easing === 'elastic' ? (
                                                        <path d="M 0 100 C 10 140 20 60 40 120 C 60 80 80 110 100 100" stroke="#6366f1" strokeWidth="4" fill="none" />
                                                    ) : selectedText.easing === 'linear' ? (
                                                        <path d="M 0 100 L 100 0" stroke="#6366f1" strokeWidth="4" fill="none" />
                                                    ) : (
                                                        <path d="M 0 100 C 40 100 60 0 100 0" stroke="#6366f1" strokeWidth="4" fill="none" />
                                                    )}
                                                </svg>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1">
                                                {['linear', 'ease_in_out', 'elastic', 'bounce', 'backOut', 'anticipate'].map(curve => (
                                                    <button 
                                                        key={curve}
                                                        onClick={() => onUpdateText(selectedText.id, { easing: curve as any })}
                                                        className={`py-1 rounded text-[6px] font-bold border transition-all ${selectedText.easing === curve ? 'bg-studio-accent/10 border-studio-accent/30 text-studio-accent' : 'bg-zinc-900/50 border-white/5 text-zinc-600 hover:text-zinc-400'}`}
                                                    >
                                                        {curve.replace(/_([a-z])/g, ' ').replace('Out', '').toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[7px] text-slate-500 uppercase font-sans tracking-widest">Movement Path</label>
                                        <select 
                                            value={selectedText.motionPath || 'linear'}
                                            onChange={(e) => onUpdateText(selectedText.id, { motionPath: e.target.value as any })}
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
                                                <label className="text-[6px] text-zinc-500 uppercase font-mono">3D Material Engine</label>
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
                                                        type="range" min="0" max="100" step="1"
                                                        value={selectedText.extrude || 0}
                                                        onChange={(e) => onUpdateText(selectedText.id, { extrude: parseInt(e.target.value) })}
                                                        className="w-full h-1 accent-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[7px] text-slate-400 font-mono">Lighting</label>
                                                    <input 
                                                        type="range" min="0" max="100" step="1"
                                                        value={selectedText.lightingIntensity || 50}
                                                        onChange={(e) => onUpdateText(selectedText.id, { lightingIntensity: parseInt(e.target.value) })}
                                                        className="w-full h-1 accent-yellow-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[7px] text-slate-400 font-mono">Reflection</label>
                                                    <input 
                                                        type="range" min="0" max="100" step="1"
                                                        value={selectedText.reflection || 0}
                                                        onChange={(e) => onUpdateText(selectedText.id, { reflection: parseInt(e.target.value) })}
                                                        className="w-full h-1 accent-emerald-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[7px] text-slate-400 font-mono">Perspective</label>
                                                    <input 
                                                        type="range" min="0" max="2000" step="10"
                                                        value={selectedText.perspective || 1000}
                                                        onChange={(e) => onUpdateText(selectedText.id, { perspective: parseInt(e.target.value) })}
                                                        className="w-full h-1 accent-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Kinetic Engine</label>
                                            <span className="text-[5px] text-purple-500/50 font-mono">Procedural Motion</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div className="space-y-1">
                                                <label className="text-[6px] text-zinc-600 font-mono">Mass</label>
                                                <input 
                                                    type="range" min="0.1" max="10" step="0.1" 
                                                    value={selectedText.mass || 1}
                                                    onChange={(e) => onUpdateText(selectedText.id, { mass: parseFloat(e.target.value) })}
                                                    className="w-full h-0.5 accent-purple-500" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[6px] text-zinc-600 font-mono">Damping</label>
                                                <input 
                                                    type="range" min="1" max="100" step="1" 
                                                    value={selectedText.damping || 10}
                                                    onChange={(e) => onUpdateText(selectedText.id, { damping: parseInt(e.target.value) })}
                                                    className="w-full h-0.5 accent-purple-500" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1 mb-2">
                                            <label className="text-[6px] text-zinc-600 font-mono">Stiffness</label>
                                            <input 
                                                type="range" min="1" max="1000" step="10" 
                                                value={selectedText.stiffness || 100}
                                                onChange={(e) => onUpdateText(selectedText.id, { stiffness: parseInt(e.target.value) })}
                                                className="w-full h-0.5 accent-purple-500" 
                                            />
                                        </div>
                                        <select 
                                            value={selectedText.typographyPreset || 'none'}
                                            onChange={(e) => onUpdateText(selectedText.id, { typographyPreset: e.target.value as any })}
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
                                            <label className="text-[7px] text-zinc-500 uppercase font-bold tracking-wider">Motion Blur</label>
                                            <span className="text-[6px] text-zinc-600 font-medium tracking-tight">Pixel velocity</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {selectedText.motionBlur && (
                                                <input 
                                                    type="range" min="0" max="100" step="1"
                                                    value={selectedText.motionBlurIntensity || 50}
                                                    onChange={(e) => onUpdateText(selectedText.id, { motionBlurIntensity: parseInt(e.target.value) })}
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
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Shape Color</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={selectedText.style.backgroundColor || '#000000'} 
                                        onChange={(e) => onUpdateText(selectedText.id, { style: { backgroundColor: e.target.value } })}
                                        className="w-8 h-8 bg-transparent border-none cursor-pointer"
                                    />
                                    <span className="text-[8px] font-mono text-slate-400 uppercase">{selectedText.style.backgroundColor || 'Transparent'}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Opacity</label>
                                    <span className="text-[9px] font-mono text-white">{Math.round((selectedText.style.backgroundOpacity ?? 0) * 100)}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="1" step="0.01"
                                    value={selectedText.style.backgroundOpacity ?? 0}
                                    onChange={(e) => onUpdateText(selectedText.id, { style: { backgroundOpacity: parseFloat(e.target.value) } })}
                                    className="w-full accent-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Padding</label>
                                    <span className="text-[9px] font-mono text-white">{selectedText.style.padding ?? 0}px</span>
                                </div>
                                <input 
                                    type="range" min="0" max="50" step="1"
                                    value={selectedText.style.padding ?? 0}
                                    onChange={(e) => onUpdateText(selectedText.id, { style: { padding: parseInt(e.target.value) } })}
                                    className="w-full accent-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Border Radius</label>
                                    <span className="text-[9px] font-mono text-white">{selectedText.style.borderRadius ?? 0}px</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" step="1"
                                    value={selectedText.style.borderRadius ?? 0}
                                    onChange={(e) => onUpdateText(selectedText.id, { style: { borderRadius: parseInt(e.target.value) } })}
                                    className="w-full accent-white"
                                />
                            </div>
                        </div>
                    </Section>
                </>
            )}

            {selectedClip && (
              <>
                <Section icon={Move} title="Transform & Blending">
                    <div className="space-y-4">
                        <RangeControl 
                            label="Opacity" 
                            value={selectedClip.transform?.opacity ?? 100}
                            min={0}
                            max={100}
                            step={1}
                            onChange={(val) => onUpdateClip(selectedClip.id, { transform: { ...(selectedClip.transform || { scale: 1, positionX: 0, positionY: 0, rotation: 0, opacity: 100, keyframes: {} }), opacity: val } })}
                        />
                        <SelectControl 
                            label="Blend Mode"
                            value={selectedClip.blendMode || 'normal'}
                            options={blendModeOptions}
                            onChange={(val) => onUpdateClip(selectedClip.id, { blendMode: val as any })}
                        />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Sub-frame Motion Blur</label>
                                    <span className="text-[5px] text-zinc-600 font-mono tracking-wider">Shutter-sync velocity</span>
                                </div>
                                <input 
                                  type="checkbox" 
                                  checked={selectedClip.motionBlur} 
                                  onChange={(e) => onUpdateClip(selectedClip.id, { motionBlur: e.target.checked })}
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
                <Section icon={Palette} title="Color Grading (Tiered)">
                    <div className="space-y-8">
                      {(['lift', 'gamma', 'gain'] as const).map(type => (
                        <div key={type} className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{type}</label>
                          <div className="grid grid-cols-4 gap-2">
                             {(['r', 'g', 'b', 'w'] as const).map(channel => (
                               <div key={channel} className="space-y-1">
                                 <input 
                                     type="range" min="-1" max="1" step="0.01"
                                     value={selectedClip.colorGrading?.[type]?.[channel] ?? 0}
                                     onChange={(e) => {
                                         const val = parseFloat(e.target.value);
                                         const current = selectedClip.colorGrading || {
                                             lift: {r:0, g:0, b:0, w:0},
                                             gamma: {r:0, g:0, b:0, w:0},
                                             gain: {r:0, g:0, b:0, w:0},
                                             offset: {r:0, g:0, b:0, w:0},
                                             colorSpace: 'rec709'
                                         };
                                         onUpdateClip(selectedClip.id, {
                                             colorGrading: {
                                                 ...current,
                                                 [type]: { ...current[type], [channel]: val }
                                             }
                                         });
                                     }}
                                     className={`w-full h-1 ${channel === 'r' ? 'accent-red-500' : channel === 'g' ? 'accent-green-500' : channel === 'b' ? 'accent-blue-500' : 'accent-white'}`}
                                 />
                                 <span className="text-[6px] font-mono text-zinc-600 uppercase text-center block">{channel}</span>
                               </div>
                             ))}
                          </div>
                        </div>
                      ))}
                    </div>
                </Section>

                                <Section icon={Zap} title="Glow & Effects">
                    <div className="space-y-4">
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                                <span>Edge Color</span>
                                <span className="text-blue-400">{(selectedClip.effects?.chromaticAberration || 0).toFixed(2)}</span>
                             </div>
                             <input 
                                type="range" min="0" max="1" step="0.01"
                                value={selectedClip.effects?.chromaticAberration || 0}
                                onChange={(e) => onUpdateClip(selectedClip.id, { effects: { ...(selectedClip.effects || {}), chromaticAberration: parseFloat(e.target.value) } as any })}
                                className="w-full accent-blue-500 h-0.5"
                             />
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                                <span>Glitch</span>
                                <span className="text-purple-400">{(selectedClip.effects?.glitchIntensity || 0).toFixed(2)}</span>
                             </div>
                             <input 
                                type="range" min="0" max="1" step="0.01"
                                value={selectedClip.effects?.glitchIntensity || 0}
                                onChange={(e) => onUpdateClip(selectedClip.id, { effects: { ...(selectedClip.effects || {}), glitchIntensity: parseFloat(e.target.value) } as any })}
                                className="w-full accent-purple-500 h-0.5"
                             />
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-sans tracking-widest">
                                <span>Glow</span>
                                <span className="text-yellow-400">{(selectedClip.effects?.bloom || 0).toFixed(2)}</span>
                             </div>
                             <input 
                                type="range" min="0" max="1" step="0.01"
                                value={selectedClip.effects?.bloom || 0}
                                onChange={(e) => onUpdateClip(selectedClip.id, { effects: { ...(selectedClip.effects || {}), bloom: parseFloat(e.target.value) } as any })}
                                className="w-full accent-yellow-400 h-0.5"
                             />
                        </div>
                    </div>
                </Section>

                <Section icon={Target} title="Object Tracking">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                             {['Point', 'Region', 'Full'].map(t => (
                                 <button 
                                    key={t}
                                    onClick={() => onUpdateClip(selectedClip.id, { tracking: { id: 'tr-1', type: t.toLowerCase() === 'point' ? 'point' : t.toLowerCase() === 'region' ? 'planar' : 'camera', status: 'idle', confidence: 0, points: [], searchRange: 20, featureQuality: 0.8, occlusionHandling: 'linear_prediction', smoothing: 0.5 } })}
                                    className={`flex-1 py-1.5 text-[8px] font-bold rounded border transition-all ${((selectedClip.tracking?.type === 'point' && t === 'Point') || (selectedClip.tracking?.type === 'planar' && t === 'Region') || (selectedClip.tracking?.type === 'camera' && t === 'Full')) ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-black border-[#222] text-amber-500/50'}`}
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
                                            type="range" min="5" max="100" step="1"
                                            value={selectedClip.tracking.searchRange}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { tracking: { ...selectedClip.tracking!, searchRange: parseInt(e.target.value) } })}
                                            className="w-full accent-amber-500 h-0.5"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                                            <span>FEATURE QUALITY</span>
                                            <span>{(selectedClip.tracking.featureQuality * 100).toFixed(0)}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0.1" max="1" step="0.01"
                                            value={selectedClip.tracking.featureQuality}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { tracking: { ...selectedClip.tracking!, featureQuality: parseFloat(e.target.value) } })}
                                            className="w-full accent-amber-500 h-0.5"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[6px] text-zinc-500 uppercase font-mono">Occlusion Strategy</label>
                                        <select 
                                            value={selectedClip.tracking.occlusionHandling}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { tracking: { ...selectedClip.tracking!, occlusionHandling: e.target.value as any } })}
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
                                <label className="text-[7px] text-zinc-500 uppercase font-sans tracking-widest">Smart Select</label>
                                <span className="text-[5px] text-zinc-600 font-sans italic">Remove background automatically</span>
                             </div>
                             <input 
                                type="checkbox"
                                checked={selectedClip.rotoscope?.enabled}
                                onChange={(e) => onUpdateClip(selectedClip.id, { rotoscope: { enabled: e.target.checked, points: [], feather: 10, autoKeyframe: true, mode: 'smart_segmentation', refinement: 0.5, propagation: true } })}
                                className="accent-fuchsia-500"
                             />
                        </div>
                        {selectedClip.rotoscope?.enabled && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-1">
                                    {(['smart_segmentation', 'manual_spline', 'magic_edge'] as const).map(m => (
                                        <button 
                                            key={m}
                                            onClick={() => onUpdateClip(selectedClip.id, { rotoscope: { ...selectedClip.rotoscope!, mode: m } })}
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
                                            type="range" min="0" max="100" step="1"
                                            value={selectedClip.rotoscope.feather}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { rotoscope: { ...selectedClip.rotoscope!, feather: parseInt(e.target.value) } })}
                                            className="w-full accent-fuchsia-500 h-0.5"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                                            <span>REFINEMENT</span>
                                            <span className="text-fuchsia-400">{(selectedClip.rotoscope.refinement * 100).toFixed(0)}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="1" step="0.01"
                                            value={selectedClip.rotoscope.refinement}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { rotoscope: { ...selectedClip.rotoscope!, refinement: parseFloat(e.target.value) } })}
                                            className="w-full accent-fuchsia-500 h-0.5"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-[6px] text-zinc-500 uppercase font-mono">Bidirectional Prop</label>
                                        <input 
                                            type="checkbox"
                                            checked={selectedClip.rotoscope.propagation}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { rotoscope: { ...selectedClip.rotoscope!, propagation: e.target.checked } })}
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

                <Section icon={Wind} title="Speed & Transitions">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Playback Speed</span>
                            <span className="text-[9px] font-mono text-blue-400">{(selectedClip.speed * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                            type="range" min="0.1" max="4" step="0.1"
                            value={selectedClip.speed}
                            onChange={(e) => onUpdateClip(selectedClip.id, { speed: parseFloat(e.target.value) })}
                            className="w-full accent-blue-500"
                        />
                        
                        <div className="grid grid-cols-5 gap-1 mt-2">
                            {[0.25, 0.5, 1, 2, 4].map(s => (
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
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Transition In</label>
                                <select 
                                    value={selectedClip.transitionIn || 'none'}
                                    onChange={(e) => onUpdateClip(selectedClip.id, { transitionIn: e.target.value as any })}
                                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none"
                                >
                                    <option value="none">None</option>
                                    <option value="fade">Fade</option>
                                    <option value="slide">Slide</option>
                                    <option value="blur">Blur</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Transition Out</label>
                                <select 
                                    value={selectedClip.transitionOut || 'none'}
                                    onChange={(e) => onUpdateClip(selectedClip.id, { transitionOut: e.target.value as any })}
                                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none"
                                >
                                    <option value="none">None</option>
                                    <option value="fade">Fade</option>
                                    <option value="slide">Slide</option>
                                    <option value="blur">Blur</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Global Transition Duration (s)</label>
                            <input 
                                type="range" min="0" max="5" step="0.1"
                                value={selectedClip.fadeInDuration || 0}
                                onChange={(e) => onUpdateClip(selectedClip.id, { fadeInDuration: parseFloat(e.target.value), fadeOutDuration: parseFloat(e.target.value) })}
                                className="w-full accent-blue-500"
                            />
                        </div>
                    </div>
                </Section>

                <Section icon={WaveformIcon} title="Spatial Audio (Beta)">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">360° Auto-Panning</span>
                            <input 
                                type="checkbox" 
                                checked={selectedClip?.spatialAudioEnabled} 
                                onChange={(e) => onUpdateClip(selectedClip!.id, { spatialAudioEnabled: e.target.checked })} 
                                className="accent-yellow-500 w-3 h-3 cursor-pointer" 
                            />
                        </div>
                        {selectedClip?.spatialAudioEnabled && (
                            <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 rounded font-mono text-[7px] text-yellow-200/50 leading-tight">
                                Tracking movement to dynamically shift audio channels.
                            </div>
                        )}
                    </div>
                </Section>

                <Section icon={Focus} title="Auto Resize">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Smart Crop</span>
                            <input 
                                type="checkbox" 
                                checked={selectedClip?.autoReframeEnabled} 
                                onChange={(e) => onUpdateClip(selectedClip!.id, { autoReframeEnabled: e.target.checked })} 
                                className="accent-white w-3 h-3 cursor-pointer" 
                            />
                        </div>
                        {selectedClip?.autoReframeEnabled && (
                            <div className="grid grid-cols-3 gap-1">
                                {(['center', 'subject', 'dynamic'] as const).map(mode => (
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

                <Section icon={Palette} title="Color Grade">
                    <div className="space-y-6 pt-2">
                        {/* LGG Wheels Interaction */}
                        <div className="grid grid-cols-3 gap-2">
                             <ColorWheel label="LIFT" targetKey="lift" />
                             <ColorWheel label="GAMMA" targetKey="gamma" />
                             <ColorWheel label="GAIN" targetKey="gain" />
                        </div>

                        {/* Professional LUTs */}
                        <div className="space-y-3">
                            <label className="text-[7px] text-slate-500 uppercase font-sans tracking-widest">Color Presets</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['CINEMATIC', 'VINTAGE', 'MODERN', 'DRAMATIC'].map(lut => (
                                    <button 
                                        key={lut}
                                        onClick={() => selectedClip && onUpdateClip(selectedClip.id, { colorGrading: { ...(selectedClip.colorGrading || { lift: {r:0,g:0,b:0,w:0}, gamma: {r:0,g:0,b:0,w:0}, gain: {r:0,g:0,b:0,w:0}, offset: {r:0,g:0,b:0,w:0}, colorSpace: 'rec709' }), lut } } as any)}
                                        className={`px-2 py-1.5 text-[6px] font-sans border rounded transition-all truncate text-left ${selectedClip?.colorGrading?.lut === lut ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-black border-[#222] text-zinc-500 hover:border-zinc-700'}`}
                                    >
                                        {lut}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-white/5">
                            {/* Detailed Adjustment Parameters */}
                            <div className="space-y-3">
                                {[
                                    { label: 'Brightness', key: 'brightness', color: 'amber', min: 0, max: 200 },
                                    { label: 'Contrast', key: 'contrast', color: 'blue', min: 0, max: 200 },
                                    { label: 'Saturation', key: 'saturation', color: 'emerald', min: 0, max: 200 },
                                    { label: 'Hue', key: 'hue', color: 'purple', min: -180, max: 180 }
                                ].map(param => (
                                    <div key={param.label} className="space-y-1">
                                        <div className="flex justify-between items-center text-[7px] font-mono">
                                            <span className="text-zinc-500 uppercase">{param.label}</span>
                                            <span className="text-white">{(selectedClip?.adjustment?.[param.key as keyof VideoAdjustment] ?? 100).toFixed(0)}</span>
                                        </div>
                                        <div className="h-4 flex items-center group/slider">
                                            <input 
                                                type="range"
                                                min={param.min}
                                                max={param.max}
                                                value={selectedClip?.adjustment?.[param.key as keyof VideoAdjustment] ?? 100}
                                                onChange={(e) => {
                                                    if (!selectedClip) return;
                                                    const adj = selectedClip.adjustment || {
                                                        brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0,
                                                        filterIntensity: 100, vignetteIntensity: 0, vignetteSize: 50
                                                    };
                                                    onUpdateClip(selectedClip.id, { 
                                                        adjustment: { ...adj, [param.key]: parseFloat(e.target.value) } 
                                                    });
                                                }}
                                                className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-studio-accent"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>

                <Section icon={Sparkles} title="Auto Fix">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Optimization</span>
                            {selectedClip.isEnhanced ? (
                                <span className="text-[7px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-sm font-black animate-pulse">BEST QUALITY</span>
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
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Stability</span>
                        {selectedClip.isStabilized ? (
                            <span className="text-[7px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-sm font-black">STABLE</span>
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

                <Section icon={Move} title="Motion & Physics">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Motion Blur</label>
                            <input 
                                type="checkbox" 
                                checked={selectedClip.motionBlur} 
                                onChange={(e) => onUpdateClip(selectedClip.id, { motionBlur: e.target.checked })}
                                className="accent-blue-500 w-3 h-3 cursor-pointer"
                            />
                        </div>
                        
                        <div className="pt-2 border-t border-[#1a1a1a] space-y-3">
                                    <p className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Advanced Masking</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {['None', 'Rect', 'Circle', 'Smart', 'Alpha', 'Luma'].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => onUpdateClip(selectedClip.id, { mask: m === 'None' ? undefined : { id: 'mask-1', type: m.toLowerCase() as any, feather: 10, invert: false, expansion: 0, opacity: 1 } })}
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
                                            onClick={() => onUpdateClip(selectedClip.id, { mask: { ...selectedClip.mask!, invert: !selectedClip.mask?.invert } })}
                                            className={`px-2 py-1 text-[6px] font-mono border rounded transition-colors ${selectedClip.mask.invert ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-500 border-white/10'}`}
                                        >
                                            INVERT
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Expansion</label>
                                                <span className="text-[8px] font-mono text-white">{selectedClip.mask.expansion}px</span>
                                            </div>
                                            <input 
                                                type="range" min="-100" max="100" step="1"
                                                value={selectedClip.mask.expansion}
                                                onChange={(e) => onUpdateClip(selectedClip.id, { mask: { ...selectedClip.mask!, expansion: parseInt(e.target.value) } })}
                                                className="w-full accent-blue-500 h-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Opacity</label>
                                                <span className="text-[8px] font-mono text-white">{Math.round((selectedClip.mask.opacity ?? 1) * 100)}%</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max="1" step="0.01"
                                                value={selectedClip.mask.opacity ?? 1}
                                                onChange={(e) => onUpdateClip(selectedClip.id, { mask: { ...selectedClip.mask!, opacity: parseFloat(e.target.value) } })}
                                                className="w-full accent-blue-500 h-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Edge Feathering</label>
                                            <span className="text-[8px] font-mono text-white">{selectedClip.mask.feather}px</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="250" step="1"
                                            value={selectedClip.mask.feather}
                                            onChange={(e) => onUpdateClip(selectedClip.id, { mask: { ...selectedClip.mask!, feather: parseInt(e.target.value) } })}
                                            className="w-full accent-blue-500 h-1"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>
                <Section icon={Mic2} title="Audio Settings">
                    <div className="space-y-4 pt-2">
                        <div className="flex gap-2">
                            {(['SMART', 'NATURAL', 'CUSTOM'] as const).map(s => (
                                <button 
                                    key={s}
                                    onClick={() => onUpdateClip(selectedClip.id, { audio: { ...(selectedClip.audio || { volume: 1, pan: 0, eq: {low:0,mid:0,high:0}, voiceClarity: false, voiceIsolation: 0, spectralRepair: false, loudnessStandard: 'EBU_R128' }), loudnessStandard: s === 'SMART' ? 'EBU_R128' : s === 'NATURAL' ? 'ATSC_A85' : 'CUSTOM' } })}
                                    className={`flex-1 py-1 text-[5px] font-black uppercase rounded border transition-all ${(selectedClip.audio?.loudnessStandard === 'EBU_R128' && s === 'SMART') || (selectedClip.audio?.loudnessStandard === 'ATSC_A85' && s === 'NATURAL') || (selectedClip.audio?.loudnessStandard === 'CUSTOM' && s === 'CUSTOM') ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-black border-[#1a1a1a] text-zinc-600'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-[7px] text-zinc-400 uppercase font-sans tracking-widest">Clean Voice</div>
                                    <div className="text-[5px] text-emerald-500 font-sans">VOICE_FIX_ACTIVE</div>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={selectedClip.audio?.voiceClarity}
                                    onChange={(e) => onUpdateClip(selectedClip.id, { audio: { ...(selectedClip.audio || { volume: 1, pan: 0, eq: {low:0,mid:0,high:0}, voiceClarity: false, voiceIsolation: 0, spectralRepair: false, loudnessStandard: 'EBU_R128' }), voiceClarity: e.target.checked } })}
                                    className="accent-emerald-500"
                                />
                            </div>
                            <input 
                                type="range" min="0" max="1" step="0.01"
                                value={selectedClip.audio?.voiceIsolation || 0}
                                onChange={(e) => onUpdateClip(selectedClip.id, { audio: { ...(selectedClip.audio || { volume: 1, pan: 0, eq: {low:0,mid:0,high:0}, voiceClarity: false, voiceIsolation: 0, spectralRepair: false, loudnessStandard: 'EBU_R128' }), voiceIsolation: parseFloat(e.target.value) } })}
                                className="w-full accent-emerald-500 h-0.5"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
                            {['LOW', 'MID', 'HIGH'].map(band => (
                                <div key={band} className="space-y-1 text-center">
                                    <div className="h-16 bg-zinc-900 rounded-sm relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-x-0 bottom-0 bg-emerald-500/20" style={{ height: '40%' }} />
                                        <div className="w-0.5 h-full bg-white/10" />
                                        <div className="w-2 h-2 rounded-full bg-white shadow-lg relative z-10 translate-y-1" />
                                    </div>
                                    <span className="text-[6px] font-mono text-zinc-500">{band}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                <Section icon={BoxSelect} title="3D Depth">
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[7px] text-zinc-500 uppercase font-sans tracking-widest">Extra Dimension</span>
                            <input 
                                type="checkbox"
                                checked={selectedClip.depth?.enabled}
                                onChange={(e) => onUpdateClip(selectedClip.id, { depth: { ...(selectedClip.depth || { enabled: false, near: 0, far: 100, focalLength: 35 }), enabled: e.target.checked } })}
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
                                    <div className="absolute bottom-1 right-1 text-[5px] font-sans text-zinc-600">SMART_DEPTH_READY</div>
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
                            </div>
                        )}
                    </div>
                </Section>
              </>
            )}

            <Section icon={Sliders} title={selectedClip ? "Primary Node Adjustments" : "Project Master Out"}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Hue Shift</label>
                            <span className="text-[9px] font-mono text-white">{activeAdjustment.hue}°</span>
                        </div>
                        <input 
                            type="range" min="-180" max="180" step="1"
                            value={activeAdjustment.hue}
                            onChange={(e) => handleAdjustmentChange('hue', parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Luminance</label>
                            <span className="text-[9px] font-mono text-white">{activeAdjustment.brightness}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="200" step="1"
                            value={activeAdjustment.brightness}
                            onChange={(e) => handleAdjustmentChange('brightness', parseFloat(e.target.value))}
                            className="w-full accent-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Contrast</label>
                            <span className="text-[9px] font-mono text-white">{activeAdjustment.contrast}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="200" step="1"
                            value={activeAdjustment.contrast}
                            onChange={(e) => handleAdjustmentChange('contrast', parseFloat(e.target.value))}
                            className="w-full accent-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Saturation</label>
                            <span className="text-[9px] font-mono text-white">{activeAdjustment.saturation}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="200" step="1"
                            value={activeAdjustment.saturation}
                            onChange={(e) => handleAdjustmentChange('saturation', parseFloat(e.target.value))}
                            className="w-full accent-white"
                        />
                    </div>
                </div>
            </Section>

            <Section icon={Focus} title="Creative Focus (Vignette)">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Intensity</label>
                            <span className="text-[9px] font-mono text-white">{activeAdjustment.vignetteIntensity}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" step="1"
                            value={activeAdjustment.vignetteIntensity}
                            onChange={(e) => handleAdjustmentChange('vignetteIntensity', parseFloat(e.target.value))}
                            className="w-full accent-slate-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Softness (Size)</label>
                            <span className="text-[9px] font-mono text-white">{activeAdjustment.vignetteSize}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" step="1"
                            value={activeAdjustment.vignetteSize}
                            onChange={(e) => handleAdjustmentChange('vignetteSize', parseFloat(e.target.value))}
                            className="w-full accent-slate-400"
                        />
                    </div>
                </div>
            </Section>

            <Section icon={Scissors} title="Chroma Keying">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Chroma Key</span>
                        <input type="checkbox" checked={state.chromaKey.enabled} onChange={(e) => onChangeChromaKey({ ...state.chromaKey, enabled: e.target.checked })} className="accent-blue-500 w-3 h-3 cursor-pointer" />
                    </div>
                    {state.chromaKey.enabled && (
                        <div className="space-y-2">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Target Color</label>
                            <input type="color" value={state.chromaKey.color} onChange={(e) => onChangeChromaKey({ ...state.chromaKey, color: e.target.value })} className="w-full h-8 rounded border-none bg-transparent cursor-pointer" />
                        </div>
                    )}
                </div>
            </Section>

            <Section icon={Maximize} title="Spatial Controls">
                {[
                    { label: 'Scale', prop: 'scale', min: 0.1, max: 2, step: 0.01 },
                    { label: 'Rotate', prop: 'rotation', min: -180, max: 180, step: 1 },
                    { label: 'PosX', prop: 'positionX', min: -500, max: 500, step: 1 },
                    { label: 'PosY', prop: 'positionY', min: -500, max: 500, step: 1 },
                ].map(item => {
                    const hasKeyframe = (state.transform.keyframes[item.prop] || []).some(k => Math.abs(k.time - state.currentTime) < 0.1);
                    return (
                        <div key={item.prop} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">{item.label}</label>
                                    <button 
                                        onClick={() => onToggleKeyframe(item.prop)}
                                        className={`transition-all ${hasKeyframe ? 'text-blue-500' : 'text-slate-700 hover:text-slate-500'}`}
                                    >
                                        <Diamond className={`w-2 h-2 ${hasKeyframe ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasKeyframe && (
                                        <select 
                                            className="bg-black border border-white/5 text-[6px] font-mono text-zinc-500 outline-none rounded px-1 py-0.5"
                                            value={(state.transform.keyframes[item.prop] || []).find(k => Math.abs(k.time - state.currentTime) < 0.1)?.easing || 'linear'}
                                            onChange={(e) => {
                                                const k = (state.transform.keyframes[item.prop] || []).find(k => Math.abs(k.time - state.currentTime) < 0.1);
                                                if (k && onUpdateKeyframeEasing) onUpdateKeyframeEasing(item.prop, k.id, e.target.value);
                                            }}
                                        >
                                            <option value="linear">Lin</option>
                                            <option value="easeIn">In</option>
                                            <option value="easeOut">Out</option>
                                            <option value="easeInOut">In/Out</option>
                                            <option value="elastic">Elas</option>
                                            <option value="bounce">Bnc</option>
                                            <option value="backIn">BkIn</option>
                                            <option value="backOut">BkOut</option>
                                        </select>
                                    )}
                                    <span className="text-[9px] font-mono text-white">{(state.transform[item.prop as keyof VideoTransform] as number).toFixed(2)}</span>
                                </div>
                            </div>
                            <input type="range" min={item.min} max={item.max} step={item.step} value={state.transform[item.prop as keyof VideoTransform] as number} onChange={(e) => onUpdateTransformProperty(item.prop as keyof VideoTransform, parseFloat(e.target.value))} className="w-full" />
                        </div>
                    );
                })}
            </Section>

            {selectedShape && (
                <Section icon={Square} title="Procedural Shape">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Shape Type</label>
                            <select 
                                value={selectedShape.type}
                                onChange={(e) => onUpdateShape?.(selectedShape.id, { type: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[10px] text-white outline-none"
                            >
                                <option value="rectangle">Rectangle</option>
                                <option value="circle">Circle</option>
                                <option value="triangle">Triangle</option>
                                <option value="star">Star</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Fill Color</label>
                            <input 
                                type="color" 
                                value={selectedShape.color} 
                                onChange={(e) => onUpdateShape?.(selectedShape.id, { color: e.target.value })}
                                className="w-full h-8 bg-transparent border-none cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Blend Mode</label>
                            <select 
                                value={selectedShape.blendMode}
                                onChange={(e) => onUpdateShape?.(selectedShape.id, { blendMode: e.target.value as any })}
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
                        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Motion Blur</label>
                            <div className="flex items-center gap-2">
                                {selectedShape.motionBlur && (
                                    <input 
                                        type="range" min="0" max="100" step="1"
                                        value={selectedShape.motionBlurIntensity || 50}
                                        onChange={(e) => onUpdateShape?.(selectedShape.id, { motionBlurIntensity: parseInt(e.target.value) })}
                                        className="w-16 accent-green-500 h-1"
                                    />
                                )}
                                <input 
                                    type="checkbox" 
                                    checked={selectedShape.motionBlur} 
                                    onChange={(e) => onUpdateShape?.(selectedShape.id, { motionBlur: e.target.checked })}
                                    className="accent-green-500 w-3 h-3 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[7px] text-zinc-500 uppercase font-mono tracking-widest">Active Behavior</label>
                            <select 
                                value={selectedShape.behavior || 'none'}
                                onChange={(e) => onUpdateShape?.(selectedShape.id, { behavior: e.target.value as any })}
                                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[8px] text-white outline-none focus:border-green-500/50"
                            >
                                <option value="none">Static Behavior</option>
                                <option value="drift">Slow Drift</option>
                                <option value="float">Zero-G Float</option>
                                <option value="pulse">Pulse Scale</option>
                                <option value="avoid_mouse">Smart Avoidance</option>
                                <option value="attract_mouse">Magnetic Attraction</option>
                                <option value="orbit_center">Orbital Path</option>
                                <option value="shake_on_beat">Beat-Sync Shake</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a1a1a]">
                            <div className="space-y-1">
                                <label className="text-[6px] text-zinc-600 font-mono">Mass</label>
                                <input 
                                    type="range" min="0.1" max="10" step="0.1"
                                    value={selectedShape.mass || 1}
                                    onChange={(e) => onUpdateShape?.(selectedShape.id, { mass: parseFloat(e.target.value) })}
                                    className="w-full h-0.5 accent-green-500" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[6px] text-zinc-600 font-mono">Elasticity</label>
                                <input 
                                    type="range" min="0" max="1" step="0.01"
                                    value={selectedShape.stiffness ? selectedShape.stiffness / 1000 : 0.5}
                                    onChange={(e) => onUpdateShape?.(selectedShape.id, { stiffness: parseFloat(e.target.value) * 1000 })}
                                    className="w-full h-0.5 accent-green-500" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Points / Sides</label>
                                <span className="text-[9px] font-mono text-white">{selectedShape.points || 4}</span>
                            </div>
                            <input 
                                type="range" min="3" max="20" step="1"
                                value={selectedShape.points || 4}
                                onChange={(e) => onUpdateShape?.(selectedShape.id, { points: parseInt(e.target.value) })}
                                className="w-full accent-yellow-500"
                            />
                        </div>

                        <div className="pt-2 border-t border-[#1a1a1a] space-y-3">
                             <div className="flex items-center justify-between">
                                <label className="text-[7px] text-zinc-500 uppercase font-mono tracking-widest">3D Shape Engine</label>
                                <input 
                                    type="checkbox" 
                                    checked={selectedShape.is3D} 
                                    onChange={(e) => onUpdateShape?.(selectedShape.id, { is3D: e.target.checked })}
                                    className="accent-blue-500 w-3 h-3 cursor-pointer"
                                />
                            </div>

                            {selectedShape.is3D && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[7px] text-slate-400 font-mono tracking-widest">Extrusion Depth</label>
                                        <input 
                                            type="range" min="0" max="100" step="1"
                                            value={selectedShape.depth || 10}
                                            onChange={(e) => onUpdateShape?.(selectedShape.id, { depth: parseInt(e.target.value) })}
                                            className="w-full h-1 accent-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['matte', 'metallic', 'glass', 'neon'].map((m) => (
                                            <button 
                                                key={m}
                                                onClick={() => onUpdateShape?.(selectedShape.id, { material: m })}
                                                className={`py-1 rounded text-[5px] font-black uppercase border transition-all ${selectedShape.material === m ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-transparent border-white/5 text-zinc-600'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pt-2 border-t border-[#1a1a1a] space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[7px] text-zinc-500 uppercase font-mono tracking-widest">Physics Sim</label>
                                <Activity className="w-2.5 h-2.5 text-purple-500/50" />
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[6px] text-zinc-600 uppercase">Gravity</label>
                                        <input type="range" className="w-full h-0.5 accent-purple-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[6px] text-zinc-600 uppercase">Friction</label>
                                        <input type="range" className="w-full h-0.5 accent-purple-500" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-1 bg-black/40 rounded border border-white/5">
                                    <span className="text-[5px] text-zinc-500 font-mono uppercase">Collision Engine</span>
                                    <span className="text-[5px] text-green-500 font-mono uppercase">V_Detect_On</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            )}

            {selectedParticle && (
                <Section icon={Activity} title="Particle Simulations">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">System Type</label>
                            <span className="text-[10px] text-white font-bold block bg-[#0a0a0a] p-2 rounded uppercase">{selectedParticle.type}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Emission Intensity</label>
                                <span className="text-[9px] font-mono text-white">{selectedParticle.intensity}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" step="1"
                                value={selectedParticle.intensity}
                                onChange={(e) => onUpdateParticle?.(selectedParticle.id, { intensity: parseInt(e.target.value) })}
                                className="w-full accent-purple-500"
                            />
                        </div>
                        <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Gravity</label>
                                    <input 
                                        type="range" min="-50" max="50" step="1"
                                        value={selectedParticle.gravity || 0}
                                        onChange={(e) => onUpdateParticle?.(selectedParticle.id, { gravity: parseInt(e.target.value) })}
                                        className="w-full accent-indigo-500 h-1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Turbulence</label>
                                    <input 
                                        type="range" min="0" max="100" step="1"
                                        value={selectedParticle.turbulence || 0}
                                        onChange={(e) => onUpdateParticle?.(selectedParticle.id, { turbulence: parseInt(e.target.value) })}
                                        className="w-full accent-cyan-500 h-1"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Vorticity (Fluid)</label>
                                    <input 
                                        type="range" min="0" max="100" step="1"
                                        value={selectedParticle.vorticity || 0}
                                        onChange={(e) => onUpdateParticle?.(selectedParticle.id, { vorticity: parseInt(e.target.value) })}
                                        className="w-full accent-blue-500 h-1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Attraction</label>
                                    <input 
                                        type="range" min="-50" max="50" step="1"
                                        value={selectedParticle.attraction || 0}
                                        onChange={(e) => onUpdateParticle?.(selectedParticle.id, { attraction: parseInt(e.target.value) })}
                                        className="w-full accent-purple-500 h-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-[7px] text-zinc-500 uppercase font-mono tracking-widest">Noise Field Scale</label>
                                    <span className="text-[9px] font-mono text-zinc-400">{selectedParticle.noiseScale || 20}</span>
                                </div>
                                <input 
                                    type="range" min="1" max="100" step="1"
                                    value={selectedParticle.noiseScale || 20}
                                    onChange={(e) => onUpdateParticle?.(selectedParticle.id, { noiseScale: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-400 h-1"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Transfer Mode</label>
                                <select 
                                    value={selectedParticle.blendMode}
                                    onChange={(e) => onUpdateParticle?.(selectedParticle.id, { blendMode: e.target.value as any })}
                                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1 text-[8px] text-white outline-none"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="screen">Screen (Lighten)</option>
                                    <option value="add">Add (Glow)</option>
                                    <option value="overlay">Overlay</option>
                                    <option value="multiply">Multiply (Darken)</option>
                                    <option value="color_dodge">Color Dodge (Pro)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">Spread Angle</label>
                                <span className="text-[9px] font-mono text-white">{selectedParticle.spread}°</span>
                            </div>
                            <input 
                                type="range" min="0" max="360" step="1"
                                value={selectedParticle.spread}
                                onChange={(e) => onUpdateParticle?.(selectedParticle.id, { spread: parseInt(e.target.value) })}
                                className="w-full accent-blue-500"
                            />
                        </div>
                    </div>
                </Section>
            )}
        </div>
    </div>
  );
};

export default PropertiesPanel;
