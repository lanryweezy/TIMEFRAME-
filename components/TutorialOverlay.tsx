// @ts-nocheck
/**
 * Interactive Tutorial Overlay (#32)
 * Guided onboarding flow for first-time users
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Play, CheckCircle, HelpCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  action?: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Timeframe Studio',
    description: 'Let me show you around the interface. This interactive tutorial will guide you through the main features.',
    position: 'center',
  },
  {
    id: 'timeline',
    title: 'Timeline',
    description: 'The timeline is where you arrange and edit your video clips, audio, and text. Drag clips to rearrange them.',
    target: '#timeline-container',
    position: 'bottom',
  },
  {
    id: 'properties',
    title: 'Properties Panel',
    description: 'Adjust clip properties like position, scale, rotation, and effects. Changes are applied in real-time.',
    target: '#properties-panel',
    position: 'left',
  },
  {
    id: 'sidebar',
    title: 'Media Sidebar',
    description: 'Access your media assets, effects, and templates. Drag items directly onto the timeline.',
    target: '#editor-sidebar',
    position: 'right',
  },
  {
    id: 'export',
    title: 'Export Your Video',
    description: 'Click the Export button to render your video. Choose from multiple formats, resolutions, and quality settings.',
    target: 'button[title="Export"]',
    position: 'top',
  },
  {
    id: 'done',
    title: 'You\'re All Set!',
    description: 'You now know the basics. Explore more features and start creating amazing videos!',
    position: 'center',
  },
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && tutorialSteps[currentStep].target) {
      const element = document.querySelector(tutorialSteps[currentStep].target) as HTMLElement;
      setHighlightedElement(element);
    } else {
      setHighlightedElement(null);
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete?.();
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleSkip}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-studio-panel border border-studio-border rounded-lg w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-studio-border">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-studio-accent" />
            <h2 className="text-xl font-bold text-studio-text-high">Interactive Tutorial</h2>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close tutorial"
            title="Close tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {tutorialSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= currentStep
                    ? 'bg-studio-accent text-white'
                    : 'bg-studio-border text-studio-text'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-studio-text-high">{currentStepData.title}</h3>
            <p className="text-studio-text leading-relaxed">{currentStepData.description}</p>

            {/* Highlighted element */}
            {highlightedElement && (
              <div className="relative mt-6">
                <div className="absolute -inset-4 bg-studio-accent/20 rounded-lg animate-pulse" />
                <div className="bg-studio-bg border border-studio-accent rounded-lg p-4">
                  <p className="text-xs text-studio-accent font-mono">
                    {highlightedElement.tagName.toLowerCase()}#{highlightedElement.id || 'element'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {currentStepData.action && (
            <button
              onClick={currentStepData.action}
              className="mt-6 px-4 py-2 bg-studio-accent hover:bg-studio-accent-hover text-white rounded transition-colors"
            >
              {currentStepData.title}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-studio-border">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              currentStep === 0
                ? 'text-studio-text/50 cursor-not-allowed'
                : 'text-studio-text hover:text-studio-text-high hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-studio-accent hover:bg-studio-accent-hover text-white rounded transition-colors"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Onboarding flow component
export const OnboardingFlow: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem('timeframe-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('timeframe-tutorial-seen', 'true');
    onComplete?.();
  };

  return (
    <TutorialOverlay
      isOpen={showTutorial}
      onClose={() => setShowTutorial(false)}
      onComplete={handleComplete}
    />
  );
};