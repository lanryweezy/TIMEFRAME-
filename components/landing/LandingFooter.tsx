import React from 'react';

export const LandingFooter = () => {
  return (
    <footer className="py-40 border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-12 gap-20">
        <div className="md:col-span-4 space-y-10">
          <div className="text-2xl font-black tracking-tightest flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm" />
             </div>
             <span className="tracking-tighter uppercase text-white">TIMEFRAME</span>
          </div>
          <p className="text-xl text-white/40 font-medium leading-relaxed max-w-xs">
            Reimagining the architecture of creativity for the elite professional.
          </p>
          <div className="flex gap-6 opacity-30">
             {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="text-[10px] font-black uppercase tracking-[.4em] text-white hover:text-white transition-colors">{social}</a>
             ))}
          </div>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-20">
           {[
              { title: "Platform", links: ["Quantum Engine", "AI Council", "OPFS Sync", "WebGPU Specs"] },
              { title: "Ecosystem", links: ["Community", "Developers", "Showcase", "API Docs"] },
              { title: "Company", links: ["Manifesto", "Craft", "Privacy", "Security"] }
           ].map(col => (
              <div key={col.title} className="space-y-10">
                 <h5 className="text-[11px] font-black uppercase tracking-[.8em] text-white/20">{col.title}</h5>
                 <ul className="space-y-6">
                    {col.links.map(link => (
                       <li key={link}>
                          <a href="#" className="text-[11px] font-black uppercase tracking-[.4em] text-white/40 hover:text-white transition-colors">{link}</a>
                       </li>
                    ))}
                 </ul>
              </div>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="text-[10px] font-black uppercase tracking-[.8em] text-white/10">
            &copy; 2026 TIMEFRAME STUDIO. ALL RIGHTS RESERVED.
         </div>
         <div className="text-[10px] font-black uppercase tracking-[.8em] text-white/10 flex gap-10">
            <span>CRAFTED WITH SOUL IN THE BROWSER.</span>
            <span className="text-electric-blue">V0.9.8 QUANTUM</span>
         </div>
      </div>
    </footer>
  );
};
