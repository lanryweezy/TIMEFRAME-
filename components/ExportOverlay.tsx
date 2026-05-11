
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState } from '../types';
import { Download, Loader2, CheckCircle2, AlertCircle, Cpu, Zap, Activity, HardDrive, Target, Gauge, X } from 'lucide-react';

interface ExportOverlayProps {
  state: VideoState;
  onClose: () => void;
  onDownload: () => void;
  onSeek: (time: number) => void;
}

const ExportOverlay: React.FC<ExportOverlayProps> = ({ state, onClose, onDownload, onSeek }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'preparing' | 'processing' | 'finishing' | 'complete'>('preparing');
  const [log, setLog] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    gpuLoad: 45,
    temp: 62,
    fps: 0,
    framesProcessed: 0
  });

  const totalFrames = Math.round(state.duration * 30);
  const originalTime = useRef(state.currentTime);

  useEffect(() => {
    const addLog = (msg: string) => setLog(prev => [msg, ...prev.slice(0, 10)]);

    let frameCount = 0;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const currentProgress = (frameCount / totalFrames) * 100;

      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
        onSeek(originalTime.current);
        setProgress(100);
        return;
      }

      if (currentProgress < 15) setStatus('preparing');
      else if (currentProgress < 85) setStatus('processing');
      else setStatus('finishing');

      // Actual seek to drive the preview
      const targetTime = (frameCount / totalFrames) * state.duration;
      onSeek(targetTime);

      // Analyze complexity at this time
      const activeClipsCount = state.videoClips.filter(c => targetTime >= c.startTime && targetTime <= c.startTime + c.duration).length;
      const activeEffectsCount = state.effectTrack.filter(e => targetTime >= e.startTime && targetTime <= e.startTime + e.duration).length;
      const complexityFactor = 1 + (activeClipsCount * 0.5) + (activeEffectsCount * 0.8);

      // Metrics logic
      setMetrics(m => ({
          ...m,
          gpuLoad: Math.min(100, 40 + (complexityFactor * 15) + Math.random() * 10),
          temp: 65 + (complexityFactor * 3) + Math.random() * 5,
          fps: Math.round(30 / complexityFactor),
          framesProcessed: frameCount
      }));

           if (Math.random() > 0.9) {
          const msgs = [
              `Processing video layers...`,
              `Applying ${state.activeFilter} look...`,
              `Updating video frames @ ${targetTime.toFixed(2)}s`,
              `Saving frame ${frameCount} details`,
              `Adjusting quality for video complexity`,
              `Processing audio settings...`
          ];
          addLog(msgs[Math.floor(Math.random() * msgs.length)]);
      }

      // Render "speed" depends on complexity
      frameCount += Math.max(1, Math.floor(4 / complexityFactor));
      
      setProgress(Math.min(100, currentProgress));
    }, 50);

    return () => {
        clearInterval(interval);
        onSeek(originalTime.current);
    };
  }, [state, totalFrames, state.duration, onSeek]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 -right-4 md:-right-12 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all z-50"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Left: Metadata & Status */}
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Export Progress</h1>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Saving Video</h2>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded border border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                        <span>Project</span>
                        <span className="text-white">{state.projectName || 'Untitled'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                        <span>Resolution</span>
                        <span className="text-white">{state.aspectRatio === '9:16' ? '1080x1920' : '1920x1080'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                        <span>Format</span>
                        <span className="text-cyan-400">ProRes 422 (HQ)</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                        <span>Duration</span>
                        <span className="text-white">{state.duration.toFixed(2)}s</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[8px] font-black text-slate-600 uppercase tracking-widest">System Info</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-black border border-white/5 rounded space-y-1">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Cpu className="w-3 h-3" />
                                <span className="text-[8px] font-sans uppercase tracking-tighter">PC Speed</span>
                            </div>
                            <div className="text-lg font-black text-white">{Math.round(metrics.gpuLoad)}%</div>
                        </div>
                        <div className="p-3 bg-black border border-white/5 rounded space-y-1">
                            <div className="flex items-center gap-2 text-orange-400">
                                <Activity className="w-3 h-3" />
                                <span className="text-[8px] font-sans uppercase tracking-tighter">Heat</span>
                            </div>
                            <div className="text-lg font-black text-white">{Math.round(metrics.temp)}°C</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Tasks Running</h3>
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${status === 'processing' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'}`} />
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                        className="h-full bg-slate-600"
                                        animate={{ width: status === 'processing' ? `${40 + Math.random() * 60}%` : '0%' }}
                                        transition={{ duration: 0.2 }}
                                     />
                                </div>
                                <span className="text-[6px] font-sans text-slate-600 uppercase">Task_{i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Center: Main Visuals */}
        <div className="md:col-span-2 space-y-8">
            <div className="relative aspect-video bg-black rounded-lg border border-white/10 overflow-hidden ring-1 ring-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.1)]">
                {/* Visual Simulation of Rendering */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-x-0 h-[1px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_2s_linear_infinite]" style={{ top: `${progress}%` }} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {status === 'complete' ? (
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4 text-emerald-400"
                            >
                                <CheckCircle2 className="w-16 h-16" />
                                <span className="text-[12px] font-black tracking-[0.8em] uppercase">Render Finished</span>
                            </motion.div>
                        ) : (
                            <motion.div 
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-8 w-full px-12"
                            >
                                <div className="text-center space-y-2">
                                    <div className="text-[9px] font-sans text-blue-400 tracking-[0.4em] uppercase animate-pulse">
                                        {status === 'preparing' ? 'Getting everything ready' : status === 'processing' ? 'Generating video' : 'Saving file'}
                                    </div>
                                    <div className="text-6xl font-black text-white italic tracking-tighter">
                                        {Math.round(progress)}%
                                    </div>
                                </div>

                                <div className="w-full space-y-2">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full"
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 tracking-widest">
                                        <span>FRAME {metrics.framesProcessed} / {totalFrames}</span>
                                        <span>{metrics.fps} FPS</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Radar/Hud corners */}
                <div className="absolute top-4 left-4 p-2 border-l border-t border-white/20" />
                <div className="absolute top-4 right-4 p-2 border-r border-t border-white/20" />
                <div className="absolute bottom-4 left-4 p-2 border-l border-b border-white/20" />
                <div className="absolute bottom-4 right-4 p-2 border-r border-b border-white/20" />
            </div>

            {/* Bottom Log & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-500" /> Internal Status
                    </h3>
                    <div className="h-32 bg-black rounded border border-white/5 p-4 overflow-y-hidden font-sans text-[8px] leading-relaxed select-none">
                        <div className="space-y-1">
                            {log.map((entry, i) => (
                                <div key={i} className={`${i === 0 ? 'text-white font-bold' : 'text-slate-600'} transition-all`}>
                                    <span className="text-slate-800 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    {entry}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-end gap-3">
                    <AnimatePresence>
                        {status === 'complete' ? (
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                onClick={onDownload}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all"
                            >
                                <Download className="w-4 h-4" /> Save Video
                            </motion.button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-[#1a1a1a] hover:bg-[#222] text-white/50 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] rounded transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExportOverlay;
