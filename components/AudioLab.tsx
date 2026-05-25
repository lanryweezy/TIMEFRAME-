import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Mic, 
  Bot, 
  Headphones, 
  Waves, 
  Zap, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Activity,
  Plus,
  Trash2,
  X,
  Dna
} from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { AudioBlock } from '../types';

interface ChannelStripProps {
  name: string;
  type: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSoloed: boolean;
  onVolumeChange: (val: number) => void;
  onPanChange: (val: number) => void;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  peak: number;
}

const ChannelStrip: React.FC<ChannelStripProps> = ({ 
  name, type, volume, pan, isMuted, isSoloed, 
  onVolumeChange, onPanChange, onToggleMute, onToggleSolo, peak 
}) => {
  const [localVolume, setLocalVolume] = useState(volume);
  
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  return (
    <div className="w-20 sm:w-24 h-full flex flex-col bg-black/40 border-r border-white/5 group">
      {/* Header */}
      <div className="p-2 border-b border-white/5 bg-zinc-900/50">
        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest block truncate">{type}</span>
        <span className="text-[9px] font-bold text-white block truncate mt-1">{name}</span>
      </div>

      {/* EQ/FX Area (Placeholder) */}
      <div className="p-2 space-y-1.5 flex flex-col items-center border-b border-white/5">
        <button className="w-full py-1 rounded bg-white/5 border border-white/10 text-[7px] font-black text-zinc-400 hover:text-white uppercase">EQ</button>
        <button className="w-full py-1 rounded bg-white/5 border border-white/10 text-[7px] font-black text-zinc-400 hover:text-white uppercase">Dyn</button>
      </div>

      {/* Pan */}
      <div className="p-3 flex flex-col items-center gap-1 border-b border-white/5">
        <span className="text-[7px] text-zinc-600 font-black">PAN</span>
        <input 
          type="range" min="-1" max="1" step="0.1" value={pan} 
          onChange={(e) => onPanChange(parseFloat(e.target.value))}
          className="w-full accent-studio-accent h-0.5"
        />
        <div className="flex justify-between w-full text-[6px] font-mono text-zinc-700">
            <span>L</span><span>C</span><span>R</span>
        </div>
      </div>

      {/* Fader & Meter Area */}
      <div className="flex-1 flex gap-2 p-3 justify-center">
        {/* Level Meter */}
        <div className="w-2 h-full bg-black rounded-full overflow-hidden relative flex flex-col-reverse">
          <motion.div 
            className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500 rounded-full"
            animate={{ height: `${Math.min(100, (peak + 60) * 1.5)}%` }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
          {/* db Markings */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center py-1 opacity-20">
            {[0, -6, -12, -24, -48].map(db => (
              <span key={db} className="text-[5px] font-mono text-white leading-none">{db}</span>
            ))}
          </div>
        </div>

        {/* Gain Fader */}
        <div className="relative w-8 h-full flex flex-col items-center">
          <input 
            type="range" min="0" max="1.5" step="0.01" value={localVolume} 
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setLocalVolume(val);
              onVolumeChange(val);
            }}
            style={{ writingMode: 'bt-lr' as any, appearance: 'slider-vertical' as any }}
            className="w-2 h-full cursor-ns-resize opacity-0 absolute inset-0 z-10"
          />
          <div className="absolute inset-y-0 w-0.5 bg-white/5" />
          <motion.div 
            className="absolute w-6 h-3 bg-studio-accent rounded-sm shadow-xl flex items-center justify-center z-0 border border-white/20"
            animate={{ bottom: `${(localVolume / 1.5) * 100}%` }}
            transition={{ type: 'tween', duration: 0 }}
          >
            <div className="w-full h-[1px] bg-black/40" />
          </motion.div>
        </div>
      </div>

      {/* Mute/Solo */}
      <div className="p-2 bg-zinc-950 flex gap-1">
        <button 
          onClick={onToggleSolo}
          className={`flex-1 py-1 rounded text-[9px] font-black transition-all ${isSoloed ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-zinc-600 hover:text-zinc-400'}`}
        >S</button>
        <button 
          onClick={onToggleMute}
          className={`flex-1 py-1 rounded text-[9px] font-black transition-all ${isMuted ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-white/5 text-zinc-600 hover:text-zinc-400'}`}
        >M</button>
      </div>
    </div>
  );
};

export const AudioLab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const store = useVideoStore();
  const { audioTrack, videoClips, audioMetering } = store;

  // Combine video audio and dedicated audio tracks
  const tracks = useMemo(() => {
    const combined: { id: string; name: string; type: string; volume: number; pan: number; isMuted?: boolean; isSoloed?: boolean }[] = [];
    
    videoClips.filter(c => !c.isAdjustmentLayer).forEach(c => {
        combined.push({
            id: c.id,
            name: c.name,
            type: 'VIDEO',
            volume: c.audio?.volume ?? 1,
            pan: c.audio?.pan ?? 0,
        });
    });

    audioTrack.forEach(a => {
        combined.push({
            id: a.id,
            name: a.name,
            type: a.type.toUpperCase(),
            volume: a.volume,
            pan: a.pan,
        });
    });

    return combined;
  }, [videoClips, audioTrack]);

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#020202]/95 backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Music className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">Audio Mixing Lab</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">High-Precision Neural Spatializer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-400">LUFS: <span className="text-white">{audioMetering.integrated.toFixed(1)}</span></span>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-[9px] font-mono text-zinc-400">PEAK: <span className="text-white">{Math.max(...audioMetering.peak).toFixed(1)}</span> db</span>
           </div>
           <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Mixer Area */}
        <div className="flex-1 flex overflow-x-auto p-8 scrollbar-hide">
            <div className="flex h-full min-w-max gap-1">
                {tracks.map((track, i) => (
                    <ChannelStrip 
                        key={track.id}
                        name={track.name}
                        type={track.type}
                        volume={track.volume}
                        pan={track.pan}
                        isMuted={false}
                        isSoloed={false}
                        onVolumeChange={(val) => {
                            if (track.type === 'VIDEO') {
                                store.updateClip(track.id, { audio: { ...videoClips.find(c => c.id === track.id)?.audio, volume: val } } as any);
                            } else {
                                store.updateAudio(track.id, { volume: val });
                            }
                        }}
                        onPanChange={(val) => {
                             if (track.type === 'VIDEO') {
                                store.updateClip(track.id, { audio: { ...videoClips.find(c => c.id === track.id)?.audio, pan: val } } as any);
                            } else {
                                store.updateAudio(track.id, { pan: val });
                            }
                        }}
                        onToggleMute={() => {}}
                        onToggleSolo={() => {}}
                        peak={audioMetering.peak[i % 2] || -60}
                    />
                ))}

                {/* Master Output */}
                <div className="ml-4 flex h-full">
                    <div className="w-px h-full bg-white/10" />
                    <div className="w-24 sm:w-32 h-full flex flex-col bg-zinc-900/40 group">
                        <div className="p-3 border-b border-white/10 bg-studio-accent/10">
                            <span className="text-[8px] font-black text-studio-accent uppercase tracking-widest block">Output</span>
                            <span className="text-[11px] font-black text-white block uppercase tracking-tighter mt-1">Master Bus</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-4 p-4">
                            <div className="flex-1 w-12 flex gap-1.5">
                                {[0, 1].map(ch => (
                                    <div key={ch} className="flex-1 bg-black rounded-sm overflow-hidden relative flex flex-col-reverse">
                                        <motion.div 
                                            className="w-full bg-gradient-to-t from-emerald-500 via-studio-accent to-rose-500"
                                            animate={{ height: `${Math.min(100, (audioMetering.peak[ch] + 60) * 1.5)}%` }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="w-full h-32 relative flex flex-col items-center">
                                <div className="absolute inset-y-0 w-0.5 bg-white/10" />
                                <div className="absolute bottom-1/2 w-8 h-4 bg-white rounded shadow-2xl flex items-center justify-center border-2 border-studio-accent">
                                    <div className="w-full h-[2px] bg-studio-accent" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-black border-t border-white/5 space-y-3">
                             <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black text-zinc-500 uppercase">Limit</span>
                                <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
                             </div>
                             <button className="w-full py-2 bg-studio-accent text-black text-[10px] font-black uppercase rounded-lg">Mastering</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* AI Audio Inspector */}
        <div className="w-[380px] border-l border-white/5 bg-zinc-950/50 p-8 space-y-10 overflow-y-auto">
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-studio-accent" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Neural Audio Engine</h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Voice Isolation', icon: Mic, active: true },
                        { label: 'De-Hum', icon: Waves, active: false },
                        { label: 'Spectral Repair', icon: Activity, active: true },
                        { label: 'Loudness Sync', icon: Headphones, active: false },
                    ].map(tool => (
                        <button key={tool.label} className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all ${tool.active ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'}`}>
                            <tool.icon className="w-5 h-5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Dna className="w-4 h-4 text-purple-400" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Sonic Identity</h3>
                </div>
                <div className="p-5 bg-black border border-white/5 rounded-2xl space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase">
                            <span>Sentiment Bias</span>
                            <span className="text-studio-accent">EPIC / CINEMATIC</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-studio-accent w-3/4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {['1176', 'PULTEC', 'NEVE'].map(m => (
                            <button key={m} className="py-2 rounded bg-white/5 text-[8px] font-black text-zinc-400 hover:text-white border border-white/5">{m}</button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Procedural SFX</h3>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Describe a sound..." 
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white focus:outline-none focus:border-studio-accent/40"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-studio-accent rounded-lg text-black">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};
