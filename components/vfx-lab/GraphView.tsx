import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VfxNode } from './VfxNode';
import { VfxNodeData, VfxGraph, VideoClip } from '../../types';
import {
  Activity,
  Droplets,
  Atom,
  Orbit,
  Cloud,
  Shield,
  Plus,
  Zap,
} from 'lucide-react';

interface GraphViewProps {
  selectedClip?: VideoClip;
  activeVfx: any;
  updateProp: (prop: string, value: any) => void;
  onSelectNode: (id: string) => void;
  selectedNode: string;
}

const INITIAL_NODES: VfxNodeData[] = [
    { id: 'input', type: 'input', label: 'Video Input', position: { x: 50, y: 300 }, params: {}, inputs: {} },
    { id: 'blur', type: 'blur', label: 'Gaussian Blur', position: { x: 300, y: 200 }, params: { intensity: 50 }, inputs: { in: 'input' } },
    { id: 'color', type: 'color', label: 'Primary Grade', position: { x: 300, y: 400 }, params: { saturation: 1.2 }, inputs: { in: 'input' } },
    { id: 'output', type: 'output', label: 'Render Output', position: { x: 600, y: 300 }, params: {}, inputs: { in: 'blur' } },
];

export const GraphView: React.FC<GraphViewProps> = ({
  selectedClip,
  activeVfx,
  updateProp,
  onSelectNode,
  selectedNode,
}) => {
  const [nodes, setNodes] = useState<VfxNodeData[]>(selectedClip?.vfxGraph?.nodes || INITIAL_NODES);

  const handleNodeDrag = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, position: { x, y } } : n));
  }, []);

  const handleNodeChange = useCallback((id: string, value: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, params: { ...n.params, intensity: value } } : n));
  }, []);

  // Compute edges for SVG rendering
  const edges = useMemo(() => {
    const e: { from: { x: number, y: number }, to: { x: number, y: number } }[] = [];
    nodes.forEach(node => {
        Object.entries(node.inputs).forEach(([port, sourceId]) => {
            if (sourceId) {
                const source = nodes.find(n => n.id === sourceId);
                if (source) {
                    e.push({
                        from: { x: source.position.x + 192, y: source.position.y + 48 }, // Adjust for node width/height
                        to: { x: node.position.x, y: node.position.y + 48 }
                    });
                }
            }
        });
    });
    return e;
  }, [nodes]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050505] pattern-grid-lg opacity-90">
      {/* Dynamic Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
              </feMerge>
          </filter>
        </defs>
        <AnimatePresence>
            {edges.map((edge, i) => (
                <motion.path
                    key={`edge-${i}`}
                    d={`M ${edge.from.x} ${edge.from.y} C ${edge.from.x + 80} ${edge.from.y}, ${
                    edge.to.x - 80
                    } ${edge.to.y}, ${edge.to.x} ${edge.to.y}`}
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
            ))}
        </AnimatePresence>
      </svg>

      {/* Dynamic Node Layer */}
      {nodes.map((node) => (
        <VfxNode
          key={node.id}
          id={node.id}
          x={node.position.x}
          y={node.position.y}
          label={node.label}
          icon={node.type === 'blur' ? Droplets : node.type === 'color' ? Activity : Zap}
          active={true}
          value={node.params.intensity || 100}
          onChange={(v) => handleNodeChange(node.id, v)}
          onDrag={handleNodeDrag}
          onSelect={onSelectNode}
          isSelected={selectedNode === node.id}
        />
      ))}

      {/* Node Creation Palette */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-3 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
          <button 
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            onClick={() => {/* Logic to add node */}}
          >
              <Plus className="w-4 h-4" /> Add Node
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">
              Project Nodes: {nodes.length}
          </span>
      </div>
    </div>
  );
};
