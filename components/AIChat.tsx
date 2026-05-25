import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AIActionSandbox } from '../types';
import { Send, MessageSquare, Brain, Zap, Sparkles, Activity, Check, X, Info } from 'lucide-react';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  aiActionSandbox: AIActionSandbox;
  onApproveAction: (id: string) => void;
  onRejectAction: (id: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ 
  messages, 
  onSendMessage, 
  isProcessing,
  aiActionSandbox,
  onApproveAction,
  onRejectAction
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border-l border-white/5">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-studio-accent/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-studio-accent/20 flex items-center justify-center border border-studio-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Brain className="w-5 h-5 text-studio-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-white tracking-[0.2em] uppercase">
              Neural Canvas
            </span>
            <span className="text-[10px] font-mono text-studio-accent uppercase tracking-widest animate-pulse">
              Multimodal Engine v1.0
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Activity className="w-4 h-4 text-zinc-700" />
           <div className="px-2.5 py-1 bg-zinc-900 border border-white/5 rounded-md text-[9px] font-mono text-zinc-500 tracking-wider">PEAK_CORE</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 studio-scrollbar" ref={scrollRef}>
        {/* AI Governance Sandbox Proposals */}
        {aiActionSandbox.actions.filter(a => a.status === 'pending').map((action) => (
           <div key={action.id} className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-5 shadow-lg shadow-amber-500/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2.5 text-amber-500 font-black uppercase text-[11px] tracking-widest">
                    <Zap className="w-4.5 h-4.5 animate-pulse" />
                    Neural Proposal
                 </div>
                 <span className="text-[9px] font-mono text-amber-500/50 uppercase tracking-widest">Sandbox v1</span>
              </div>
              <p className="text-[14px] text-zinc-200 font-medium leading-relaxed">
                 {action.description}
              </p>
              <div className="flex gap-3 pt-2">
                 <button 
                   onClick={() => onApproveAction(action.id)}
                   className="flex-1 flex items-center justify-center gap-2.5 py-2.5 bg-studio-accent text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-studio-accent/20"
                   aria-label="Approve AI action"
                 >
                    <Check className="w-4.5 h-4.5" />
                    Approve
                 </button>
                 <button 
                   onClick={() => onRejectAction(action.id)}
                   className="flex-1 flex items-center justify-center gap-2.5 py-2.5 bg-white/5 border border-white/10 text-zinc-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                   aria-label="Reject AI action"
                 >
                    <X className="w-4.5 h-4.5" />
                    Reject
                 </button>
              </div>
              <div className="flex items-center gap-2.5 text-[9px] text-zinc-600 font-mono uppercase pt-1 tracking-wider">
                 <Info className="w-3.5 h-3.5" />
                 Modified: {Object.keys(action.proposedState).join(', ')}
              </div>
           </div>
        ))}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-6 rounded-2xl text-[14px] leading-relaxed transition-all ${
                msg.role === 'user' 
                ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/10 border border-white/10' 
                : 'bg-zinc-900/50 text-zinc-200 border border-white/5 backdrop-blur-sm'
              }`}
            >
              {msg.isFunctionCall ? (
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-studio-accent font-black uppercase text-[11px] tracking-widest">
                      <Zap className="w-4.5 h-4.5 animate-pulse" />
                      Executing Multi-Step Plan...
                   </div>
                   <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-studio-accent w-2/3 animate-shimmer" />
                   </div>
                </div>
              ) : (
                msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-4 p-5 bg-zinc-900/30 rounded-2xl border border-white/5">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-studio-accent rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-studio-accent rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-studio-accent rounded-full animate-bounce delay-150"></span>
              </div>
              <span className="text-[11px] font-black uppercase text-zinc-600 tracking-[0.2em]">Synthesizing Reality</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-black/40">
        <form onSubmit={handleSubmit} className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type directorial instructions..."
            className="w-full bg-zinc-950 border border-white/5 text-white rounded-2xl px-6 py-4.5 text-[14px] focus:outline-none focus:border-studio-accent/50 transition-all font-medium placeholder:text-zinc-700 shadow-inner"
            disabled={isProcessing}
            aria-label="Message AI Assistant"
          />
          <div className="absolute right-4 flex items-center gap-2">
             <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-2.5 bg-studio-accent rounded-xl text-black hover:scale-110 disabled:opacity-0 transition-all shadow-lg shadow-studio-accent/20"
                aria-label="Send message"
              >
                <Sparkles className="w-5 h-5" />
              </button>
          </div>
        </form>
        <p className="mt-4 text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] text-center">
           Neural Canvas supports complex multi-step orchestration
        </p>
      </div>
    </div>
  );
};

export default AIChat;
