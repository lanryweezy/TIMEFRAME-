import React from 'react';
import {
  Music2,
  Instagram,
  Video,
  Layout,
  Sparkles,
  ChevronRight,
  Activity,
  Target,
} from 'lucide-react';
import { EditorSidebarProps } from './types';

export const RatioTab: React.FC<
  Pick<
    EditorSidebarProps,
    | 'state'
    | 'onSetSocialPlatform'
    | 'onSetAspectRatio'
    | 'onAutoResize'
    | 'onToggleProxy'
    | 'onToggleMultiCam'
  >
> = ({
  state,
  onSetSocialPlatform,
  onSetAspectRatio,
  onAutoResize,
  onToggleProxy,
  onToggleMultiCam,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[8px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
          Platform
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'tiktok', label: 'TikTok/Reels', ratio: '9:16', icon: Music2 },
            { id: 'reels', label: 'Instagram Post', ratio: '4:5', icon: Instagram },
            { id: 'shorts', label: 'YouTube Shorts', ratio: '9:16', icon: Video },
            { id: 'none', label: 'Standard Landscape', ratio: '16:9', icon: Layout },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSetSocialPlatform?.(p.id as any);
                onSetAspectRatio?.(p.ratio as any);
              }}
              className={`w-full p-3 border rounded flex items-center gap-3 transition-all ${state.socialPlatform === p.id ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-[#1a1a1a] bg-black text-slate-400 hover:border-white/20'}`}
            >
              <p.icon
                className={`w-4 h-4 ${state.socialPlatform === p.id ? 'text-blue-400' : 'text-slate-600'}`}
              />
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
        <p className="text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">
          Aspect Ratio
        </p>
        <div className="flex flex-wrap gap-2">
          {['16:9', '9:16', '1:1', '4:5', '2.35:1'].map((r) => (
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
        <p className="text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">
          Rendering
        </p>
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
          <div
            className={`w-6 h-3 rounded-full relative transition-all ${state.proxyMode ? 'bg-yellow-500' : 'bg-slate-800'}`}
          >
            <div
              className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${state.proxyMode ? 'right-0.5' : 'left-0.5'}`}
            />
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
          <div
            className={`w-6 h-3 rounded-full relative transition-all ${state.multiCamMode ? 'bg-cyan-500' : 'bg-slate-800'}`}
          >
            <div
              className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${state.multiCamMode ? 'right-0.5' : 'left-0.5'}`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
