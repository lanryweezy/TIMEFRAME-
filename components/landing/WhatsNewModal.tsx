import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const WhatsNewModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 backdrop-blur-sm"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative glass p-10 rounded-3xl max-w-lg w-full overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent"></div>
                        <h2 className="relative text-3xl font-extrabold tracking-tighter mb-6 text-white">What's New</h2>
                        <ul className="relative space-y-4 text-studio-text">
                            <li className="flex items-center gap-3"><span className="text-electric-blue">✨</span> Added interactive AI feedback loops.</li>
                            <li className="flex items-center gap-3"><span className="text-electric-blue">🚀</span> Faster workflow engine.</li>
                            <li className="flex items-center gap-3"><span className="text-electric-blue">🎨</span> New premium Bento-inspired palette.</li>
                        </ul>
                        <button onClick={onClose} className="relative mt-8 bg-white text-black font-semibold w-full p-4 rounded-full hover:bg-studio-text-high transition">Dismiss</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
