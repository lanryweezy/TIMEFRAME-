
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VideoState, EditorMode, FilterPreset, AspectRatio, EffectType, AudioBlock, SocialPlatform, BeatSyncSettings } from '../types';
import { FolderOpen, Type, Music, Image as ImageIcon, Zap, Square, Subtitles, Plus, Sparkles, Volume2, AudioWaveform, Activity, Wand2, Video, Languages, Mic2, ShieldAlert, Smartphone, Layout, Facebook, Instagram, Music2, Share2, Scissors, ScissorsLineDashed, Target, ChevronRight, Shield, Users, TrendingUp, Palette, ShieldCheck, Box, Boxes, Layers, Move, MousePointer2, Binary, Sun, Waves, Settings, Globe, HardDrive, Brain } from 'lucide-react';

import ColorPanel from './ColorPanel';
import AudioPanel from './AudioPanel';
import AssetManagerPanel from './AssetManagerPanel';
import AgentHubPanel from './AgentHubPanel';

interface EditorSidebarProps {
  state: VideoState;
  onSetMode: (mode: EditorMode) => void;
  onAddText: (style: string) => void;
  onAddAudio: (track: string) => void;
  onUpdateAudio: (id: string, updates: Partial<AudioBlock>) => void;
  onSetFilter: (filter: FilterPreset) => void;
  onAddSubtitle: () => void;
  onAddClip: () => void;
  onAddEffect: (type: EffectType) => void;
  onFabricate: (prompt: string, type: 'video' | 'image') => void;
  handleSendMessage: (message: string) => void;
  onUpdateDucking?: (enabled: boolean, ratio: number) => void;
  onSetAspectRatio?: (ratio: AspectRatio) => void;
  onSetSocialPlatform?: (platform: SocialPlatform) => void;
  onApplyTemplate?: (name: string) => void;
  onUpdateBeatSync?: (settings: Partial<BeatSyncSettings>) => void;
  onGenerateAvatar?: () => void;
  onToggleFaceTracking?: () => void;
  onAIStoryteller?: () => void;
  onAutoResize?: () => void;
  onAddAdjustmentLayer?: () => void;
  onToggleProxy?: () => void;
  onToggleMultiCam?: () => void;
  onOptimizeForPlatform?: (platform: string) => void;
  onTrackTrends?: (platform: string) => void;
  onSearchViralSounds?: (platform: string) => void;
  onToggleDebugger?: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ 
    state, onSetMode, onAddText, onAddAudio, onUpdateAudio, onSetFilter, 
    onAddSubtitle, onAddClip, onAddEffect, onFabricate, handleSendMessage, onUpdateDucking,
    onSetAspectRatio, onSetSocialPlatform, onApplyTemplate, onUpdateBeatSync,
    onGenerateAvatar, onToggleFaceTracking, onAIStoryteller, onAutoResize,
    onAddAdjustmentLayer, onToggleProxy, onToggleMultiCam,
    onOptimizeForPlatform, onTrackTrends, onSearchViralSounds,
    onToggleDebugger
}) => {
  const [genPrompt, setGenPrompt] = useState('');

  const NavButton = ({ mode, icon: Icon, label, badge }: { mode: EditorMode, icon: any, label: string, badge?: string }) => (
    <button 
      onClick={() => onSetMode(mode)} 
      className={`relative w-full flex flex-col items-center justify-center py-4 transition-colors group ${state.activeMode === mode ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
      title={label}
    >
        {state.activeMode === mode && (
            <motion.div layoutId="navActive" className="absolute right-0 w-0.5 h-6 bg-studio-accent rounded-l-full shadow-[0_0_10px_rgba(var(--studio-accent-rgb),0.4)]" />
        )}
        <div className="relative">
            <Icon className={`w-5 h-5 mb-1.5 transition-transform ${state.activeMode === mode ? 'scale-110 text-studio-accent' : 'group-hover:scale-105'}`} />
            {badge && (
                <div className="absolute -top-2 -right-2 px-1 py-0.5 bg-studio-accent text-black text-[6px] font-black rounded-full shadow-lg">
                    {badge}
                </div>
            )}
        </div>
        <span className="sr-only">{label}</span>
    </button>
  );

  const isDuckingActive = state.audioSettings.duckingEnabled && (state.audioTrack || []).some(t => 
    (t.type === 'voiceover' || t.type === 'sfx') && 
    state.currentTime >= t.startTime && 
    state.currentTime <= t.startTime + t.duration
  );

  return (
    <div className="flex h-full select-none">
        <nav className="w-14 bg-black flex flex-col pt-6 gap-0 z-30">
            <NavButton mode="media" icon={FolderOpen} label="Media" />
            <NavButton mode="templates" icon={Layout} label="Styles" />
            <div className="h-px bg-white/5 mx-3 my-2 opacity-20" />
            <NavButton mode="generator" icon={Wand2} label="Generate" />
            <NavButton mode="text" icon={Type} label="Text" />
            <NavButton mode="audio" icon={Music} label="Audio" />
            <div className="h-px bg-white/5 mx-3 my-2 opacity-20" />
            <NavButton mode="ratio" icon={Smartphone} label="Rec/Sq" />
            <NavButton mode="motion" icon={Boxes} label="Motion" />
            <NavButton mode="color" icon={Palette} label="Color" />
            <NavButton mode="assistant" icon={Sparkles} label="Assistant" />
            <NavButton mode="filters" icon={ImageIcon} label="Looks" />
            <NavButton mode="effects" icon={Zap} label="Fx" />
            
            <div className="mt-auto pb-4">
                <button 
                  onClick={() => handleSendMessage("Show settings.")}
                  className="w-full flex flex-col items-center justify-center text-zinc-600 hover:text-studio-accent transition-all hover:scale-110"
                >
                    <Settings className="w-5 h-5 mb-1.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">Set</span>
                </button>
            </div>
        </nav>

        <aside className="w-48 bg-zinc-950/10 backdrop-blur-3xl flex flex-col z-20 relative border-r border-white/5 shadow-2xl">
            <header className="px-5 py-5 flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                    <h2 className="text-[12px] font-black text-zinc-100 tracking-[0.2em] uppercase leading-none opacity-80">{state.activeMode}</h2>
                </div>
                <button 
                  onClick={() => handleSendMessage(`Help me understand the ${state.activeMode} panel.`)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                >
                    <Wand2 className="w-3 h-3 text-zinc-600 group-hover:text-studio-accent" />
                </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6 studio-scrollbar relative z-10">
                {state.activeMode === 'templates' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                             <p className="micro-label">Templates</p>
                             <div className="px-1.5 py-0.5 bg-yellow-500/10 rounded border border-yellow-500/20 text-[10px] font-black text-yellow-500 uppercase tracking-tight">New</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: 'vlog', label: 'Daily Vlog', icon: Instagram, color: 'text-pink-500' },
                                { name: 'tiktok', label: 'Vertical Video', icon: Music2, color: 'text-white' },
                                { name: 'cinematic', label: 'Modern Look', icon: Video, color: 'text-blue-400' },
                                { name: 'vintage', label: 'Old Film', icon: ImageIcon, color: 'text-amber-500' },
                                { name: 'gaming', label: 'Game Clip', icon: Zap, color: 'text-purple-500' },
                                { name: 'promo', label: 'Company Ad', icon: Target, color: 'text-red-500' }
                            ].map(tpl => (
                                <button 
                                    key={tpl.name}
                                    onClick={() => onApplyTemplate?.(tpl.name)}
                                    className="p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-white/20 group transition-all relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="w-2 h-2 text-white" />
                                    </div>
                                    <tpl.icon className={`w-5 h-5 ${tpl.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-white leading-none">{tpl.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                             <p className="micro-label flex items-center gap-2">Project Assets</p>
                             <div className="space-y-1">
                                 {['B-Roll 01', 'Intro Graphics', 'Interview Audio'].map((c, i) => (
                                     <button key={i} onClick={() => onApplyTemplate?.(c)} className="w-full flex items-center justify-between p-2 rounded bg-black border border-[#1a1a1a] hover:bg-[#0a0a0a] transition-all group">
                                         <span className="text-[7px] font-mono text-slate-400 group-hover:text-white truncate">{c}</span>
                                         <Plus className="w-2 h-2 text-slate-600" />
                                     </button>
                                 ))}
                             </div>
                        </div>

                        {/* NEW: Quick Animation Presets Section */}
                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="micro-label text-slate-500">Movements</p>
                                <Zap className="w-2.5 h-2.5 text-blue-500/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Pop In', type: 'pop_in', icon: Sparkles, color: 'text-yellow-400' },
                                    { name: 'Bounce', type: 'elastic_bounce', icon: Activity, color: 'text-purple-400' },
                                    { name: 'Slide', type: 'slide_mask', icon: Layout, color: 'text-blue-400' },
                                    { name: 'Distort', type: 'liquid_distortion', icon: Wand2, color: 'text-cyan-400' }
                                ].map(preset => (
                                    <button 
                                        key={preset.type}
                                        onClick={() => handleSendMessage(`Apply ${preset.name} animation preset.`)}
                                        className="flex flex-col items-center justify-center p-2.5 rounded bg-black border border-[#1a1a1a] hover:border-white/20 transition-all group"
                                    >
                                        <preset.icon className={`w-3.5 h-3.5 mb-1.5 ${preset.color} group-hover:scale-110 transition-transform`} />
                                        <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-white">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* NEW: Motion Library Section */}
                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Library</p>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                                    <Settings className="w-2.5 h-2.5 text-zinc-500" />
                                </motion.div>
                            </div>
                            
                            {/* Easing Quick Toggle */}
                            <div className="flex gap-1 mb-2">
                                {['linear', 'easeOut', 'backOut', 'anticipate'].map(e => (
                                    <button 
                                        key={e}
                                        onClick={() => handleSendMessage(`Set global timing to ${e}.`)}
                                        className="flex-1 py-1 bg-black border border-white/5 rounded text-[8px] font-mono text-zinc-500 hover:text-blue-400 transition-colors uppercase"
                                    >
                                        {e.replace('Ease', '')}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                {[
                                    { name: 'Block Build', preset: 'voxel_build', icon: Box, desc: '3D blocks appear' },
                                    { name: 'Digital Rain', preset: 'matrix_cascade', icon: Binary, desc: 'Matrix style code' },
                                    { name: 'Soft Glow', preset: 'nebula_glow', icon: Sun, desc: 'Magical light' },
                                    { name: 'Moving Dust', preset: 'liquid_distortion', icon: Waves, desc: 'Slow particles' }
                                ].map(item => (
                                    <button 
                                        key={item.preset}
                                        onClick={() => handleSendMessage(`Apply the ${item.name} motion system.`)}
                                        className="w-full flex items-center gap-3 p-2 rounded bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center border border-white/5 group-hover:border-blue-500/20">
                                            <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] font-black text-white uppercase">{item.name}</span>
                                            <span className="text-[8px] text-zinc-500 font-mono italic">{item.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="text-[7px] font-mono text-slate-600 uppercase text-center mt-4 tracking-widest">Choose a template to get started quickly.</p>
                    </div>
                )}

                {state.activeMode === 'color' && (
                    <ColorPanel 
                        state={state} 
                        onSetFilter={onSetFilter} 
                        handleSendMessage={handleSendMessage} 
                    />
                )}

                {state.activeMode === 'ratio' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <p className="text-[8px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2 tracking-widest">Platform</p>
                             <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'tiktok', label: 'TikTok/Reels', ratio: '9:16', icon: Music2 },
                                    { id: 'reels', label: 'Instagram Post', ratio: '4:5', icon: Instagram },
                                    { id: 'shorts', label: 'YouTube Shorts', ratio: '9:16', icon: Video },
                                    { id: 'none', label: 'Standard Landscape', ratio: '16:9', icon: Layout }
                                ].map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => {
                                            onSetSocialPlatform?.(p.id as any);
                                            onSetAspectRatio?.(p.ratio as any);
                                        }}
                                        className={`w-full p-3 border rounded flex items-center gap-3 transition-all ${state.socialPlatform === p.id ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-[#1a1a1a] bg-black text-slate-400 hover:border-white/20'}`}
                                    >
                                        <p.icon className={`w-4 h-4 ${state.socialPlatform === p.id ? 'text-blue-400' : 'text-slate-600'}`} />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[11px] font-bold uppercase">{p.label}</span>
                                            <span className="text-[9px] font-mono opacity-50">{p.ratio} SAFE ZONE</span>
                                        </div>
                                    </button>
                                ))}
                             </div>
                             
                             <button 
                                onClick={onAutoResize}
                                className="w-full mt-4 p-3 bg-blue-600/10 border border-blue-500/40 rounded flex items-center justify-between group hover:bg-blue-600/20 transition-all"
                             >
                                 <div className="flex items-center gap-3">
                                     <Sparkles className="w-4 h-4 text-blue-400" />
                                     <div className="flex flex-col items-start text-left">
                                         <span className="text-[11px] font-bold uppercase text-blue-100 italic">Resize</span>
                                         <span className="text-[9px] font-mono text-blue-400/60 uppercase">Smart Crop</span>
                                     </div>
                                 </div>
                                 <ChevronRight className="w-3 h-3 text-blue-400/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                             </button>
                        </div>

                        <div className="pt-4 border-t border-[#1a1a1a]">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">Aspect Ratio</p>
                            <div className="flex flex-wrap gap-2">
                                {['16:9', '9:16', '1:1', '4:5', '2.35:1'].map(r => (
                                    <button 
                                        key={r}
                                        onClick={() => onSetAspectRatio?.(r as any)}
                                        className={`px-3 py-1.5 border rounded text-[8px] font-mono ${state.aspectRatio === r ? 'border-white bg-white text-black' : 'border-[#1a1a1a] bg-black text-slate-500 hover:border-white/10'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">Rendering</p>
                            <button 
                                onClick={onToggleProxy}
                                className={`w-full p-3 border rounded flex items-center justify-between transition-all ${state.proxyMode ? 'border-yellow-500/50 bg-yellow-500/5 text-white' : 'border-[#1a1a1a] bg-black text-slate-500'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-yellow-500" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase">Proxy Editing</span>
                                        <span className="text-[7px] font-mono opacity-50 uppercase">Performance First</span>
                                    </div>
                                </div>
                                <div className={`w-6 h-3 rounded-full relative transition-all ${state.proxyMode ? 'bg-yellow-500' : 'bg-slate-800'}`}>
                                    <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${state.proxyMode ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>

                            <button 
                                onClick={onToggleMultiCam}
                                className={`w-full p-3 border rounded flex items-center justify-between transition-all ${state.multiCamMode ? 'border-cyan-500/50 bg-cyan-500/5 text-white' : 'border-[#1a1a1a] bg-black text-slate-500'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Target className="w-4 h-4 text-cyan-500" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase">Multi-Camera</span>
                                        <span className="text-[7px] font-mono opacity-50 uppercase">Switching Engine</span>
                                    </div>
                                </div>
                                <div className={`w-6 h-3 rounded-full relative transition-all ${state.multiCamMode ? 'bg-cyan-500' : 'bg-slate-800'}`}>
                                    <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${state.multiCamMode ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                 {state.activeMode === 'generator' && (
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded">
                            <p className="text-[8px] font-black text-blue-400 uppercase mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Prompt</p>
                            <textarea 
                                value={genPrompt}
                                onChange={(e) => setGenPrompt(e.target.value)}
                                placeholder="Describe the scene..."
                                className="w-full bg-black/40 border border-[#1a1a1a] text-white text-[10px] p-2 rounded focus:border-blue-500 outline-none h-24 font-mono resize-none mb-3"
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => onFabricate(genPrompt, 'image')}
                                    className="flex-1 bg-white text-black text-[9px] font-black uppercase py-2 rounded flex items-center justify-center gap-1 hover:bg-slate-200"
                                >
                                    <ImageIcon className="w-3 h-3" /> Image
                                </button>
                                <button 
                                    onClick={() => onFabricate(genPrompt, 'video')}
                                    className="flex-1 bg-blue-600 text-white text-[9px] font-black uppercase py-2 rounded flex items-center justify-center gap-1 hover:bg-blue-500"
                                >
                                    <Video className="w-3 h-3" /> Generate Video
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                             <div className="flex items-center justify-between mb-3">
                                <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2"><Target className="w-3 h-3" /> Growth</p>
                                <div className="h-[1px] flex-1 bg-yellow-500/10 ml-3" />
                             </div>
                              <div className="grid grid-cols-2 gap-2">
                                  {[
                                      { label: 'Vertical Video', icon: Smartphone, fn: () => onOptimizeForPlatform?.('tiktok'), color: 'hover:border-yellow-500/50' },
                                      { label: 'Viral Trends', icon: TrendingUp, fn: () => onTrackTrends?.('tiktok'), color: 'hover:border-red-500/50' },
                                      { label: 'Brand Kit', icon: Palette, fn: () => handleSendMessage("Create my brand kit."), color: 'hover:border-blue-500/50' },
                                      { label: 'Quick Audit', icon: ShieldCheck, fn: () => handleSendMessage("Audit my project."), color: 'hover:border-emerald-500/50' },
                                  ].map(tool => (
                                      <button 
                                         key={tool.label}
                                         onClick={tool.fn}
                                         className={`p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 ${tool.color} group transition-all`}
                                      >
                                          <tool.icon className="w-3.5 h-3.5 text-slate-500 group-hover:scale-110 transition-transform" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center leading-tight">{tool.label}</span>
                                      </button>
                                  ))}
                              </div>
                        </div>

                        <div className="pt-2">
                             <div className="flex items-center justify-between mb-3">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Smart Editing</p>
                                <div className="h-[1px] flex-1 bg-[#1a1a1a] ml-3" />
                             </div>
                              <div className="grid grid-cols-2 gap-2">
                                  {[
                                      { label: 'Fast Cut', icon: Scissors, cmd: 'Auto-cut the timeline.' },
                                      { label: 'Silence Fix', icon: ScissorsLineDashed, cmd: 'Remove silent gaps.' },
                                      { label: 'Find Scenes', icon: Target, cmd: 'Detect scene changes.' },
                                      { label: 'Best Clips', icon: Sparkles, cmd: 'Identify the best moments.' },
                                      { label: 'Beat Sync', icon: Music, cmd: 'Sync transitions to music.' },
                                      { label: 'Add Captions', icon: Subtitles, cmd: 'Generate subtitles.' },
                                      { label: 'Better Pacing', icon: Activity, cmd: 'Improve video pacing.' },
                                      { label: 'Story Helper', icon: Layout, cmd: 'Suggest a better storyboard.' },
                                  ].map(tool => (
                                      <button 
                                         key={tool.label}
                                         onClick={() => handleSendMessage(tool.cmd)}
                                         className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-blue-500/50 group transition-all"
                                      >
                                          <tool.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center leading-tight">{tool.label}</span>
                                      </button>
                                  ))}
                              </div>
                        </div>

                         <div className="pt-2">
                             <div className="flex items-center justify-between mb-3">
                                <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Smart Tools</p>
                                <div className="h-[1px] flex-1 bg-[#1a1a1a] ml-3" />
                             </div>
                             <div className="space-y-2">
                                 <button 
                                    onClick={onGenerateAvatar}
                                    className={`w-full p-2.5 border rounded flex items-center gap-3 transition-all ${state.isGeneratingAvatar ? 'border-orange-500 bg-orange-500/10' : 'border-[#1a1a1a] bg-black hover:border-white/10'}`}
                                 >
                                     <Smartphone className="w-4 h-4 text-orange-500" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase text-white leading-none mb-1">Character</span>
                                        <span className="text-[7px] font-sans text-slate-500 uppercase">Virtual talking person</span>
                                    </div>
                                 </button>
                                 <button 
                                    onClick={() => handleSendMessage('Remove background from current footage.')}
                                    className={`w-full p-2.5 border rounded flex items-center gap-3 transition-all ${state.isRemovingBackground ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#1a1a1a] bg-black hover:border-white/10'}`}
                                 >
                                     <Wand2 className="w-4 h-4 text-emerald-500" />
                                     <div className="flex flex-col items-start">
                                         <span className="text-[9px] font-black uppercase text-white leading-none mb-1">Remove BG</span>
                                         <span className="text-[7px] font-mono text-slate-500 uppercase">One-click removal</span>
                                     </div>
                                 </button>
                                  <div className="grid grid-cols-2 gap-2">
                                      <button onClick={() => handleSendMessage('Track and follow objects.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-orange-500/50 group">
                                          <Target className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white">Tracking</span>
                                      </button>
                                      <button onClick={() => handleSendMessage('Remove background.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-emerald-500/50 group">
                                          <Wand2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white">Clean Background</span>
                                      </button>
                                      <button onClick={() => handleSendMessage('Remove specific objects.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-red-500/50 group">
                                          <Target className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white">Object Removal</span>
                                      </button>
                                  <button onClick={() => handleSendMessage('Smooth out camera motion.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-cyan-500/50 group">
                                          <Activity className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center">Smooth Motion</span>
                                      </button>
                                      <button onClick={() => handleSendMessage('Identify highlights.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-yellow-500/50 group">
                                          <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-yellow-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center">Highlights</span>
                                      </button>
                                      <button onClick={() => handleSendMessage('Generate viral clips.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-blue-500/50 group">
                                          <Zap className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center">Clip Maker</span>
                                      </button>
                                      <button onClick={() => handleSendMessage('Stabilize jerky footage.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-blue-500/50 group">
                                          <Shield className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center">Stabilize</span>
                                      </button>
                                      <button onClick={() => handleSendMessage('Reframe this video for vertical mobile.')} className="p-2 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-1.5 hover:border-purple-500/50 group">
                                          <Smartphone className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                                          <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white text-center">Auto Resize</span>
                                      </button>
                                  </div>
                             </div>
                        </div>

                        <div className="pt-2">
                             <div className="flex items-center justify-between mb-3">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Marketing</p>
                                <div className="h-[1px] flex-1 bg-[#1a1a1a] ml-3" />
                             </div>
                              <div className="grid grid-cols-1 gap-2">
                                  {[
                                      { label: 'Thumbnail Maker', icon: ImageIcon, cmd: 'Generate thumbnails.' },
                                      { label: 'Best Titles', icon: Type, cmd: 'Suggest viral titles.' },
                                      { label: 'Social Captions', icon: Share2, cmd: 'Write social captions.' },
                                      { label: 'Hashtag Ideas', icon: Zap, cmd: 'Suggest hashtags.' },
                                      { label: 'Script Maker', icon: Subtitles, cmd: 'Generate a script.' },
                                  ].map(tool => (
                                     <button 
                                        key={tool.label}
                                        onClick={() => handleSendMessage(tool.cmd)}
                                        className="w-full p-2.5 border border-[#1a1a1a] bg-black rounded flex items-center gap-3 hover:border-blue-500/50 group transition-all"
                                     >
                                         <tool.icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400" />
                                         <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-white">{tool.label}</span>
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                )}

                {state.activeMode === 'audio' && (
                    <AudioPanel 
                        state={state} 
                        handleSendMessage={handleSendMessage} 
                    />
                )}


                {state.activeMode === 'media' && (
                    <AssetManagerPanel state={state} handleSendMessage={handleSendMessage} />
                )}

                {state.activeMode === 'filters' && (
                    <div className="space-y-4">
                        <button 
                            onClick={onAddAdjustmentLayer}
                            className="w-full p-4 border border-dashed border-blue-500/30 bg-blue-500/5 rounded flex flex-col items-center justify-center gap-2 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group"
                        >
                            <Plus className="w-5 h-5 text-blue-500/50 group-hover:text-blue-400" />
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">New Adjustment Layer</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            {['none', 'vibrant', 'cinema', 'vintage', 'bw', 'cyber', 'horror', 'gold', 'neon'].map((f) => (
                            <button 
                                key={f} 
                                onClick={() => onSetFilter(f as FilterPreset)}
                                className={`p-2 border rounded text-center transition-all uppercase text-[8px] font-black tracking-widest h-20 flex flex-col items-center justify-center gap-2 ${state.activeFilter === f ? 'border-white bg-white text-black' : 'border-[#1a1a1a] bg-black text-slate-500 hover:border-slate-700'}`}
                            >
                                <div className={`w-8 h-8 rounded-full border border-current flex items-center justify-center`}>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                )}

                {state.activeMode === 'effects' && (
                    <div className="space-y-2">
                        {['vhs', 'glitch', 'scanline', 'film_grain', 'chromatic_aberration', 'data_stream', 'shake', 'bounce', 'slide_up'].map((e) => (
                            <button 
                                key={e} 
                                onClick={() => onAddEffect(e as EffectType)}
                                className={`w-full p-4 border border-[#1a1a1a] bg-black rounded flex items-center justify-between hover:border-orange-500/50 group transition-all`}
                            >
                                <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">{e}</span>
                                <Plus className="w-3 h-3 text-slate-700 group-hover:text-orange-500" />
                            </button>
                        ))}
                    </div>
                )}

                {state.activeMode === 'text' && (
                    <div className="space-y-3">
                        <button onClick={() => onAddText('title')} className="w-full p-6 border border-[#1a1a1a] bg-black rounded hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-2 group">
                             <Type className="w-6 h-6 text-slate-700 group-hover:text-white" />
                             <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Heading</span>
                        </button>
                        <button onClick={() => onAddText('sub')} className="w-full p-4 border border-[#1a1a1a] bg-black rounded hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-2 group">
                             <Subtitles className="w-6 h-6 text-slate-700 group-hover:text-white" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Subheading</span>
                        </button>

                        <div className="pt-4 border-t border-[#1a1a1a]">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">3D & VFX</p>
                            <div className="grid grid-cols-1 gap-2">
                                <button 
                                    onClick={() => handleSendMessage("Synthesize a cinematic 3D title with heavy extrusion.")}
                                    className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded flex items-center justify-between group hover:bg-indigo-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <Box className="w-4 h-4 text-indigo-400" />
                                        <span className="text-[9px] font-black uppercase text-white">Smart 3D Title</span>
                                    </div>
                                    <Sparkles className="w-3 h-3 text-indigo-400" />
                                </button>
                                <button 
                                    onClick={() => handleSendMessage("Apply a glitching particle reveal to my text.")}
                                    className="p-3 bg-red-500/10 border border-red-500/30 rounded flex items-center justify-between group hover:bg-red-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-red-500" />
                                        <span className="text-[9px] font-black uppercase text-white">Glow Reveal</span>
                                    </div>
                                    <Activity className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                         </div>
                    </div>
                )}

                {state.activeMode === 'motion' && (
                     <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Compositing</p>
                                <div className="px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 text-[6px] font-black text-blue-500 uppercase">Pro</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => handleSendMessage("Rotoscope the subject and isolate background.")}
                                    className={`p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-blue-500 group transition-all relative overflow-hidden ${state.isRotoscoping ? 'bg-blue-500/10 border-blue-500/40' : ''}`}
                                >
                                    {state.isRotoscoping && <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />}
                                    <MousePointer2 className={`w-5 h-5 ${state.isRotoscoping ? 'text-blue-400' : 'text-slate-500'} group-hover:text-blue-400`} />
                                    <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-white">Rotoscoping</span>
                                </button>
                                <button 
                                    onClick={() => handleSendMessage("Track the camera motion in this footage.")}
                                    className={`p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-emerald-500 group transition-all relative overflow-hidden ${state.isTrackingMotion ? 'bg-emerald-500/10 border-emerald-500/40' : ''}`}
                                >
                                    {state.isTrackingMotion && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />}
                                    <Move className={`w-5 h-5 ${state.isTrackingMotion ? 'text-emerald-400' : 'text-slate-500'} group-hover:text-emerald-400`} />
                                    <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-white">Motion Track</span>
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => handleSendMessage("Synthesize a node-based compositing map for this scene.")}
                                className="w-full flex items-center justify-between p-3 rounded bg-[#0a0a0a] border border-[#1a1a1a] hover:border-blue-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-blue-500" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase text-white">Project Flow</span>
                                        <span className="text-[6px] text-slate-500 font-mono italic text-left">View structure</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-700" />
                            </button>
                        </div>

                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Procedural Masking</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => handleSendMessage("Apply a cinematic letterbox mask.")}
                                    className="p-2.5 border border-[#1a1a1a] bg-black rounded flex items-center gap-2 hover:border-white/20 group transition-all"
                                >
                                    <div className="w-6 h-4 border border-white/20 rounded-sm relative overflow-hidden">
                                        <div className="absolute top-0 w-full h-[2px] bg-white/40" />
                                        <div className="absolute bottom-0 w-full h-[2px] bg-white/40" />
                                    </div>
                                    <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-white">Letterbox</span>
                                </button>
                                <button 
                                    onClick={() => handleSendMessage("Add a circular vignette mask.")}
                                    className="p-2.5 border border-[#1a1a1a] bg-black rounded flex items-center gap-2 hover:border-white/20 group transition-all"
                                >
                                    <div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white/20 rounded-full" />
                                    </div>
                                    <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-white">Vignette</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Procedural Shapes</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { type: 'rectangle', icon: Square },
                                    { type: 'circle', icon: Layers },
                                    { type: 'triangle', icon: Activity }
                                ].map(s => (
                                    <button 
                                        key={s.type}
                                        onClick={() => handleSendMessage(`Add a ${s.type} shape to the timeline.`)}
                                        className="p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-yellow-500 group transition-all"
                                    >
                                        <s.icon className="w-4 h-4 text-yellow-500 opacity-50 group-hover:opacity-100" />
                                        <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white">{s.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Particle Systems</p>
                            <div className="h-[1px] flex-1 bg-purple-500/10 ml-3" />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {/* NEW: Procedural VFX Library */}
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest -mb-1 mt-2">Procedural VFX</p>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { name: 'Lens Flare (Anamorphic)', type: 'lens_flare', icon: Sparkles, color: 'text-blue-400' },
                                    { name: 'Heat Distortion', type: 'distortion', icon: Activity, color: 'text-orange-400' },
                                    { name: 'VHS Degradation', type: 'vhs', icon: Shield, color: 'text-emerald-400' },
                                    { name: 'Kinetic Type (Orbital)', type: 'kinetic_orbital', icon: Type, color: 'text-purple-400' },
                                    { name: 'Chroma Glitch', type: 'glitch_pro', icon: Zap, color: 'text-rose-400' }
                                ].map(vfx => (
                                    <button 
                                        key={vfx.type}
                                        onClick={() => handleSendMessage(`Add a cinematic ${vfx.name} effect.`)}
                                        className="w-full flex items-center justify-between p-2 rounded bg-[#0a0a0a] border border-[#1a1a1a] hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <vfx.icon className={`w-3 h-3 ${vfx.color}`} />
                                            <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-white">{vfx.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[5px] text-zinc-700 font-mono group-hover:text-zinc-500">PRO</span>
                                            <Zap className="w-2.5 h-2.5 text-zinc-800 group-hover:text-yellow-500 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Existing Particles */}
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest -mb-1 mt-2">Simulations</p>
                            {[
                                    { name: 'Energy Field', type: 'energy', color: 'text-purple-400' },
                                    { name: 'Atmospheric Dust', type: 'dust', color: 'text-slate-400' },
                                    { name: 'Cinematic Sparkles', type: 'sparkles', color: 'text-yellow-400' }
                                ].map(p => (
                                    <button 
                                        key={p.type}
                                        onClick={() => handleSendMessage(`Generate a high intensity ${p.type} particle simulation.`)}
                                        className="p-3 border border-[#1a1a1a] bg-black rounded flex items-center justify-between hover:border-purple-500 group transition-all"
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-[9px] font-black uppercase text-white">{p.name}</span>
                                            <span className="text-[7px] text-slate-500 font-mono italic">Procedural fluid simulation</span>
                                        </div>
                                        <Activity className={`w-3 h-3 ${p.color}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                )}
            </div>
            
            {/* Master Master Engine Monitor */}
            <div className="p-4 border-t border-[#1a1a1a] bg-black/50">
                                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-sans text-slate-500 uppercase tracking-widest">Volume Level</span>
                    <span className="text-[10px] font-sans text-emerald-400">-3.2dB</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500 w-[65%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <div className="h-full bg-emerald-500/20 w-[10%]" />
                    </div>
                    <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500 w-[72%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <div className="h-full bg-emerald-500/20 w-[8%]" />
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-500">48kHz / 32-bit</span>
                </div>
            </div>
        </aside>
    </div>
  );
};

export default EditorSidebar;
