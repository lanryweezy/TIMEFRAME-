import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Flame,
  Calendar,
  Zap,
} from 'lucide-react';

export type HubTab = 'analytics' | 'viral' | 'publish' | 'optimize';

interface HubHeaderProps {
  activeTab: HubTab;
  setActiveTab: (tab: HubTab) => void;
  onClose: () => void;
}

export const HubHeader: React.FC<HubHeaderProps> = ({
  activeTab,
  setActiveTab,
  onClose,
}) => {
  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: HubTab;
    label: string;
    icon: any;
  }) => (
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
    <>
      <div className="h-14 border-b border-studio-border flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-studio-accent/20 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-accent/10 rounded-sm border border-studio-accent/20">
            <Sparkles className="w-4 h-4 text-studio-accent" />
          </div>
          <div>
            <h2 className="text-[13px] font-black text-white uppercase tracking-[0.2em] leading-tight">
              Video Analytics
            </h2>
            <p className="text-[10px] text-zinc-600 uppercase font-sans tracking-tighter">
              Performance Overview
            </p>
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
    </>
  );
};
