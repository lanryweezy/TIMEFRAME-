import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Brain,
  Wand2,
  Film,
  Layers,
  Cpu,
  Database,
  TrendingUp,
  Search,
  Info,
} from 'lucide-react';
import { VideoState } from '../types';
import { ViralityWindTunnel } from './ViralityWindTunnel';

const GENERATIVE_TOOLS = [
  {
    id: 't2v',
    name: 'Text to Video',
    description: 'Generate high-fidelity cinematic scenes from text prompts.',
    icon: Zap,
    color: 'text-blue-400',
    bg: 'bg-blue-400/5',
    border: 'border-blue-400/20',
  },
  {
    id: 'i2v',
    name: 'Image to Video',
    description: 'Animate static images with neural motion synthesis.',
    icon: Film,
    color: 'text-purple-400',
    bg: 'bg-purple-400/5',
    border: 'border-purple-400/20',
  },
  {
    id: 'actor',
    name: 'AI Actors',
    description: 'Synthesize digital humans with emotive performance.',
    icon: Brain,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/5',
    border: 'border-emerald-400/20',
  },
  {
    id: 'voice',
    name: 'Neural Voice',
    description: 'Cloned or generated voices for narrations and dubbing.',
    icon: Wand2,
    color: 'text-orange-400',
    bg: 'bg-orange-400/5',
    border: 'border-orange-400/20',
  },
  {
    id: 'storyboard',
    name: 'AI Storyboard',
    description: 'Procedural shot breakdown and sequence planning.',
    icon: Layers,
    color: 'text-pink-400',
    bg: 'bg-pink-400/5',
    border: 'border-pink-400/20',
  },
  {
    id: 'scene',
    name: 'Scene Synthesis',
    description: 'Generate environments and lighting setups.',
    icon: Cpu,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/5',
    border: 'border-cyan-400/20',
  },
];

interface GenerativeLabProps {
  state: VideoState;
  onSendMessage: (message: string) => void;
}

export const GenerativeLab: React.FC<GenerativeLabProps> = ({ state, onSendMessage }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar">
      {/* Lab Header */}
      <div className="px-12 py-12 flex flex-col gap-2 border-b border-white/5 bg-gradient-to-r from-studio-accent/5 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-accent/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-studio-accent" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Generative <span className="text-studio-accent">Lab</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-xs font-medium tracking-wide max-w-xl">
          Orchestrate neural networks to synthesize high-fidelity media assets. All generated
          content is automatically optimized for your current project resolution.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 p-12">
        {/* Main Tool Grid */}
        <div className="xl:col-span-8 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Neural Instruments
            </h2>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Engine Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENERATIVE_TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSendMessage(`I want to use ${tool.name}.`)}
                className={`p-6 rounded-2xl border ${tool.border} ${tool.bg} cursor-pointer group transition-all duration-300 flex flex-col gap-4`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-black/40 ${tool.color}`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <button
                    aria-label="More info"
                    title="More info"
                    className="p-1.5 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Info className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    v4.0 Alpha
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-black text-studio-accent uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Launch Tool <Zap className="w-2.5 h-2.5 fill-current" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Virality Insights */}
          <div className="pt-8 border-t border-white/5">
            <ViralityWindTunnel state={state} />
          </div>
        </div>

        {/* Sidebar Lab Info */}
        <div className="xl:col-span-4 space-y-8">
          <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-black uppercase text-white tracking-widest">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-3 hover:bg-white/2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0 border border-white/5 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 opacity-50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-zinc-300 truncate">
                      Cinematic_Shot_{i}.mp4
                    </p>
                    <p className="text-[8px] text-zinc-600 uppercase mt-1">Generated 2h ago</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all">
              View Asset Library
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-studio-accent/5 border border-studio-accent/10 space-y-4">
            <div className="w-10 h-10 rounded-full bg-studio-accent/20 flex items-center justify-center text-studio-accent">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest">AI Context</h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              The engine is currently attuned to your project's{' '}
              <span className="text-studio-accent">"Cinematic Cyberpunk"</span> style profile. All
              generations will inherit these aesthetic weights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
