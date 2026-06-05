import React from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Play, Zap, Monitor, Activity, ShieldCheck, Cpu } from 'lucide-react';

export const HomePage = ({ onStart, onNavigate }: { onStart: () => void, onNavigate: (page: string) => void }) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  
  // Scrollytelling Assembly
  const frameY = useTransform(scrollYProgress, [0, 0.3], ["100px", "0px"]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const telemetryX = useTransform(scrollYProgress, [0.1, 0.4], ["-40px", "0px"]);
  const telemetryOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  // 3D Tilt Effect for Hero
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative selection:bg-electric-blue selection:text-white bg-app-bg overflow-x-hidden antialiased">
      {/* 2026 Atmosphere: Hyper-Focused Light */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-blue/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/5 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-40 flex flex-col items-center text-center relative z-10">
        <motion.div style={{ opacity, scale }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.6em] font-black uppercase text-electric-blue mb-12"
          >
            Digital Craftsmanship &bull; Est. 2026
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-7xl md:text-[10rem] font-black tracking-tightest leading-[0.75] mb-16"
          >
            The Soul <br/> of the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">
              Machine.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-studio-text text-xl md:text-2xl max-w-2xl font-medium leading-relaxed mb-20 mx-auto opacity-80"
          >
            In an age of automated generation, we return to the artist. 
            TIMEFRAME is a professional-grade video editing operating system built for the browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-32"
          >
            <button
              onClick={onStart}
              className="bg-white text-black px-14 py-7 rounded-full font-black text-2xl shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all"
            >
              Begin Journey
            </button>
            <button className="group flex items-center gap-6 text-white/50 hover:text-white transition-colors font-black text-2xl">
               <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-electric-blue group-hover:bg-electric-blue/5 transition-all">
                  <Play size={28} fill="currentColor" />
               </div>
               Watch the Film
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Product Frame: 2026 Living UI with 3D Interaction and Kinetic Assembly */}
        <motion.div
          style={{ 
            rotateX, 
            rotateY, 
            transformStyle: "preserve-3d",
            y: frameY,
            opacity: frameOpacity
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full relative group cursor-crosshair mb-40"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 rounded-[4rem] blur-[100px] opacity-30 group-hover:opacity-60 transition duration-1000" />
          <div 
            style={{ transform: "translateZ(50px)" }}
            className="relative aspect-[16/9] w-full bg-[#020202] rounded-[3rem] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden"
          >
             {/* Live Telemetry Overlay: Kinetic Assembly */}
             <motion.div 
               style={{ 
                 transform: "translateZ(80px)",
                 x: telemetryX,
                 opacity: telemetryOpacity
               }}
               className="absolute top-12 left-12 z-30 flex flex-col gap-6"
             >
                 <div className="bg-panel-elevated backdrop-blur-2xl border border-white/10 p-5 rounded-3xl flex items-center gap-5 shadow-2xl">
                   <div className="w-2.5 h-2.5 rounded-full bg-electric-blue animate-pulse" />
                   <div className="flex flex-col text-left">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Disk I/O (OPFS)</span>
                      <span className="text-lg font-mono font-medium text-white">2.8 GB/s <span className="text-electric-blue">&uarr;</span></span>
                   </div>
                </div>
                <div className="bg-panel-elevated backdrop-blur-2xl border border-white/10 p-5 rounded-3xl flex items-center gap-5 shadow-2xl">
                   <Activity size={20} className="text-neon-purple" />
                   <div className="flex flex-col text-left">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Thread Sync</span>
                      <span className="text-lg font-mono font-medium text-white">0.002 ms</span>
                   </div>
                </div>
             </motion.div>

             {/* UI Environment Simulation */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                <Monitor size={160} strokeWidth={0.5} />
             </div>
             
             {/* Interface Micro-Layers */}
             <div className="absolute inset-12 pt-16 flex flex-col gap-10" style={{ transform: "translateZ(30px)" }}>
                <div className="flex-1 rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden relative shadow-inner">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(59,130,246,0.1),transparent)]" />
                   <div className="absolute bottom-10 left-10 right-10 h-24 bg-white/[0.02] rounded-3xl border border-white/5" />
                </div>
             </div>
             
             <div className="absolute inset-0 border-[24px] border-black/80 rounded-[3rem] pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-4">
             <div className="w-1 h-12 bg-gradient-to-b from-electric-blue to-transparent rounded-full" />
             <p className="text-[11px] font-bold text-electric-blue uppercase tracking-widest">8K Native Pipeline &bull; Zero-Copy State &bull; Hardware Accelerated</p>
          </div>
        </motion.div>

        {/* The 2026 Manifesto: The Soul of the Craft */}
        <div className="py-80 w-full max-w-5xl text-left border-t border-white/5 mt-40">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
           >
             <span className="text-electric-blue font-semibold uppercase tracking-widest text-[11px] mb-12 block">Philosophy</span>
             <h2 className="text-5xl md:text-8xl font-bold tracking-tight mb-20 leading-[1]">
               Invisible tech.<br/> Loud art.<br/> One engine.
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                <p className="text-2xl text-studio-text leading-relaxed opacity-70 font-medium">
                  We rebuilt the browser's core rendering pipeline. Not for benchmarks, but to remove the wall between your intention and the screen. 
                </p>
                <p className="text-2xl text-studio-text leading-relaxed opacity-70 font-medium">
                  When the tools disappear, the story begins. TIMEFRAME is for everyone who believes the medium should be as ambitious as the message.
                </p>
             </div>
           </motion.div>
        </div>

        {/* The Bento of Inventions: The Architecture of Sovereignty */}
        <div className="py-80 w-full border-t border-white/5 relative">
           <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none" />
           
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="relative z-10"
           >
              <div className="text-center mb-32">
                 <span className="text-electric-blue font-semibold uppercase tracking-widest text-[11px] mb-8 block">Engineering</span>
                 <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Built to perform.</h2>
                 <p className="text-xl text-studio-text opacity-50 max-w-2xl mx-auto font-medium">Four core technologies that redefined the boundaries of the browser.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                 {[
                    { icon: ShieldCheck, title: "Quantum Sync", desc: "Proprietary SharedArrayBuffer state mirroring. Zero-latency synchronization between UI and Renderer threads.", span: "md:col-span-8" },
                    { icon: Zap, title: "Edge Native", desc: "Decentralized I/O. Your local machine is the compute engine, eliminating cloud round-trips forever.", span: "md:col-span-4" },
                    { icon: Cpu, title: "SAB State", desc: "Binary-level state replication. No serialization overhead. No message passing.", span: "md:col-span-4" },
                    { icon: Activity, title: "Neural Lookahead", desc: "Predictive VRAM management using weighted priority queues to hallucinate frame needs before they exist.", span: "md:col-span-8" }
                 ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.98, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`p-16 rounded-[4rem] bg-[#030303] border border-white/5 hover:border-electric-blue/30 hover:shadow-[0_0_80px_rgba(59,130,246,0.1)] transition-all text-left group relative overflow-hidden ${item.span}`}
                    >
                       <div className="absolute top-0 right-0 p-8 opacity-5 font-mono text-[80px] font-black tracking-tighter pointer-events-none">{i + 1}</div>
                       <item.icon size={48} className="text-electric-blue mb-12 group-hover:scale-110 transition-transform" />
                       <h4 className="text-3xl font-bold text-white mb-6 tracking-tight">{item.title}</h4>
                       <p className="text-2xl text-studio-text leading-relaxed opacity-60 font-medium">{item.desc}</p>
                       
                       {/* Blueprint detail lines */}
                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </motion.div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* The Sovereignty Manifesto: The Human Element */}
        <div className="py-80 w-full relative">
           <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="flex flex-col items-center text-center space-y-16"
           >
              <span className="text-neon-purple font-black uppercase tracking-[1em] text-[11px]">The Sovereignty Protocol</span>
              <h2 className="text-6xl md:text-[12rem] font-black tracking-tighter leading-[0.8] uppercase italic">
                Art is <br/> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">Human.</span>
              </h2>
              <p className="text-3xl md:text-5xl text-white font-medium max-w-5xl leading-tight opacity-90">
                In a world of generated noise, we protect the signal. 
                TIMEFRAME is built on the belief that AI should be a mirror for your soul, not a replacement for your hands.
              </p>
              <div className="w-1 h-32 bg-gradient-to-b from-neon-purple to-transparent rounded-full" />
           </motion.div>
        </div>

        {/* Case Studies Showcase */}
        <div className="py-40 w-full">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-24"
           >
              <h2 className="text-5xl md:text-7xl font-black tracking-tightest tracking-tighter text-white">Proof of Impact.</h2>
           </motion.div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-10">
              {[
                { title: "Streaming Giant Reduces Edit Time by 80%", id: "case-study-1", desc: "Linear manual editing caused production bottlenecks." },
                { title: "Independent Studio Scales to 50 Videos/Month", id: "case-study-2", desc: "Deployed generative actors and automated pacing analysis." }
              ].map(study => (
                 <motion.div
                    key={study.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                       onNavigate(study.id);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="glass p-12 rounded-[3rem] border border-white/5 hover:border-electric-blue/50 transition-all cursor-pointer group flex flex-col justify-between space-y-8"
                 >
                    <div>
                       <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight group-hover:text-electric-blue transition-colors">{study.title}</h3>
                       <p className="text-studio-text text-xl leading-relaxed opacity-70">{study.desc}</p>
                    </div>
                    <div className="flex items-center gap-4 text-electric-blue font-bold uppercase tracking-[.2em] text-sm">
                       Read Case Study <span className="text-xl leading-none">&rarr;</span>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* Final Statement: The Choice */}
        <div className="py-60 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/[0.03] to-transparent p-24 md:p-40 rounded-[6rem] border border-white/5 relative overflow-hidden text-center"
          >
            <div className="relative z-10">
               <h2 className="text-7xl md:text-[11rem] font-black tracking-tightest mb-16 leading-[0.7]">Experience<br/>Magic.</h2>
               <button
                  onClick={onStart}
                  className="bg-white text-black px-20 py-10 rounded-full font-black text-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.1)]"
               >
                  Begin for Free
               </button>
            </div>
            
            <div className="absolute -bottom-80 -left-80 w-[120%] h-[120%] bg-electric-blue/5 rounded-full blur-[200px] pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};





