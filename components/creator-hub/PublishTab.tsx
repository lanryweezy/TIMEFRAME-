import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Plus,
  Calendar,
  ExternalLink,
  Smartphone,
  Heart,
  MessageSquare,
  Share2,
  Activity,
  Layout,
  Sparkles,
} from 'lucide-react';
import { VideoState } from '../../types';
import { MOCK_SCHEDULES } from './mockData';

interface PublishTabProps {
  state: VideoState;
  onSendMessage: (message: string) => void;
}

export const PublishTab: React.FC<PublishTabProps> = ({ state, onSendMessage }) => {
  const schedules = state.distribution?.schedules || MOCK_SCHEDULES;

  return (
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
            Direct-to-Platform Publishing
          </h3>
          <button className="text-[7px] font-black text-studio-accent uppercase tracking-widest flex items-center gap-1">
            Connect New Account
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {schedules.map((sch) => (
            <div
              key={sch.id}
              className="p-4 rounded-xl bg-zinc-900 border border-studio-border group hover:border-studio-accent/50 transition-all cursor-pointer"
              onClick={() => onSendMessage(`Review publishing settings for ${sch.platform}`)}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/5 shadow-2xl relative flex-shrink-0">
                  <img
                    src={sch.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt=""
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 rounded border border-white/10 text-[6px] font-black uppercase">
                    {sch.platform}
                  </div>
                </div>
                <div className="flex-1 min-0 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            sch.status === 'scheduled'
                              ? 'bg-studio-accent animate-pulse'
                              : 'bg-orange-500'
                          }`}
                        />
                        <span className="text-[8px] font-black text-zinc-300 uppercase italic">
                          {sch.status === 'scheduled' ? 'Queued' : 'Draft'}
                        </span>
                      </div>
                      <span className="text-[7px] font-mono text-zinc-500">
                        {new Date(sch.scheduledTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                      "{sch.caption}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {sch.hashtags.map((h) => (
                        <span key={h} className="text-[7px] font-mono text-studio-accent">
                          #{h}
                        </span>
                      ))}
                    </div>
                    <button className="p-1.5 bg-white/5 rounded text-zinc-500 hover:text-white transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => onSendMessage('Schedule new global drop.')}
            className="w-full py-8 border-2 border-dashed border-studio-border rounded-2xl flex flex-col items-center justify-center gap-3 group hover:bg-studio-accent/5 hover:border-studio-accent/30 transition-all"
          >
            <div className="p-3 bg-zinc-900 rounded-full border border-white/5 group-hover:border-studio-accent/30 transition-all">
              <Calendar className="w-6 h-6 text-zinc-700 group-hover:text-studio-accent transition-colors" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-white uppercase tracking-widest block">
                Schedule Global Drop
              </span>
              <span className="text-[7px] text-zinc-600 uppercase font-bold mt-1">
                TikTok, Reels, & Shorts
              </span>
            </div>
          </button>
        </div>
      </section>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black text-white uppercase">Mobile Feed Preview</span>
          </div>
          <button className="text-[8px] font-black uppercase text-indigo-400 hover:underline">
            Change Device
          </button>
        </div>
        <div className="aspect-[9/16] bg-black rounded-3xl border-8 border-zinc-800 shadow-2xl relative overflow-hidden max-w-[200px] mx-auto">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=700&fit=crop"
            className="w-full h-full object-cover opacity-60"
            alt=""
          />
          <div className="absolute inset-0 p-4 flex flex-col justify-end gap-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-white">@timeframe_studio</p>
              <p className="text-[7px] text-zinc-300 line-clamp-2">
                The future of AI creatives is finally here! 🚀 #ai #video #studio
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Heart className="w-4 h-4 text-white" />
                <MessageSquare className="w-4 h-4 text-white" />
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=50&h=50&fit=crop"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-studio-border space-y-4">
        <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">
          Growth Engine Toggles
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-zinc-900 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-studio-accent" />
              <div>
                <p className="text-[10px] font-black text-white uppercase">Viral Heatmap Overlay</p>
                <p className="text-[7px] text-zinc-500 uppercase">Visible on player</p>
              </div>
            </div>
            <button
              onClick={() => onSendMessage('Toggle viral heatmap overlay.')}
              className={`w-10 h-5 rounded-full transition-all relative ${
                state.showViralHeatmap ? 'bg-studio-accent' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  state.showViralHeatmap ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-900 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[10px] font-black text-white uppercase">
                  Engagement Auto-Resizing
                </p>
                <p className="text-[7px] text-zinc-500 uppercase">Zoom on highlights</p>
              </div>
            </div>
            <button
              onClick={() => onSendMessage('Toggle engagement auto-resizing.')}
              className={`w-10 h-5 rounded-full transition-all relative ${
                state.engagementResizing ? 'bg-studio-accent' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  state.engagementResizing ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-studio-accent" />
            AI Trending Captions
          </h3>
          <span className="text-[7px] text-emerald-500 uppercase">New Styles</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Alex Hormozi', color: 'text-yellow-400', font: 'Impact', style: 'impact' },
            { name: 'MrBeast Pop', color: 'text-blue-400', font: 'Montserrat', style: 'impact' },
            { name: 'Minimalist Clean', color: 'text-white', font: 'Inter', style: 'minimal' },
            { name: 'Kinetic Neon', color: 'text-pink-500', font: 'Futura', style: 'standard' },
          ].map((style, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(`Apply ${style.style} style to all subtitles.`)}
              className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col items-center gap-2 group hover:border-studio-accent/40 transition-all"
            >
              <span
                className={`text-[12px] font-black uppercase ${style.color}`}
                style={{ fontFamily: style.font }}
              >
                STYLE {i + 1}
              </span>
              <span className="text-[8px] text-zinc-500 uppercase font-mono">{style.name}</span>
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
