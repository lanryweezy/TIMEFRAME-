import React from 'react';

export const LandingHeader = ({ onStart, onNavigate, onOpenWhatsNew }: { onStart: () => void, onNavigate: (page: string) => void, onOpenWhatsNew: () => void }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => onNavigate('home')}>TIMEFRAME</div>
        <nav aria-label="Main Navigation" className="flex gap-6 text-sm text-studio-text">
          {['Product', 'AI Features', 'Solutions', 'Developers', 'Pricing'].map(item => (
            <button key={item} aria-label={`Go to ${item}`} onClick={() => onNavigate(item.toLowerCase() === 'ai features' ? 'ai features' : item.toLowerCase())} className="hover:text-white transition-colors">{item}</button>
          ))}
          <button onClick={onOpenWhatsNew} aria-label="View What's New" className="text-electric-blue hover:text-white transition-colors">What's New</button>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-studio-text hover:text-white transition">Log in</a>
          <button onClick={onStart} aria-label="Get Started" className="studio-btn-primary px-5 py-2.5 text-sm">Get Started Free →</button>
        </div>
      </div>
    </header>
  );
};
