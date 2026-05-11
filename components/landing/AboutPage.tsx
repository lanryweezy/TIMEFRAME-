import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

export const AboutPage = () => {
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <div className="py-32 max-w-5xl mx-auto px-6 space-y-16"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>;

    return (
        <div className="py-32 max-w-5xl mx-auto px-6">
             {/* Philosophy */}
            <motion.section 
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
            >
                <div className="glass p-10 rounded-3xl flex flex-col justify-center">
                   <h2 className="text-sm font-semibold text-electric-blue uppercase tracking-widest mb-4">The New Paradigm</h2>
                   <h3 className="text-5xl font-extrabold tracking-tighter mb-6 text-white">Timelines Are A Legacy Format.</h3>
                   <p className="text-studio-text text-lg leading-relaxed mb-6">
                     For three decades, creators have been trapped in rigid linear timelines. While tools evolved, the workflow stagnated. We are drowning in manual labor while AI waits to be unleashed.
                   </p>
                   <p className="text-studio-text text-lg leading-relaxed">
                     Timeframe isn't an editor. It's a creative operating system. By fusing intelligent agents with generative power, we turn creation from a manual slog into a directed symphony.
                   </p>
                </div>
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    className="glass p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between"
                >
                   <div className="absolute top-0 right-0 p-8">
                       <Cpu className="text-electric-blue/20" size={128}/>
                   </div>
                   <p className="text-2xl italic text-white/90 relative z-10">"The bottleneck isn't the skill, it's the tools. We are moving from 'doing' to 'directing'."</p>
                   <div className="mt-8 flex items-center gap-4 text-sm text-studio-text">
                       <div className="h-px w-8 bg-electric-blue"></div>
                       AI-NATIVE CREATIVE WORKFLOWS
                   </div>
                </motion.div>
            </motion.section>
            
            {/* Future Vision */}
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass p-16 rounded-3xl text-center space-y-6"
            >
                <h2 className="text-5xl font-extrabold tracking-tighter text-white">The Future Of Generative Storytelling</h2>
                <p className="text-xl text-studio-text leading-relaxed max-w-2xl mx-auto">Timeframe isn't just a tool; it's the foundation for a new era of media where stories adapt in real-time, simulations replace renders, and intelligence powers every frame.</p>
            </motion.section>
        </div>
    );
};
