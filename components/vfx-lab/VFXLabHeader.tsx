import React from 'react';
import { Network, Wand2, Sliders, Scissors } from 'lucide-react';
import { motion } from 'motion/react';

interface VFXLabHeaderProps {
  viewMode: 'graph' | 'sliders';
  setViewMode: (mode: 'graph' | 'sliders') => void;
  onClose: () => void;
}

export const VFXLabHeader: React.FC<VFXLabHeaderProps> = ({
  viewMode,
  setViewMode,
  onClose,
}) => {
  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: 'graph' | 'sliders';
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setViewMode(id)}
      className={`flex items-center gap-2 px-6 py-2 transition-all relative ${
        viewMode === id ? 'text-studio-accent' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {viewMode === id && (
        <motion.div
          layoutId="vfxTab"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-studio-accent"
        />
      )}
    </button>
  );

  return (
    <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl relative z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-accent/20 rounded-lg">
            <Network className="w-5 h-5 text-studio-accent" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">
              VFX Neural Lab
            </h2>
            <p className="text-[8px] text-zinc-600 uppercase font-mono mt-1">
              GPU Accelerated • Node Graph V2.0
            </p>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div className="flex bg-zinc-900/50 rounded-lg p-1">
          <TabButton id="graph" label="Graph" icon={Wand2} />
          <TabButton id="sliders" label="Sliders" icon={Sliders} />
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 hover:bg-white/5 rounded-lg transition-all text-zinc-500 hover:text-white border border-transparent hover:border-white/10"
      >
        <Scissors className="w-4 h-4" />
      </button>
    </div>
  );
};
