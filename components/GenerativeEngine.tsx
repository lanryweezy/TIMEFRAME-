import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Brain, Wand2, Film, Layers, Cpu, Database } from 'lucide-react';
import { VideoState } from '../types';
import { ViralityWindTunnel } from './ViralityWindTunnel';
import VFXLab from './VFXLab';
import { AudioLab } from './AudioLab';

const FEATURES = [
  { name: 'text-to-video', icon: Zap },
  { name: 'image-to-video', icon: Film },
  { name: 'AI actors', icon: Brain },
  { name: 'voice generation', icon: Wand2 },
  { name: 'storyboard generation', icon: Layers },
  { name: 'scene synthesis', icon: Cpu },
  { name: 'cinematic generation', icon: Sparkles },
  { name: 'procedural animation', icon: Zap },
  { name: 'style transfer', icon: Database },
  { name: 'AI scripting', icon: Brain },
];

interface GenerativeEngineProps {
  state: VideoState;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

export const GenerativeEngine: React.FC<GenerativeEngineProps> = ({
  state,
  onClose,
  onSendMessage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-[#050505] border-l border-white/10 z-[110] flex flex-col shadow-2xl"
    >
      <div className="h-20 flex items-center justify-between px-8 bg-gradient-to-b from-[#111] to-[#050505] border-b border-white/5">
        <h2 className="text-xl font-display font-black text-white italic tracking-tighter">
          THE GENERATIVE ENGINE
        </h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12">
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.name}
              whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => onSendMessage(`Use ${feature.name} to generate content.`)}
              className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-3 text-center"
            >
              <feature.icon className="w-6 h-6 text-indigo-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                {feature.name}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-500/20 text-center space-y-4">
          <Brain className="w-12 h-12 text-indigo-400 mx-auto" />
          <p className="text-sm text-zinc-300 leading-relaxed">
            Unlock infinite creative possibilities. Synthesize scenes, generate voices, and
            orchestrate cinematic masterpieces with the power of the engine.
          </p>
        </div>

        <ViralityWindTunnel state={state} />
        <VFXLab onClose={() => {}} />
        <AudioLab state={state} handleSendMessage={onSendMessage} />
      </div>
    </motion.div>
  );
};
