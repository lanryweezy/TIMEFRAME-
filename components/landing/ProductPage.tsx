import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import {
  Edit,
  Mic,
  Video,
  Sparkles,
  Zap,
  Activity,
  BarChart2,
  Users,
  Flame,
  Target,
  BrainCircuit,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { InteractionDemo } from './InteractionDemo';
import { AgentFeedbackLoop } from './AgentFeedbackLoop';
import { Skeleton } from '../ui/Skeleton';

const FeatureModule = ({ section, idx }: { section: any, idx: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className={`flex flex-col ${section.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-32 items-center relative`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Glow for Section */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${section.align === 'left' ? '-left-60' : '-right-60'} w-[30rem] h-[30rem] bg-electric-blue/5 rounded-full blur-[160px] pointer-events-none`} />

      <div className="flex-1 space-y-14 relative z-10">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-2xl">
              <section.icon className="text-electric-blue" size={36} />
           </div>
           <span className="text-[11px] font-black uppercase tracking-[.5em] text-white/30">Architecture &bull; 0{idx + 1}</span>
        </div>
        <h3 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.85] tracking-tighter">{section.title}</h3>
        <p className="text-2xl md:text-3xl text-studio-text leading-relaxed opacity-60 font-medium">{section.desc}</p>
        
        <div className="grid grid-cols-2 gap-16 pt-16 border-t border-white/5">
          {section.stats.map(stat => (
            <div key={stat} className="group">
              <div className="text-white font-black text-sm uppercase tracking-[.3em] mb-4 group-hover:text-electric-blue transition-colors">{stat}</div>
              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "0%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="w-full h-full bg-electric-blue" 
                 />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 2026 Living Frame with 3D Tilt */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex-1 w-full aspect-square relative group cursor-none"
      >
         <div className="relative h-full w-full bg-[#020202] rounded-[5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden group/window">
            {/* Interactive Cursor Simulation */}
            <motion.div 
               style={{ x: mouseXSpring, y: mouseYSpring, transform: "translateZ(100px)" }}
               className="absolute w-6 h-6 bg-electric-blue rounded-full blur-sm z-50 pointer-events-none opacity-0 group-hover:opacity-40"
            />

            {/* Glass Top Bar */}
            <div className="absolute top-10 inset-x-16 h-1.5 bg-white/5 rounded-full overflow-hidden" style={{ transform: "translateZ(20px)" }}>
               <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-electric-blue to-transparent"
               />
            </div>

            {/* Screenshot Content Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-24" style={{ transform: "translateZ(40px)" }}>
               <div className="w-full h-full rounded-[3.5rem] border border-white/5 bg-white/[0.01] flex items-center justify-center relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03),transparent)]" />
                  <div className="z-10 flex flex-col items-center gap-8 text-center">
                     <div className="p-8 bg-white/[0.04] rounded-[3rem] border border-white/10 shadow-3xl">
                        <section.icon size={64} className="text-electric-blue opacity-50" />
                     </div>
                     <span className="font-black tracking-[.8em] text-[11px] uppercase text-white/10 leading-loose">{section.screenshot}</span>
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 border-[32px] border-black/90 rounded-[5rem] pointer-events-none" />
         </div>
      </motion.div>
    </div>
  );
};

export const ProductPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="py-40 max-w-7xl mx-auto px-8 selection:bg-electric-blue selection:text-white relative antialiased">
      <div className="absolute inset-0 bg-blueprint opacity-[0.02] pointer-events-none" />
      
      <div className="text-center mb-80 relative">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-12"
        >
           <span className="text-electric-blue font-black uppercase tracking-[.8em] text-[11px]">The Architecture of Imagination</span>
           <h2 className="text-7xl md:text-[11rem] font-black tracking-tightest leading-[0.75] tracking-tighter">
             Born for the <br/> Uncompromising.
           </h2>
           <p className="text-2xl md:text-4xl text-studio-text max-w-4xl mx-auto font-medium opacity-50 leading-relaxed">
             We stripped away the legacy friction of the cloud. No proxies. No latency. No compromise.
           </p>
        </motion.div>
      </div>

      {/* Feature Sections: 2026 Immersive Experience */}
      <div className="space-y-[30rem] mb-80">
        {[
          {
            title: "Speed that defies logic.",
            desc: "Direct-disk access via Quantum OPFS. 8K streams handled like cached thumbnails. Pure, native-speed flow.",
            icon: Rocket,
            stats: ["2.8GB/s Direct I/O", "Zero Playhead Latency"],
            align: "left",
            screenshot: "Quantum Engine Native"
          },
          {
            title: "AI that shares ambition.",
            desc: "Multimodal agents that share your directorial intent. Vision translated into timeline reality in real-time.",
            icon: BrainCircuit,
            stats: ["Multimodal Engine", "Intent Orchestration"],
            align: "right",
            screenshot: "Agent Council Panel"
          }
        ].map((section, idx) => (
          <FeatureModule key={section.title} section={section} idx={idx} />
        ))}
      </div>

      {/* The Demo: 2026 Immersive Interaction */}
      <div className="mb-[30rem] relative">
        <div className="absolute inset-0 bg-electric-blue/5 blur-[200px] rounded-full opacity-30 pointer-events-none" />
        <div className="text-center mb-40 relative z-10">
          <span className="text-electric-blue font-black uppercase tracking-[.6em] text-[11px] mb-12 block">Live Telemetry</span>
          <h2 className="text-6xl md:text-9xl font-black tracking-tightest mb-10 tracking-tighter">Proof of Soul.</h2>
          <p className="text-2xl md:text-3xl text-studio-text opacity-50 font-medium max-w-3xl mx-auto">Scrub the timeline. Feel the zero-latency response of a true native engine.</p>
        </div>
        <InteractionDemo />
      </div>

      {/* The Creative Council: Reimagined for Elite Mastery */}
      <div className="mb-80">
        <h2 className="text-7xl md:text-9xl font-black tracking-tightest mb-40 text-center tracking-tighter">
          The Council.
        </h2>
        <AgentFeedbackLoop />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {[
            { icon: Edit, name: 'The Architect', role: 'Structure' },
            { icon: Mic, name: 'The Virtuoso', role: 'Sound' },
            { icon: Video, name: 'The Visionary', role: 'Visuals' },
            { icon: Sparkles, name: 'The Oracle', role: 'Soul' },
            { icon: Zap, name: 'The Catalyst', role: 'Impact' },
          ].map((agent) => (
            <motion.div
              whileHover={{ y: -15, scale: 1.02 }}
              key={agent.name}
              className="bg-white/[0.02] p-12 rounded-[4rem] flex flex-col items-center text-center border border-white/5 hover:border-electric-blue/20 hover:bg-white/[0.05] transition-all cursor-pointer group shadow-2xl"
            >
              <agent.icon className="text-electric-blue mb-12 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="font-black text-2xl text-white mb-3">{agent.name}</h4>
              <p className="text-[11px] font-black uppercase tracking-[.5em] text-electric-blue/40">{agent.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Statement: The Visionary's Choice */}
      <div className="text-center py-80 border-t border-white/5 relative">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="space-y-20"
        >
           <h2 className="text-7xl md:text-[11rem] font-black tracking-tightest leading-[0.8] tracking-tighter">
             The future <br/> is brave.
           </h2>
           <div className="flex flex-col sm:flex-row justify-center gap-10 pt-16">
             <button
               onClick={() => onNavigate('pricing')}
               className="bg-white text-black px-16 py-8 rounded-full font-black text-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.15)]"
             >
               Join the Elite
             </button>
             <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="text-white font-black px-12 py-8 rounded-full text-3xl hover:bg-white/5 transition-all border border-white/10"
             >
               Return to Top
             </button>
           </div>
           <div className="mt-40 flex flex-col items-center gap-8 opacity-20">
              <ShieldCheck size={32} className="text-electric-blue" />
              <p className="text-[11px] font-black uppercase tracking-[1em]">Private Storage &bull; Artist Sovereignty &bull; Absolute Power</p>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
