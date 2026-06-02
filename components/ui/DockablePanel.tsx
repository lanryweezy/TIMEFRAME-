import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { Maximize2, Minimize2, X, Move } from 'lucide-react';
import { PanelState } from '../../types';
import { useUIStore } from '../../store/videoStore';

interface DockablePanelProps {
  panelId: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const DockablePanel: React.FC<DockablePanelProps> = ({
  panelId,
  title,
  children,
  className = '',
}) => {
  const { ui, setPanelState } = useUIStore();
  const panel = ui.panels[panelId];
  const dragControls = useDragControls();
  
  if (!panel || !panel.isVisible) return null;

  const handleToggleFloating = () => {
    setPanelState(panelId, { isFloating: !panel.isFloating });
  };

  const handleClose = () => {
    setPanelState(panelId, { isVisible: false });
  };

  const style: React.CSSProperties = panel.isFloating ? {
    position: 'absolute',
    left: panel.x,
    top: panel.y,
    width: panel.width,
    height: panel.height,
    zIndex: panel.zIndex,
  } : {
    width: panel.width,
    height: panel.height,
  };

  return (
    <motion.div
      layout
      drag={panel.isFloating}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (panel.isFloating) {
          setPanelState(panelId, {
            x: panel.x + info.offset.x,
            y: panel.y + info.offset.y,
          });
        }
      }}
      className={`bg-zinc-950/40 backdrop-blur-xl border border-white/5 flex flex-col overflow-hidden ${panel.isFloating ? 'rounded-xl shadow-2xl' : ''} ${className}`}
      style={style}
    >
      <div 
        className="h-8 flex items-center justify-between px-3 border-b border-white/5 bg-white/5 cursor-default select-none group"
        onPointerDown={(e) => panel.isFloating && dragControls.start(e)}
      >
        <div className="flex items-center gap-2">
          {panel.isFloating && <Move className="w-3 h-3 text-zinc-500" />}
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200 transition-colors">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleFloating}
            className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-500 hover:text-white"
            aria-label={panel.isFloating ? `Dock ${title} panel` : `Float ${title} panel`}
            title={panel.isFloating ? "Dock panel" : "Float panel"}
          >
            {panel.isFloating ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-500/20 rounded transition-colors text-zinc-500 hover:text-red-400"
            aria-label={`Close ${title} panel`}
            title="Close panel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </motion.div>
  );
};
