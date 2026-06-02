import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState, AudioBlock } from '../types';
import { audioEngine } from '../lib/audioEngine';
import {
  Volume2,
  Music,
  Mic2,
  Waves,
  Activity,
  Zap,
  Sparkles,
  Ear,
  Radio,
  Layers,
  Sliders,
  Wind,
  Shield,
  Target,
  Plus,
  Scissors,
  Play,
  SkipBack,
  SkipForward,
  Settings,
  BarChart,
  Headphones,
  Speaker,
  MessageSquare,
  TrendingUp,
  Brain,
  ChevronRight,
  ChevronDown,
  Pause
} from 'lucide-react';

interface AudioPanelProps {
  state: VideoState;
  onUpdateAudio?: (id: string, updates: Partial<AudioBlock>) => void;
  handleSendMessage: (msg: string) => void;
}

const AutomationEditor = ({ 
    audio, 
    onUpdate 
}: { 
    audio: AudioBlock, 
    onUpdate: (updates: Partial<AudioBlock>) => void 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keyframes = audio.automation?.volume || [{ id: 'initial', time: 0, value: audio.volume }];

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        
        const newTime = x * audio.duration;
        const newValue = y * 200; // 0-200% volume

        const newKeyframes = [...keyframes, { id: Math.random().toString(36), time: newTime, value: newValue }]
            .sort((a, b) => a.time - b.time);
        
        onUpdate({ automation: { ...audio.automation, volume: newKeyframes } });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();

        keyframes.forEach((kf, i) => {
            const x = (kf.time / audio.duration) * canvas.width;
            const y = canvas.height - (kf.value / 200) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            // Draw node
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.moveTo(x, y);
        });
        ctx.stroke();
    }, [keyframes, audio.duration]);

    return (
        <div className="relative h-24 bg-zinc-950/50 rounded-xl border border-white/5 overflow-hidden group/auto">
            <div className="absolute top-2 left-3 flex items-center gap-2">
                <TrendingUp className="w-2.5 h-2.5 text-studio-accent" />
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Volume Automation</span>
            </div>
            <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className="w-full h-full cursor-crosshair" 
                width={400} 
                height={100} 
            />
        </div>
    );
};

const SpectrumVisualizer = ({ audioId, isExpanded }: { audioId: string, isExpanded: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isExpanded || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const render = () => {
            const data = audioEngine.getFrequencyData(audioId);
            if (data) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
                const barWidth = (canvas.width / data.length) * 2.5;
                let x = 0;
                for (let i = 0; i < data.length; i++) {
                    const barHeight = (data[i] / 255) * canvas.height;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            }
            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [audioId, isExpanded]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" 
            width={300} 
            height={100} 
        />
    );
};

const AudioPanel: React.FC<AudioPanelProps> = ({ 
  state, 
  onUpdateAudio,
  handleSendMessage 
}) => {
  const [activeTab, setActiveTab] = useState<'mixer' | 'ai' | 'fx' | 'library'>('mixer');
  const [masterLevel, setMasterLevel] = useState(0);

  // Real-time Master Level Monitoring
  useEffect(() => {
    let animationFrame: number;
    const updateLevel = () => {
      // Use the high-precision LUFS value from the AudioWorklet
      const lufs = audioEngine.getMasterLUFS();
      // Map LUFS (-60 to 0) to 0-1 range for the visual meter
      const normalized = Math.max(0, (lufs + 60) / 60);
      setMasterLevel(normalized);
      animationFrame = requestAnimationFrame(updateLevel);
    };
    updateLevel();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const audioTracks = useMemo(() => state.audioTrack || [], [state.audioTrack]);

  const AudioTrackControl = ({
    audio,
    color,
  }: {
    audio: AudioBlock;
    color: string;
  }) => {
    const [isEqExpanded, setIsEqExpanded] = useState(false);
    const [isAutoExpanded, setIsAutoExpanded] = useState(false);
    const eqBands = (audio as any).eqBands || [0, 0, 0, 0, 0];

    const handleEqChange = (index: number, value: number) => {
        const newBands = [...eqBands];
        newBands[index] = value;
        onUpdateAudio?.(audio.id, { eqBands: newBands } as any);
    };

    return (
      <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-studio-accent/30 transition-all group shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color} bg-opacity-10 ring-1 ring-inset ring-white/5`}>
              {audio.type === 'music' ? <Music className="w-4 h-4 text-purple-400" /> : 
               audio.type === 'voiceover' ? <Mic2 className="w-4 h-4 text-studio-accent" /> : 
               <Waves className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-black uppercase tracking-tight text-white/90 truncate max-w-[120px]">
                {audio.name}
              </span>
              <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{audio.type}</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => { setIsEqExpanded(!isEqExpanded); setIsAutoExpanded(false); }}
              className={`w-7 h-7 rounded-lg border border-white/5 flex items-center justify-center transition-all ${isEqExpanded ? 'bg-studio-accent text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              title="Parametric EQ + Spectrum"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setIsAutoExpanded(!isAutoExpanded); setIsEqExpanded(false); }}
              className={`w-7 h-7 rounded-lg border border-white/5 flex items-center justify-center transition-all ${isAutoExpanded ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              title="Automation Curves"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-zinc-800 border border-white/5 text-[9px] font-black hover:bg-studio-accent hover:text-black transition-all">
              M
            </button>
          </div>
        </div>

        <AnimatePresence>
            {isAutoExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                >
                    <AutomationEditor 
                        audio={audio} 
                        onUpdate={(updates) => onUpdateAudio?.(audio.id, updates)} 
                    />
                </motion.div>
            )}
            {isEqExpanded && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                >
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between gap-2 h-32 items-end pb-6 relative overflow-hidden">
                        <SpectrumVisualizer audioId={audio.id} isExpanded={isEqExpanded} />
                        <div className="absolute top-2 left-3 flex items-center gap-2 z-10">
                             <Activity className="w-2.5 h-2.5 text-studio-accent" />
                             <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">5-Band Parametric EQ + Spectral Analysis</span>
                        </div>
                        {['80Hz', '250Hz', '1kHz', '4kHz', '12kHz'].map((label, i) => (
                            <div key={label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group/eq z-10">
                                <div className="w-1 h-full bg-zinc-800 rounded-full relative">
                                    <div 
                                        className="absolute inset-x-0 bg-studio-accent rounded-full opacity-30" 
                                        style={{ 
                                            bottom: '50%', 
                                            height: `${Math.abs(eqBands[i]) * 2.5}%`,
                                            transform: eqBands[i] < 0 ? 'scaleY(-1)' : 'scaleY(1)',
                                            transformOrigin: 'bottom'
                                        }} 
                                    />
                                    <input 
                                        type="range"
                                        min="-20"
                                        max="20"
                                        step="0.5"
                                        value={eqBands[i]}
                                        onChange={(e) => handleEqChange(i, parseFloat(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10"
                                        style={{ writingMode: 'vertical-lr' as any, transform: 'rotate(180deg)' }}
                                    />
                                    <div 
                                        className="absolute left-1/2 -translate-x-1/2 w-3 h-1.5 bg-white rounded-full shadow-lg group-hover/eq:scale-125 transition-transform"
                                        style={{ bottom: `${50 + (eqBands[i] * 2.5)}%` }}
                                    />
                                </div>
                                <span className="text-[6px] font-bold text-zinc-600 uppercase">{label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="h-12 bg-black/60 rounded-xl border border-white/5 relative overflow-hidden mb-4 group-hover:border-studio-accent/20 transition-all">
          <div className="absolute inset-0 flex items-center gap-[1px] px-2 opacity-30">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${audio.type === 'voiceover' ? 'bg-studio-accent' : audio.type === 'music' ? 'bg-purple-500' : 'bg-cyan-500'} h-full min-w-[1px]`}
                style={{ height: `${10 + Math.random() * 80}%` }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-zinc-500 tracking-widest">
                <span>Volume</span>
                <span className="text-studio-accent font-mono">{audio.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={audio.volume}
                onChange={(e) => onUpdateAudio?.(audio.id, { volume: parseInt(e.target.value) })}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent hover:accent-white transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-zinc-500 tracking-widest">
                <span>Panning</span>
                <span className="text-zinc-400 font-mono">{(audio as any).pan || 0}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={(audio as any).pan || 0}
                onChange={(e) => onUpdateAudio?.(audio.id, { pan: parseInt(e.target.value) } as any)}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 hover:accent-studio-accent transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-studio-bg text-white select-none studio-scrollbar overflow-hidden">
      <div className="p-5 bg-zinc-950/80 border-b border-studio-border backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-studio-accent rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">
              Multitrack Mixer
            </h2>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase text-zinc-500">LUFS Radar</span>
                <span className={`text-[10px] font-mono ${audioEngine.getMasterLUFS() > -14 ? 'text-red-500' : 'text-studio-accent'}`}>
                    {audioEngine.getMasterLUFS().toFixed(1)} LUFS
                </span>
             </div>
             <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
                <Settings className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {[1, 2].map(ch => (
            <div key={ch} className="h-2 rounded-full bg-black/60 p-[1px] border border-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-studio-accent via-studio-accent to-red-500 rounded-full"
                animate={{ width: state.isPlaying ? `${Math.min(100, masterLevel * (150 + (ch*10)))}%` : '2%' }}
                transition={{ duration: 0.05 }}
              />
            </div>
          ))}
          <div className="flex justify-between px-1 text-[7px] font-mono text-zinc-600 font-bold uppercase">
            <span>-∞</span>
            <span>-24</span>
            <span>-12</span>
            <span>-6</span>
            <span className="text-red-500">0</span>
          </div>
        </div>
      </div>

      <div className="flex bg-black shadow-2xl relative z-10 border-b border-studio-border">
        {(['mixer', 'ai', 'fx', 'library'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[9px] font-black uppercase tracking-[0.15em] relative transition-all ${activeTab === tab ? 'text-studio-accent' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="audio-tab-active"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-studio-accent rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto studio-scrollbar bg-black/20">
        <AnimatePresence mode="wait">
          {activeTab === 'mixer' && (
            <motion.div 
              key="mixer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-5 space-y-4"
            >
              {audioTracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
                  <div className="p-4 bg-zinc-900 rounded-full">
                    <Music className="w-8 h-8 text-zinc-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-black uppercase text-zinc-500">No Audio Tracks</h3>
                    <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Drag sounds into the timeline to begin mixing</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {audioTracks.map((audio) => (
                    <AudioTrackControl
                      key={audio.id}
                      audio={audio}
                      color="bg-studio-accent"
                    />
                  ))}
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-white/5 pb-10">
                <div className="p-6 bg-gradient-to-br from-zinc-900 to-black border border-studio-accent/20 rounded-3xl shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-studio-accent rounded-xl shadow-lg shadow-studio-accent/20">
                        <BarChart className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest">Master Bus</span>
                        <span className="text-[7px] text-zinc-500 font-mono uppercase">Stereo Output (L/R)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-8 h-40">
                    <div className="flex-1 flex gap-2 justify-center h-full items-end pb-8">
                      {[60, 200, 1, 5, 12].map((f, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className="h-28 w-1.5 bg-zinc-800 rounded-full relative group">
                            <div className="absolute inset-0 bg-studio-accent/20 rounded-full scale-y-50 origin-bottom" />
                            <div className="absolute bottom-[50%] left-1/2 -translate-x-1/2 w-4 h-2 bg-white rounded-sm shadow-xl cursor-ns-resize group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-[7px] font-black text-zinc-600 uppercase">{f}{i < 2 ? 'Hz' : 'kHz'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-6">
              <div className="p-6 bg-gradient-to-r from-studio-accent/20 to-purple-500/20 border border-studio-accent/30 rounded-3xl group hover:border-studio-accent transition-all shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-studio-accent rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <Brain className="w-6 h-6 text-black" />
                  </div>
                  <span className="text-[14px] font-black uppercase tracking-widest">Neural Audio Engine</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed mb-6 uppercase font-bold tracking-tight">
                  Studio-grade AI processing for noise removal, stem separation, and rhythmic intelligence.
                </p>
                <div className="grid grid-cols-1 gap-3">
                   <button 
                    onClick={() => handleSendMessage("Run AI Mastering and normalize project to -14 LUFS.")}
                    className="py-4 bg-black/60 border border-white/5 rounded-2xl text-[11px] font-black uppercase hover:bg-studio-accent hover:text-black transition-all flex items-center justify-center gap-3"
                   >
                     <Zap className="w-4 h-4 text-studio-accent animate-pulse" />
                     AI Master & LUFS Radar
                   </button>
                   <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleSendMessage("Apply AI Noise & Reverb removal to dialogue.")}
                            className="py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase hover:border-emerald-500 transition-all flex flex-col items-center gap-2"
                        >
                            <Mic2 className="w-4 h-4 text-emerald-500" />
                            AI De-Noise
                        </button>
                        <button 
                            onClick={() => {
                                handleSendMessage(state.audioSettings.deClickEnabled ? "Disable project-wide De-Clicker." : "Enable project-wide De-Clicker.");
                            }}
                            className={`py-3 bg-zinc-900 border rounded-xl text-[9px] font-black uppercase transition-all flex flex-col items-center gap-2 ${state.audioSettings.deClickEnabled ? 'border-studio-accent text-studio-accent' : 'border-white/5 text-zinc-400 hover:border-studio-accent'}`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Master De-Click
                        </button>
                        <button 
                            onClick={() => handleSendMessage("Split the music track into Vocals, Drums, and Bass.")}
                            className="py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase hover:border-purple-500 transition-all flex flex-col items-center gap-2"
                        >
                            <Layers className="w-4 h-4 text-purple-500" />
                            AI Stem Split
                        </button>
                        <button 
                            onClick={() => handleSendMessage("Analyze project loudness for Netflix/TikTok compliance.")}
                            className="py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase hover:border-cyan-500 transition-all flex flex-col items-center gap-2"
                        >
                            <Activity className="w-4 h-4 text-cyan-500" />
                            LUFS Analysis
                        </button>
                        <button 
                            onClick={() => handleSendMessage("Generate a voiceover using my cloned voice.")}
                            className="py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase hover:border-orange-500 transition-all flex flex-col items-center gap-2"
                        >
                            <Headphones className="w-4 h-4 text-orange-500" />
                            AI Voice Clone
                        </button>
                        </div>
                        <div className="p-4 bg-black border border-white/5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Master LUFS</span>
                            <span className="text-[10px] font-mono text-emerald-500">-14.2 LUFS</span>
                        </div>
                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex gap-0.5">
                            <div className="h-full bg-emerald-500 w-[60%]" />
                            <div className="h-full bg-emerald-500 w-[15%]" />
                            <div className="h-full bg-yellow-500 w-[10%]" />
                            <div className="h-full bg-red-500 w-[5%] opacity-20" />
                        </div>
                        <div className="flex justify-between text-[6px] font-mono text-zinc-600">
                            <span>-Infinity</span>
                            <span>-23</span>
                            <span>-14</span>
                            <span>-9</span>
                            <span>0</span>
                        </div>
                        </div>
                    <button 
                      onClick={() => handleSendMessage("Detect BPM and add rhythm markers to the timeline.")}
                      className="py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase hover:border-cyan-500 transition-all flex items-center justify-center gap-2"
                    >
                      <Target className="w-4 h-4 text-cyan-500" />
                      Rhythm Snapping (BPM)
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-studio-accent">AI Sound FX Generator</span>
                    <Sparkles className="w-3.5 h-3.5 text-studio-accent animate-pulse" />
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Type 'cinematic whoosh' or 'deep impact'..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(`Generate a custom sound effect: ${e.currentTarget.value}`);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-[12px] text-white focus:outline-none focus:border-studio-accent transition-all placeholder:text-zinc-700 font-medium shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                       <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5">Enter</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest text-center px-4">
                    Neural synthesis creates unique, royalty-free assets instantly.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 space-y-6">
                <div className="p-5 bg-gradient-to-br from-studio-accent/20 to-indigo-900/20 border border-studio-accent/30 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Layers className="w-5 h-5 text-studio-accent" />
                    <span className="text-[12px] font-black uppercase tracking-widest text-white">AI Sound Match Mastering</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 mb-4 uppercase font-bold tracking-tight">Upload a reference track to match its spectral profile and LUFS density automatically.</p>
                  <button 
                    onClick={() => handleSendMessage("Analyze reference track and apply AI Sound Match mastering.")}
                    className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase hover:bg-studio-accent hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Reference Track
                  </button>
                </div>

                <div className="p-6 bg-black/40 border border-white/5 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio-accent">Peak Mastering Dashboard</span>
                    <div className="flex gap-2">
                       <span className="px-2 py-0.5 bg-studio-accent/20 rounded text-[7px] font-black text-studio-accent uppercase tracking-widest">64-Bit DSP</span>
                       <span className="px-2 py-0.5 bg-purple-500/20 rounded text-[7px] font-black text-purple-400 uppercase tracking-widest">Neural Analog</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                       { name: 'Warmth', icon: Zap, color: 'text-orange-500' },
                       { name: 'Clarity', icon: Sparkles, color: 'text-cyan-400' },
                       { name: 'Impact', icon: Target, color: 'text-red-500' }
                    ].map(stat => (
                       <div key={stat.name} className="p-3 bg-zinc-950/80 rounded-2xl border border-white/5 flex flex-col items-center gap-1 shadow-lg">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          <span className="text-[7px] font-black uppercase text-zinc-500">{stat.name}</span>
                          <span className="text-[9px] font-mono text-white">{(Math.random() * 20 + 80).toFixed(1)}%</span>
                       </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-500/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                       <Activity className="w-4 h-4 text-indigo-400" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Neural 1176 Precision Modeling</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div 
                           className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                           animate={{ width: ['40%', '85%', '60%'] }}
                           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                       />
                    </div>
                    <div className="flex justify-between mt-2 text-[6px] font-black text-zinc-600 uppercase tracking-widest">
                       <span>GR: -3.2dB</span>
                       <span>Dynamic Transparency: 99.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'fx' && (
            <motion.div 
              key="fx"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 space-y-6"
            >
              <div className="h-48 bg-zinc-950 border border-white/10 rounded-3xl relative overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 pattern-grid-lg opacity-[0.05]" />
                <div className="relative w-32 h-32">
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border border-studio-accent/20 rounded-full border-dashed"
                   />
                   <div className="absolute inset-4 border border-white/5 rounded-full" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <Radio className="w-6 h-6 text-studio-accent mb-2" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em]">Spatial Audio</span>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-2 block">VST Plugin Rack (Web-Compiled)</span>
                <div className="space-y-1">
                  {[
                    { name: 'FabFilter Q-3 Eq', status: 'Active', category: 'EQ' },
                    { name: 'Ozone 11 Maximizer', status: 'Active', category: 'Mastering' },
                    { name: 'Soothe2 Node', status: 'Empty Slot', category: 'Resonance' }
                  ].map((vst, i) => (

                        <div key={i} className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between hover:border-studio-accent/50 transition-all cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${vst.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-zinc-700'}`} />
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black uppercase">{vst.name}</span>
                                 <span className="text-[7px] font-mono text-zinc-500 uppercase">{vst.category}</span>
                              </div>
                           </div>
                           <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-studio-accent transition-colors" />
                        </div>
                    ))}
                    <button className="p-3 border-2 border-dashed border-white/5 rounded-xl text-[8px] font-black uppercase text-zinc-600 hover:border-studio-accent hover:text-studio-accent transition-all flex items-center justify-center gap-2">
                        <Plus className="w-3 h-3" /> Load VST Plugin (.wasm)
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                    { name: 'De-Esser', desc: 'Sibilance Control', color: 'border-emerald-500/30' },
                    { name: 'Plosive Control', desc: 'P/B Filtering', color: 'border-red-500/30' }
                ].map(fx => (
                  <button key={fx.name} className={`p-4 bg-zinc-900 border ${fx.color} rounded-2xl flex flex-col items-start gap-1 hover:border-studio-accent transition-all group`}>
                    <span className="text-[10px] font-black uppercase group-hover:text-studio-accent">{fx.name}</span>
                    <span className="text-[7px] font-mono text-zinc-600 uppercase">{fx.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 border-t border-studio-border bg-black/80 backdrop-blur-xl flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button aria-label="Previous frame" className="text-zinc-600 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
          <button 
            aria-label={state.isPlaying ? "Pause" : "Play"}
            className="w-10 h-10 bg-studio-accent rounded-full text-black flex items-center justify-center hover:scale-110 transition-transform"
            onClick={() => handleSendMessage("Toggle playback.")}
          >
            {state.isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          <button aria-label="Next frame" className="text-zinc-600 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 flex flex-col gap-2">
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
               <div className="absolute inset-y-0 left-0 bg-studio-accent shadow-[0_0_10px_#3b82f6]" style={{ width: `${(state.currentTime / state.duration) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">
                <span>{new Date(state.currentTime * 1000).toISOString().substr(14, 5)}</span>
                <span>{new Date(state.duration * 1000).toISOString().substr(14, 5)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPanel;
