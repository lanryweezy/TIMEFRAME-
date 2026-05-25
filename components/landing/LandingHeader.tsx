import React from 'react';

export const LandingHeader = ({
  onStart,
  onNavigate,
  onOpenWhatsNew,
}: {
  onStart: () => void;
  onNavigate: (page: string) => void;
  onOpenWhatsNew: () => void;
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-[100] border-b border-white/5 bg-black/40 backdrop-blur-3xl">
      <div className="flex items-center justify-between px-10 h-24 max-w-[1600px] mx-auto">
        <div
          className="text-2xl font-black tracking-tightest cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-3"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          <span className="tracking-tighter">TIMEFRAME</span>
        </div>
        
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[.4em] text-white/40">
          {['Product', 'AI Features', 'Solutions', 'Developers'].map((item) => (
            <button
              key={item}
              aria-label={`Go to ${item}`}
              onClick={() =>
                onNavigate(
                  item.toLowerCase() === 'ai features' ? 'ai features' : item.toLowerCase(),
                )
              }
              className="hover:text-white hover:tracking-[.5em] transition-all duration-500"
            >
              {item}
            </button>
          ))}
          <button
            onClick={onOpenWhatsNew}
            aria-label="View What's New"
            className="text-electric-blue hover:text-white transition-colors"
          >
            What's New
          </button>
        </nav>

        <div className="flex items-center gap-8">
          <a href="#" className="text-[11px] font-black uppercase tracking-[.4em] text-white/40 hover:text-white transition-colors">
            Log in
          </a>
          <button
            onClick={onStart}
            aria-label="Get Started"
            className="bg-white text-black px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            Start Free
          </button>
        </div>
      </div>
    </header>
  );
};

