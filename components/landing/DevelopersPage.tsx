import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';

export const DevelopersPage = () => {
  const [copied, setCopied] = useState(false);
  const code = `import { Agent } from '@timeframe/sdk';

const editor = new Agent('editor');
await editor.cut({
  source: 'raw_footage.mp4',
  transform: 'cinematic_vibe'
});`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-32 max-w-5xl mx-auto px-6 text-white">
      <h1 className="text-5xl font-extrabold mb-12 tracking-tighter">Developer Resources</h1>
      <div className="glass p-10 rounded-3xl">
        <h3 className="text-2xl font-bold mb-6">Agent SDK Usage</h3>
        <div className="bg-black p-6 rounded-2xl border border-white/10 relative group">
          <button 
            onClick={handleCopy}
            className="absolute right-4 top-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition"
          >
            {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
          </button>
          <pre className="text-sm font-mono text-studio-text overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
