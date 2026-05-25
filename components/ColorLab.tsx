import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Sun, 
  Contrast, 
  CircleDot, 
  Thermometer, 
  Maximize, 
  Wand2, 
  Eye, 
  EyeOff, 
  X,
  Target,
  Waves,
  Zap,
  Activity,
  Aperture,
  Droplets,
  Spline
} from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';
import { VideoAdjustment, FilterPreset } from '@/types';

interface ColorWheelProps {
  label: string;
  value: { x: number; y: number };
  intensity: number;
  onChange: (pos: { x: number; y: number }, intensity: number) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ label, value, intensity, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative w-40 h-40 rounded-full border-2 border-white/5 bg-zinc-950 flex items-center justify-center cursor-crosshair hover:border-studio-accent/30 transition-all shadow-2xl overflow-hidden">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] opacity-[0.08]" />
        <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
        <div className="absolute inset-12 rounded-full border border-white/[0.01]" />
        
        {/* The Dot */}
        <motion.div 
            className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_white] absolute z-10 border border-black/50"
            animate={{ x: value.x * 60, y: value.y * 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
        
        {/* Crosshair Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white" />
        </div>
      </div>

      <div className="w-full space-y-2 px-2">
         <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{label}</span>
            <span className="text-[9px] font-mono text-studio-accent">{(intensity * 100).toFixed(0)}%</span>
         </div>
         <input 
            type="range" min="0" max="1" step="0.01" value={intensity} 
            onChange={(e) => onChange(value, parseFloat(e.target.value))}
            className="w-full h-1 bg-white/5 rounded-full accent-studio-accent"
         />
      </div>
    </div>
  );
};

const CurveEditor: React.FC = () => (
    <div className="h-full bg-zinc-950/50 border border-white/5 rounded-2xl relative overflow-hidden p-6 group">
        <div className="absolute inset-0 pattern-grid-lg opacity-[0.03]" />
        <div className="relative w-full h-full border border-white/10 rounded-lg flex items-center justify-center">
            <svg className="w-full h-full overflow-visible">
                <path d="M 0,100 Q 50,50 100,0" className="stroke-studio-accent stroke-2 fill-none opacity-50" style={{ vectorEffect: 'non-scaling-stroke' }} />
                <circle cx="0%" cy="100%" r="4" className="fill-studio-accent shadow-xl" />
                <circle cx="50%" cy="50%" r="4" className="fill-studio-accent shadow-xl" />
                <circle cx="100%" cy="0%" r="4" className="fill-studio-accent shadow-xl" />
            </svg>
            <div className="absolute top-2 left-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest">Luminance Curve</div>
        </div>
    </div>
);

export const ColorLab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const store = useVideoStore();
  const { videoClips, selectedClipId, adjustment, updateClip } = store;
  
  const selectedClip = useMemo(() => 
    videoClips.find(c => c.id === selectedClipId),
    [videoClips, selectedClipId]
  );

  const activeAdj = selectedClip?.adjustment || adjustment;

  const handleUpdate = (updates: Partial<VideoAdjustment>) => {
    if (selectedClip) {
        updateClip(selectedClip.id, { adjustment: { ...activeAdj, ...updates } } as any);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#020202]/98 backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Palette className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Cinema Color Lab</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">
                {selectedClip ? `Mastering: ${selectedClip.name}` : 'Project Primary Correction'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
                onClick={() => store.setState({ ghostMode: !store.ghostMode })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${store.ghostMode ? 'bg-studio-accent/20 border-studio-accent text-studio-accent' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'}`}
           >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Compare</span>
           </button>
           <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Primary Wheels & Curves */}
        <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[400px]">
                <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
                    <ColorWheel label="Lift" value={{x: 0.1, y: 0.2}} intensity={0.5} onChange={() => {}} />
                    <ColorWheel label="Gamma" value={{x: -0.1, y: -0.1}} intensity={0.4} onChange={() => {}} />
                    <ColorWheel label="Gain" value={{x: 0, y: -0.3}} intensity={0.6} onChange={() => {}} />
                </div>
                <CurveEditor />
            </div>

            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Exposure', icon: Sun, prop: 'brightness', unit: '%' },
                    { label: 'Contrast', icon: Contrast, prop: 'contrast', unit: '%' },
                    { label: 'Saturation', icon: CircleDot, prop: 'saturation', unit: '%' },
                    { label: 'Warmth', icon: Thermometer, prop: 'hue', unit: '°' },
                ].map((c) => (
                    <div key={c.prop} className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-4 group hover:border-studio-accent/20 transition-all">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <c.icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-studio-accent transition-colors" />
                                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{c.label}</span>
                            </div>
                            <span className="text-[11px] font-mono text-white">{(activeAdj as any)[c.prop]}{c.unit}</span>
                        </div>
                        <input 
                            type="range" min="0" max="200" value={(activeAdj as any)[c.prop]} 
                            onChange={(e) => handleUpdate({ [c.prop]: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/5 rounded-full accent-studio-accent"
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Scopes & Secondary Controls */}
        <div className="w-[450px] border-l border-white/5 bg-zinc-950/50 p-8 flex flex-col gap-8">
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-studio-accent" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Signal Scopes</h3>
                    </div>
                    <div className="flex gap-2">
                        {['WFM', 'PAR', 'VEC'].map(s => (
                            <button key={s} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[8px] font-black text-zinc-600 hover:text-white transition-all">{s}</button>
                        ))}
                    </div>
                </div>
                
                <div className="h-64 bg-black border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 flex items-end gap-[2px] p-4 opacity-40">
                         {Array.from({ length: 60 }).map((_, i) => (
                             <div key={i} className="flex-1 bg-studio-accent/60" style={{ height: `${20 + Math.random() * 60}%` }} />
                         ))}
                    </div>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="px-2 py-1 bg-black/60 rounded text-[7px] font-mono text-zinc-500 uppercase border border-white/5">0-100 IRE</div>
                        <div className="px-2 py-1 bg-black/60 rounded text-[7px] font-mono text-zinc-500 uppercase border border-white/5">Rec.709 Space</div>
                    </div>
                </div>
            </section>

            <section className="space-y-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                    <Zap className="w-4 h-4 text-studio-accent" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Neural Grading</h3>
                </div>

                <div className="flex-1 space-y-3">
                    <button className="w-full py-4 bg-studio-accent/10 border border-studio-accent/20 rounded-2xl flex flex-col items-center gap-1 hover:bg-studio-accent/20 transition-all">
                        <Wand2 className="w-5 h-5 text-studio-accent animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI Color Match</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: 'Sky Blueing', icon: Droplets },
                            { label: 'Skin Retouch', icon: Aperture },
                            { label: 'HDR Expand', icon: Maximize },
                            { label: 'Grain Inject', icon: Spline },
                        ].map(t => (
                            <button key={t.label} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:border-white/10 transition-all">
                                <t.icon className="w-4 h-4 text-zinc-500" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3">
                    <button className="py-4 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Reset Grade</button>
                    <button className="py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Save Preset</button>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};
