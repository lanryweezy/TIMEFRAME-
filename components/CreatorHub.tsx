import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, Target, BarChart3, Palette, ShieldCheck, 
  Share2, Sparkles, AlertCircle, Layers, Zap, Activity, Wand2, 
  Play, Calendar, Globe, Search, Copy, CheckCircle2, Clock,
  ArrowUpRight, ExternalLink, Hash, Layout, Eye, MessageSquare,
  ChevronRight, Brain, Filter, Download, Cpu, Server, Wifi, 
  Smartphone, Monitor, RefreshCw, HardDrive, Database, ZapOff,
  Flame, Rocket, Award, Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { VideoState, PublishingSchedule, ABTest, SocialPlatform, ComputeNode, RenderingPipeline } from '../types';

interface CreatorHubProps {
  state: VideoState;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

type HubTab = 'analytics' | 'viral' | 'publish' | 'optimize';

const TRAJECTORY_DATA = [
  { hour: '0h', potential: 10, actual: 5 },
  { hour: '4h', potential: 45, actual: 38 },
  { hour: '8h', potential: 85, actual: 92 },
  { hour: '12h', potential: 140, actual: 156 },
  { hour: '16h', potential: 220, actual: 210 },
  { hour: '20h', potential: 380, actual: 410 },
  { hour: '24h', potential: 650, actual: 720 },
];

const RETENTION_DATA = [
  { time: '0s', retention: 100 },
  { time: '3s', retention: 92 },
  { time: '10s', retention: 78 },
  { time: '30s', retention: 65 },
  { time: '1m', retention: 58 },
  { time: '2m', retention: 42 },
  { time: '5m', retention: 35 },
];

const VIRAL_TRENDS = [
  { name: 'Cinematic Glitch', score: 94, platform: 'TikTok', trend: 'rising' },
  { name: 'Cyberpunk Aesthetic', score: 88, platform: 'Instagram', trend: 'stable' },
  { name: 'Hyperlapse HDR', score: 72, platform: 'YouTube', trend: 'hot' },
  { name: 'AI Voiceover V4', score: 91, platform: 'Reels', trend: 'rising' },
];

export const CreatorHub: React.FC<CreatorHubProps> = ({ state, onClose, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('analytics');
  const { analytics, brandKit, distribution } = state;

  const mockSchedules = distribution?.schedules || [
    {
      id: 'sch_1',
      platform: 'tiktok',
      scheduledTime: Date.now() + 3600000 * 5,
      status: 'scheduled',
      caption: 'The future of AI video is here. #ai #video #studio',
      hashtags: ['ai', 'video', 'studio'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop'
    },
    {
      id: 'sch_2',
      platform: 'reels',
      scheduledTime: Date.now() + 3600000 * 24,
      status: 'draft',
      caption: 'Behind the scenes of our latest creation.',
      hashtags: ['creative', 'vfx'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop'
    }
  ];

  const mockABTests = distribution?.abTests || [
    {
      id: 'ab_1',
      name: 'Thumbnail Performance Test',
      status: 'running',
      variants: [
        { id: 'v1', thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop', title: 'Option A: Abstract', metrics: { ctr: 4.2, avgViewTime: 45 } },
        { id: 'v2', thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop', title: 'Option B: Portrait', metrics: { ctr: 5.8, avgViewTime: 52 } }
      ]
    }
  ];

  const thermalMatrix = React.useMemo(() => [...Array(32)].map(() => Math.random()), []);

  const TabButton = ({ id, label, icon: Icon }: { id: HubTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${
        activeTab === id ? 'text-studio-accent' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === id ? 'animate-pulse' : ''}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {activeTab === id && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-studio-accent"
        />
      )}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed top-0 right-0 bottom-0 w-full md:w-[420px] bg-studio-bg border-l border-studio-border z-[110] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      <div className="h-14 border-b border-studio-border flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-studio-accent/20 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-accent/10 rounded-sm border border-studio-accent/20">
            <Sparkles className="w-4 h-4 text-studio-accent" />
          </div>
          <div>
            <h2 className="text-[13px] font-black text-white uppercase tracking-[0.2em] leading-tight">Video Analytics</h2>
            <p className="text-[10px] text-zinc-600 uppercase font-sans tracking-tighter">Performance Overview</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-sm transition-all text-zinc-600 hover:text-white border border-transparent hover:border-studio-border"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex border-b border-studio-border bg-black/20">
        <TabButton id="analytics" label="Stats" icon={TrendingUp} />
        <TabButton id="viral" label="Trends" icon={Flame} />
        <TabButton id="publish" label="Post" icon={Calendar} />
        <TabButton id="optimize" label="Growth" icon={Zap} />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 studio-scrollbar bg-[#020202]">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
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
                  <span className="text-[9px] px-3 py-1 bg-studio-accent/10 text-studio-accent border border-studio-accent/20 rounded-md font-black uppercase">Live Data</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[analytics?.views, analytics?.engagement, analytics?.retention, analytics?.reach].map((metric, i) => (
                    metric && (
                      <div key={i} className="p-4 rounded-xl bg-zinc-900/40 border border-studio-border hover:bg-zinc-900/60 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest font-mono">{metric.label}</span>
                          <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-500'}`} />
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-lg font-black text-white tracking-tighter font-mono">{metric.value}</span>
                          <div className={`text-[7px] font-black px-1.5 py-0.5 rounded ${metric.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                            {metric.change}%
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-studio-accent/10 to-transparent border border-studio-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-studio-accent/20 flex items-center justify-center border border-studio-accent/30">
                      <Target className="w-4 h-4 text-studio-accent" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Potential Earnings</h4>
                      <p className="text-[7px] text-zinc-500 uppercase font-sans">Estimated Total</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 justify-between">
                    <div className="space-y-1">
                      <span className="text-2xl font-black text-white">$12,450.00</span>
                      <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">Total Value • 14% growth</p>
                    </div>
                    <button className="px-4 py-2 bg-studio-accent text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all">
                      Withdraw
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/40 border border-studio-border">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Watch Time</h4>
                     <Info className="w-3 h-3 text-zinc-700" />
                  </div>
                  <div className="h-40 w-full font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={RETENTION_DATA}>
                        <defs>
                          <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#52525b' }} 
                        />
                        <YAxis 
                          hide 
                          domain={[0, 100]} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '8px' }}
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
                  <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-4">Top Conversion Sources</h4>
                  <div className="space-y-3">
                    {[
                      { platform: 'TikTok Search', share: 45, color: 'bg-emerald-500' },
                      { platform: 'Instagram Reels', share: 30, color: 'bg-studio-accent' },
                      { platform: 'YouTube Shorts', share: 15, color: 'bg-red-500' },
                      { platform: 'Direct Links', share: 10, color: 'bg-purple-500' }
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
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${source.color}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'viral' && (
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
                    <span className="text-[9px] font-black text-white bg-orange-500 px-1.5 rounded">HIGH</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {VIRAL_TRENDS.map((trend, i) => (
                    <div key={i} className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                            trend.trend === 'rising' ? 'bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-zinc-800 border-white/10'
                          }`}>
                            {trend.trend === 'rising' ? <Rocket className="w-4 h-4 text-orange-500" /> : <Activity className="w-4 h-4 text-zinc-500" />}
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-tight">{trend.name}</h4>
                            <p className="text-[7px] text-zinc-500 font-mono uppercase tracking-tighter">{trend.platform} • Popularity: {trend.score}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`text-[8px] font-black uppercase ${trend.trend === 'rising' ? 'text-orange-500' : 'text-emerald-500'}`}>
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
                    <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Trending Sounds</h4>
                    <Search className="w-3 h-3 text-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Phonk Midnight', use: '2.4M', trend: '+12%' },
                      { name: 'Lo-Fi Chill Beat', use: '850K', trend: '+45%' },
                      { name: 'Cyberpunk Bass', use: '1.2M', trend: '+5%' }
                    ].map((sound, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 group hover:border-studio-accent/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-studio-accent/10 flex items-center justify-center text-studio-accent group-hover:bg-studio-accent group-hover:text-black transition-all">
                             <Play className="w-2.5 h-2.5 fill-current" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-white">{sound.name}</p>
                            <p className="text-[7px] text-zinc-600 uppercase font-sans">USES</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-black text-emerald-500 font-mono">{sound.trend}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Viral Growth Trajectory</h4>
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
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis 
                          dataKey="hour" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 7, fill: '#3f3f46' }} 
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '8px', borderRadius: '8px' }}
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
                      <h4 className="text-[11px] font-black text-white uppercase tracking-[0.1em]">AI Growth Tips</h4>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                        "Your project fits the <span className="text-white font-bold tracking-tight uppercase">Cool Glitch</span> trend. 
                        You have a <span className="text-indigo-400 font-bold">big chance</span> on TikTok if you post by <span className="text-white font-bold">6 PM</span>."
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                         <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-[7px] text-zinc-500 uppercase font-mono">Success Chance</span>
                            <span className="text-xl font-display font-black text-white italic">74.2%</span>
                         </div>
                         <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-[7px] text-zinc-500 uppercase font-mono">Intro Quality</span>
                            <span className="text-xl font-display font-black text-emerald-400 italic">EXCELLENT</span>
                         </div>
                      </div>

                      <button onClick={() => onSendMessage("Publish now.")} className="w-full py-3 bg-white text-black text-[9px] font-black uppercase rounded-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
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
                      <span className="text-2xl font-display font-black text-white italic tracking-tighter">#04</span>
                   </div>
                   <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl text-center space-y-1">
                      <span className="text-[7px] text-zinc-600 uppercase font-mono block">Level</span>
                      <span className="text-2xl font-display font-black text-studio-accent italic tracking-tighter">TOP</span>
                   </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'publish' && (
            <motion.div
              key="publish"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Globe className="w-3 h-3 text-studio-accent" />
                    Share Everywhere
                  </h3>
                  <button className="text-[7px] font-black text-studio-accent uppercase tracking-widest flex items-center gap-1">
                    Connect All
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {mockSchedules.map((sch) => (
                    <div key={sch.id} className="p-4 rounded-xl bg-zinc-900 border border-studio-border group hover:border-studio-accent/50 transition-all">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/5 shadow-2xl relative">
                          <img src={sch.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                          <div className="absolute top-1 left-1 px-1 py-0.5 bg-black/80 rounded border border-white/10 text-[6px] font-black uppercase">
                            {sch.platform}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${sch.status === 'scheduled' ? 'bg-studio-accent animate-pulse' : 'bg-orange-500'}`} />
                              <span className="text-[8px] font-black text-zinc-300 uppercase italic">
                                {sch.status === 'scheduled' ? 'Queued' : 'Draft'}
                              </span>
                            </div>
                            <span className="text-[7px] font-mono text-zinc-500">
                              {new Date(sch.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">"{sch.caption}"</p>
                          <div className="flex flex-wrap gap-1">
                            {sch.hashtags.map(h => (
                              <span key={h} className="text-[7px] font-mono text-studio-accent">#{h}</span>
                            ))}
                          </div>
                        </div>
                        <button className="p-2 text-zinc-600 hover:text-white transition-colors self-start">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-6 border-2 border-dashed border-studio-border rounded-xl flex flex-col items-center justify-center gap-2 group hover:bg-studio-accent/5 hover:border-studio-accent/30 transition-all">
                    <Calendar className="w-5 h-5 text-zinc-700 group-hover:text-studio-accent transition-colors" />
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-studio-accent">Schedule New Drop</span>
                  </button>
                </div>
              </section>

              <section className="p-4 rounded-xl bg-black/40 border border-studio-border space-y-4">
                <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Connected Accounts</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['tiktok', 'instagram', 'youtube', 'twitter'].map((p) => (
                    <div key={p} className="aspect-square rounded-lg bg-zinc-900 border border-white/5 flex flex-col items-center justify-center gap-2 relative group overflow-hidden">
                      <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
                      <Globe className="w-4 h-4 text-zinc-400 group-hover:text-studio-accent transition-colors" />
                      <span className="text-[6px] font-black uppercase text-zinc-600">{p}</span>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'optimize' && (
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
                    Reach More People
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] text-zinc-500 font-sans">Index Status:</span>
                    <span className="text-[9px] font-black text-white bg-studio-accent px-1.5 rounded">FAST</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-zinc-900 border border-studio-border space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex justify-between">
                        Title Ideas
                        <Wand2 className="w-2.5 h-2.5 text-studio-accent" />
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly
                          value="The Future of AI Creatives is finally here! 🚀"
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-[10px] text-white focus:outline-none focus:border-studio-accent/50 transition-all font-medium pr-10"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-studio-accent hover:bg-studio-accent/10 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">Best Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {['aivideo', 'filmmaking', 'tech2026', 'creatoreconomy', 'viral', 'generative', 'studio'].map(tag => (
                          <div key={tag} className="px-2 py-1 bg-studio-accent/10 border border-studio-accent/20 rounded-md text-[8px] font-black text-studio-accent flex items-center gap-1.5 group cursor-pointer hover:bg-studio-accent/20 transition-all">
                            <Hash className="w-2.5 h-2.5 opacity-50" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                 <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Zap className="w-3 h-3 text-studio-accent" />
                   Creative Mix
                 </h3>
                 <div className="p-4 rounded-xl bg-black border border-studio-border aspect-[16/9]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'SIGHT', load: 85, fill: '#3b82f6' },
                            { name: 'SOUND', load: 42, fill: '#06b6d4' },
                            { name: 'PACING', load: 15, fill: '#8b5cf6' },
                            { name: 'EFFECTS', load: 68, fill: '#f59e0b' },
                            { name: 'SEARCH', load: 94, fill: '#10b981' }
                        ]}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 900 }} />
                            <YAxis hide />
                            <Bar dataKey="load" radius={[2, 2, 0, 0]} barSize={20}>
                                { [0,1,2,3,4].map((_, index) => (
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
                      { name: 'Grain_Matrix_Sigma', type: 'Texture', load: 5, status: 'Queued' }
                    ].map((vfx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-studio-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <div>
                               <p className="text-[9px] font-bold text-white uppercase font-mono tracking-tighter">{vfx.name}</p>
                               <p className="text-[7px] text-zinc-600 uppercase font-mono">{vfx.type} • LOAD: {vfx.load}%</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className={`text-[7px] font-black uppercase ${vfx.status === 'Active' ? 'text-emerald-500' : 'text-studio-accent animate-pulse'}`}>
                               {vfx.status}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Copy className="w-3 h-3 text-studio-accent" />
                    Thumbnail Testing
                  </h3>
                  <span className="text-[7px] font-sans text-emerald-500 uppercase">Live Test</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {mockABTests[0].variants.map((variant, i) => (
                    <div key={variant.id} className="space-y-3 p-3 bg-zinc-900 border border-studio-border rounded-xl group relative overflow-hidden">
                      <div className="aspect-video rounded-lg overflow-hidden border border-white/10 shadow-xl">
                        <img src={variant.thumbnailUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">{variant.title}</span>
                          <span className={`text-[10px] font-black ${i === 1 ? 'text-studio-accent' : 'text-zinc-600'}`}>{i === 1 ? 'WINNING' : 'TESTING'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-black/40 rounded-lg border border-white/5 space-y-1 text-center">
                            <span className="text-[6px] text-zinc-600 uppercase font-mono block">CTR</span>
                            <span className="text-[10px] text-white font-black">{variant.metrics?.ctr}%</span>
                          </div>
                          <div className="p-2 bg-black/40 rounded-lg border border-white/5 space-y-1 text-center">
                            <span className="text-[6px] text-zinc-600 uppercase font-mono block">VIEW_T</span>
                            <span className="text-[10px] text-white font-black">{variant.metrics?.avgViewTime}s</span>
                          </div>
                        </div>
                      </div>
                      {i === 1 && <div className="absolute top-0 right-0 p-1 bg-studio-accent text-black text-[7px] font-black uppercase rounded-bl shadow-lg">Leader</div>}
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-4 rounded-xl bg-studio-accent/5 border border-studio-accent/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-studio-accent/20 flex items-center justify-center border border-studio-accent/30 flex-shrink-0 animate-pulse">
                  <Brain className="w-5 h-5 text-studio-accent" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-white uppercase tracking-wider">Smart Search</h5>
                  <p className="text-[9px] text-zinc-500 leading-tight">We're making your video easy to find.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-black border-t border-studio-border">
        <button className="w-full h-12 bg-studio-accent hover:bg-studio-accent/90 text-black text-[10px] font-black uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 group">
          <Zap className="w-3 h-3 group-hover:animate-pulse" />
          {activeTab === 'analytics' ? 'SAVE STATS' : activeTab === 'publish' ? 'POST EVERYWHERE' : 'FIX VIDEO'}
        </button>
      </div>
    </motion.div>
  );
};
