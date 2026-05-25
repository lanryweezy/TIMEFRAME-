import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Target,
  TrendingUp,
  Palette,
  ShieldCheck,
  Scissors,
  ScissorsLineDashed,
  Music,
  Subtitles,
  Activity,
  Layout,
  Smartphone,
  Wand2,
  Zap,
  Shield,
  Type,
  Share2,
} from 'lucide-react';
import { EditorSidebarProps } from './types';

export const GeneratorTab: React.FC<
  Pick<
    EditorSidebarProps,
    | 'state'
    | 'onFabricate'
    | 'handleSendMessage'
    | 'onOptimizeForPlatform'
    | 'onTrackTrends'
    | 'onGenerateAvatar'
  >
> = ({
  state,
  onFabricate,
  handleSendMessage,
  onOptimizeForPlatform,
  onTrackTrends,
  onGenerateAvatar,
}) => {
  const [genPrompt, setGenPrompt] = useState('');

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <p className="text-[11px] font-black text-blue-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
          <Sparkles className="w-4 h-4" /> Neural Prompt
        </p>
        <textarea
          value={genPrompt}
          onChange={(e) => setGenPrompt(e.target.value)}
          placeholder="Describe the scene you want to synthesize..."
          className="w-full bg-black/40 border border-[#1a1a1a] text-white text-[13px] p-3 rounded-lg focus:border-blue-500 outline-none h-32 font-mono resize-none mb-4 transition-all"
        />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onFabricate(genPrompt, 'image')}
              className="flex-1 bg-white text-black text-[11px] font-black uppercase py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
              aria-label="Generate Image"
            >
              <ImageIcon className="w-4 h-4" /> Image
            </button>
            <button
              onClick={() => onFabricate(genPrompt, 'video')}
              className="flex-1 bg-blue-600 text-white text-[11px] font-black uppercase py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors"
              aria-label="Generate Video"
            >
              <Video className="w-4 h-4" /> Video
            </button>
          </div>
          <button
            onClick={() => {
              if (genPrompt) handleSendMessage(`Generate a custom sound effect: ${genPrompt}`);
              else alert('Please enter a description for the sound effect.');
            }}
            className="w-full bg-cyan-600 text-white text-[11px] font-black uppercase py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-500 transition-colors"
            aria-label="Generate SFX"
          >
            <Music className="w-4 h-4" /> Generate SFX
          </button>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4" /> Growth Lab
          </p>
          <div className="h-[1px] flex-1 bg-yellow-500/10 ml-4" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'Vertical Video',
              icon: Smartphone,
              fn: () => onOptimizeForPlatform?.('tiktok'),
              color: 'hover:border-yellow-500/50',
            },
            {
              label: 'Viral Trends',
              icon: TrendingUp,
              fn: () => onTrackTrends?.('tiktok'),
              color: 'hover:border-red-500/50',
            },
            {
              label: 'Brand Kit',
              icon: Palette,
              fn: () => handleSendMessage('Create my brand kit.'),
              color: 'hover:border-blue-500/50',
            },
            {
              label: 'Quick Audit',
              icon: ShieldCheck,
              fn: () => handleSendMessage('Audit my project.'),
              color: 'hover:border-emerald-500/50',
            },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.fn}
              className={`p-3 border border-[#1a1a1a] bg-black rounded-xl flex flex-col items-center gap-2 ${tool.color} group transition-all`}
              aria-label={tool.label}
            >
              <tool.icon className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white text-center leading-tight tracking-tight">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Smart Editing
          </p>
          <div className="h-[1px] flex-1 bg-[#1a1a1a] ml-4" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Fast Cut', icon: Scissors, cmd: 'Auto-cut the timeline.' },
            { label: 'Silence Fix', icon: ScissorsLineDashed, cmd: 'Remove silent gaps.' },
            { label: 'Find Scenes', icon: Target, cmd: 'Detect scene changes.' },
            { label: 'Best Clips', icon: Sparkles, cmd: 'Identify the best moments.' },
            { label: 'Beat Sync', icon: Music, cmd: 'Sync transitions to music.' },
            { label: 'Add Captions', icon: Subtitles, cmd: 'Generate subtitles.' },
            { label: 'Better Pacing', icon: Activity, cmd: 'Improve video pacing.' },
            { label: 'Story Helper', icon: Layout, cmd: 'Suggest a better storyboard.' },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={() => handleSendMessage(tool.cmd)}
              className="p-3 border border-[#1a1a1a] bg-black rounded-xl flex flex-col items-center gap-2 hover:border-blue-500/50 group transition-all"
              aria-label={tool.label}
            >
              <tool.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
              <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white text-center leading-tight tracking-tight">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">
            Smart Tools
          </p>
          <div className="h-[1px] flex-1 bg-[#1a1a1a] ml-4" />
        </div>
        <div className="space-y-3">
          <button
            onClick={onGenerateAvatar}
            className={`w-full p-3.5 border rounded-xl flex items-center gap-4 transition-all ${state.isGeneratingAvatar ? 'border-orange-500 bg-orange-500/10' : 'border-[#1a1a1a] bg-black hover:border-white/10'}`}
            aria-label="Generate AI Avatar"
          >
            <Smartphone className="w-5 h-5 text-orange-500" />
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-black uppercase text-white leading-none mb-1.5">
                AI Character
              </span>
              <span className="text-[9px] font-sans text-slate-500 uppercase tracking-wider">
                Virtual talking person
              </span>
            </div>
          </button>
          <button
            onClick={() => handleSendMessage('Remove background from current footage.')}
            className={`w-full p-3.5 border rounded-xl flex items-center gap-4 transition-all ${state.isRemovingBackground ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#1a1a1a] bg-black hover:border-white/10'}`}
            aria-label="Remove Background"
          >
            <Wand2 className="w-5 h-5 text-emerald-500" />
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-black uppercase text-white leading-none mb-1.5">
                Remove BG
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                One-click removal
              </span>
            </div>
          </button>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Tracking', icon: Target, cmd: 'Track and follow objects.', color: 'hover:border-orange-500/50' },
              { label: 'Clean BG', icon: Wand2, cmd: 'Remove background.', color: 'hover:border-emerald-500/50' },
              { label: 'Object Rm', icon: Target, cmd: 'Remove specific objects.', color: 'hover:border-red-500/50' },
              { label: 'Smooth', icon: Activity, cmd: 'Smooth out camera motion.', color: 'hover:border-cyan-500/50' },
              { label: 'Highlights', icon: Sparkles, cmd: 'Identify highlights.', color: 'hover:border-yellow-500/50' },
              { label: 'Clip Maker', icon: Zap, cmd: 'Generate viral clips.', color: 'hover:border-blue-500/50' },
              { label: 'Stabilize', icon: Shield, cmd: 'Stabilize jerky footage.', color: 'hover:border-blue-500/50' },
              { label: 'Auto Size', icon: Smartphone, cmd: 'Reframe this video.', color: 'hover:border-purple-500/50' },
            ].map((tool) => (
              <button
                key={tool.label}
                onClick={() => handleSendMessage(tool.cmd)}
                className={`p-3 border border-[#1a1a1a] bg-black rounded-xl flex flex-col items-center gap-2 ${tool.color} group transition-all`}
                aria-label={tool.label}
              >
                <tool.icon className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white text-center leading-tight">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 pb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Marketing Hub
          </p>
          <div className="h-[1px] flex-1 bg-[#1a1a1a] ml-4" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'Thumbnail Maker', icon: ImageIcon, cmd: 'Generate thumbnails.' },
            { label: 'Viral Titles', icon: Type, cmd: 'Suggest viral titles.' },
            { label: 'Social Captions', icon: Share2, cmd: 'Write social captions.' },
            { label: 'Hashtag Ideas', icon: Zap, cmd: 'Suggest hashtags.' },
            { label: 'Script Maker', icon: Subtitles, cmd: 'Generate a script.' },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={() => handleSendMessage(tool.cmd)}
              className="w-full p-3.5 border border-[#1a1a1a] bg-black rounded-xl flex items-center gap-4 hover:border-blue-500/50 group transition-all"
              aria-label={tool.label}
            >
              <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-400" />
              <span className="text-[11px] font-black uppercase text-slate-500 group-hover:text-white">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
