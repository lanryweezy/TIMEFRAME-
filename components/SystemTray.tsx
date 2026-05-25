import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Zap, 
    Sparkles, 
    Activity, 
    Cpu, 
    Database, 
    Shield, 
    Wand2, 
    Brain,
    Cloud
} from 'lucide-react';
import { VideoState } from '../types';

interface SystemTrayProps {
  state: VideoState;
}

const ACTIVE_TASKS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  isAnalyzing: { label: 'Analyzing', icon: Activity, color: 'text-blue-400' },
  isGenerating: { label: 'Exporting', icon: Zap, color: 'text-studio-accent' },
  isEnhancing: { label: 'Enhancing', icon: Sparkles, color: 'text-yellow-400' },
  isStabilizing: { label: 'Stabilizing', icon: Shield, color: 'text-cyan-400' },
  isRemovingBackground: { label: 'Rotoscope', icon: Wand2, color: 'text-emerald-400' },
  isDetectingScenes: { label: 'Vision', icon: Cpu, color: 'text-indigo-400' },
  isGeneratingAvatar: { label: 'Neural Actor', icon: Brain, color: 'text-orange-400' },
  isOptimizingPacing: { label: 'Rhythm', icon: Activity, color: 'text-pink-400' },
  isTranslating: { label: 'Universal Sync', icon: Database, color: 'text-purple-400' },
  isStoryboarding: { label: 'Narrative', icon: Sparkles, color: 'text-amber-400' },
};

export const SystemTray: React.FC<SystemTrayProps> = ({ state }) => {
  const activeTasks = Object.entries(ACTIVE_TASKS_CONFIG)
    .filter(([key]) => (state as any)[key] === true)
    .map(([_, config]) => config);

  if (activeTasks.length === 0) {
    return (
      <div className="h-8 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 select-none">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Engine Ready</span>
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-2">
                <Cloud className="w-3 h-3 text-zinc-700" />
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tight">Sync Active</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-zinc-700 uppercase">GPU_ACCEL: ON</span>
            <span className="text-[9px] font-mono text-zinc-700 uppercase">BUFFER_LOAD: 12%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-studio-accent/5 backdrop-blur-2xl border-t border-studio-accent/20 flex items-center justify-between px-6 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-studio-accent/5 via-transparent to-transparent opacity-50" />
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="flex items-center gap-3">
            <div className="flex gap-1 items-end h-3">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 bg-studio-accent rounded-full"
                    />
                ))}
            </div>
            <span className="text-[11px] font-black uppercase text-white tracking-widest italic">
                Neural Cluster Active
            </span>
        </div>

        <div className="w-[1px] h-4 bg-white/10" />

        <div className="flex items-center gap-4">
            <AnimatePresence mode="popLayout">
                {activeTasks.map((task) => (
                    <motion.div
                        key={task.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 ${task.color}`}
                    >
                        <task.icon className="w-3.5 h-3.5 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-tight">{task.label}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-5 relative z-10">
        <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-studio-accent uppercase tracking-widest animate-pulse">
                Processing...
            </span>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <motion.div 
                    animate={{ x: [-128, 128] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-studio-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
            </div>
        </div>
        <div className="w-[1px] h-4 bg-white/10" />
        <div className="flex items-center gap-2 text-zinc-500">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[9px] font-mono font-bold">X-ENGINE v4.0</span>
        </div>
      </div>
    </div>
  );
};
