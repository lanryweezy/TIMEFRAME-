import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, MessageSquare } from 'lucide-react';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const AIChat: React.FC<AIChatProps> = ({ messages, onSendMessage, isProcessing }) => {
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
    <div className="flex flex-col h-full bg-black">
      <div className="p-6 border-b border-white/5 flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <span className="text-[14px] font-black text-white tracking-[0.2em] uppercase">Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-[15px] leading-relaxed tracking-normal ${
                msg.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-zinc-300'
              }`}>
                {msg.isFunctionCall ? (
                    <span className="animate-pulse flex items-center gap-2 text-[12px] font-sans italic opacity-60">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Thinking...
                    </span>
                ) : (
                    msg.content.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)
                )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
             <div className="flex gap-1 p-2">
                <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-75"></span>
                <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-150"></span>
              </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-black">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="w-full bg-white/5 text-white rounded-xl px-6 py-4 text-[15px] focus:outline-none focus:bg-white/[0.08] transition-all font-sans"
            disabled={isProcessing}
          />
          <button type="submit" disabled={!input.trim() || isProcessing} className="absolute right-2 text-slate-500 hover:text-white disabled:opacity-0 transition-opacity">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;