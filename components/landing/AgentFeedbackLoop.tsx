import React from 'react';
import { motion } from 'motion/react';

export const AgentFeedbackLoop = () => {
  return (
    <div className="flex justify-center p-12">
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="stroke-studio-text stroke-2 fill-none"
      >
        <circle cx="200" cy="200" r="160" className="stroke-white/10" strokeDasharray="8 8" />

        {/* Flow Lines */}
        <motion.path
          d="M200 40 L200 360"
          strokeDasharray="10 10"
          className="stroke-electric-blue"
          animate={{ strokeDashoffset: [-20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M40 200 L360 200"
          strokeDasharray="10 10"
          className="stroke-neon-purple"
          animate={{ strokeDashoffset: [-20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
        />

        {/* Agents */}
        {[
          { cx: 200, cy: 40, color: 'fill-electric-blue', label: 'Editor Agent' },
          { cx: 360, cy: 200, color: 'fill-neon-purple', label: 'Sound Agent' },
          { cx: 200, cy: 360, color: 'fill-electric-blue', label: 'Story Agent' },
        ].map((agent, i) => (
          <g key={i}>
            <motion.circle
              cx={agent.cx}
              cy={agent.cy}
              r="25"
              className={`${agent.color}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            />
            <text
              x={agent.cx}
              y={agent.cy + 5}
              textAnchor="middle"
              className="fill-midnight font-bold text-[10px] pointer-events-none"
            >
              AI
            </text>
            <text
              x={agent.cx}
              y={agent.cy + 50}
              textAnchor="middle"
              className="fill-white font-bold text-xs"
            >
              {agent.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
