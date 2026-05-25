import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Play, 
  Film,
  Zap,
  Activity
} from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';

export const SceneDetector: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'reviewing' | 'applying'>('idle');
  const [progress, setProgress] = useState(0);
  const [detectedScenes, setDetectedScenes] = useState<{ id: string; time: number; thumbnail: string }[]>([]);
  
  const store = useVideoStore();

  const startScan = () => {
    setStatus('scanning');
    setProgress(0);
    
    // Simulate Neural Scan
    const interval = setInterval(() => {
        setProgress(p => {
            if (p >= 100) {
                clearInterval(interval);
                setStatus('reviewing');
                // Mock detected scenes
                setDetectedScenes([
                    { id: '1', time: 1.2, thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200' },
                    { id: '2', time: 4.5, thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200' },
                    { id: '3', time: 8.9, thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200' },
                    { id: '4', time: 12.4, thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200' },
                ]);
                return 100;
            }
            return p + 2;
        });
    }, 50);
  };

  const applyCuts = () => {
    setStatus('applying');
    setTimeout(() => {
        // In a real app, we'd call store.splitClip() at these times
        store.setState({ isDetectingScenes: false });
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8 overflow-hidden animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-studio-accent/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-studio-accent" />
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Scene Detector</h3>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Frame-Accurate Saliency Mapping</span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
           <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div 
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-8 py-12 text-center"
                >
                    <div className="w-24 h-24 rounded-full bg-studio-accent/5 border border-studio-accent/20 flex items-center justify-center relative">
                         <div className="absolute inset-0 rounded-full animate-ping bg-studio-accent/5" />
                         <Film className="w-10 h-10 text-studio-accent" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Ready for Media Analysis</h4>
                        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                            Our neural engine will scan your footage for visual shifts, action peaks, and emotional transitions to find the perfect cut-points.
                        </p>
                    </div>
                    <button 
                        onClick={startScan}
                        className="px-8 py-4 bg-studio-accent text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--studio-accent-rgb),0.3)]"
                    >
                        Initiate Neural Scan
                    </button>
                </motion.div>
              )}

              {status === 'scanning' && (
                <motion.div 
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-8 py-12"
                >
                    <div className="relative">
                         <Activity className="w-20 h-20 text-studio-accent animate-pulse opacity-20" />
                         <Loader2 className="w-20 h-20 text-studio-accent animate-spin absolute inset-0" />
                    </div>
                    <div className="w-full max-w-xs space-y-3 text-center">
                        <div className="text-4xl font-black text-white italic">{progress}%</div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                             <motion.div 
                                className="h-full bg-studio-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                             />
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Mapping story beats...</p>
                    </div>
                </motion.div>
              )}

              {status === 'reviewing' && (
                <motion.div 
                    key="reviewing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Detected Transitions ({detectedScenes.length})</h4>
                         <span className="text-[10px] font-bold text-studio-accent uppercase tracking-widest">Select to Review</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {detectedScenes.map((scene, i) => (
                            <div key={scene.id} className="group relative aspect-video bg-black rounded-xl overflow-hidden border border-white/5 hover:border-studio-accent/40 transition-all cursor-pointer">
                                <img src={scene.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-2 left-3 flex flex-col">
                                     <span className="text-[9px] font-black text-white uppercase tracking-tighter italic">Scene {i + 1}</span>
                                     <span className="text-[8px] font-mono text-zinc-400">{scene.time.toFixed(2)}s</span>
                                </div>
                                <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Play className="w-3 h-3 text-white fill-white" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex gap-3">
                         <button 
                            onClick={() => setStatus('idle')}
                            className="flex-1 py-4 bg-white/5 text-zinc-500 text-[10px] font-black uppercase rounded-2xl border border-white/5 hover:text-white"
                         >
                            Discard
                         </button>
                         <button 
                            onClick={applyCuts}
                            className="flex-1 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500"
                         >
                            Apply Neural Slicing
                         </button>
                    </div>
                </motion.div>
              )}

              {status === 'applying' && (
                <motion.div 
                    key="applying"
                    className="flex flex-col items-center gap-8 py-12 text-center"
                >
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-in zoom-in-50 duration-500" />
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-white uppercase italic">Surgical Splitting Active</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Hard-cutting timeline segments...</p>
                    </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer Metrics */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
             <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[8px] font-mono text-zinc-600 uppercase">GPU: CUDA_v4</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <span className="text-[8px] font-mono text-zinc-600 uppercase">Model: StoryBeats_v2</span>
                 </div>
             </div>
             <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest italic">Deterministic Output v1.0</span>
        </div>
      </div>
    </div>
  );
};
