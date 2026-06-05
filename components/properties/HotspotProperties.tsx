import React from 'react';
import { motion } from 'motion/react';
import { Target, Plus, Trash2, ExternalLink, Globe, Clock, Crosshair } from 'lucide-react';
import { VideoClip, Hotspot } from '../../types';

interface HotspotPropertiesProps {
  selectedClip: VideoClip;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
}

export const HotspotProperties: React.FC<HotspotPropertiesProps> = ({
  selectedClip,
  onUpdateClip,
}) => {
  const addHotspot = () => {
    const newHotspot: Hotspot = {
      id: crypto.randomUUID().slice(0, 8),
      x: 50,
      y: 50,
      label: 'New Hotspot',
      url: '',
      time: selectedClip.startTime,
      duration: 3,
    };
    onUpdateClip(selectedClip.id, {
      hotspots: [...(selectedClip.hotspots || []), newHotspot],
    });
  };

  const updateHotspot = (id: string, updates: Partial<Hotspot>) => {
    const newHotspots = (selectedClip.hotspots || []).map((h: Hotspot) =>
      h.id === id ? { ...h, ...updates } : h,
    );
    onUpdateClip(selectedClip.id, { hotspots: newHotspots });
  };

  const removeHotspot = (id: string) => {
    const newHotspots = (selectedClip.hotspots || []).filter((h: Hotspot) => h.id !== id);
    onUpdateClip(selectedClip.id, { hotspots: newHotspots });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-studio-accent" />
          <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            Interactive Hotspots
          </h3>
        </div>
        <button
          onClick={addHotspot}
          className="p-1.5 bg-studio-accent/10 border border-studio-accent/20 rounded-md text-studio-accent hover:bg-studio-accent/20 transition-all"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4">
        {(selectedClip.hotspots || []).map((h) => (
          <div
            key={h.id}
            className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={h.label}
                onChange={(e) => updateHotspot(h.id, { label: e.target.value })}
                className="bg-transparent text-[11px] font-black text-white uppercase focus:outline-none w-full"
              />
              <button
                onClick={() => removeHotspot(h.id)}
                aria-label="Delete hotspot"
                title="Delete hotspot"
                className="p-1 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1.5">
                  <Globe className="w-2.5 h-2.5" /> Destination URL
                </label>
                <input
                  type="text"
                  value={h.url}
                  onChange={(e) => updateHotspot(h.id, { url: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] text-zinc-400 focus:border-studio-accent/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1.5">
                  <Clock className="w-2.5 h-2.5" /> Start Time (s)
                </label>
                <input
                  type="number"
                  value={h.time}
                  step={0.1}
                  onChange={(e) => updateHotspot(h.id, { time: parseFloat(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] text-white focus:border-studio-accent/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1.5">
                  <Crosshair className="w-2.5 h-2.5" /> Position X (%)
                </label>
                <input
                  type="number"
                  value={h.x}
                  onChange={(e) => updateHotspot(h.id, { x: parseFloat(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] text-white focus:border-studio-accent/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[7px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1.5">
                  <Crosshair className="w-2.5 h-2.5" /> Position Y (%)
                </label>
                <input
                  type="number"
                  value={h.y}
                  onChange={(e) => updateHotspot(h.id, { y: parseFloat(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] text-white focus:border-studio-accent/50 transition-all"
                />
              </div>
            </div>
          </div>
        ))}

        {(!selectedClip.hotspots || selectedClip.hotspots.length === 0) && (
          <div className="py-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-40">
            <Target className="w-6 h-6 text-zinc-600" />
            <span className="text-[8px] font-black uppercase text-zinc-600">No Hotspots Added</span>
          </div>
        )}
      </div>
    </div>
  );
};
