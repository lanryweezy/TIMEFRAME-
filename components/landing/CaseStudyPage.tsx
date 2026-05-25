import React from 'react';
import { motion } from 'motion/react';

const caseStudies = {
  'case-study-1': {
    title: 'Streaming Giant Reduces Edit Time by 80%',
    problem: 'Linear manual editing caused production bottlenecks and limited content output.',
    solution: 'Implemented Timeframe AI Agents for automated cut and beat-sync.',
    result: 'Reduced editing hours from 40 to 6 per episode.',
    metrics: [
      { label: 'Reduction', val: '80%' },
      { label: 'Time Saved', val: '34h' },
      { label: 'Efficiency', val: '6.6x' },
    ],
    steps: ['Agentic silence removal', 'Automated pacing', 'AI-assisted color balancing'],
  },
  'case-study-2': {
    title: 'Independent Studio Scales to 50 Videos/Month',
    problem: 'Small team unable to keep up with viral market demand and high production standards.',
    solution: 'Deployed generative actors and automated pacing analysis.',
    result: '5x increase in monthly output without increasing staff.',
    metrics: [
      { label: 'Scale', val: '5x' },
      { label: 'Monthly Output', val: '50+' },
      { label: 'Cost/Video', val: '-60%' },
    ],
    steps: ['Gen-AI Actor implementation', 'Pacing analysis', 'Automated asset library'],
  },
};

export const CaseStudyPage = ({ id }: { id: string }) => {
  const study = caseStudies[id as keyof typeof caseStudies];

  if (!study) return <div className="py-32 text-center text-white">Case study not found.</div>;

  return (
    <div className="py-32 max-w-5xl mx-auto px-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-electric-blue font-bold uppercase tracking-widest text-sm">
          Case Study
        </span>
        <h1 className="text-6xl font-extrabold tracking-tighter mt-4">{study.title}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-6 mb-12"
      >
        {study.metrics.map((m) => (
          <div key={m.label} className="glass p-8 rounded-3xl text-center">
            <div className="text-4xl font-extrabold text-white mb-2">{m.val}</div>
            <div className="text-studio-text text-sm uppercase tracking-wider">{m.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass p-10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4 text-electric-blue">The Challenge</h3>
          <p className="text-studio-text text-lg leading-relaxed">{study.problem}</p>
        </div>
        <div className="glass p-10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4 text-neon-purple">The Timeframe Solution</h3>
          <p className="text-studio-text text-lg leading-relaxed mb-6">{study.solution}</p>
          <ul className="space-y-3">
            {study.steps.map((s) => (
              <li key={s} className="flex gap-2 items-center text-white">
                {' '}
                <div className="w-1.5 h-1.5 rounded-full bg-electric-blue" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
