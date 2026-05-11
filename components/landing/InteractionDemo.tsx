import React, { useState } from 'react';
import { motion } from 'motion/react';

export const InteractionDemo = () => {
  const [activeMode, setActiveMode] = useState('Auto-Edit');
  const [progress, setProgress] = useState(33);

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl">
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        {['Auto-Edit', 'Color Grade', 'AI Actors'].map(mode => (
          <button 
            key={mode} 
            onClick={() => setActiveMode(mode)}
            className={`px-4 py-2 rounded-full text-sm transition ${activeMode === mode ? 'bg-electric-blue text-white' : 'bg-transparent text-studio-text hover:text-white'}`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-white/10 mb-6 relative overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-electric-blue/10"
        />
         <span className="text-white font-mono text-xl">{activeMode} Active</span>
      </div>
      <div className="h-16 bg-deep-charcoal rounded-xl border border-white/10 relative flex items-center px-4">
         <motion.div 
            drag="x"
            dragConstraints={{ left: 0, right: 600 }}
            onDrag={(_, info) => setProgress(prev => Math.min(100, Math.max(0, prev + info.offset.x / 6)))}
            className="w-4 h-12 bg-electric-blue rounded-full cursor-grab absolute"
            style={{ left: `${progress}%` }}
         />
      </div>
    </div>
  );
};
