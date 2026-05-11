import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Skeleton } from '../ui/Skeleton';

export const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const tiers = [
        {name: 'Creator', price: 29}, 
        {name: 'Pro', price: 79}, 
        {name: 'Studio', price: 199}
    ];

    return (
        <section className="py-32 bg-midnight">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-5xl font-extrabold tracking-tighter text-center mb-12 text-white">Simple, Scalable Pricing</h2>
                
                <div className="flex justify-center mb-16">
                    <div className="glass p-1 rounded-full flex items-center gap-2">
                        <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 rounded-full font-semibold transition ${!isAnnual ? 'bg-electric-blue text-white' : 'text-studio-text'}`}>Monthly</button>
                        <button onClick={() => setIsAnnual(true)} className={`px-6 py-2 rounded-full font-semibold transition ${isAnnual ? 'bg-electric-blue text-white' : 'text-studio-text'}`}>Annual <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full">Save 20%</span></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-96" />) : tiers.map((tier, i) => (
                        <motion.div 
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-10 rounded-3xl text-left hover:border-electric-blue/50 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-white">{tier.name}</h4>
                                <div className="text-5xl font-extrabold mb-8 text-white">
                                    ${isAnnual ? Math.round(tier.price * 0.8) : tier.price}
                                    <span className="text-lg font-normal text-studio-text">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 text-studio-text">
                                    <li>✔ AI Agent Access</li>
                                    <li>✔ 100GB Cloud Storage</li>
                                    <li>✔ Priority Rendering</li>
                                    <li>✔ Community Support</li>
                                </ul>
                            </div>
                            <button className="w-full bg-electric-blue text-white py-4 rounded-full font-semibold hover:bg-studio-accent-hover transition mt-auto">Start Creating</button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
