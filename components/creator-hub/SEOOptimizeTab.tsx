import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Sparkles,
  Copy,
  Hash,
  Target,
  ExternalLink,
  Zap,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

interface SEOOptimizeTabProps {
  onSendMessage: (message: string) => void;
}

export const SEOOptimizeTab: React.FC<SEOOptimizeTabProps> = ({ onSendMessage }) => {
  return (
    <motion.div
      key="optimize"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Search className="w-3 h-3 text-studio-accent" />
            Neural SEO Optimizer
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[7px] text-zinc-500 font-sans">Index Score:</span>
            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">
              94/100
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900 border border-studio-border space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex justify-between items-center">
                AI Suggested Titles
                <button
                  onClick={() => onSendMessage('Regenerate SEO titles.')}
                  className="text-studio-accent hover:underline"
                >
                  Regenerate
                </button>
              </label>
              <div className="space-y-2">
                {[
                  'The Future of AI Creatives is finally here! 🚀',
                  'Why 2026 is the year of Neural Editing 🧠',
                  'I used AI to edit this entire video... (Shocking Result)',
                ].map((title, i) => (
                  <div key={i} className="relative group">
                    <input
                      type="text"
                      readOnly
                      value={title}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-[10px] text-white focus:outline-none focus:border-studio-accent/50 transition-all font-medium pr-10"
                    />
                    <button
                      onClick={() => onSendMessage(`Set title to: ${title}`)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-600 hover:text-studio-accent hover:bg-studio-accent/10 rounded transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex justify-between items-center">
                Neural Descriptions
                <Sparkles className="w-2.5 h-2.5 text-studio-accent" />
              </label>
              <div className="p-3 bg-black border border-white/10 rounded-lg space-y-3">
                <p className="text-[9px] text-zinc-400 leading-relaxed font-medium">
                  "This video explores the intersection of human creativity and generative AI in 2026.
                  We dive deep into neural workflows that are changing the industry..."
                </p>
                <button className="text-[7px] font-black uppercase text-studio-accent flex items-center gap-1 hover:underline">
                  Copy Description <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">
                High-Ranking Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'aivideo',
                  'filmmaking',
                  'tech2026',
                  'creatoreconomy',
                  'viral',
                  'generative',
                  'studio',
                  'neuralediting',
                  'futuretech',
                ].map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-1 bg-studio-accent/10 border border-studio-accent/20 rounded-md text-[8px] font-black text-studio-accent flex items-center gap-1.5 group cursor-pointer hover:bg-studio-accent/20 transition-all"
                  >
                    <Hash className="w-2.5 h-2.5 opacity-50" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => onSendMessage('Apply all SEO optimizations.')}
            className="w-full py-3 bg-studio-accent text-black text-[9px] font-black uppercase rounded-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Target className="w-3.5 h-3.5" />
            Push to Global Search Index
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Zap className="w-3 h-3 text-studio-accent" />
          Creative Mix
        </h3>
        <div className="p-4 rounded-xl bg-black border border-studio-border aspect-[16/9]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'SIGHT', load: 85, fill: '#3b82f6' },
                { name: 'SOUND', load: 42, fill: '#06b6d4' },
                { name: 'PACING', load: 15, fill: '#8b5cf6' },
                { name: 'EFFECTS', load: 68, fill: '#f59e0b' },
                { name: 'SEARCH', load: 94, fill: '#10b981' },
              ]}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 900 }}
              />
              <YAxis hide />
              <Bar dataKey="load" radius={[2, 2, 0, 0]} barSize={20}>
                {[0, 1, 2, 3, 4].map((_, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Layers className="w-3 h-3 text-studio-accent" />
          Active Effects
        </h3>
        <div className="p-4 rounded-xl bg-black border border-studio-border space-y-4">
          {[
            { name: 'Cinematic_Tone_V4', type: 'Color', load: 12, status: 'Active' },
            { name: 'Temporal_Glitch_X', type: 'VFX', load: 45, status: 'Active' },
            { name: 'Neural_Depth_Map', type: 'Geometry', load: 88, status: 'Rendering' },
            { name: 'Grain_Matrix_Sigma', type: 'Texture', load: 5, status: 'Queued' },
          ].map((vfx, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-studio-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <div>
                  <p className="text-[9px] font-bold text-white uppercase font-mono tracking-tighter">
                    {vfx.name}
                  </p>
                  <p className="text-[6px] text-zinc-500 uppercase">
                    {vfx.type} • CPU LOAD: {vfx.load}%
                  </p>
                </div>
              </div>
              <span className="text-[7px] font-black text-studio-accent uppercase tracking-widest">
                {vfx.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
