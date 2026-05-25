import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Brain, Users, TrendingUp, Sparkles, AlertCircle, Eye, Target, BarChart2 } from 'lucide-react';
import { VideoState } from '../types';

export const ViralityWindTunnel = ({ state, onToggleHeatmap, onSeek }: { state: VideoState, onToggleHeatmap?: () => void, onSeek?: (time: number) => void }) => {
  const analytics = state.analytics;
  
  if (!analytics) return null;

  const viralScore = useMemo(() => {
    const avgDopamine = analytics.dopamineMap.reduce((acc, p) => acc + p.y, 0) / analytics.dopamineMap.length;
    const avgRetention = analytics.heatmapData.reduce((acc, p) => acc + p.y, 0) / analytics.heatmapData.length;
    return (avgDopamine * 0.6 + avgRetention * 0.4);
  }, [analytics]);

  const hookStrength = useMemo(() => {
    const first3Seconds = analytics.dopamineMap.filter(p => p.x < 3);
    if (first3Seconds.length === 0) return 50;
    return first3Seconds.reduce((acc, p) => acc + p.y, 0) / first3Seconds.length;
  }, [analytics]);

  const handleBarClick = (index: number) => {
    if (onSeek && analytics.dopamineMap[index]) {
      const time = analytics.dopamineMap[index].x;
      onSeek(time);
      
      // Proactive Fix Suggestion logic
      const value = analytics.dopamineMap[index].y;
      if (value < 50 && (state as any).addSuggestion) {
        (state as any).addSuggestion({
          id: `fix-${Date.now()}`,
          agentId: 'ag-zoe',
          type: 'edit',
          title: 'Engagement Bridge Required',
          description: `Neural analysis predicts a significant drop-off at ${Math.round(time)}s. I suggest adding a narrative hook or a fast-paced B-roll montage to re-engage the viewer's dopamine baseline.`,
          actionPrompt: 'Apply a 3-second cinematic B-roll bridge with rhythmic cuts.',
          impact: 0.85,
          status: 'new',
          startTime: time,
          duration: 3,
          createdAt: Date.now(),
        });
      }
    }
  };

  const handleApplyHookFix = () => {
    if ((state as any).addSuggestion) {
        (state as any).addSuggestion({
          id: `hook-fix-${Date.now()}`,
          agentId: 'ag-zoe',
          type: 'strategy',
          title: 'Neural Hook Optimization',
          description: 'The first 3 seconds are low in visual entropy. I recommend an aggressive intro sequence with 3 fast cuts and a high-energy sound riser.',
          actionPrompt: 'Apply high-entropy intro sequence.',
          impact: 0.92,
          status: 'new',
          startTime: 0,
          duration: 3,
          createdAt: Date.now(),
        });
    }
  };

  const demographics = [
    { age: '13-17', score: 85, color: 'bg-studio-accent' },
    { age: '18-24', score: 92, color: 'bg-purple-500' },
    { age: '25-34', score: 65, color: 'bg-cyan-500' },
    { age: '35+', score: 40, color: 'bg-zinc-700' },
  ];

  return (
    <div className="p-6 bg-zinc-950 border border-white/5 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden group">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-grid-lg" />
      
      {/* Header Section */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/20 rounded-xl border border-orange-500/30">
            <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-white uppercase tracking-widest">Virality Wind Tunnel</h3>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">Neural Engagement Predictor v3.0</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-white">{Math.round(viralScore)}<span className="text-[10px] text-zinc-600 ml-1">VQ</span></span>
          <span className="text-[7px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">Viral Potential: High</span>
        </div>
      </div>

      {/* Hook Strength Indicator */}
      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400" />
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Neural Hook Check</span>
          </div>
          <span className={`text-[10px] font-black uppercase ${hookStrength > 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
            {hookStrength > 80 ? 'STRONG HOOK' : 'WEAK START'}
          </span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${hookStrength}%` }}
            className={`h-full ${hookStrength > 80 ? 'bg-emerald-500' : 'bg-orange-500'} shadow-[0_0_10px_rgba(249,115,22,0.5)]`}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-[8px] text-zinc-600 uppercase font-bold italic max-w-[200px]">
            {hookStrength > 80 
              ? "Visual entropy in first 3s is optimal for scroll-stopping." 
              : "Predicted drop-off in first 2s. Apply Neural Auto-Fix?"}
          </p>
          {hookStrength <= 80 && (
            <button 
              onClick={handleApplyHookFix}
              className="px-3 py-1 bg-orange-500 text-black text-[8px] font-black uppercase rounded shadow-lg hover:scale-105 transition-all"
            >
              Apply Hook Fix
            </button>
          )}
        </div>
      </div>

      {/* Multimodal Heatmap Visualization */}
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center px-1">
           <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
             <Activity className="w-3.5 h-3.5 text-studio-accent" /> Multimodal Attention Heatmap
           </span>
           <button 
             onClick={onToggleHeatmap}
             className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[8px] font-black uppercase ${state.showViralHeatmap ? 'bg-studio-accent text-black border-studio-accent' : 'bg-white/5 text-zinc-500 border-white/10'}`}
           >
              <Eye className="w-3 h-3" /> {state.showViralHeatmap ? 'Overlay Active' : 'Show Overlay'}
           </button>
        </div>

        <div className="h-40 w-full bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-end px-2 pb-2 gap-1 group/heatmap">
            {/* Playhead Indicator in Heatmap */}
            <motion.div 
              className="absolute top-0 bottom-0 w-[2px] bg-white/40 z-20 pointer-events-none"
              style={{ left: `${(state.currentTime / (state.duration || 1)) * 100}%` }}
            />

            {/* Bars */}
            {analytics.dopamineMap.map((point, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col gap-1 h-full justify-end cursor-pointer group/bar relative"
                  onClick={() => handleBarClick(i)}
                >
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${point.y}%` }}
                     className="w-full bg-purple-500/20 group-hover/bar:bg-purple-500/40 rounded-t-sm transition-colors"
                   />
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${analytics.heatmapData[i]?.y || 0}%` }}
                     className="w-full bg-studio-accent/40 group-hover/bar:bg-studio-accent/80 rounded-t-sm transition-colors shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                   />
                   {/* Tooltip on Hover */}
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-0.5 rounded text-[6px] font-black uppercase text-white opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-30">
                     Seek to {Math.round(point.x)}s
                   </div>
                </div>
            ))}
        </div>
        <p className="text-[7px] text-zinc-700 uppercase font-bold text-center tracking-widest italic opacity-50">
          Click bars to sync timeline to engagement hotspots
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
         <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
               <Brain className="w-3.5 h-3.5 text-purple-400" />
               <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Cognitive Load</span>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-lg font-black text-white">OPTIMAL</span>
               <TrendingUp className="w-3 h-3 text-emerald-500" />
            </div>
            <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold">Pacing is synchronized with audience retention patterns.</p>
         </div>

         <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
               <Users className="w-3.5 h-3.5 text-studio-accent" />
               <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Target Archetype</span>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-lg font-black text-white">GEN-Z</span>
               <Sparkles className="w-3 h-3 text-studio-accent" />
            </div>
            <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold">High visual entropy favors short-form discovery feeds.</p>
         </div>
      </div>

      {/* Advice Panel */}
      <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-3 relative z-10">
         <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
         <p className="text-[9px] text-orange-200 leading-relaxed uppercase font-black tracking-tight">
           Neural Audit: <span className="text-white">Retention drop predicted at 00:18.</span> Suggest adding a narrative hook or a B-roll bridge to maintain dopamine intensity.
         </p>
      </div>
    </div>
  );
};
