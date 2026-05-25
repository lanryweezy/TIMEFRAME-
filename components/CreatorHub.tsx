import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState } from '../types';
import { HubHeader, HubTab } from './creator-hub/HubHeader';
import { AnalyticsTab } from './creator-hub/AnalyticsTab';
import { ViralTrendsTab } from './creator-hub/ViralTrendsTab';
import { PublishTab } from './creator-hub/PublishTab';
import { SEOOptimizeTab } from './creator-hub/SEOOptimizeTab';

interface CreatorHubProps {
  state: VideoState;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

export const CreatorHub: React.FC<CreatorHubProps> = ({ state, onClose, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('analytics');
  const { analytics } = state;

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed top-0 right-0 bottom-0 w-full md:w-[420px] bg-studio-bg border-l border-studio-border z-[110] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      <HubHeader activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-6 space-y-8 studio-scrollbar bg-[#020202]">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} />}
          {activeTab === 'viral' && <ViralTrendsTab onSendMessage={onSendMessage} />}
          {activeTab === 'publish' && <PublishTab state={state} onSendMessage={onSendMessage} />}
          {activeTab === 'optimize' && <SEOOptimizeTab onSendMessage={onSendMessage} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
