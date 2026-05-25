import React from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Instagram,
  Music2,
  Video,
  Image as ImageIcon,
  Zap,
  Target,
  Sparkles,
  Activity,
  Layout,
  Wand2,
  Settings,
  Box,
  Binary,
  Sun,
  Waves,
} from 'lucide-react';
import { EditorSidebarProps } from './types';

export const TemplatesTab: React.FC<
  Pick<EditorSidebarProps, 'onApplyTemplate' | 'handleSendMessage'>
> = ({ onApplyTemplate, handleSendMessage }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="micro-label">Templates</p>
        <div className="px-1.5 py-0.5 bg-yellow-500/10 rounded border border-yellow-500/20 text-[10px] font-black text-yellow-500 uppercase tracking-tight">
          New
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'vlog', label: 'Daily Vlog', icon: Instagram, color: 'text-pink-500' },
          { name: 'tiktok', label: 'Vertical Video', icon: Music2, color: 'text-white' },
          { name: 'cinematic', label: 'Modern Look', icon: Video, color: 'text-blue-400' },
          { name: 'vintage', label: 'Old Film', icon: ImageIcon, color: 'text-amber-500' },
          { name: 'gaming', label: 'Game Clip', icon: Zap, color: 'text-purple-500' },
          { name: 'promo', label: 'Company Ad', icon: Target, color: 'text-red-500' },
        ].map((tpl) => (
          <button
            key={tpl.name}
            onClick={() => onApplyTemplate?.(tpl.name)}
            className="p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-white/20 group transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-2 h-2 text-white" />
            </div>
            <tpl.icon
              className={`w-5 h-5 ${tpl.color} group-hover:scale-110 transition-transform`}
            />
            <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-white leading-none">
              {tpl.label}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
        <p className="micro-label flex items-center gap-2">Project Assets</p>
        <div className="space-y-1">
          {['B-Roll 01', 'Intro Graphics', 'Interview Audio'].map((c, i) => (
            <button
              key={i}
              onClick={() => onApplyTemplate?.(c)}
              className="w-full flex items-center justify-between p-2 rounded bg-black border border-[#1a1a1a] hover:bg-[#0a0a0a] transition-all group"
            >
              <span className="text-[7px] font-mono text-slate-400 group-hover:text-white truncate">
                {c}
              </span>
              <Plus className="w-2 h-2 text-slate-600" />
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
        <div className="flex items-center justify-between">
          <p className="micro-label text-slate-500">Movements</p>
          <Zap className="w-2.5 h-2.5 text-blue-500/50" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Pop In', type: 'pop_in', icon: Sparkles, color: 'text-yellow-400' },
            {
              name: 'Bounce',
              type: 'elastic_bounce',
              icon: Activity,
              color: 'text-purple-400',
            },
            { name: 'Slide', type: 'slide_mask', icon: Layout, color: 'text-blue-400' },
            {
              name: 'Distort',
              type: 'liquid_distortion',
              icon: Wand2,
              color: 'text-cyan-400',
            },
          ].map((preset) => (
            <button
              key={preset.type}
              onClick={() => handleSendMessage(`Apply ${preset.name} animation preset.`)}
              className="flex flex-col items-center justify-center p-2.5 rounded bg-black border border-[#1a1a1a] hover:border-white/20 transition-all group"
            >
              <preset.icon
                className={`w-3.5 h-3.5 mb-1.5 ${preset.color} group-hover:scale-110 transition-transform`}
              />
              <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-white">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Library</p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Settings className="w-2.5 h-2.5 text-zinc-500" />
          </motion.div>
        </div>

        <div className="flex gap-1 mb-2">
          {['linear', 'easeOut', 'backOut', 'anticipate'].map((e) => (
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
            {
              name: 'Block Build',
              preset: 'voxel_build',
              icon: Box,
              desc: '3D blocks appear',
            },
            {
              name: 'Digital Rain',
              preset: 'matrix_cascade',
              icon: Binary,
              desc: 'Matrix style code',
            },
            { name: 'Soft Glow', preset: 'nebula_glow', icon: Sun, desc: 'Magical light' },
            {
              name: 'Moving Dust',
              preset: 'liquid_distortion',
              icon: Waves,
              desc: 'Slow particles',
            },
          ].map((item) => (
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
      <p className="text-[7px] font-mono text-slate-600 uppercase text-center mt-4 tracking-widest">
        Choose a template to get started quickly.
      </p>
    </div>
  );
};
