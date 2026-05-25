import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  Zap,
  Palette,
  Save,
  User,
  Film,
  Download,
  Keyboard,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'ai', name: 'AI & Performance', icon: Database },
  { id: 'export', name: 'Export Defaults', icon: Download },
  { id: 'shortcuts', name: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'account', name: 'Account', icon: User },
];

export const Settings = ({ onClose }: { onClose: () => void }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[600px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex shadow-2xl"
      >
        <div className="w-64 border-r border-zinc-800 p-4 space-y-2">
          <h2 className="text-xl font-bold text-white mb-6 px-2 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-studio-accent" /> Settings
          </h2>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col h-full bg-zinc-950">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-8">
            {activeCategory === 'general' && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Project Defaults
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Default Resolution</label>
                      <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white">
                        <option>1920 x 1080 (HD)</option>
                        <option>3840 x 2160 (4K)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Default Frame Rate</label>
                      <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white">
                        <option>24 fps</option>
                        <option>30 fps</option>
                        <option>60 fps</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>
            )}
            {activeCategory === 'ai' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div>
                      <div className="text-white font-medium">GPU Acceleration</div>
                      <div className="text-xs text-zinc-500">
                        Accelerate rendering and AI inference.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="accent-purple-500 w-5 h-5 cursor-pointer"
                      defaultChecked
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div>
                      <div className="text-white font-medium">Pre-cache Frames</div>
                      <div className="text-xs text-zinc-500">
                        Keep timeline frames in memory for smoother scrubbing.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="accent-purple-500 w-5 h-5 cursor-pointer"
                      defaultChecked
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-900">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
