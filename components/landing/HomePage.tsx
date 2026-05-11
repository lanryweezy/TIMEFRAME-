import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';

export const HomePage = ({ onStart }: { onStart: () => void }) => {
    return (
        <div className="py-32 relative">
            {/* Background enhancement */}
            <div className="absolute inset-x-0 -top-20 h-[500px] bg-electric-blue/10 blur-[150px] opacity-30 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 text-electric-blue text-xs font-semibold bg-electric-blue/10 px-4 py-1.5 rounded-full border border-electric-blue/20"
                >
                    <Sparkles size={14} /> NEW AI-POWERED VIDEO CREATION PLATFORM
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="fluid-h1 font-extrabold tracking-tighter leading-[0.9] max-w-4xl"
                >
                    The Creative Operating System For The <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">AI Era</span>.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-studio-text text-xl max-w-2xl"
                >
                    AI-native editing, generative creation, cinematic workflows, and intelligent collaboration — inside one creative platform.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4"
                >
                    <button onClick={onStart} className="bg-electric-blue hover:bg-studio-accent-hover text-white px-8 py-4 rounded-full font-semibold transition text-lg shadow-lg shadow-electric-blue/20">Start Creating</button>
                    <button className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition flex items-center gap-2 text-lg">
                        <Play size={18} /> Watch Demo
                    </button>
                </motion.div>
                
                {/* Stats Row */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-4 gap-8 text-center mt-12 w-full max-w-5xl border-t border-studio-border pt-12"
                >
                    {[ { val: '2M+', label: 'Projects Created' }, { val: '500M+', label: 'Clips Generated' }, { val: '99.9%', label: 'Cloud Render Uptime' }, { val: '10x', label: 'Faster Workflow' } ].map(stat => (
                        <div key={stat.label}>
                            <div className="text-3xl font-bold text-white">{stat.val}</div>
                            <div className="text-xs mt-1 uppercase tracking-widest text-studio-text">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
                
                {/* Social Proof */}
                <div className="py-12 w-full border-t border-studio-border bg-deep-charcoal/50 mt-12">
                     <p className="text-center text-studio-text text-sm mb-8 uppercase tracking-widest font-semibold">Trusted by leading creators and studios</p>
                     <div className="flex flex-wrap justify-center items-center gap-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['TikTok', 'YouTube', 'Netflix', 'Unreal Engine', 'NVIDIA', 'Adobe'].map(brand => (
                        <span key={brand} className="text-xl font-bold text-white/50">{brand}</span>
                        ))}
                     </div>
                </div>

                {/* Testimonials */}
                <div className="py-24 w-full">
                    <h2 className="text-4xl font-extrabold tracking-tighter text-center mb-16">Creators Love Timeframe</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Alex', role: 'Filmmaker', quote: 'Timeframe completely replaced my manual workflow.', span: 'md:col-span-2' },
                            { name: 'Sarah', role: 'Motion Designer', quote: 'The AI agents save me hours on every project.', span: 'md:col-span-1' },
                            { name: 'Marcus', role: 'YouTuber', quote: 'I can finally focus on storytelling instead of cutting.', span: 'md:col-span-1' },
                            { name: 'Elena', role: 'Studio Head', quote: 'It scales our production 5x effortlessly.', span: 'md:col-span-2' }
                        ].map((t, i) => (
                            <motion.div 
                                key={t.name} 
                                className={`glass p-8 rounded-3xl flex flex-col justify-between ${t.span}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <p className="text-xl text-studio-text-high italic mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-studio-border rounded-full"></div>
                                    <div>
                                        <h4 className="font-semibold text-white">{t.name}</h4>
                                        <p className="text-sm text-studio-text">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
