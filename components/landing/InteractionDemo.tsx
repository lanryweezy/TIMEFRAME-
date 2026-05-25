import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';

export const InteractionDemo = () => {
  const [activeMode, setActiveMode] = useState('Quantum Scrub');
  const [progress, setProgress] = useState(45);

  return (
    <div className="glass rounded-[3rem] p-12 shadow-2xl border border-white/5 relative overflow-hidden group/demo">
      <div className="absolute inset-0 bg-blueprint opacity-[0.05] pointer-events-none" />
      
      <div className="absolute top-0 right-0 p-8 flex gap-6 z-20">
        <div className="flex items-center gap-3 text-[11px] font-mono text-electric-blue bg-electric-blue/10 px-4 py-2 rounded-full border border-electric-blue/20 backdrop-blur-md">
          <Cpu size={14} className="animate-pulse" /> 8K PRORES NATIVE
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-neon-purple bg-neon-purple/10 px-4 py-2 rounded-full border border-neon-purple/20 backdrop-blur-md">
          <Zap size={14} /> ZERO LATENCY SAB
        </div>
      </div>

      <div className="flex gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
        {['Quantum Scrub', 'AI Intent Edit', 'Neural Grade'].map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[.4em] transition-all ${
              activeMode === mode 
                ? 'bg-white text-black shadow-2xl scale-105' 
                : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="aspect-[16/7] bg-[#020202] rounded-[2.5rem] flex flex-col items-center justify-center border border-white/10 mb-12 relative overflow-hidden group">
        {/* Scanline Effect */}
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        
        <motion.div
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-neon-purple/10"
        />
        
        <div className="z-10 flex flex-col items-center gap-6">
          <Activity className="text-electric-blue animate-pulse" size={64} strokeWidth={1.5} />
          <span className="text-white font-black text-4xl tracking-tightest uppercase italic">
            {activeMode}
          </span>
          <div className="flex gap-10">
             {[
                { label: "Buffer", val: "0.0ms" },
                { label: "Sync", val: "Deterministic" },
                { label: "VRAM", val: "Allocated" }
             ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center">
                   <span className="text-[10px] font-black uppercase tracking-[.5em] text-white/20 mb-1">{stat.label}</span>
                   <span className="text-xs font-mono text-electric-blue">{stat.val}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Floating AI Agent Cursor snippet */}
        <motion.div 
          animate={{ x: [0, 150, -80, 0], y: [0, -50, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-12 h-12 bg-electric-blue/10 rounded-full blur-2xl z-20"
        />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-end px-4">
          <div className="flex items-center gap-3">
             <ShieldCheck size={14} className="text-electric-blue" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[.6em]">Quantum Timeline Architecture</span>
          </div>
          <span className="text-[11px] font-mono text-electric-blue font-bold tracking-widest">{Math.round(progress)}% NATIVE CACHE</span>
        </div>
        <div className="h-20 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 relative flex items-center px-8 shadow-inner overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex gap-2 items-center px-8 pointer-events-none">
            {[...Array(80)].map((_, i) => (
              <div key={i} className="flex-1 bg-white rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
          </div>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 800 }}
            onDrag={(_, info) =>
              setProgress((prev) => Math.min(100, Math.max(0, prev + info.offset.x / 8)))
            }
            className="w-1.5 h-16 bg-white rounded-full cursor-grab active:cursor-grabbing absolute z-30 shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
            style={{ left: `${progress}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full blur-xl opacity-0 group-hover/demo:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};


