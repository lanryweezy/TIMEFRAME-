import React from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Scissors,
  Activity,
  Wand2,
  Target,
  Shield,
  Camera,
  Layers,
  Brain,
  GitBranch,
  Zap,
  Sun,
  Scale,
  BoxSelect,
  Maximize,
} from 'lucide-react';
import { VideoClip } from '../../types';

interface NodeInspectorProps {
  selectedNode: string;
  onClose: () => void;
  activeVfx: any;
  updateSubProp: (mainProp: string, subProp: string, value: any) => void;
  selectedClip: VideoClip | undefined;
  onUpdateClip?: (id: string, updates: Partial<VideoClip>) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  onClose,
  activeVfx,
  updateSubProp,
  selectedClip,
  onUpdateClip,
}) => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute right-0 top-0 bottom-0 w-72 bg-black/80 backdrop-blur-2xl border-l border-white/5 z-50 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Sliders className="w-3 h-3 text-studio-accent" />
          Node Inspector
        </h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors" aria-label="Close" title="Close">
          <Scissors className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-studio-accent/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-studio-accent" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase">{selectedNode.toUpperCase()}</p>
            <p className="text-[6px] text-zinc-500 font-mono">STATUS: OPTIMIZED</p>
          </div>
        </div>
      </div>

      {selectedNode === 'primary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {['LIFT', 'GAMMA', 'GAIN'].map((type) => (
              <div key={type} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-black relative overflow-hidden group cursor-crosshair">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-red-500/20 opacity-50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
                <span className="text-[7px] font-black text-zinc-500">{type}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
              <span>SATURATION</span>
              <span>100%</span>
            </div>
            <input type="range" className="w-full h-0.5 accent-studio-accent" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
              <span>CONTRAST</span>
              <span>1.0</span>
            </div>
            <input type="range" className="w-full h-0.5 accent-studio-accent" />
          </div>
        </div>
      )}

      {selectedNode === 'curves' && (
        <div className="space-y-4">
          <div className="h-48 bg-zinc-950 border border-white/5 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 pattern-grid-sm opacity-[0.05]" />
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 0 192 L 192 0"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <path d="M 0 192 Q 96 96, 192 0" stroke="#3b82f6" strokeWidth="2" fill="none" />
            </svg>
            <div className="absolute bottom-2 right-2 text-[6px] font-mono text-zinc-600">
              RGB CURVES
            </div>
          </div>
          <div className="flex gap-2">
            {['R', 'G', 'B', 'W'].map((c) => (
              <button
                key={c}
                className={`flex-1 py-1 rounded text-[8px] font-black border ${
                  c === 'W'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-zinc-500 border-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedNode === 'mask' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center gap-3 text-center">
            <Wand2 className="w-8 h-8 text-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase">Magic Wand AI</p>
              <p className="text-[6px] text-zinc-500">Auto-Segmentation Model Active</p>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full py-2 bg-emerald-500 text-black text-[8px] font-black uppercase rounded-lg">
              Select Subject
            </button>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Edge Feather</span>
                <span>5.0 px</span>
              </div>
              <input type="range" className="w-full h-0.5 accent-emerald-500" />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'tracker' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col items-center gap-3 text-center">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase">3D Camera Tracker</p>
              <p className="text-[6px] text-zinc-500">Feature Points: 1,240</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 bg-zinc-800 text-white text-[7px] font-black uppercase rounded-lg border border-white/5">
              Track Forward
            </button>
            <button className="py-2 bg-zinc-800 text-white text-[7px] font-black uppercase rounded-lg border border-white/5">
              Solve Camera
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
              <span>Search Range</span>
              <span>20%</span>
            </div>
            <input type="range" className="w-full h-0.5 accent-blue-500" />
          </div>
        </div>
      )}

      {selectedNode === 'rayTracing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">Enable Path Tracing</span>
            <button
              onClick={() => updateSubProp('rayTracing', 'enabled', !activeVfx.rayTracing.enabled)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.rayTracing.enabled ? 'bg-studio-accent' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.rayTracing.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Samples per pixel</span>
                <span>{activeVfx.rayTracing.samples}</span>
              </div>
              <input
                type="range"
                min="8"
                max="256"
                value={activeVfx.rayTracing.samples}
                onChange={(e) =>
                  updateSubProp('rayTracing', 'samples', parseInt(e.target.value))
                }
                className="w-full h-0.5 accent-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Bounce Depth</span>
                <span>{activeVfx.rayTracing.bounces}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={activeVfx.rayTracing.bounces}
                onChange={(e) =>
                  updateSubProp('rayTracing', 'bounces', parseInt(e.target.value))
                }
                className="w-full h-0.5 accent-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-zinc-400 uppercase">AI Denoising</span>
              <input
                type="checkbox"
                checked={activeVfx.rayTracing.denoise}
                onChange={(e) => updateSubProp('rayTracing', 'denoise', e.target.checked)}
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'relighting' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">Active Relighting</span>
            <button
              onClick={() => updateSubProp('relighting', 'enabled', !activeVfx.relighting.enabled)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.relighting.enabled ? 'bg-orange-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.relighting.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[7px] text-zinc-500 uppercase">Light Color</label>
              <input
                type="color"
                value={activeVfx.relighting.lightColor}
                onChange={(e) => updateSubProp('relighting', 'lightColor', e.target.value)}
                className="w-full h-8 bg-zinc-900 border border-white/10 rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[7px] text-zinc-500 uppercase">Z-Depth</label>
              <input
                type="range"
                min="0"
                max="100"
                value={activeVfx.relighting.lightPosition.z * 50}
                onChange={(e) =>
                  updateSubProp('relighting', 'lightPosition', {
                    ...activeVfx.relighting.lightPosition,
                    z: parseFloat(e.target.value) / 50,
                  })
                }
                className="w-full"
              />
            </div>
          </div>
          <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 relative aspect-square overflow-hidden group">
            <div className="absolute inset-0 pattern-grid-sm opacity-20" />
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 200, top: 0, bottom: 200 }}
              className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_20px_orange] cursor-move z-10"
              style={{
                x: activeVfx.relighting.lightPosition.x * 100 + 100,
                y: activeVfx.relighting.lightPosition.y * 100 + 100,
              }}
            />
            <div className="absolute bottom-2 left-2 text-[6px] text-zinc-600 font-mono uppercase">
              Virtual Studio Space
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'styleDNA' && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-500" />
              <span className="text-[10px] font-black text-purple-400 uppercase">
                Visual DNA Decoder
              </span>
            </div>
            <div className="h-12 flex gap-1 items-end overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, Math.abs(Math.sin(i * 0.5)) * 40 + 10, 10] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  className="flex-1 bg-purple-500/30 rounded-t-sm"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Color Signature</span>
                <span>{Math.round(activeVfx.styleDNA.colorBias * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.styleDNA.colorBias}
                onChange={(e) =>
                  updateSubProp('styleDNA', 'colorBias', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-purple-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Texture DNA</span>
                <span>{Math.round(activeVfx.styleDNA.textureBias * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.styleDNA.textureBias}
                onChange={(e) =>
                  updateSubProp('styleDNA', 'textureBias', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'volumetrics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">Neural Volumetrics</span>
            <button
              onClick={() =>
                updateSubProp('volumetrics', 'enabled', !activeVfx.volumetrics.enabled)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.volumetrics.enabled ? 'bg-cyan-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.volumetrics.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Fog Density</span>
                <span>{Math.round(activeVfx.volumetrics.density * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.volumetrics.density}
                onChange={(e) =>
                  updateSubProp('volumetrics', 'density', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Anisotropy (God Rays)</span>
                <span>{activeVfx.volumetrics.anisotropy}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.volumetrics.anisotropy}
                onChange={(e) =>
                  updateSubProp('volumetrics', 'anisotropy', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-cyan-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-zinc-400 uppercase">
                Neural Atmosphere
              </span>
              <input
                type="checkbox"
                checked={activeVfx.volumetrics.neuralAtmosphere}
                onChange={(e) =>
                  updateSubProp('volumetrics', 'neuralAtmosphere', e.target.checked)
                }
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'procedural' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
              VEX Procedural Code
            </label>
            <div className="flex gap-2">
              <span className="text-[6px] font-mono text-emerald-500 bg-emerald-500/10 px-1 rounded">
                GPU READY
              </span>
              <span className="text-[6px] font-mono text-zinc-500">
                SEED: {activeVfx.procedural.seed}
              </span>
            </div>
          </div>
          <textarea
            className="w-full h-48 bg-zinc-950 border border-white/5 rounded-lg p-3 font-mono text-[8px] text-emerald-400 overflow-auto whitespace-pre outline-none focus:border-studio-accent/50 transition-all resize-none"
            value={activeVfx.procedural.vexCode}
            onChange={(e) => updateSubProp('procedural', 'vexCode', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 bg-zinc-800 text-white text-[7px] font-black uppercase rounded-lg border border-white/5 hover:bg-studio-accent hover:text-black transition-all">
              Compile VEX
            </button>
            <button className="py-2 bg-zinc-800 text-white text-[7px] font-black uppercase rounded-lg border border-white/5">
              Random Seed
            </button>
          </div>
        </div>
      )}

      {selectedNode === 'temporal' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-400 uppercase">
                Temporal Engine 3.0
              </span>
            </div>
            <p className="text-[7px] text-zinc-500 leading-relaxed">
              Neural optical flow resolution active. Eliminating high-frequency flicker and
              ensuring temporal coherence across AI segments.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Optical Flow Weight</span>
                <span>{Math.round(activeVfx.temporalConsistency.flowWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.temporalConsistency.flowWeight}
                onChange={(e) =>
                  updateSubProp('temporalConsistency', 'flowWeight', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>History Buffer</span>
                <span>{activeVfx.temporalConsistency.historyBuffer} Frames</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={activeVfx.temporalConsistency.historyBuffer}
                onChange={(e) =>
                  updateSubProp('temporalConsistency', 'historyBuffer', parseInt(e.target.value))
                }
                className="w-full h-0.5 accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'reality' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">
              Reality Synthesis (NeRF)
            </span>
            <button
              onClick={() =>
                updateSubProp('realitySynthesis', 'enabled', !activeVfx.realitySynthesis.enabled)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.realitySynthesis.enabled ? 'bg-indigo-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.realitySynthesis.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3">
              <Camera className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-[8px] font-black text-indigo-400 uppercase">
                  3D Reconstruction
                </p>
                <p className="text-[6px] text-zinc-500">GAUSSIAN SPLATTING ACTIVE</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Reconstruction Quality</span>
                <span>{Math.round(activeVfx.realitySynthesis.reconstructionQuality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.realitySynthesis.reconstructionQuality}
                onChange={(e) =>
                  updateSubProp(
                    'realitySynthesis',
                    'reconstructionQuality',
                    parseFloat(e.target.value),
                  )
                }
                className="w-full h-0.5 accent-indigo-500"
              />
            </div>
            <button className="w-full py-2 bg-zinc-800 text-white text-[7px] font-black uppercase rounded-lg border border-white/5 hover:bg-indigo-500 hover:text-black transition-all">
              Generate Virtual Camera Path
            </button>
          </div>
        </div>
      )}

      {selectedNode === 'quantum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">Quantum Simulation</span>
            <button
              onClick={() =>
                updateSubProp('quantumSimulation', 'isActive', !activeVfx.quantumSimulation.isActive)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.quantumSimulation.isActive ? 'bg-blue-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.quantumSimulation.isActive ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['fluid', 'smoke', 'fire', 'cloth'].map((t) => (
              <button
                key={t}
                onClick={() => updateSubProp('quantumSimulation', 'type', t)}
                className={`py-2 text-[7px] font-black uppercase rounded-lg border transition-all ${
                  activeVfx.quantumSimulation.type === t
                    ? 'bg-blue-500 text-black border-blue-500'
                    : 'bg-zinc-900 text-zinc-500 border-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Turbulence Intensity</span>
                <span>{Math.round(activeVfx.quantumSimulation.turbulence * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.quantumSimulation.turbulence}
                onChange={(e) =>
                  updateSubProp('quantumSimulation', 'turbulence', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-zinc-400 uppercase">Neural Super-Res</span>
              <input
                type="checkbox"
                checked={activeVfx.quantumSimulation.neuralEnhancement}
                onChange={(e) =>
                  updateSubProp('quantumSimulation', 'neuralEnhancement', e.target.checked)
                }
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'holograph' && (
        <div className="space-y-6">
          <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl space-y-4 text-center">
            <Layers className="w-8 h-8 text-teal-500 mx-auto" />
            <div>
              <p className="text-[10px] font-black text-teal-400 uppercase">6D Light Field Engine</p>
              <p className="text-[6px] text-zinc-500">HOLOGRAPHIC PARALLAX ACTIVE</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Depth Planes</span>
                <span>{activeVfx.holographicDepth.planes}</span>
              </div>
              <input
                type="range"
                min="32"
                max="1024"
                value={activeVfx.holographicDepth.planes}
                onChange={(e) =>
                  updateSubProp('holographicDepth', 'planes', parseInt(e.target.value))
                }
                className="w-full h-0.5 accent-teal-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Parallax Strength</span>
                <span>{activeVfx.holographicDepth.parallaxStrength}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={activeVfx.holographicDepth.parallaxStrength}
                onChange={(e) =>
                  updateSubProp('holographicDepth', 'parallaxStrength', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'sentient' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">Sentient Logic Engine</span>
            <button
              onClick={() =>
                updateSubProp('sentientLogic', 'enabled', !activeVfx.sentientLogic.enabled)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.sentientLogic.enabled ? 'bg-rose-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.sentientLogic.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[7px] text-zinc-500 uppercase">Narrative Intent</label>
              <textarea
                value={activeVfx.sentientLogic.narrativeIntent}
                onChange={(e) => updateSubProp('sentientLogic', 'narrativeIntent', e.target.value)}
                className="w-full h-20 bg-zinc-950 border border-white/5 rounded-lg p-2 text-[8px] text-rose-400"
                placeholder="Describe the emotional arc..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Emotional Bias</span>
                <span>
                  {activeVfx.sentientLogic.emotionalBias > 0 ? 'EUPHORIA' : 'MELANCHOLY'}
                </span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={activeVfx.sentientLogic.emotionalBias}
                onChange={(e) =>
                  updateSubProp('sentientLogic', 'emotionalBias', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-rose-500"
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'multiverse' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-4 text-center">
            <GitBranch className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
            <div>
              <p className="text-[10px] font-black text-amber-400 uppercase">
                Multiversal Branching
              </p>
              <p className="text-[6px] text-zinc-500">SIMULATING ALTERNATIVE REALITIES</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Divergence Factor</span>
                <span>{Math.round(activeVfx.multiversalBranching.divergenceFactor * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.multiversalBranching.divergenceFactor}
                onChange={(e) =>
                  updateSubProp(
                    'multiversalBranching',
                    'divergenceFactor',
                    parseFloat(e.target.value),
                  )
                }
                className="w-full h-0.5 accent-amber-500"
              />
            </div>
            <button className="w-full py-2 bg-amber-500 text-black text-[7px] font-black uppercase rounded-lg">
              Spawn Reality Branch
            </button>
          </div>
        </div>
      )}

      {selectedNode === 'causal' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">Causal Engineering</span>
            <button
              onClick={() =>
                updateSubProp('causalEngineering', 'enabled', !activeVfx.causalEngineering.enabled)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.causalEngineering.enabled ? 'bg-yellow-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.causalEngineering.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Causality Shift</span>
                <span>{activeVfx.causalEngineering.causalityShift} ms</span>
              </div>
              <input
                type="range"
                min="-1000"
                max="1000"
                value={activeVfx.causalEngineering.causalityShift * 1000}
                onChange={(e) =>
                  updateSubProp(
                    'causalEngineering',
                    'causalityShift',
                    parseFloat(e.target.value) / 1000,
                  )
                }
                className="w-full h-0.5 accent-yellow-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-zinc-400 uppercase">Reverse Entropy</span>
              <input
                type="checkbox"
                checked={activeVfx.causalEngineering.effectBeforeCause}
                onChange={(e) =>
                  updateSubProp('causalEngineering', 'effectBeforeCause', e.target.checked)
                }
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'noetic' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">
              Noetic Synthesis Engine
            </span>
            <button
              onClick={() =>
                updateSubProp('noeticSynthesis', 'enabled', !activeVfx.noeticSynthesis.enabled)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.noeticSynthesis.enabled ? 'bg-yellow-400' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.noeticSynthesis.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['Hero', 'Shadow', 'Anima', 'Sage'].map((a) => (
                <button
                  key={a}
                  onClick={() => updateSubProp('noeticSynthesis', 'archetypeId', a)}
                  className={`py-2 text-[7px] font-black uppercase rounded-lg border transition-all ${
                    activeVfx.noeticSynthesis.archetypeId === a
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-zinc-900 text-zinc-500 border-white/5'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Consciousness Sync</span>
                <span>{Math.round(activeVfx.noeticSynthesis.consciousnessSync * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeVfx.noeticSynthesis.consciousnessSync}
                onChange={(e) =>
                  updateSubProp('noeticSynthesis', 'consciousnessSync', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-yellow-400"
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'ontological' && (
        <div className="space-y-6">
          <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl space-y-4 text-center">
            <Scale className="w-8 h-8 text-sky-500 mx-auto" />
            <div>
              <p className="text-[10px] font-black text-sky-400 uppercase">
                Ontological Variable Control
              </p>
              <p className="text-[6px] text-zinc-500">REWRITING UNIVERSAL CONSTANTS</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Gravity Constant</span>
                <span>{activeVfx.ontologicalVariables.gravityConstant.toFixed(2)} G</span>
              </div>
              <input
                type="range"
                min="-2"
                max="5"
                step="0.01"
                value={activeVfx.ontologicalVariables.gravityConstant}
                onChange={(e) =>
                  updateSubProp('ontologicalVariables', 'gravityConstant', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-sky-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Light Speed (C)</span>
                <span>{activeVfx.ontologicalVariables.lightSpeedShift.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={activeVfx.ontologicalVariables.lightSpeedShift}
                onChange={(e) =>
                  updateSubProp('ontologicalVariables', 'lightSpeedShift', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'dimensional' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase">
              Hyper-Dimensional 5D Fold
            </span>
            <button
              onClick={() =>
                updateSubProp('hyperDimensional', 'active', !activeVfx.hyperDimensional.active)
              }
              className={`w-10 h-5 rounded-full transition-all relative ${
                activeVfx.hyperDimensional.active ? 'bg-fuchsia-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                  activeVfx.hyperDimensional.active ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                <span>Dimensional Scale</span>
                <span>{activeVfx.hyperDimensional.dimensionScale.toFixed(1)}D</span>
              </div>
              <input
                type="range"
                min="3"
                max="5"
                step="0.1"
                value={activeVfx.hyperDimensional.dimensionScale}
                onChange={(e) =>
                  updateSubProp('hyperDimensional', 'dimensionScale', parseFloat(e.target.value))
                }
                className="w-full h-0.5 accent-fuchsia-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-zinc-400 uppercase">
                Non-Euclidean Space
              </span>
              <input
                type="checkbox"
                checked={activeVfx.hyperDimensional.nonEuclideanGeometry}
                onChange={(e) =>
                  updateSubProp('hyperDimensional', 'nonEuclideanGeometry', e.target.checked)
                }
              />
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'glsl' && (
        <div className="space-y-4">
          <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
            Live Shader Code
          </label>
          <textarea
            className="w-full h-64 bg-zinc-950 border border-white/5 rounded-lg p-3 font-mono text-[8px] text-emerald-400 overflow-auto whitespace-pre outline-none focus:border-studio-accent/50 transition-all resize-none"
            defaultValue={`void main(void) {\n  vec4 color = texture2D(uSampler, vTextureCoord);\n  float luma = dot(color.rgb, vec3(0.3, 0.59, 0.11));\n  gl_FragColor = vec4(vec3(luma), color.a);\n}`}
            onChange={(e) => {
              if (selectedClip && onUpdateClip) {
                onUpdateClip(selectedClip.id, {
                  vfx: { ...activeVfx, customShader: e.target.value },
                } as any);
              }
            }}
          />
          <button className="w-full py-2 bg-studio-accent text-black text-[8px] font-black uppercase rounded-lg shadow-lg shadow-studio-accent/20">
            Compile & Apply
          </button>
        </div>
      )}

      {selectedNode === 'particles' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
              <span>Particle Gravity</span>
              <span>0.5G</span>
            </div>
            <input type="range" className="w-full h-0.5 accent-studio-accent" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
              <span>Emission Rate</span>
              <span>240/s</span>
            </div>
            <input type="range" className="w-full h-0.5 accent-studio-accent" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
