import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, Download, X, Cpu, Globe, Zap, Layout, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  progress: number;
  onClose: () => void;
}

const RENDER_LOGS = [
  'Initializing Render...',
  'Caching frames...',
  'Syncing audio...',
  'Applying masking...',
  'Optimizing bitrate...',
  'Generating metadata...',
  'Synthesizing motion blur...',
  'Finalizing export...',
  'Export successful.',
];

const THUMBNAIL_VARIANTS = [
  { id: 'v1', label: 'Variant A: High Contrast', ctr: 5.8, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=112&fit=crop' },
  { id: 'v2', label: 'Variant B: Face Close-up', ctr: 4.2, url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=112&fit=crop' },
  { id: 'v3', label: 'Variant C: Text Overlay', ctr: 7.1, url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=112&fit=crop' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, progress, onClose }) => {
  const [logIndex, setLogIndex] = useState(0);
  const [exportMode, setExportMode] = useState<'single' | 'multi'>('single');

  useEffect(() => {
    if (isOpen) {
      const nextLogIndex = Math.min(
        Math.floor((progress / 100) * RENDER_LOGS.length),
        RENDER_LOGS.length - 1,
      );
      if (nextLogIndex > logIndex) {
        setLogIndex(nextLogIndex);
      }
    } else {
      setLogIndex(0);
    }
  }, [progress, isOpen, logIndex]);

  if (!isOpen) return null;

  const isComplete = progress >= 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white font-black uppercase tracking-tighter italic">
                  Exporting Project
                </h2>
                <p className="text-xs text-slate-500 font-mono">v4.0.2-stable // CUDA_ENABLED</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setExportMode('single')}
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${exportMode === 'single' ? 'bg-studio-accent text-black' : 'bg-white/5 text-zinc-500 border border-white/5'}`}
              >
                Single Export
              </button>
              <button 
                onClick={() => setExportMode('multi')}
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${exportMode === 'multi' ? 'bg-studio-accent text-black animate-pulse' : 'bg-white/5 text-zinc-500 border border-white/5'}`}
              >
                Multi-platform (1-Click)
              </button>
            </div>
            {isComplete && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close export modal"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-8">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * progress) / 100 }}
                    className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white italic">{progress}%</span>
                  <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest leading-none">
                    Complete
                  </span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    {isComplete ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                    )}
                    <span className="text-[10px] font-mono text-white uppercase tracking-widest">
                      {RENDER_LOGS[logIndex]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-5">
                    <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-500"
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[8px] font-mono text-slate-500 uppercase">
                        Process: {exportMode === 'multi' ? 'MULTI_PLATFORM_RENDER' : 'SINGLE_RENDER'}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 uppercase">
                        Thread: 0x8A2B
                      </span>
                    </div>
                  </div>
                </div>
                
                {exportMode === 'multi' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Globe className="w-3 h-3 text-studio-accent" />
                      <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Platform Sync Status</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['TikTok', 'Instagram', 'YouTube'].map((p, i) => (
                        <div key={i} className="p-2 bg-black/40 border border-white/5 rounded-lg flex flex-col items-center gap-1">
                          <span className="text-[7px] font-black text-zinc-500 uppercase">{p}</span>
                          <div className={`text-[8px] font-black uppercase ${progress > (i+1)*33 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                            {progress > (i+1)*33 ? 'READY' : 'WAITING'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Thumbnail Testing Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">A/B Thumbnail Variants</span>
                  </div>
                  <Sparkles className="w-3 h-3 text-studio-accent animate-pulse" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {THUMBNAIL_VARIANTS.map((variant) => (
                    <div key={variant.id} className="p-3 bg-zinc-900 border border-white/5 rounded-xl flex gap-3 group hover:border-studio-accent/30 transition-all">
                      <div className="w-24 h-14 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={variant.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <span className="text-[9px] font-black text-white uppercase leading-tight line-clamp-1">{variant.label}</span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[7px] text-zinc-500 uppercase font-mono">Predicted CTR</span>
                            <span className="text-[10px] font-black text-emerald-400">{variant.ctr}%</span>
                          </div>
                          <button
                            className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white"
                            aria-label={`Download ${variant.label} thumbnail`}
                            title="Download thumbnail"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 bg-purple-500/10 border border-purple-500/20 text-[9px] font-black uppercase text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all">
                  Generate 5 More Variants
                </button>
              </div>

              {isComplete && (
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                  <button className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-white/10 text-[9px] font-black uppercase text-zinc-400 hover:text-white hover:border-studio-accent transition-all rounded-lg">
                      <Download className="w-3 h-3" />
                      Export XML
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-white/10 text-[9px] font-black uppercase text-zinc-400 hover:text-white hover:border-studio-accent transition-all rounded-lg">
                      <Download className="w-3 h-3" />
                      Export EDL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3">
            {isComplete ? (
              <>
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-studio-accent text-black font-black uppercase italic rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  <Download className="w-5 h-5" />
                  Download {exportMode === 'multi' ? 'All Platforms (.zip)' : 'Final Asset'}
                </button>
                <p className="text-[8px] text-zinc-500 text-center uppercase font-mono">
                  Cloud Sync Active • Direct Publishing Enabled
                </p>
              </>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 text-white/40 font-black uppercase italic rounded-xl cursor-not-allowed"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                {exportMode === 'multi' ? 'Rendering Multi-format Stack...' : 'Processing Layers...'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
