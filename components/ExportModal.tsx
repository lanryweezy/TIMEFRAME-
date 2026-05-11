import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, Download, X, Cpu, Globe, Zap } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    progress: number;
    onClose: () => void;
}

const RENDER_LOGS = [
    "Initializing Render...",
    "Caching frames...",
    "Syncing audio...",
    "Applying masking...",
    "Optimizing bitrate...",
    "Generating metadata...",
    "Synthesizing motion blur...",
    "Finalizing export...",
    "Export successful."
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, progress, onClose }) => {
    const [logIndex, setLogIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            const nextLogIndex = Math.min(
                Math.floor((progress / 100) * RENDER_LOGS.length),
                RENDER_LOGS.length - 1
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
                    className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                                <Cpu className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-white font-black uppercase tracking-tighter italic">Exporting Project</h2>
                                <p className="text-xs text-slate-500 font-mono">v4.0.2-stable // CUDA_ENABLED</p>
                            </div>
                        </div>
                        {isComplete && (
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <div className="flex flex-col items-center justify-center py-10">
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
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white italic">{progress}%</span>
                                    <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest leading-none">Complete</span>
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        {isComplete ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />}
                                        <span className="text-[10px] font-mono text-white uppercase tracking-widest">{RENDER_LOGS[logIndex]}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 px-5">
                                        <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-cyan-500"
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[8px] font-mono text-slate-500 uppercase">Process: EXPORT_RENDER</span>
                                            <span className="text-[8px] font-mono text-slate-500 uppercase">Thread: 0x8A2B</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {[
                                { label: 'TikTok Ready', color: 'bg-black text-white hover:bg-zinc-800' },
                                { label: 'YouTube Shorts', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
                                { label: 'IG Reels', color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' }
                            ].map((p, i) => (
                                <button key={i} className={`px-3 py-1.5 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-tighter transition-all ${p.color}`}>
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                <Globe className="w-3 h-3 text-blue-400" />
                                <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">ProRes 422</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">Hardware Accel</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3">
                        {isComplete ? (
                            <>
                                <button 
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-yellow-500 text-black font-black uppercase italic rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Final Asset
                                </button>
                                <p className="text-[8px] text-zinc-500 text-center uppercase font-mono">Cloud Sync Active</p>
                            </>
                        ) : (
                            <button 
                                disabled
                                className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 text-white/40 font-black uppercase italic rounded-xl cursor-not-allowed"
                            >
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Layers...
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
