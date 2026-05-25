import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  TrendingUp,
  Target,
  Info,
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
import { VideoState } from '../../types';
import { RETENTION_DATA } from './mockData';

interface AnalyticsTabProps {
  analytics: VideoState['analytics'];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analytics }) => {
  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity className="w-4 h-4 text-studio-accent" />
            AI Analysis
          </h3>
          <span className="text-[9px] px-3 py-1 bg-studio-accent/10 text-studio-accent border border-studio-accent/20 rounded-md font-black uppercase">
            Live Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            analytics?.views,
            analytics?.engagement,
            analytics?.retention,
            analytics?.reach,
          ].map(
            (metric, i) =>
              metric && (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-studio-border hover:bg-zinc-900/60 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest font-mono">
                      {metric.label}
                    </span>
                    <TrendingUp
                      className={`w-4 h-4 ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-500'}`}
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-black text-white tracking-tighter font-mono">
                      {metric.value}
                    </span>
                    <div
                      className={`text-[7px] font-black px-1.5 py-0.5 rounded ${metric.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}
                    >
                      {metric.change}%
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-studio-accent/10 to-transparent border border-studio-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-studio-accent/20 flex items-center justify-center border border-studio-accent/30">
              <Target className="w-4 h-4 text-studio-accent" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">
                Potential Earnings
              </h4>
              <p className="text-[7px] text-zinc-500 uppercase font-sans">
                Estimated Total
              </p>
            </div>
          </div>
          <div className="flex items-end gap-3 justify-between">
            <div className="space-y-1">
              <span className="text-2xl font-black text-white">$12,450.00</span>
              <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">
                Total Value • 14% growth
              </p>
            </div>
            <button className="px-4 py-2 bg-studio-accent text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all">
              Withdraw
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-studio-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              Watch Time
            </h4>
            <Info className="w-3 h-3 text-zinc-700" />
          </div>
          <div className="h-40 w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RETENTION_DATA}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#52525b' }}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '8px',
                  }}
                  labelStyle={{ color: '#6366f1' }}
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorRetention)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-studio-accent/5 rounded-lg border border-studio-accent/10">
            <p className="text-[7.5px] text-zinc-400 leading-tight italic">
              "People stop watching around 10 seconds. Try adding a faster transition here."
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-studio-border">
          <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-4">
            Top Conversion Sources
          </h4>
          <div className="space-y-3">
            {[
              { platform: 'TikTok Search', share: 45, color: 'bg-emerald-500' },
              { platform: 'Instagram Reels', share: 30, color: 'bg-studio-accent' },
              { platform: 'YouTube Shorts', share: 15, color: 'bg-red-500' },
              { platform: 'Direct Links', share: 10, color: 'bg-purple-500' },
            ].map((source, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-[7px] font-black uppercase">
                  <span className="text-zinc-400">{source.platform}</span>
                  <span className="text-white">{source.share}%</span>
                </div>
                <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.share}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${source.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
