import React from 'react';
import {
  MousePointer2,
  Move,
  Layers,
  ChevronRight,
  Square,
  Activity,
  Sparkles,
  Type,
  Zap,
  Shield,
} from 'lucide-react';
import { EditorSidebarProps } from './types';

export const MotionTab: React.FC<Pick<EditorSidebarProps, 'state' | 'handleSendMessage'>> = ({
  state,
  handleSendMessage,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">
            Compositing
          </p>
          <div className="px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 text-[6px] font-black text-blue-500 uppercase">
            Pro
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSendMessage('Rotoscope the subject and isolate background.')}
            className={`p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-blue-500 group transition-all relative overflow-hidden ${state.isRotoscoping ? 'bg-blue-500/10 border-blue-500/40' : ''}`}
          >
            {state.isRotoscoping && (
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
            )}
            <MousePointer2
              className={`w-5 h-5 ${state.isRotoscoping ? 'text-blue-400' : 'text-slate-500'} group-hover:text-blue-400`}
            />
            <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-white">
              Rotoscoping
            </span>
          </button>
          <button
            onClick={() => handleSendMessage('Track the camera motion in this footage.')}
            className={`p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-emerald-500 group transition-all relative overflow-hidden ${state.isTrackingMotion ? 'bg-emerald-500/10 border-emerald-500/40' : ''}`}
          >
            {state.isTrackingMotion && (
              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
            )}
            <Move
              className={`w-5 h-5 ${state.isTrackingMotion ? 'text-emerald-400' : 'text-slate-500'} group-hover:text-emerald-400`}
            />
            <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-white">
              Motion Track
            </span>
          </button>
        </div>

        <button
          onClick={() =>
            handleSendMessage('Synthesize a node-based compositing map for this scene.')
          }
          className="w-full flex items-center justify-between p-3 rounded bg-[#0a0a0a] border border-[#1a1a1a] hover:border-blue-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-black uppercase text-white">Project Flow</span>
              <span className="text-[6px] text-slate-500 font-mono italic text-left">
                View structure
              </span>
            </div>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-700" />
        </button>
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Procedural Masking
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSendMessage('Apply a cinematic letterbox mask.')}
            className="p-2.5 border border-[#1a1a1a] bg-black rounded flex items-center gap-2 hover:border-white/20 group transition-all"
          >
            <div className="w-6 h-4 border border-white/20 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 w-full h-[2px] bg-white/40" />
              <div className="absolute bottom-0 w-full h-[2px] bg-white/40" />
            </div>
            <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-white">
              Letterbox
            </span>
          </button>
          <button
            onClick={() => handleSendMessage('Add a circular vignette mask.')}
            className="p-2.5 border border-[#1a1a1a] bg-black rounded flex items-center gap-2 hover:border-white/20 group transition-all"
          >
            <div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/20 rounded-full" />
            </div>
            <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-white">
              Vignette
            </span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Procedural Shapes
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: 'rectangle', icon: Square },
            { type: 'circle', icon: Layers },
            { type: 'triangle', icon: Activity },
          ].map((s) => (
            <button
              key={s.type}
              onClick={() => handleSendMessage(`Add a ${s.type} shape to the timeline.`)}
              className="p-3 border border-[#1a1a1a] bg-black rounded flex flex-col items-center gap-2 hover:border-yellow-500 group transition-all"
            >
              <s.icon className="w-4 h-4 text-yellow-500 opacity-50 group-hover:opacity-100" />
              <span className="text-[7px] font-black uppercase text-slate-500 group-hover:text-white">
                {s.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Particle Systems
        </p>
        <div className="h-[1px] flex-1 bg-purple-500/10 ml-3" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest -mb-1 mt-2">
          Procedural VFX
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[
            {
              name: 'Lens Flare (Anamorphic)',
              type: 'lens_flare',
              icon: Sparkles,
              color: 'text-blue-400',
            },
            {
              name: 'Heat Distortion',
              type: 'distortion',
              icon: Activity,
              color: 'text-orange-400',
            },
            {
              name: 'VHS Degradation',
              type: 'vhs',
              icon: Shield,
              color: 'text-emerald-400',
            },
            {
              name: 'Kinetic Type (Orbital)',
              type: 'kinetic_orbital',
              icon: Type,
              color: 'text-purple-400',
            },
            {
              name: 'Chroma Glitch',
              type: 'glitch_pro',
              icon: Zap,
              color: 'text-rose-400',
            },
          ].map((vfx) => (
            <button
              key={vfx.type}
              onClick={() => handleSendMessage(`Add a cinematic ${vfx.name} effect.`)}
              className="w-full flex items-center justify-between p-2 rounded bg-[#0a0a0a] border border-[#1a1a1a] hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-2">
                <vfx.icon className={`w-3 h-3 ${vfx.color}`} />
                <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-white">
                  {vfx.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[5px] text-zinc-700 font-mono group-hover:text-zinc-500">
                  PRO
                </span>
                <Zap className="w-2.5 h-2.5 text-zinc-800 group-hover:text-yellow-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest -mb-1 mt-2">
          Simulations
        </p>
        {[
          { name: 'Energy Field', type: 'energy', color: 'text-purple-400' },
          { name: 'Atmospheric Dust', type: 'dust', color: 'text-slate-400' },
          { name: 'Cinematic Sparkles', type: 'sparkles', color: 'text-yellow-400' },
        ].map((p) => (
          <button
            key={p.type}
            onClick={() =>
              handleSendMessage(`Generate a high intensity ${p.type} particle simulation.`)
            }
            className="p-3 border border-[#1a1a1a] bg-black rounded flex items-center justify-between hover:border-purple-500 group transition-all"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[9px] font-black uppercase text-white">{p.name}</span>
              <span className="text-[7px] text-slate-500 font-mono italic">
                Procedural fluid simulation
              </span>
            </div>
            <Activity className={`w-3 h-3 ${p.color}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
