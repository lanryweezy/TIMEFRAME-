import React from 'react';
import { Type, Subtitles, Box, Sparkles, Zap, Activity } from 'lucide-react';
import { EditorSidebarProps } from './types';

export const TextTab: React.FC<Pick<EditorSidebarProps, 'onAddText' | 'handleSendMessage'>> = ({
  onAddText,
  handleSendMessage,
}) => {
  return (
    <div className="space-y-3">
      <button
        onClick={() => onAddText('title')}
        className="w-full p-6 border border-[#1a1a1a] bg-black rounded hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <Type className="w-6 h-6 text-slate-700 group-hover:text-white" />
        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Heading</span>
      </button>
      <button
        onClick={() => onAddText('sub')}
        className="w-full p-4 border border-[#1a1a1a] bg-black rounded hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <Subtitles className="w-6 h-6 text-slate-700 group-hover:text-white" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Subheading
        </span>
      </button>

      <div className="pt-4 border-t border-[#1a1a1a]">
        <p className="text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">
          3D & VFX
        </p>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() =>
              handleSendMessage('Synthesize a cinematic 3D title with heavy extrusion.')
            }
            className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded flex items-center justify-between group hover:bg-indigo-500/20"
          >
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-indigo-400" />
              <span className="text-[9px] font-black uppercase text-white">Smart 3D Title</span>
            </div>
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </button>
          <button
            onClick={() => handleSendMessage('Apply a glitching particle reveal to my text.')}
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
  );
};
