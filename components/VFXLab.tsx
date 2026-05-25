import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Atom, Orbit, Cloud, Sparkles } from 'lucide-react';
import { VideoClip } from '../types';
import { VFXLabHeader } from './vfx-lab/VFXLabHeader';
import { GraphView } from './vfx-lab/GraphView';
import { SliderView } from './vfx-lab/SliderView';
import { NodeInspector } from './vfx-lab/NodeInspector';
import { DEFAULT_VFX_STATE } from './vfx-lab/vfxConstants';

interface VFXLabProps {
  onClose: () => void;
  selectedClip?: VideoClip;
  onUpdateClip?: (id: string, updates: Partial<VideoClip>) => void;
}

const VFXLab: React.FC<VFXLabProps> = ({ onClose, selectedClip, onUpdateClip }) => {
  const [viewMode, setViewMode] = useState<'graph' | 'sliders'>('graph');
  const [selectedNode, setSelectedNode] = useState<string>('primary');

  const activeVfx = useMemo(() => {
    return selectedClip?.vfx || DEFAULT_VFX_STATE;
  }, [selectedClip]);

  const updateProp = useCallback(
    (prop: string, value: any) => {
      if (selectedClip && onUpdateClip) {
        onUpdateClip(selectedClip.id, {
          vfx: { ...activeVfx, [prop]: value },
        } as any);
      }
    },
    [selectedClip, onUpdateClip, activeVfx],
  );

  const updateSubProp = useCallback(
    (mainProp: string, subProp: string, value: any) => {
      if (selectedClip && onUpdateClip) {
        onUpdateClip(selectedClip.id, {
          vfx: {
            ...activeVfx,
            [mainProp]: {
              ...(activeVfx[mainProp as keyof typeof activeVfx] as any),
              [subProp]: value,
            },
          },
        } as any);
      }
    },
    [selectedClip, onUpdateClip, activeVfx],
  );

  const sliders = [
    {
      id: 'halation',
      label: 'Halation',
      icon: Atom,
      value: activeVfx.halation,
      onChange: (v: number) => updateProp('halation', v),
    },
    {
      id: 'grain',
      label: 'Film Grain',
      icon: Orbit,
      value: activeVfx.grain,
      onChange: (v: number) => updateProp('grain', v),
    },
    {
      id: 'motionBlur',
      label: 'Motion Blur',
      icon: Cloud,
      value: activeVfx.motionBlur,
      onChange: (v: number) => updateProp('motionBlur', v),
    },
    {
      id: 'beauty',
      label: 'Neural Beauty',
      icon: Sparkles,
      value: activeVfx.beauty,
      onChange: (v: number) => updateProp('beauty', v),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[120] flex flex-col bg-[#020202]/95 backdrop-blur-3xl overflow-hidden"
    >
      <VFXLabHeader viewMode={viewMode} setViewMode={setViewMode} onClose={onClose} />

      <div className="flex-1 flex relative">
        <AnimatePresence mode="wait">
          {viewMode === 'graph' ? (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 relative"
            >
              <GraphView
                selectedClip={selectedClip}
                activeVfx={activeVfx}
                updateProp={updateProp}
                onSelectNode={setSelectedNode}
                selectedNode={selectedNode}
              />

              <AnimatePresence>
                {selectedNode && (
                  <NodeInspector
                    selectedNode={selectedNode}
                    onClose={() => setSelectedNode('')}
                    activeVfx={activeVfx}
                    updateSubProp={updateSubProp}
                    selectedClip={selectedClip}
                    onUpdateClip={onUpdateClip}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="sliders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1"
            >
              <SliderView sliders={sliders} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VFXLab;
