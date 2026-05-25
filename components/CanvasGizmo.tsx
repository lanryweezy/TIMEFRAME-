import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Move, Maximize2, RotateCw } from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';
import { VideoClip } from '@/types';

interface CanvasGizmoProps {
  containerRect?: DOMRect;
}

export const CanvasGizmo: React.FC<CanvasGizmoProps> = ({ containerRect }) => {
  const store = useVideoStore();
  const { videoClips, selectedClipId, updateClip } = store;
  
  const selectedClip = useMemo(() => 
    videoClips.find(c => c.id === selectedClipId),
    [videoClips, selectedClipId]
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'scale' | 'rotate' | null>(null);
  const [startPos, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTransform, setInitialTransform] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  const gizmoRef = useRef<HTMLDivElement>(null);

  if (!selectedClip || !containerRect) return null;

  const transform = selectedClip.transform || { scale: 1, positionX: 0, positionY: 0, rotation: 0 };
  
  // Map world (centered percentage) to screen pixels
  // Pixi renderer uses (0,0) as center by default in many configs, or (top,left).
  // Looking at pixi.worker.ts: sprite.position.set(app.screen.width / 2, app.screen.height / 2);
  // So (0,0) in our transform is the center of the screen.
  
  const screenX = (containerRect.width / 2) + transform.positionX;
  const screenY = (containerRect.height / 2) + transform.positionY;
  
  // Rough estimate of clip size (needs metadata, but we'll assume 16:9 for now or use a default)
  const baseWidth = containerRect.width * 0.8; 
  const baseHeight = baseWidth * (9/16);
  const width = baseWidth * transform.scale;
  const height = baseHeight * transform.scale;

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'scale' | 'rotate') => {
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialTransform({
        x: transform.positionX,
        y: transform.positionY,
        scale: transform.scale,
        rotation: transform.rotation
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragType) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    if (dragType === 'move') {
        updateClip(selectedClip.id, {
            transform: {
                ...transform,
                positionX: initialTransform.x + dx,
                positionY: initialTransform.y + dy
            }
        } as any);
    } else if (dragType === 'scale') {
        const scaleFactor = 1 + (dx / 200);
        updateClip(selectedClip.id, {
            transform: {
                ...transform,
                scale: Math.max(0.1, initialTransform.scale * scaleFactor)
            }
        } as any);
    } else if (dragType === 'rotate') {
        const rotationDeg = initialTransform.rotation + (dx / 2);
        updateClip(selectedClip.id, {
            transform: {
                ...transform,
                rotation: rotationDeg
            }
        } as any);
    }
  }, [isDragging, dragType, startPos, initialTransform, transform, selectedClip, updateClip]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
        className="absolute inset-0 pointer-events-none z-[100]"
        style={{ width: containerRect.width, height: containerRect.height }}
    >
        <motion.div 
            ref={gizmoRef}
            className="absolute border-2 border-studio-accent/60 shadow-[0_0_20px_rgba(var(--studio-accent-rgb),0.3)] pointer-events-auto cursor-grab active:cursor-grabbing group"
            style={{
                left: screenX,
                top: screenY,
                width: width,
                height: height,
                x: '-50%',
                y: '-50%',
                rotate: transform.rotation,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
            {/* Corner Scale Handles */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
                <div 
                    key={corner}
                    className={`absolute w-3 h-3 bg-white border-2 border-studio-accent rounded-full shadow-lg cursor-nwse-resize z-20 hover:scale-125 transition-transform ${
                        corner.includes('top') ? '-top-1.5' : '-bottom-1.5'
                    } ${
                        corner.includes('left') ? '-left-1.5' : '-right-1.5'
                    }`}
                    onMouseDown={(e) => handleMouseDown(e, 'scale')}
                />
            ))}

            {/* Rotation Handle */}
            <div 
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group/rot"
                onMouseDown={(e) => handleMouseDown(e, 'rotate')}
            >
                <div className="w-4 h-4 bg-white border-2 border-studio-accent rounded-full shadow-lg flex items-center justify-center cursor-alias hover:scale-125 transition-transform">
                    <RotateCw className="w-2.5 h-2.5 text-studio-accent" />
                </div>
                <div className="w-0.5 h-4 bg-studio-accent/40" />
            </div>

            {/* Center Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-studio-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Info Badge */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-studio-accent text-black text-[7px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {transform.scale.toFixed(2)}x | {transform.rotation.toFixed(0)}°
            </div>
        </motion.div>
    </div>
  );
};

import { useMemo } from 'react';
