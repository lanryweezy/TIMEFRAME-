import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Mic, Video, Sparkles, Zap, Activity, BarChart2, Users, Flame } from 'lucide-react';
import { InteractionDemo } from './InteractionDemo';
import { AgentFeedbackLoop } from './AgentFeedbackLoop';
import { Skeleton } from '../ui/Skeleton';

export const ProductPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className="py-24 max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-extrabold tracking-tighter mb-20 text-center">Intelligent Workflows</h2>
            
            {/* Bento Grid Features */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 mb-24 auto-rows-min"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {loading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-64" />) : [ 
                    { title: 'AI Editing', desc: 'Intelligent, automated editing workflows.', items: ['Auto-cutting', 'Beat sync', 'Silence removal', 'Pacing optimization'], className: 'md:col-span-2 md:row-span-2 p-8' },
                    { title: 'Generative Creation', desc: 'Unleash generative potential.', items: ['Text-to-video', 'Image-to-video', 'AI actors', 'Scene generation'], className: 'md:col-span-2 p-8' },
                    { title: 'Motion & VFX', desc: 'Professional-grade cinematic effects.', items: ['Procedural animation', 'Cinematic effects', 'Compositing', 'Motion graphics'], className: 'md:col-span-1 p-8' },
                    { title: 'Audio Intelligence', desc: 'Audio mastered by AI.', items: ['AI mastering', 'Emotional soundtrack generation', 'Voice cloning'], className: 'md:col-span-1 p-8' },
                ].map((feat, i) => (
                    <motion.div 
                        key={feat.title} 
                        variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                        whileHover={{ scale: 1.02 }}
                        className={`group glass rounded-3xl transition-all duration-300 ${feat.className}`}
                    >
                        <h3 className="text-2xl font-bold mb-3 text-white">{feat.title}</h3>
                        <p className="text-studio-text mb-6">{feat.desc}</p>
                        <ul className="grid grid-cols-2 gap-3">
                            {feat.items.map(item => (
                                <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span> {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </motion.div>

            {/* Interactive Demo */}
            <div className="mb-24">
                <h2 className="text-4xl font-extrabold tracking-tighter text-center mb-6">Experience Timeframe</h2>
                <p className="text-studio-text text-center mb-16 text-lg max-w-xl mx-auto">Scrub the timeline, test AI editing modes, and see the transformation in real-time.</p>
                <InteractionDemo />
            </div>

            {/* AI Agents */}
            <div className="mb-24">
                 <h2 className="text-4xl font-extrabold tracking-tighter mb-16 text-center">Meet Your AI Agents</h2>
                 <AgentFeedbackLoop />
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[ {icon: Edit, name: 'Editor'}, {icon: Mic, name: 'Sound'}, {icon: Video, name: 'Cinematic'}, {icon: Sparkles, name: 'Storyteller'}, {icon: Zap, name: 'Marketing'} ].map(role => (
                        <motion.div 
                            whileHover={{ y: -5, scale: 1.05 }}
                            key={role.name} 
                            className="glass p-8 rounded-3xl flex flex-col items-center text-center cursor-glow"
                        >
                            <role.icon className="text-electric-blue mb-6" size={40} />
                            <h4 className="font-semibold text-lg text-white">{role.name} Agent</h4>
                            <p className="text-xs text-studio-text mt-2">Specialized intelligent optimization</p>
                        </motion.div>
                    ))}
                 </div>
            </div>

            {/* Timeline Intelligence */}
            <div className="mb-24">
                <h2 className="text-4xl font-extrabold tracking-tighter mb-16 text-center">Timeline Intelligence</h2>
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        { icon: Activity, title: 'Emotion Curves', span: 'col-span-2 md:col-span-1' },
                        { icon: BarChart2, title: 'Retention Heatmaps', span: 'col-span-2 md:col-span-1' },
                        { icon: Target, title: 'Pacing Analysis', span: 'col-span-1 md:col-span-1' },
                        { icon: Users, title: 'Audience Simulation', span: 'col-span-1 md:col-span-1' },
                        { icon: Flame, title: 'Virality Scoring', span: 'col-span-2 md:col-span-1' },
                    ].map(item => (
                        <motion.div 
                            key={item.title} 
                            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                            whileHover={{ scale: 1.05 }}
                            className={`glass p-6 rounded-2xl text-center cursor-glow ${item.span}`}
                        >
                            <item.icon className="text-neon-purple mx-auto mb-4" size={32} />
                            <h4 className="font-semibold text-xs tracking-wider uppercase text-white">{item.title}</h4>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Case Studies */}
            <div className="mb-24">
                <h2 className="text-4xl font-extrabold tracking-tighter mb-16 text-center">Real World Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {['case-study-1', 'case-study-2'].map(id => (
                        <div key={id} className="glass p-10 rounded-3xl flex flex-col items-center text-center">
                            <h4 className="font-semibold text-2xl mb-6">See how teams like yours win.</h4>
                            <button onClick={() => onNavigate(id)} className="bg-electric-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-studio-accent-hover transition">Read Case Study</button>
                        </div>
                     ))}
                </div>
            </div>

            {/* Performance & Ecosystem */}
            <div className="mb-24">
                <h3 className="text-3xl font-bold mb-8 text-center text-white">Platform Ecosystem</h3>
                <div className="overflow-hidden bg-deep-charcoal p-8 rounded-3xl border border-white/5 relative">
                   <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-midnight to-transparent z-10"></div>
                   <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-midnight to-transparent z-10"></div>
                   <motion.div
                    className="flex gap-16 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                  >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-16">
                            {['TikTok', 'YouTube', 'Blender', 'Unreal Engine', 'Adobe Creative Cloud', 'Cloud Rendering API'].map(brand => (
                                <motion.div 
                                    key={brand} 
                                    whileHover={{ scale: 1.1, color: '#3B82F6' }}
                                    className="text-2xl font-bold text-studio-text cursor-pointer transition"
                                >
                                    {brand}
                                </motion.div>
                            ))}
                        </div>
                    ))}
                  </motion.div>
                </div>
            </div>
        </div>
    );
};
