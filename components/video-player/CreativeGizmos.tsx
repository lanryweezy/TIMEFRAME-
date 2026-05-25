import React from 'react';
import { motion } from 'motion/react';
import { VideoState, VideoClip } from '../../types';

interface CreativeGizmosProps {
  state: VideoState;
  activeClip: VideoClip | undefined;
}

export const CreativeGizmos: React.FC<CreativeGizmosProps> = ({ state, activeClip }) => {
  return (
    <>
      {/* Video HUD */}
      {(state.isTrackingMotion ||
        state.isRotoscoping ||
        activeClip?.tracking ||
        activeClip?.rotoscope?.enabled) && (
        <svg className="absolute inset-0 z-[35] pointer-events-none overflow-visible">
          <defs>
            <filter id="accent-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {activeClip?.tracking && (
            <g filter="url(#accent-glow)">
              {[...Array(12)].map((_, i) => (
                <g
                  key={`tr-${i}`}
                  transform={`translate(${20 + ((i * 7) % 70)}%, ${30 + ((i * 13) % 50)}%)`}
                  className="opacity-40"
                >
                  <rect x="-1" y="-1" width="2" height="2" fill="#fbbf24" />
                  <circle
                    r="6"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="0.2"
                    strokeDasharray="1 2"
                    className="animate-[spin_4s_linear_infinite]"
                  />
                </g>
              ))}
              {activeClip.tracking.points.map((p, i) => (
                <g key={`p-${i}`} transform={`translate(${p.x}%, ${p.y}%)`}>
                  <rect
                    x="-2"
                    y="-2"
                    width="4"
                    height="4"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1"
                  />
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#fbbf24" strokeWidth="0.5" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#fbbf24" strokeWidth="0.5" />
                  <text
                    y="-8"
                    fontSize="4"
                    fill="#fbbf24"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    P_{i.toString().padStart(2, '0')}
                  </text>
                </g>
              ))}
            </g>
          )}

          {activeClip?.rotoscope?.enabled && (
            <g filter="url(#accent-glow)">
              <path
                d="M 30 40 Q 50 20, 70 40 T 90 60 L 90 80 Q 70 95, 50 80 T 30 60 Z"
                fill="rgba(217, 70, 239, 0.05)"
                stroke="#d946ef"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="opacity-60"
              />
              {[
                { x: 30, y: 40 },
                { x: 50, y: 20 },
                { x: 70, y: 40 },
                { x: 90, y: 60 },
                { x: 90, y: 80 },
                { x: 70, y: 95 },
                { x: 50, y: 80 },
                { x: 30, y: 60 },
              ].map((p, i) => (
                <g key={`ro-${i}`} transform={`translate(${p.x}%, ${p.y}%)`}>
                  <circle r="2" fill="#d946ef" className="shadow-lg" />
                  <circle
                    r="4"
                    fill="none"
                    stroke="#d946ef"
                    strokeWidth="0.2"
                    className="animate-ping"
                  />
                </g>
              ))}
            </g>
          )}

          {state.isTrackingMotion && (
            <g className="translate-x-1/2 translate-y-1/2">
              <rect
                x="-40"
                y="-40"
                width="80"
                height="80"
                fill="none"
                stroke="rgba(245, 158, 11, 0.4)"
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />
              <circle r="20" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" />
              <text
                y="-45"
                fontSize="5"
                fill="#f59e0b"
                className="font-mono uppercase text-center opacity-60"
              >
                Tracking Region
              </text>
            </g>
          )}

          {(state.isTrackingMotion || state.isRotoscoping) && (
            <g transform="translate(20, 20)">
              <rect
                width="60"
                height="30"
                fill="rgba(0,0,0,0.4)"
                stroke="white"
                strokeWidth="0.2"
              />
              <text x="5" y="10" fontSize="4" fill="white" className="font-mono uppercase">
                Processing
              </text>
              <text x="5" y="18" fontSize="4" fill="white" className="font-mono uppercase">
                Frame: 042
              </text>
              <text x="5" y="26" fontSize="4" fill="white" className="font-mono uppercase">
                Status: OK
              </text>
              <rect x="35" y="22" width="20" height="2" fill="white" fillOpacity="0.1" />
              <rect x="35" y="22" width="14" height="2" fill="#fbbf24" />
            </g>
          )}
        </svg>
      )}

      {state.selectedTextId && (
        <svg className="absolute inset-0 z-[26] pointer-events-none overflow-visible">
          <g className="opacity-10">
            {[...Array(5)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={100 + i * 50}
                x2="100%"
                y2={100 + i * 50}
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 10 + '%'}
                y1="0"
                x2={50 + (i - 5) * 20 + '%'}
                y2="100%"
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            ))}
          </g>

          <path
            d="M 50 150 Q 250 100 450 150"
            stroke="#a78bfa"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 4"
            className="animate-[dash_6s_linear_infinite]"
          />
          {[...Array(10)].map((_, i) => (
            <circle
              key={`tick-${i}`}
              cx={50 + i * 44}
              cy={150 - Math.sin(i * 0.3) * 20}
              r="1"
              fill="#a78bfa"
              className="opacity-20"
            />
          ))}

          <circle cx="50" cy="150" r="2" fill="#a78bfa" className="opacity-50" />
          <circle cx="450" cy="150" r="2" fill="#a78bfa" className="opacity-50" />

          <g className="translate-x-[250px] translate-y-[100px] opacity-40">
            <rect
              x="-30"
              y="-15"
              width="60"
              height="30"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <line x1="0" y1="0" x2="0" y2="-40" stroke="#ef4444" strokeWidth="1" />
            <line x1="0" y1="0" x2="40" y2="0" stroke="#22c55e" strokeWidth="1" />
            <line x1="0" y1="0" x2="-20" y2="20" stroke="#3b82f6" strokeWidth="1" />
            <circle cx="40" cy="0" r="1.5" fill="#22c55e" />
            <circle cx="0" cy="-40" r="1.5" fill="#ef4444" />
            <circle cx="-20" cy="20" r="1.5" fill="#3b82f6" />
          </g>
        </svg>
      )}
    </>
  );
};
