import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, X, Play, Scissors, Palette, Layers, Cpu } from 'lucide-react';
import { CONFIG } from '../config';

interface Step {
  title: string;
  description: string;
  icon: any;
  target?: string; // CSS selector for highlighting
}

const STEPS: Step[] = [
  {
    title: 'Welcome to ' + CONFIG.APP_NAME,
    description: 'The high-frontier AI video engine designed for rapid synthesis and cinematic precision. Let\'s take a quick tour of your new creative studio.',
    icon: Sparkles,
  },
  {
    title: 'The Infinite Canvas',
    description: 'Preview your creation in real-time with our PIXI-powered rendering engine. Toggle safe zones, scopes, and creative gizmos directly from the player HUD.',
    icon: Play,
    target: '#video-player-container',
  },
  {
    title: 'Neural Sidebar',
    description: 'Access Gen-AI synthesis, cinematic filters, and procedural effects. This is where you fabricate environments, characters, and assets from pure thought.',
    icon: Cpu,
    target: '#editor-sidebar',
  },
  {
    title: 'Precision Timeline',
    description: 'Multi-track editing with ripple-delete, magnetic snapping, and per-clip audio processing. Scrub, trim, and sync with surgical accuracy.',
    icon: Scissors,
    target: '#timeline-container',
  },
  {
    title: 'Properties & VFX',
    description: 'Fine-tune every parameter. From LGG color grading to procedural particle dynamics, the Properties Panel gives you absolute control over every pixel.',
    icon: Palette,
    target: '#properties-panel',
  },
  {
    title: 'Agent Hub',
    description: 'Collaborate with specialized AI agents. Zoe handles pacing, Lens manages cinematography, and Echo masters your immersive soundscapes.',
    icon: Layers,
    target: '#agent-hub-trigger',
  },
];

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding_v1');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('has_seen_onboarding_v1', 'true');
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Highlight Target (Simple implementation) */}
          {step.target && (
             <motion.div
               layoutId="highlight"
               className="fixed z-[101] border-2 border-studio-accent rounded-lg pointer-events-none shadow-[0_0_50px_rgba(var(--studio-accent-rgb),0.3)]"
               initial={false}
               animate={{
                 // This would ideally use getBoundingClientRect() of the target
                 // For now, we'll use approximate positions or a simple highlight
                 opacity: 0.5,
               }}
             />
          )}

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 z-[102] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
               <motion.div 
                 className="h-full bg-studio-accent"
                 initial={{ width: 0 }}
                 animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
               />
            </div>

            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-studio-accent/10 rounded-2xl">
                <Icon className="w-10 h-10 text-studio-accent" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{step.title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center justify-between w-full pt-4">
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1 rounded-full transition-all ${i === currentStep ? 'w-6 bg-studio-accent' : 'w-1.5 bg-zinc-700'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-studio-accent hover:text-black transition-all group"
                >
                  {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
