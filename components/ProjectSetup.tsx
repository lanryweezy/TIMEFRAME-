import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECT_FORMATS, PROJECT_TEMPLATES } from '../constants';
import { X, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export const ProjectSetup = ({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: (format: any, template: any) => void;
}) => {
  const [step, setStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const getIcon = (name: string) => (Icons as any)[name] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {step === 1 ? 'Choose Format' : 'Select Editing Mode'}
          </h2>
          <button onClick={onClose}>
            <X className="text-zinc-500 hover:text-white" />
          </button>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROJECT_FORMATS.map((f) => {
              const Icon = getIcon(f.icon);
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFormat(f);
                    setStep(2);
                  }}
                  className="p-6 bg-zinc-800 rounded-xl hover:bg-studio-accent/20 flex flex-col items-center gap-4 transition-all"
                >
                  <Icon className="w-8 h-8 text-studio-accent" />
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-xs text-zinc-500">{f.ratio}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROJECT_TEMPLATES.map((t) => {
              const Icon = getIcon(t.icon);
              return (
                <button
                  key={t.id}
                  onClick={() => onStart(selectedFormat, t)}
                  className="p-6 bg-zinc-800 rounded-xl hover:border-studio-accent border border-zinc-800 flex items-start gap-4 transition-all"
                >
                  <div className="p-3 bg-zinc-950 rounded-lg">
                    <Icon className="w-6 h-6 text-studio-accent" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">{t.name}</span>
                    <span className="text-sm text-zinc-400">{t.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
