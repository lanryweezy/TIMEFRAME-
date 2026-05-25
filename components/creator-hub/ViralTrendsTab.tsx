import React from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Rocket,
  Activity,
  Music,
  Search,
  Play,
  Target,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { VIRAL_TRENDS, TRAJECTORY_DATA } from './mockData';

interface ViralTrendsTabProps {
  onSendMessage: (message: string) => void;
}

export const ViralTrendsTab: React.FC<ViralTrendsTabProps> = ({ onSendMessage }) => {
  return (
    <motion.div
      key="viral"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Flame className="w-3 h-3 text-orange-500" />
            Trending Now
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[7px] text-zinc-500 font-sans">Speed:</span>
            <span className="text-[9px] font-black text-white bg-orange-500 px-1.5 rounded">
              HIGH
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {VIRAL_TRENDS.map((trend, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                      trend.trend === 'rising'
                        ? 'bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                        : 'bg-zinc-800 border-white/10'
                    }`}
                  >
                    {trend.trend === 'rising' ? (
                      <Rocket className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Activity className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-tight">
                      {trend.name}
                    </h4>
                    <p className="text-[7px] text-zinc-500 font-mono uppercase tracking-tighter">
                      {trend.platform} • Popularity: {trend.score}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-[8px] font-black uppercase ${trend.trend === 'rising' ? 'text-orange-500' : 'text-emerald-500'}`}
                  >
                    {trend.trend.toUpperCase()}
                  </span>
                  <div className="h-0.5 w-12 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.score}%` }}
                      className={`h-full ${trend.trend === 'rising' ? 'bg-orange-500' : 'bg-studio-accent'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
              Social Trending Music
            </h4>
            <div className="p-1 bg-studio-accent/10 rounded border border-studio-accent/20">
              <Music className="w-3 h-3 text-studio-accent" />
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 group-focus-within:text-studio-accent transition-colors" />
            <input
              type="text"
              placeholder="Search viral tracks..."
              className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-[10px] text-white focus:outline-none focus:border-studio-accent/50 transition-all"
            />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto studio-scrollbar pr-1">
            {[
              {
                name: 'Phonk Midnight',
                artist: 'SIGMA',
                use: '2.4M',
                trend: '+12%',
                platform: 'TikTok',
              },
              {
                name: 'Lo-Fi Chill Beat',
                artist: 'LUNA',
                use: '850K',
                trend: '+45%',
                platform: 'IG',
              },
              {
                name: 'Cyberpunk Bass',
                artist: 'REZZ',
                use: '1.2M',
                trend: '+5%',
                platform: 'YouTube',
              },
              {
                name: 'Hyperpop Glitch',
                artist: '100 gecs',
                use: '600K',
                trend: '+88%',
                platform: 'Reels',
              },
            ].map((sound, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 group hover:border-studio-accent/30 transition-all cursor-pointer"
                onClick={() => onSendMessage(`Import trending track: ${sound.name}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-studio-accent/10 flex items-center justify-center text-studio-accent group-hover:bg-studio-accent group-hover:text-black transition-all">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-white uppercase">{sound.name}</p>
                    <p className="text-[7px] text-zinc-600 uppercase font-sans">
                      {sound.artist} • {sound.platform}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-emerald-500 font-mono">
                    {sound.trend}
                  </span>
                  <span className="text-[6px] text-zinc-600 uppercase">{sound.use} USES</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2 bg-studio-accent/10 border border-studio-accent/20 text-[9px] font-black uppercase text-studio-accent rounded-lg hover:bg-studio-accent/20 transition-all">
            See More Trends
          </button>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
              Viral Growth Trajectory
            </h4>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-studio-accent" />
                <span className="text-[6px] text-zinc-600">ACTUAL</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-studio-accent/20" />
                <span className="text-[6px] text-zinc-600">PREDICTED</span>
              </div>
            </div>
          </div>
          <div className="h-40 w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAJECTORY_DATA}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.02)"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 7, fill: '#3f3f46' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '8px',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="potential"
                  stroke="#6366f1"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-12 h-12 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.1em]">
              AI Growth Tips
            </h4>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              "Your project fits the{' '}
              <span className="text-white font-bold tracking-tight uppercase">Cool Glitch</span> trend.
              You have a <span className="text-indigo-400 font-bold">big chance</span> on TikTok if you
              post by <span className="text-white font-bold">6 PM</span>."
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[7px] text-zinc-500 uppercase font-mono">Success Chance</span>
                <span className="text-xl font-display font-black text-white italic">74.2%</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[7px] text-zinc-500 uppercase font-mono">Intro Quality</span>
                <span className="text-xl font-display font-black text-emerald-400 italic">
                  EXCELLENT
                </span>
              </div>
            </div>

            <button
              onClick={() => onSendMessage('Publish now.')}
              className="w-full py-3 bg-white text-black text-[9px] font-black uppercase rounded-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-3.5 h-3.5" />
              Share Now
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Award className="w-3 h-3 text-studio-accent" />
          Personal Score
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl text-center space-y-1">
            <span className="text-[7px] text-zinc-600 uppercase font-mono block">Rank</span>
            <span className="text-2xl font-display font-black text-white italic tracking-tighter">
              #04
            </span>
          </div>
          <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl text-center space-y-1">
            <span className="text-[7px] text-zinc-600 uppercase font-mono block">Level</span>
            <span className="text-2xl font-display font-black text-studio-accent italic tracking-tighter">
              TOP
            </span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
