import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState, AIAgent, AgentTask } from '../types';
import { useVideoStore } from '../store/videoStore';
import {
  Cpu,
  Sparkles,
  Brain,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  ChevronRight,
  User,
  Wand2,
  Target,
  MessageSquare,
  Plus,
  Activity,
  Scissors,
  Palette,
  Music,
  Megaphone,
  Video,
  Image as ImageIcon,
  ShoppingBag,
  Eye,
} from 'lucide-react';

interface AgentHubPanelProps {
  state: VideoState;
  handleSendMessage: (message: string) => void;
}

const AgentHubPanel: React.FC<AgentHubPanelProps> = ({ state, handleSendMessage }) => {
  const store = useVideoStore();
  const agents = state.agentLayer?.agents || [];
  const tasks = state.agentLayer?.tasks || [];
  const suggestions = state.agentLayer?.suggestions || [];

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    state.agentLayer?.activeAgentId || null,
  );
  const [stats, setStats] = useState({ throughput: 12.4, load: 14 });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        throughput: Number((prev.throughput + Math.sin(Date.now() / 1000) * 0.5).toFixed(1)),
        load: Math.min(100, Math.max(5, prev.load + Math.floor(Math.cos(Date.now() / 500) * 4))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [logs, setLogs] = useState<
    { id: string; msg: string; time: string; type: 'info' | 'warn' | 'success' }[]
  >([
    { id: '1', msg: 'System started.', time: '11:29:45', type: 'info' },
    { id: '2', msg: 'All AI helpers are ready.', time: '11:29:47', type: 'success' },
    { id: '3', msg: 'Effects prepared.', time: '11:30:02', type: 'info' },
    { id: '4', msg: 'Analyzing video...', time: '11:30:15', type: 'warn' },
  ]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [{ id: crypto.randomUUID().slice(0, 8), msg, time, type }, ...prev].slice(0, 10));
  };

  const handleDispatch = (agent: AIAgent) => {
    addLog(`AI Starting: ${agent.name}`, 'success');
    handleSendMessage(`Use ${agent.name} for ${agent.role}.`);
  };

  const getAgentIcon = (role: string) => {
    switch (role) {
      case 'editor':
        return <Scissors className="w-4 h-4" />;
      case 'storytelling':
        return <MessageSquare className="w-4 h-4" />;
      case 'cinematography':
        return <Video className="w-4 h-4" />;
      case 'branding':
        return <Palette className="w-4 h-4" />;
      case 'sound':
        return <Music className="w-4 h-4" />;
      case 'marketing':
        return <Megaphone className="w-4 h-4" />;
      case 'vfx':
        return <Zap className="w-4 h-4" />;
      case 'thumbnail':
        return <ImageIcon className="w-4 h-4" />;
      case 'optimizer':
        return <Target className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const SystemGraph = () => (
    <div className="relative h-48 bg-black/40 rounded-2xl border border-white/5 overflow-hidden group mb-8">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--color-studio-accent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {agents.map((agent, i) => {
          const angle = (i / agents.length) * Math.PI * 2;
          const x = 50 + Math.cos(angle) * 35;
          const y = 50 + Math.sin(angle) * 35;
          return (
            <g key={agent.id}>
              <line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke={agent.status === 'busy' ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.2)'}
                strokeWidth="0.5"
              />
              {agent.status === 'busy' && (
                <motion.circle
                  r="1.2"
                  className="fill-studio-accent"
                  animate={{
                    cx: ['50%', `${x}%`],
                    cy: ['50%', `${y}%`],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                    times: [0, 0.5, 1],
                  }}
                />
              )}
            </g>
          );
        })}
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          fill="none"
          stroke="rgba(59,130,246,0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Core Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-studio-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="relative w-10 h-10 rounded-full border border-studio-accent/40 bg-black flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Brain className="w-5 h-5 text-studio-accent" />
        </div>
      </div>

      {/* Agent Nodes */}
      {agents.map((agent, i) => {
        const angle = (i / agents.length) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 35;
        const y = 50 + Math.sin(angle) * 35;
        const isActive = selectedAgentId === agent.id || agent.status === 'busy';

        return (
          <motion.button
            key={agent.id}
            initial={false}
            animate={{
              scale: isActive ? 1.2 : 1,
              borderColor: isActive ? 'rgba(59,130,246,1)' : 'rgba(255,255,255,0.1)',
            }}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => setSelectedAgentId(agent.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-lg border bg-black flex items-center justify-center transition-colors z-10 hover:border-studio-accent/50 ${isActive ? 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}`}
          >
            {getAgentIcon(agent.role)}
            {agent.status === 'busy' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        );
      })}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/5 rounded-full">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          System Ready
        </span>
      </div>
    </div>
  );

  const AgentCard = ({ agent }: { agent: AIAgent; key?: string }) => (
    <motion.div
      onClick={() => setSelectedAgentId(agent.id)}
      className={`p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
        selectedAgentId === agent.id
          ? 'bg-studio-accent/10 border-studio-accent shadow-[0_0_15px_rgba(59,130,246,0.1)]'
          : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Corner Accent */}
      <div
        className={`absolute top-0 right-0 w-8 h-8 opacity-20 ${selectedAgentId === agent.id ? 'text-studio-accent' : 'text-zinc-700'}`}
      >
        <div className="absolute top-0 right-0 border-t border-r border-current w-2 h-2" />
      </div>

      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-lg overflow-hidden border ${selectedAgentId === agent.id ? 'border-studio-accent/50' : 'border-white/10'}`}
          >
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-black ${
              agent.status === 'online'
                ? 'bg-green-500'
                : agent.status === 'busy'
                  ? 'bg-orange-500'
                  : 'bg-zinc-600'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500">
              {agent.id}
            </span>
            <div className="flex items-center gap-1.5">
              {agent.isInstalledFromEcosystem && (
                <span className="px-1 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-[2px] text-[8px] font-bold text-indigo-400 uppercase italic">
                  ECO
                </span>
              )}
              <div
                className={`${selectedAgentId === agent.id ? 'text-studio-accent' : 'text-zinc-600'}`}
              >
                {getAgentIcon(agent.role)}
              </div>
            </div>
          </div>
          <h5
            className={`text-[12px] font-bold uppercase tracking-tight truncate ${selectedAgentId === agent.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-100'}`}
          >
            {agent.name}
          </h5>
          <p className="text-[9px] font-mono text-zinc-600 truncate uppercase mt-0.5">
            {agent.role}
          </p>
        </div>
      </div>

      {agent.status === 'busy' && (
        <div className="mt-2 border-t border-dashed border-white/5 pt-2 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 bg-studio-accent rounded-full"
              />
            ))}
          </div>
          <span className="text-[6px] font-mono uppercase text-studio-accent/70">
            Processing...
          </span>
        </div>
      )}
    </motion.div>
  );

  const NeuralDNA = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-studio-accent">
          Neural Project DNA
        </h4>
        <div className="flex items-center gap-1">
           <Zap className="w-3 h-3 text-studio-accent" />
           <span className="text-[7px] font-mono text-zinc-500">REALTIME_EVOLUTION</span>
        </div>
      </div>

      <div className="p-5 bg-zinc-950 border border-white/5 rounded-3xl space-y-5">
        <div className="grid grid-cols-3 gap-4">
           {[
              { label: 'Narrative', val: state.projectDNA.narrativeWeight, color: 'bg-studio-accent' },
              { label: 'Aesthetic', val: state.projectDNA.aestheticWeight, color: 'bg-white' },
              { label: 'Rhythmic', val: state.projectDNA.rhythmicWeight, color: 'bg-zinc-600' },
           ].map((stat, i) => (
             <div key={i} className="space-y-2">
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">{stat.label}</span>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${stat.val * 100}%` }}
                     className={`h-full ${stat.color}`}
                   />
                </div>
             </div>
           ))}
        </div>

        <div className="flex flex-wrap gap-2">
           {state.projectDNA.emotionalTone.map((tone, i) => (
             <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold text-zinc-400 uppercase">
                {tone}
             </span>
           ))}
           {state.projectDNA.signatureElements.map((el, i) => (
             <span key={i} className="px-2 py-1 bg-studio-accent/10 border border-studio-accent/20 rounded-lg text-[8px] font-bold text-studio-accent uppercase">
                {el}
             </span>
           ))}
        </div>
      </div>
    </div>
  );

  const LogicHub = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-studio-accent">
          Logic Hub: Multi-Agent Debate
        </h4>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-studio-accent animate-ping" />
           <span className="text-[7px] font-sans text-studio-accent/50">LIVE_SYNTHESIS</span>
        </div>
      </div>

      <div className="p-6 bg-zinc-950 border border-studio-accent/20 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Cpu className="w-12 h-12 text-studio-accent" />
        </div>

        <div className="mb-6">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active Topic</span>
          <h3 className="text-[16px] font-black text-white uppercase tracking-tight mt-1">
            {state.debateState?.topic || 'Creative Optimization'}
          </h3>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {state.debateState?.messages.map((msg, i) => {
            const agent = agents.find(a => a.id === msg.agentId);
            const isLens = agent?.name === 'Lens';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`flex gap-3 ${isLens ? 'flex-row-reverse' : ''}`}
              >
                <img src={agent?.avatar} alt="" className="w-8 h-8 rounded-xl border border-white/10 flex-shrink-0" />
                <div className={`flex-1 p-3 rounded-2xl text-[11px] leading-relaxed ${
                  isLens 
                    ? 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tr-none' 
                    : 'bg-studio-accent/10 border border-studio-accent/20 text-white rounded-tl-none'
                }`}>
                  <div className={`flex items-center gap-2 mb-1 ${isLens ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-studio-accent">{agent?.name}</span>
                    <span className="text-[7px] text-zinc-600 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
           <button 
             onClick={() => handleSendMessage("Continue the debate with more technical depth.")}
             className="flex-1 py-3 bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase rounded-xl hover:bg-white/10 transition-all"
           >
             Continue Debate
           </button>
           <button 
             onClick={() => handleSendMessage("Resolve the debate: Tighter cut with cinematic speed ramp.")}
             className="flex-1 py-3 bg-studio-accent text-black text-[10px] font-black uppercase rounded-xl hover:scale-[1.02] transition-all"
           >
             Accept Zoe's Cut
           </button>
           <button 
             onClick={() => handleSendMessage("Resolve the debate: Keep the long shot but enhance with neural stabilization.")}
             className="flex-1 py-3 bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-black uppercase rounded-xl hover:text-white hover:bg-white/10 transition-all"
           >
             Accept Lens' Vision
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-black text-white select-none">
      {/* Neural Engine HUD */}
      <div className="p-6 border-b border-white/5 bg-zinc-950/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-studio-accent/10 border border-studio-accent/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-studio-accent animate-pulse" />
             </div>
             <div>
                <h3 className="text-[12px] font-black uppercase tracking-widest leading-none">ORÌ Engine v1.0</h3>
                <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-tighter">Unified Neural Interface // Core active</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-[7px] font-black text-zinc-500 uppercase">Synaptic Latency</span>
                <span className="text-[10px] font-mono text-studio-accent">{state.neuralTelemetry.synapticLatency.toFixed(1)}ms</span>
             </div>
             <div className="text-right">
                <span className="block text-[7px] font-black text-zinc-500 uppercase">Quantum Entropy</span>
                <span className="text-[10px] font-mono text-white">{(state.neuralTelemetry.quantumEntropy * 100).toFixed(2)}%</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[7px] font-black text-zinc-500 uppercase">Neural Cache Efficiency</span>
                 <span className="text-[8px] font-mono text-studio-accent">{(state.neuralTelemetry.neuralCacheEfficiency * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${state.neuralTelemetry.neuralCacheEfficiency * 100}%` }}
                   className="h-full bg-studio-accent"
                 />
              </div>
           </div>
           <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[7px] font-black text-zinc-500 uppercase">Compute Load</span>
                 <span className="text-[8px] font-mono text-white">{state.neuralMetadata.localComputeLoad}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${state.neuralMetadata.localComputeLoad}%` }}
                   className="h-full bg-white"
                 />
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
        {/* System Visualization */}
        <SystemGraph />

        <NeuralDNA />

        {state.debateState?.isActive && <LogicHub />}

        {/* Active Agents Grid */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Global AI Team
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            <button
              onClick={() =>
                handleSendMessage(
                  'Initialize custom agent training for brand-specific editing style.',
                )
              }
              className="aspect-video border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-studio-accent hover:border-studio-accent transition-all group col-span-2"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Train New Agent
              </span>
            </button>
          </div>
        </div>

        {/* Proactive Suggestions Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-studio-accent">
              Directorial Suggestions
            </h4>
            <span className="text-[7px] font-sans text-studio-accent/50 animate-pulse">PROACTIVE_PLANNING</span>
          </div>
          <div className="space-y-3">
            {suggestions.filter(s => s.status === 'new').map((suggestion) => {
              const agent = agents.find(a => a.id === suggestion.agentId);
              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                     <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-black uppercase text-studio-accent">Impact Score</span>
                        <span className="text-[12px] font-mono text-white">{Math.floor(suggestion.impact * 100)}%</span>
                     </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img src={agent?.avatar} alt="" className="w-10 h-10 rounded-2xl border border-white/10 shadow-lg" />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-studio-accent rounded-full border-2 border-black">
                        {getAgentIcon(agent?.role || '')}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                       <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{agent?.name} • {suggestion.type}</span>
                       <h3 className="text-[14px] font-black text-white uppercase tracking-tight mt-1">{suggestion.title}</h3>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed">
                    {suggestion.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendMessage(suggestion.actionPrompt)}
                      className="flex-1 py-3 bg-studio-accent text-black text-[10px] font-black uppercase rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Apply
                    </button>
                    {suggestion.startTime !== undefined && (
                      <button
                        onClick={() => {
                          if (suggestion.startTime !== undefined) {
                             store.setCurrentTime(suggestion.startTime);
                             // Visual feedback: brief flash or scroll to
                             const timeline = document.querySelector('.studio-scrollbar');
                             if (timeline) {
                               // Seek logic is handled by state.setCurrentTime, 
                               // but we might want to ensure the timeline scrolls there.
                             }
                          }
                        }}
                        className="px-4 py-3 bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-black uppercase rounded-xl hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" /> See
                      </button>
                    )}
                    <button
                      className="px-5 py-3 bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-black uppercase rounded-xl hover:text-white hover:bg-white/10 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {suggestions.filter(s => s.status === 'new').length === 0 && (
              <div className="p-8 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-700">
                 <Wand2 className="w-8 h-8 mb-3 opacity-20" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Narrative Signals</span>
              </div>
            )}
          </div>
        </div>

        {/* Marketplace Discover - Ecosystem Moat */}
        <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] font-black uppercase text-white tracking-widest">
                More AI Helpers
              </span>
            </div>
            <button
              onClick={() => handleSendMessage('Show more AI tools.')}
              className="text-[8px] font-black text-indigo-400 uppercase hover:underline"
            >
              Find More
            </button>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Colorist Agent', role: 'color', desc: 'HDR Specialist' },
              { name: 'Motion Designer', role: 'motion', desc: 'Vector Dynamics' },
            ].map((suggestion, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 group hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black text-white uppercase">
                      {suggestion.name}
                    </span>
                    <span className="text-[6px] text-zinc-500 font-mono tracking-tighter uppercase">
                      {suggestion.desc}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleSendMessage(`I want to hire a ${suggestion.name} from the marketplace.`)
                  }
                  className="p-1.5 bg-white/5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Agent Details */}
        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              key={selectedAgent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-5 bg-zinc-900 border border-white/5 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Zap className="w-4 h-4 text-studio-accent/30" />
                </div>

                <div>
                  <h3 className="text-[14px] font-black text-white">{selectedAgent.name}</h3>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                    {selectedAgent.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[8px] font-black uppercase text-zinc-600">Active Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.skills.map((skillId) => {
                      const skill = state.agentLayer?.skills.find((s) => s.id === skillId);
                      return (
                        <div
                          key={skillId}
                          className="px-2 py-1 bg-black border border-white/5 rounded text-[8px] font-black uppercase text-studio-accent"
                        >
                          {skill?.name || skillId}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => selectedAgent && handleDispatch(selectedAgent)}
                  className="w-full py-3 bg-studio-accent text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Starting Tool
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neural Trace Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Activity Log
            </h4>
            <span className="text-[7px] font-sans text-studio-accent/50 animate-pulse">
              LIVE...
            </span>
          </div>
          <div className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[10px] space-y-2 max-h-[120px] overflow-y-auto scrollbar-hide">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-zinc-600">[{log.time}]</span>
                <span
                  className={`${
                    log.type === 'success'
                      ? 'text-emerald-500'
                      : log.type === 'warn'
                        ? 'text-amber-500'
                        : 'text-zinc-400'
                  }`}
                >
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Task Queue */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Current Tasks
          </h4>
          <div className="space-y-2">
            {tasks.map((task) => {
              const agent = agents.find((a) => a.id === task.agentId);
              return (
                <div
                  key={task.id}
                  className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex items-center gap-4"
                >
                  <div className="relative">
                    <img src={agent?.avatar} alt="" className="w-8 h-8 rounded-lg" />
                    <div className="absolute -top-1 -right-1 p-0.5 bg-studio-accent rounded-full">
                      <Zap className="w-2 h-2 text-black" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-bold text-white uppercase tracking-tight">
                        {task.type}
                      </span>
                      <span className="text-[10px] font-mono text-studio-accent">
                        {task.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        className="h-full bg-studio-accent"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {tasks.length === 0 && (
              <div className="p-8 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-zinc-700">
                <Clock className="w-6 h-6 mb-2 opacity-20" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  No Active Tasks
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Footer */}
      <div className="p-6 border-t border-white/5 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-600 uppercase">Processing Speed</span>
            <span className="text-[9px] font-sans text-zinc-300">{stats.throughput}k/s</span>
          </div>
          <div className="w-[1px] h-6 bg-zinc-900" />
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-600 uppercase">AI Load</span>
            <span className="text-[9px] font-sans text-studio-accent">{stats.load}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <MessageSquare className="w-4 h-4 hover:text-studio-accent transition-colors cursor-pointer" />
          <Activity className="w-4 h-4 hover:text-studio-accent transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default AgentHubPanel;
