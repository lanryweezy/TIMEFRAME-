import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { readHistogram } from '../lib/sharedState';
import { VideoState, FilterPreset, VideoClip, VideoAdjustment } from '../types';
import {
  Palette,
  Sun,
  Waves,
  Zap,
  Sparkles,
  Film,
  Maximize,
  Layers,
  Settings,
  Activity,
  Aperture,
  RefreshCcw,
  Grid,
  Droplets,
  Target,
  Wind,
  Plus,
  Eye,
  EyeOff,
  Wand2,
  Thermometer,
  Contrast,
  CircleDot,
} from 'lucide-react';

interface ColorPanelProps {
  state: VideoState;
  onSetFilter: (filter: FilterPreset) => void;
  onUpdateClip?: (id: string, updates: Partial<VideoClip>) => void;
  handleSendMessage: (msg: string) => void;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ 
  state, 
  onSetFilter, 
  onUpdateClip,
  handleSendMessage 
}) => {
  const [activeTab, setActiveTab] = useState<'essentials' | 'wheels' | 'curves' | 'looks' | 'nodes'>(
    'essentials',
  );
  const [selectedNode, setSelectedNode] = useState<string>('01');
  const [showOriginal, setShowOriginal] = useState(false);

  const selectedClip = useMemo(() => 
    state.videoClips.find(c => c.id === state.selectedClipId),
    [state.videoClips, state.selectedClipId]
  );

  const activeAdjustment = selectedClip?.adjustment || state.adjustment;

  const handleAdjustmentChange = (prop: keyof VideoAdjustment, value: number) => {
    if (selectedClip && onUpdateClip) {
      const adj = selectedClip.adjustment || {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hue: 0,
        filterIntensity: 100,
        vignetteIntensity: 0,
        vignetteSize: 50,
      };
      onUpdateClip(selectedClip.id, {
        adjustment: { ...adj, [prop]: value }
      });
    }
  };

  const ScopeVisualizer = ({
    type,
    color,
    channel = 0
  }: {
    type: 'waveform' | 'histogram' | 'vectorscope';
    color?: string;
    channel?: number;
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let frameId: number;
        const update = () => {
            if (ref.current) {
                const bars = ref.current.querySelectorAll('.scope-bar');
                for (let i = 0; i < bars.length; i++) {
                    const value = readHistogram(channel, i);
                    const bar = bars[i] as HTMLElement;
                    bar.style.height = `${Math.min(100, (value / 500) * 100)}%`;
                }
            }
            frameId = requestAnimationFrame(update);
        };
        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [channel]);

    return (
        <div className="h-24 bg-black/60 border border-white/5 rounded-lg overflow-hidden relative group backdrop-blur-sm shadow-inner">
          <div ref={ref} className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="w-full h-full flex items-end gap-[1px] px-1">
              {Array.from({ length: 256 }).map((_, i) => (
                <div
                  key={i}
                  className={`scope-bar flex-1 ${color || 'bg-studio-accent'} min-w-[1px]`}
                  style={{ height: '0%' }}
                />
              ))}
            </div>
          </div>
          <div className="absolute top-1.5 left-2 flex items-center gap-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">{type}</span>
          </div>
        </div>
    );
  };

  const ControlSlider = ({ 
    label, 
    icon: Icon, 
    value, 
    min, 
    max, 
    step = 1, 
    onChange,
    unit = "" 
  }: { 
    label: string; 
    icon: any; 
    value: number; 
    min: number; 
    max: number; 
    step?: number;
    onChange: (val: number) => void;
    unit?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 text-zinc-500" />
          <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-tight">{label}</label>
        </div>
        <span className="text-[10px] font-mono text-studio-accent">{value.toFixed(0)}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent hover:accent-white transition-all"
      />
    </div>
  );

  const ColorWheel = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 rounded-full border border-white/5 bg-zinc-950 flex items-center justify-center group cursor-crosshair hover:border-studio-accent/30 transition-all">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] opacity-[0.05]" />
        <div className="absolute inset-2 rounded-full border border-white/[0.02]" />
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] absolute" />
      </div>
      <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-studio-bg text-white select-none studio-scrollbar overflow-hidden">
      {/* Header with Active Clip Info */}
      <div className="p-4 border-b border-studio-border bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
            <Palette className="w-4 h-4 text-studio-accent" />
            Color Lab
          </h2>
          <span className="text-[9px] text-zinc-500 font-medium">
            {selectedClip ? `Editing: ${selectedClip.name}` : "No clip selected"}
          </span>
        </div>
        <button 
          onClick={() => setShowOriginal(!showOriginal)}
          className={`p-2 rounded-lg border transition-all ${showOriginal ? 'bg-studio-accent/20 border-studio-accent text-studio-accent' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}
          title="Compare with original"
        >
          {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Mini Scopes */}
      <div className="px-4 py-3 bg-zinc-950/30 border-b border-studio-border grid grid-cols-3 gap-2">
        <ScopeVisualizer type="histogram" channel={0} color="bg-red-500" />
        <ScopeVisualizer type="histogram" channel={1} color="bg-green-500" />
        <ScopeVisualizer type="histogram" channel={2} color="bg-blue-500" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-studio-border bg-black/60">
        {(['essentials', 'wheels', 'curves', 'looks', 'nodes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-tighter transition-all relative ${activeTab === tab ? 'text-studio-accent' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="color-tab-active"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-studio-accent rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto studio-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'essentials' && (
            <motion.div 
              key="essentials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 space-y-6"
            >
              <button 
                onClick={() => handleSendMessage("Analyze the current frame and apply a professional primary color correction.")}
                className="w-full py-4 bg-gradient-to-r from-studio-accent/20 to-purple-500/20 border border-studio-accent/30 rounded-xl flex items-center justify-center gap-3 group hover:border-studio-accent transition-all shadow-lg"
              >
                <Wand2 className="w-4 h-4 text-studio-accent animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">AI Auto-Enhance</span>
              </button>

              <div className="grid grid-cols-1 gap-6 pt-2">
                <ControlSlider 
                  label="Exposure" 
                  icon={Sun} 
                  value={activeAdjustment.brightness} 
                  min={0} max={200} 
                  onChange={(v) => handleAdjustmentChange('brightness', v)} 
                />
                <ControlSlider 
                  label="Contrast" 
                  icon={Contrast} 
                  value={activeAdjustment.contrast} 
                  min={0} max={200} 
                  onChange={(v) => handleAdjustmentChange('contrast', v)} 
                />
                <ControlSlider 
                  label="Warmth" 
                  icon={Thermometer} 
                  value={activeAdjustment.hue} 
                  min={-180} max={180} 
                  onChange={(v) => handleAdjustmentChange('hue', v)} 
                  unit="°"
                />
                <ControlSlider 
                  label="Saturation" 
                  icon={CircleDot} 
                  value={activeAdjustment.saturation} 
                  min={0} max={200} 
                  onChange={(v) => handleAdjustmentChange('saturation', v)} 
                />
                <ControlSlider 
                  label="Vignette" 
                  icon={Maximize} 
                  value={activeAdjustment.vignetteIntensity} 
                  min={0} max={100} 
                  onChange={(v) => handleAdjustmentChange('vignetteIntensity', v)} 
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Quick Fixes</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Brighten', 'De-haze', 'Vibrant', 'Muted'].map(fix => (
                    <button 
                      key={fix}
                      className="py-2.5 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-bold uppercase text-zinc-400 hover:text-studio-accent hover:border-studio-accent/50 transition-all"
                    >
                      {fix}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'wheels' && (
            <motion.div 
              key="wheels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 space-y-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <ColorWheel label="Lift" />
                <ColorWheel label="Gamma" />
                <ColorWheel label="Gain" />
                <ColorWheel label="Offset" />
              </div>
              <div className="p-4 bg-studio-accent/5 border border-studio-accent/10 rounded-xl">
                <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                  "Use wheels for professional cinematic tinting. Lift for shadows, Gain for highlights."
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'looks' && (
            <motion.div 
              key="looks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Professional LUTs</h4>
                <button className="text-[9px] font-bold text-studio-accent hover:underline">Import .CUBE</button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'KODAK_VISION3', desc: 'Cinematic Print', color: 'bg-amber-900/40' },
                  { name: 'TEAL_ORANGE', desc: 'Modern Blockbuster', color: 'bg-cyan-900/40' },
                  { name: 'FUJI_ETERNA', desc: 'Vintage Pastel', color: 'bg-emerald-900/40' },
                  { name: 'BLACK_WHITE', desc: 'Noir High Contrast', color: 'bg-zinc-800/40' },
                ].map((lut) => (
                  <button
                    key={lut.name}
                    className="group relative h-24 rounded-xl overflow-hidden border border-white/5 hover:border-studio-accent transition-all"
                  >
                    <div className={`absolute inset-0 ${lut.color} group-hover:scale-110 transition-transform duration-700`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-left">
                      <div className="text-[11px] font-black uppercase tracking-wider">{lut.name}</div>
                      <div className="text-[8px] text-zinc-400 font-medium">{lut.desc}</div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full bg-studio-accent shadow-[0_0_8px_#3b82f6]" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'nodes' && (
            <motion.div 
              key="nodes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 flex flex-col gap-6"
            >
              <div className="h-64 bg-zinc-950/50 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 pattern-grid-lg opacity-[0.03]" />
                <div className="flex items-center gap-6 z-10">
                  <div className="w-16 h-12 bg-studio-accent/20 border border-studio-accent rounded-lg flex items-center justify-center flex-col gap-1">
                    <span className="text-[7px] font-black uppercase">Source</span>
                    <div className="w-full h-0.5 bg-studio-accent/30" />
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="w-16 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-col gap-1">
                    <span className="text-[7px] font-black uppercase">Grade</span>
                    <Palette className="w-3 h-3 text-zinc-500" />
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="w-16 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-[7px] font-black uppercase">Out</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                   <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-white/5">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     <span className="text-[8px] font-bold text-zinc-400 uppercase">Live Pipeline</span>
                   </div>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Node Settings</h5>
                 <p className="text-[9px] text-zinc-600 italic">Advanced non-destructive grading active. Each node preserves full dynamic range.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-studio-border bg-black/80">
        <div className="flex gap-2">
          <button 
            className="flex-1 py-3 bg-zinc-900 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            onClick={() => handleSendMessage("Reset all color grading for the selected clip.")}
          >
            Reset All
          </button>
          <button 
            className="flex-1 py-3 bg-studio-accent text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
            onClick={() => handleSendMessage("Copy this color grade to all other clips in the timeline.")}
          >
            Apply to All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;

