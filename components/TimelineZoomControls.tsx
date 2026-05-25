/**
 * Timeline Zoom and Pan Controls (#42)
 * Zoomable and pannable timeline with mouse wheel and trackpad
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize2, MousePointer2 } from 'lucide-react';

interface TimelineZoomControlsProps {
  zoomLevel: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange: (zoom: number) => void;
  onPan?: (panOffset: number) => void;
  duration: number;
  currentTime: number;
  onSeek?: (time: number) => void;
  width?: number;
}

export const TimelineZoomControls: React.FC<TimelineZoomControlsProps> = ({
  zoomLevel,
  minZoom = 0.1,
  maxZoom = 10,
  onZoomChange,
  onPan,
  duration,
  currentTime,
  onSeek,
  width = 1000,
}) => {
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, pan: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel * zoomFactor));
    
    onZoomChange(newZoom);
  }, [zoomLevel, minZoom, maxZoom, onZoomChange]);

  // Pan with middle mouse button or drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, pan: panOffset });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - dragStart.x;
    const newPan = Math.max(0, Math.min(duration * 100 - width, dragStart.pan + deltaX));
    
    setPanOffset(newPan);
    onPan?.(newPan);
  }, [isPanning, dragStart, panOffset, duration, width, onPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Click to seek
  const handleClick = (e: React.MouseEvent) => {
    if (isPanning) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left + panOffset;
    const time = (x / (width * zoomLevel)) * duration;
    
    onSeek?.(Math.max(0, Math.min(duration, time)));
  };

  // Zoom presets
  const zoomPresets = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="relative">
      {/* Timeline container with pan support */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-crosshair"
        style={{ width: width * zoomLevel }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* Timeline content would be rendered here */}
        <div className="absolute top-0 left-0 h-full bg-studio-border/10">
          {/* Placeholder for timeline content */}
          <div className="h-full w-full bg-gradient-to-r from-studio-border/5 to-studio-border/10" />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-studio-panel border border-studio-border rounded-lg p-1">
        <button
          onClick={() => onZoomChange(Math.max(minZoom, zoomLevel / 1.5))}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3 h-3" />
        </button>
        
        <div className="px-2 text-xs font-mono text-studio-text">
          {Math.round(zoomLevel * 100)}%
        </div>
        
        <button
          onClick={() => onZoomChange(Math.min(maxZoom, zoomLevel * 1.5))}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3 h-3" />
        </button>
      </div>

      {/* Zoom presets */}
      <div className="absolute top-12 right-2 flex flex-col gap-1 bg-studio-panel border border-studio-border rounded-lg p-1 opacity-0 hover:opacity-100 transition-opacity">
        {zoomPresets.map(zoom => (
          <button
            key={zoom}
            onClick={() => onZoomChange(zoom)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              Math.abs(zoomLevel - zoom) < 0.01 ? 'bg-studio-accent text-white' : 'hover:bg-white/10'
            }`}
          >
            {Math.round(zoom * 100)}%
          </button>
        ))}
      </div>

      {/* Pan indicator */}
      {isPanning && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Panning
        </div>
      )}

      {/* Mini-map / scrollbar (#43) */}
      <div className="absolute bottom-2 right-2 w-32 h-8 bg-studio-panel/80 border border-studio-border rounded overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-studio-accent/30"
          style={{
            width: `${Math.min(100, (width / (width * zoomLevel)) * 100)}%`,
            left: `${(panOffset / (duration * 100 - width)) * 100}%`,
          }}
        />
      </div>

      {/* Time indicator */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
      </div>
    </div>
  );
};

// Timeline mini-map component
export const TimelineMiniMap: React.FC<{
  duration: number;
  currentTime: number;
  zoomLevel: number;
  panOffset: number;
  onSeek: (time: number) => void;
  width?: number;
}> = ({ duration, currentTime, zoomLevel, panOffset, onSeek, width = 200 }) => {
  const handleSeek = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / width) * duration;
    onSeek(Math.max(0, Math.min(duration, time)));
  };

  return (
    <div
      className="relative h-8 bg-studio-panel border border-studio-border rounded cursor-pointer overflow-hidden"
      onClick={handleSeek}
    >
      {/* Timeline markers */}
      {Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => {
        const x = (i / duration) * width;
        return (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-studio-text/20"
            style={{ left: `${x}px` }}
          />
        );
      })}

      {/* Current time indicator */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
        style={{
          left: `${(currentTime / duration) * width}px`,
        }}
      />

      {/* Zoom level indicator */}
      <div className="absolute top-1 right-2 text-xs text-studio-text">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
};