
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState } from '../types';
import { 
    Volume2, Music, Mic2, Waves, Activity, Zap, 
    Sparkles, Ear, Radio, Layers, Sliders, 
    Wind, Shield, Target, Plus, Scissors,
    Play, SkipBack, SkipForward, Settings,
    BarChart, Headphones, Speaker, MessageSquare, TrendingUp
} from 'lucide-react';

interface AudioPanelProps {
    state: VideoState;
    handleSendMessage: (msg: string) => void;
}

const AudioPanel: React.FC<AudioPanelProps> = ({ state, handleSendMessage }) => {
    const [activeTab, setActiveTab] = useState<'mixer' | 'ai' | 'fx' | 'library'>('mixer');
    const [masterLevel, setMasterLevel] = useState(85);

    const AudioTrack = ({ label, type, icon: Icon, color }: { label: string, type: string, icon: any, color: string }) => (
        <div className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl hover:border-studio-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${color} bg-opacity-20`}>
                        <Icon className={`w-3.5 h-3.5 ${color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold uppercase tracking-tight">{label}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{type}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button className="w-6 h-6 rounded bg-zinc-800 border border-white/5 text-[10px] font-bold hover:bg-studio-accent transition-colors">M</button>
                    <button className="w-6 h-6 rounded bg-zinc-800 border border-white/5 text-[10px] font-bold hover:bg-amber-500 transition-colors">S</button>
                </div>
            </div>

            {/* Waveform Visualization */}
            <div className="h-10 bg-black/40 rounded border border-white/5 relative overflow-hidden mb-3">
                 <div className="absolute inset-0 flex items-center gap-[1px] px-1 opacity-40">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`flex-1 ${color.replace('bg-', 'text-') === 'text-studio-accent' ? 'bg-studio-accent' : 'bg-zinc-500'} h-full min-w-[1px]`} 
                            style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                    ))}
                 </div>
                 <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/20" />
            </div>

            {/* Fader Control */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full relative">
                    <div className="absolute inset-y-0 left-0 bg-studio-accent rounded-full" style={{ width: '70%' }} />
                    <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border border-studio-accent cursor-pointer" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 w-10">-6.2dB</span>
            </div>
        </div>
    );

    const EQBand = ({ freq, label }: { freq: string, label: string }) => (
        <div className="flex flex-col items-center gap-2">
            <div className="h-32 w-1.5 bg-zinc-800 rounded-full relative">
                 <div className="absolute bottom-0 left-0 right-0 bg-studio-accent rounded-full opacity-20" style={{ height: '60%' }} />
                 <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 w-4 h-2 bg-white rounded-sm shadow-xl cursor-pointer" />
            </div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase">{label}</span>
            <span className="text-[8px] font-mono text-zinc-600">{freq}</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-studio-bg text-white select-none studio-scrollbar overflow-hidden">
            {/* VU Meters Header */}
            <div className="p-4 bg-zinc-950 border-b border-studio-border">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                         <BarChart className="w-5 h-5 text-studio-accent" />
                         <h2 className="text-[14px] font-bold uppercase tracking-widest text-white">Audio Levels</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 h-4 rounded-sm bg-black p-0.5 border border-white/5 relative overflow-hidden">
                    <div className="flex h-full gap-[1px]">
                         {Array.from({ length: 40 }).map((_, i) => (
                             <div key={i} className={`flex-1 ${i > 30 ? 'bg-red-500' : i > 25 ? 'bg-amber-500' : 'bg-studio-accent'} opacity-${i < 28 ? '80' : '100'}`} />
                         ))}
                    </div>
                    <div className="flex h-full gap-[1px]">
                         {Array.from({ length: 40 }).map((_, i) => (
                             <div key={i} className={`flex-1 ${i > 30 ? 'bg-red-500' : i > 25 ? 'bg-amber-500' : 'bg-studio-accent'} opacity-${i < 24 ? '80' : '100'}`} />
                         ))}
                    </div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-black shadow-xl relative z-10">
            {(['mixer', 'ai', 'fx', 'library'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider relative transition-all ${activeTab === tab ? 'text-studio-accent' : 'text-zinc-600 hover:text-white'}`}
                    >
                        {tab === 'mixer' ? 'Tracks' : tab === 'ai' ? 'Smart' : tab === 'fx' ? 'Effects' : 'Sounds'}
                        {activeTab === tab && (
                            <motion.div layoutId="audio-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-studio-accent" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto studio-scrollbar bg-black/20">
                {activeTab === 'mixer' && (
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black uppercase text-zinc-500">Audio Tracks</span>
                            <button className="flex items-center gap-1.5 text-[8px] font-black uppercase text-zinc-600 hover:text-white">
                                <Plus className="w-3 h-3" />
                                Add Bus
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <AudioTrack label="Voice / Dialogue" type="Mono Input" icon={Mic2} color="bg-studio-accent" />
                            <AudioTrack label="Guest / Remote" type="Stereo Pair" icon={Headphones} color="bg-blue-400" />
                            <AudioTrack label="Background Score" type="Stereo Pair" icon={Music} color="bg-purple-500" />
                            <AudioTrack label="Atmospheric FX" type="Spatial Link" icon={Waves} color="bg-cyan-500" />
                        </div>

                        {/* Master Fader Section */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="p-4 bg-zinc-900 border border-studio-accent/20 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-studio-accent" />
                                        <span className="text-[10px] font-black uppercase">Main Mix Bus</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Headphones className="w-3.5 h-3.5 text-zinc-600" />
                                        <Speaker className="w-3.5 h-3.5 text-zinc-600" />
                                    </div>
                                </div>
                                <div className="flex items-end gap-6 h-48 py-4">
                                    <div className="flex-1 flex gap-2 justify-center h-full items-end pb-8">
                                        <EQBand freq="60Hz" label="Sub" />
                                        <EQBand freq="200Hz" label="Low" />
                                        <EQBand freq="1kHz" label="Mid" />
                                        <EQBand freq="5kHz" label="High" />
                                        <EQBand freq="12kHz" label="Air" />
                                    </div>
                                    <div className="w-12 h-full bg-black/40 rounded flex flex-col items-center justify-around py-4 border border-white/5">
                                        <div className="w-8 h-[2px] bg-red-500/40 rounded" />
                                        <div className="w-[1px] h-full bg-zinc-800 relative">
                                            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-6 h-8 bg-zinc-700 border border-white/20 rounded-sm shadow-2xl flex items-center justify-center cursor-pointer">
                                                <div className="w-4 h-[1px] bg-white opacity-40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Smart Tools</h4>
                            
                            <button 
                                onClick={() => handleSendMessage("Isolate voice.")}
                                className="w-full p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-studio-accent group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-studio-accent/10 rounded-lg group-hover:bg-studio-accent/20">
                                        <Shield className="w-4 h-4 text-studio-accent" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black uppercase group-hover:text-studio-accent transition-colors">Clean Voice</span>
                                        <span className="text-[7px] text-zinc-500 font-sans">Isolate voice & remove noise</span>
                                    </div>
                                </div>
                                <Zap className="w-3.5 h-3.5 text-zinc-700 group-hover:text-studio-accent" />
                            </button>

                            <button 
                                onClick={() => handleSendMessage("Synchronize the video cuts and visual effects to the beats of the background music.")}
                                className="w-full p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-orange-500 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <Activity className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black uppercase group-hover:text-orange-500 transition-colors">Sync to Beats</span>
                                        <span className="text-[7px] text-zinc-500 font-sans">Match video to music beats</span>
                                    </div>
                                </div>
                                <Activity className="w-3.5 h-3.5 text-zinc-700 group-hover:text-orange-500" />
                            </button>

                            <button 
                                onClick={() => handleSendMessage("Master this audio for broadcast standards (LUFS -14).")}
                                className="w-full p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-purple-500 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black uppercase group-hover:text-purple-500 transition-colors">Fix Volume</span>
                                        <span className="text-[7px] text-zinc-500 font-sans">Professional sound balance</span>
                                    </div>
                                </div>
                                <Activity className="w-3.5 h-3.5 text-zinc-700 group-hover:text-purple-500" />
                            </button>

                            <button 
                                onClick={() => handleSendMessage("Apply auto-ducking to the music whenever voice is present.")}
                                className="w-full p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-cyan-500 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                                        <Ear className="w-4 h-4 text-cyan-500" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black uppercase group-hover:text-cyan-500 transition-colors">Auto Volume</span>
                                        <span className="text-[7px] text-zinc-500 font-sans">Lower music when talking</span>
                                    </div>
                                </div>
                                <Target className="w-3.5 h-3.5 text-zinc-700 group-hover:text-cyan-500" />
                            </button>

                            <button 
                                onClick={() => handleSendMessage("Remove static hiss and low-end hum from the recording.")}
                                className="w-full p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-emerald-500 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <Wind className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black uppercase group-hover:text-emerald-500 transition-colors">Remove Noise</span>
                                        <span className="text-[7px] text-zinc-500 font-sans">Clear hiss and hum</span>
                                    </div>
                                </div>
                                <Shield className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-500" />
                            </button>
                        </div>

                        {/* Podcast Logic */}
                        <div className="p-5 bg-studio-accent/5 border border-studio-accent/10 rounded-2xl">
                             <div className="flex items-center gap-3 mb-3">
                                <Radio className="w-5 h-5 text-studio-accent" />
                                <span className="text-[11px] font-black uppercase tracking-tight">Podcast Workflow</span>
                             </div>
                             <p className="text-[9px] text-zinc-400 mb-4 leading-relaxed">Multicam-sync your audio tracks and automatically generate transcripts with timestamps.</p>
                            <button 
                                onClick={() => handleSendMessage("Align all podcast audio tracks based on shared audio fingerprints to fix sync issues.")}
                                className="w-full py-2 bg-studio-accent text-black text-[9px] font-black uppercase rounded-lg hover:bg-studio-accent/80 transition-colors">Auto-Align Tracks</button>
                        </div>

                        {/* Dialogue Enhancement */}
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Dialogue Cleanup</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { name: 'De-Hum', cmd: 'Remove 60Hz/50Hz hum from the audio.', icon: Wind },
                                    { name: 'De-Click', cmd: 'Remove mouth clicks and digital artifacts.', icon: Zap },
                                    { name: 'De-Plosive', cmd: 'Reduce harsh P and B sounds.', icon: Mic2 },
                                    { name: 'Voice Clarity', cmd: 'Apply enhancement for broadcast clarity.', icon: Sparkles }
                                ].map(tool => (
                                    <button 
                                        key={tool.name}
                                        onClick={() => handleSendMessage(tool.cmd)}
                                        className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between hover:border-studio-accent group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <tool.icon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-studio-accent" />
                                            <span className="text-[9px] font-black uppercase tracking-tight text-zinc-400 group-hover:text-white">{tool.name}</span>
                                        </div>
                                        <Plus className="w-3 h-3 text-zinc-800 group-hover:text-studio-accent" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'fx' && (
                    <div className="p-5 flex flex-col gap-6">
                        <div className="h-64 bg-zinc-950 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
                            <div className="absolute inset-0 pattern-grid-lg opacity-[0.05]" />
                            <div className="relative w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                                <div className="w-32 h-32 border border-white/5 rounded-full border-dashed animate-spin-slow" />
                                <div className="absolute w-full h-px bg-white/5" />
                                <div className="absolute h-full w-px bg-white/5" />
                                
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-12 h-12 bg-studio-accent/20 rounded-full border border-studio-accent blur-md absolute top-10 left-10"
                                />
                                
                                <div className="z-10 flex flex-col items-center">
                                    <Headphones className="w-8 h-8 text-studio-accent mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">3D Sound</span>
                                    <span className="text-[7px] font-sans text-zinc-600">3D Audio: Active</span>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
                                <button onClick={() => handleSendMessage("Set audio output to Dolby Atmos 7.1.2 profile.")} className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[6px] font-black uppercase tracking-widest hover:border-studio-accent transition-colors">Dolby Atmos</button>
                                <button onClick={() => handleSendMessage("Apply Binaural spatialization for headphone optimization.")} className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[6px] font-black uppercase tracking-widest hover:border-studio-accent transition-colors">Binaural</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             {[
                                { name: 'Studio Reverb', desc: 'Lexicon Style' },
                                { name: 'Warm Tube', desc: 'Analog Drive' },
                                { name: 'Brickwall', desc: 'Peak Limiter' },
                                { name: 'Multiband Comp', desc: 'Punch Control' },
                                { name: 'De-Esser', desc: 'Sibilance Fix' },
                                { name: 'Sidechain', desc: 'Bass Comp' }
                             ].map(fx => (
                                <button key={fx.name} className="p-4 bg-zinc-900 border border-white/5 rounded-xl flex flex-col items-start gap-1 hover:border-studio-accent group transition-all text-left">
                                    <span className="text-[10px] font-black uppercase group-hover:text-studio-accent transition-colors">{fx.name}</span>
                                    <span className="text-[7px] font-mono text-zinc-600 uppercase">{fx.desc}</span>
                                </button>
                             ))}
                        </div>
                    </div>
                )}

                {activeTab === 'library' && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Curated Libraries</h4>
                                <span className="text-[7px] font-mono text-studio-accent bg-studio-accent/10 px-2 py-0.5 rounded">WAV / Lossless</span>
                            </div>
                                                        <div className="grid grid-cols-1 gap-3">
                                {[
                                    { name: 'Cinematic Impacts', count: '142 Files', tag: 'SFX' },
                                    { name: 'Lo-Fi Chill Beats', count: '12 Tracks', tag: 'MUSIC' },
                                    { name: 'Ambient Texture', count: '85 Clips', tag: 'ATMOS' },
                                    { name: 'Human Voices', count: '210 Files', tag: 'VO' }
                                ].map(lib => (
                                    <button key={lib.name} className="p-4 bg-zinc-900/80 border border-white/5 rounded-xl flex items-center justify-between hover:border-studio-accent group transition-all">
                                        <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-studio-accent group-hover:text-black transition-all">
                                        <Music className="w-5 h-5 text-zinc-400 trasition-colors" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[13px] font-black text-white group-hover:text-studio-accent transition-colors uppercase tracking-tight">{lib.name}</span>
                                        <span className="text-[10px] font-mono text-zinc-500">{lib.count}</span>
                                    </div>
                                        </div>
                                        <span className="text-[7px] font-black uppercase text-zinc-800 bg-white/5 px-2 py-0.5 rounded group-hover:text-studio-accent transition-colors">{lib.tag}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Viral Sounds Tracking */}
                        <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl relative overflow-hidden group">
                             <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 blur-3xl group-hover:bg-rose-500/20 transition-all" />
                             <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="w-5 h-5 text-rose-500" />
                                <span className="text-[11px] font-black uppercase tracking-tight">Viral Trends</span>
                             </div>
                             <div className="space-y-2">
                                 {[
                                     { name: 'TikTok Trend: 808 Pulse', trend: '+142%', color: 'text-rose-400' },
                                     { name: 'Viral Reel: Lo-Fi Study', trend: '+89%', color: 'text-zinc-400' }
                                 ].map(s => (
                                     <button key={s.name} onClick={() => handleSendMessage(`Add the trending sound ${s.name} to my timeline.`)} className="w-full flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 hover:border-rose-500/30 transition-all">
                                         <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-tight">{s.name}</span>
                                         <span className="text-[7px] font-mono text-rose-500">{s.trend}</span>
                                     </button>
                                 ))}
                             </div>
                             <button onClick={() => handleSendMessage("Search for trending viral sounds that match my video context.")} className="w-full mt-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] font-black uppercase rounded hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
                                 <Sparkles className="w-3 h-3" />
                                 Find Trends
                             </button>
                        </div>

                        <button className="w-full py-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all text-zinc-600 hover:text-studio-accent hover:border-studio-accent/50 group">
                            <Plus className="w-6 h-6 p-1 bg-zinc-900 rounded-full group-hover:scale-110 transition-transform" />
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest">Import Custom Soundbank</span>
                                <span className="text-[7px] font-mono text-zinc-500">Supports .wav, .mp3, .aac</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Playback Strip */}
            <div className="p-4 border-t border-studio-border bg-black/80 flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <button className="text-zinc-500 hover:text-white transition-colors"><SkipBack className="w-4 h-4" /></button>
                    <button className="p-2 bg-studio-accent rounded-full text-black hover:scale-110 transition-transform"><Play className="w-4 h-4 fill-current" /></button>
                    <button className="text-zinc-500 hover:text-white transition-colors"><SkipForward className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500">
                        <span>00:14:22</span>
                        <span>01:10:00</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full relative">
                        <div className="absolute inset-y-0 left-0 bg-studio-accent rounded-full" style={{ width: '20%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPanel;
