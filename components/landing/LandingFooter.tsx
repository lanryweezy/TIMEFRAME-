import React from 'react';

export const LandingFooter = () => {
    return (
      <footer className="py-20 bg-[#030303] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4">
                <div className="text-2xl font-bold tracking-tighter">TIMEFRAME</div>
                <p className="text-studio-text text-sm">Synchronizing creative workflows since 2026.</p>
            </div>
            
            <div className="space-y-4">
               <h4 className="font-semibold text-white">Platform</h4>
               <ul className="space-y-3 text-studio-text text-sm">
                   <li><a href="#" className="hover:text-electric-blue transition-colors">Docs</a></li>
                   <li><a href="#" className="hover:text-electric-blue transition-colors">API</a></li>
                   <li><a href="#" className="hover:text-electric-blue transition-colors">Changelog</a></li>
                   <li><a href="#" className="hover:text-electric-blue transition-colors">Developers</a></li>
                </ul>
            </div>
            
            <div className="md:col-span-2 glass p-8 rounded-3xl">
                <h4 className="font-semibold text-white mb-4">Stay Synchronized</h4>
                <div className="flex gap-2 mb-6">
                    <input type="email" placeholder="email@example.com" className="bg-black/40 border border-white/10 rounded-full px-4 py-2 w-full text-sm focus:outline-none focus:border-electric-blue/50" />
                    <button className="bg-electric-blue hover:bg-studio-accent-hover text-white rounded-full px-6 text-sm font-semibold transition-all">Join</button>
                </div>
                <div className="text-xs text-studio-text p-4 bg-white/5 rounded-2xl border border-white/5">
                    <strong>AI Prompt Suggestion:</strong> "Help me generate a cinematic intro for a travel vlog about Japan."
                </div>
            </div>
        </div>
      </footer>
    );
};
