import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Settings, 
  Play, 
  Cpu, 
  HardDrive, 
  Globe, 
  ShieldCheck, 
  Smartphone,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';
import { useVideoEditor } from '@/hooks/useVideoEditor';

export const ExportLab: React.FC = () => {
  const state = useVideoStore();
  const { handleExport, handleResetExport } = useVideoEditor();
  const [selectedFormat, setSelectedFormat] = useState<'h264' | 'prores' | 'vp9'>('h264');
  const [selectedPreset, setSelectedFormatPreset] = useState<'high' | 'medium' | 'low'>('high');
  const [platformOptimization, setPlatform] = useState<'none' | 'youtube' | 'tiktok' | 'instagram'>('none');

  const estimatedSize = useMemo(() => {
    const base = state.duration * (selectedFormat === 'prores' ? 50 : 5);
    const multiplier = selectedPreset === 'high' ? 1.5 : selectedPreset === 'low' ? 0.5 : 1;
    return (base * multiplier).toFixed(1);
  }, [state.duration, selectedFormat, selectedPreset]);

  const FORMATS = [
    { id: 'h264', label: 'H.264 / MP4', desc: 'Standard compression, high compatibility' },
    { id: 'prores', label: 'Apple ProRes 422', desc: 'Professional mastering, near-lossless' },
    { id: 'vp9', label: 'VP9 / WebM', desc: 'Modern web codec, superior efficiency' },
  ];

  const PLATFORMS = [
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'tiktok', label: 'TikTok', icon: Smartphone, color: 'text-studio-accent' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'none', label: 'Generic', icon: Globe, color: 'text-zinc-500' },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-[#020202] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Share2 className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">Export Lab</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">Final Master & Delivery Engine</p>
          </div>
        </div>
        
        <button 
          onClick={() => state.applyLayoutPreset('editing')}
          className="px-4 py-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors"
        >
          Return to Editor
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Render Settings */}
        <div className="w-[450px] border-r border-white/5 bg-zinc-950/20 p-8 overflow-y-auto space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-zinc-600" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Mastering Settings</h3>
            </div>
            
            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Video Codec</label>
              <div className="grid grid-cols-1 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedFormat === f.id ? 'bg-rose-500/10 border-rose-500 text-white' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'}`}
                  >
                    <span className="text-[11px] font-black uppercase block">{f.label}</span>
                    <span className="text-[9px] opacity-60 mt-1 block">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Platform Optimization</label>
              <div className="grid grid-cols-4 gap-2">
                {PLATFORMS.map((p) => {
                  const Icon = p.icon;
                  const isActive = platformOptimization === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id as any)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isActive ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? p.color : 'text-zinc-600'}`} />
                      <span className={`text-[8px] font-black uppercase ${isActive ? 'text-white' : 'text-zinc-700'}`}>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <HardDrive className="w-4 h-4 text-zinc-600" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">File Estimates</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black border border-white/5 rounded-xl">
                <span className="text-[8px] font-bold text-zinc-600 uppercase">Estimated Size</span>
                <div className="text-2xl font-black text-white mt-1">{estimatedSize} <span className="text-xs text-zinc-500">MB</span></div>
              </div>
              <div className="p-4 bg-black border border-white/5 rounded-xl">
                <span className="text-[8px] font-bold text-zinc-600 uppercase">Est. Render Time</span>
                <div className="text-2xl font-black text-white mt-1">~{(state.duration * 0.4).toFixed(0)} <span className="text-xs text-zinc-500">SEC</span></div>
              </div>
            </div>
          </section>
          
          <div className="pt-8">
            <button 
              onClick={handleExport}
              className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_40px_rgba(225,29,72,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-white" />
              Initiate Master Render
            </button>
            <p className="text-[8px] text-center text-zinc-600 font-bold uppercase mt-4 tracking-widest">
              Hardware acceleration: <span className="text-emerald-500">Active (WebGPU)</span>
            </p>
          </div>
        </div>

        {/* Right: Render Preview */}
        <div className="flex-1 bg-black p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Final Master Preview</span>
             </div>
             <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-mono">
                <span>1920x1080 @ 24fps</span>
                <span>REC.709</span>
             </div>
          </div>

          <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-zinc-950 group">
             {/* Virtual Viewport */}
             <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="w-full h-full relative border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                   {/* This is where the actual preview should go, but for the UI we simulation */}
                   <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
                      <Play className="w-20 h-20 text-white/5" />
                   </div>
                   
                   {/* Safe Zone Overlays based on platform */}
                   {platformOptimization === 'tiktok' && (
                      <div className="absolute inset-0 pointer-events-none">
                         <div className="absolute inset-[15%] border border-dashed border-rose-500/20" />
                         <div className="absolute bottom-8 left-8 space-y-2 opacity-40">
                            <div className="w-32 h-2 bg-white/20 rounded" />
                            <div className="w-24 h-2 bg-white/20 rounded" />
                         </div>
                      </div>
                   )}
                </div>
             </div>

             <div className="absolute bottom-8 right-8 flex gap-3">
                <div className="p-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                   <div className="flex flex-col items-center">
                      <span className="text-[7px] text-zinc-500 font-black uppercase">Parity</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   </div>
                   <div className="w-px h-6 bg-white/10" />
                   <div className="flex flex-col items-center">
                      <span className="text-[7px] text-zinc-500 font-black uppercase">GPU</span>
                      <Cpu className="w-4 h-4 text-blue-400" />
                   </div>
                </div>
             </div>
          </div>

          {/* Bottom Bar: Export Log (Condensed) */}
          <div className="h-24 bg-zinc-900/50 rounded-2xl border border-white/5 p-4 flex flex-col gap-2">
             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Engine Pipeline Log</span>
             <div className="flex-1 font-mono text-[8px] text-zinc-600 overflow-hidden space-y-1">
                <div>[00:00:01] ⚡ WebGPU Pipeline Primed for Cine-HQ rendering</div>
                <div>[00:00:01] 🧩 Checking Asset determinism... <span className="text-emerald-500">PASSED</span></div>
                <div>[00:00:02] 📦 Codec: libx264 selected for H.264 delivery</div>
                <div className="animate-pulse">[READY] Awaiting user trigger...</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
