/**
 * Collapsible Sidebar Component (#41)
 * Maximizes screen real estate for video player
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  children,
  initialWidth = 256,
  minWidth = 64,
  maxWidth = 512,
  onToggle,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <motion.div
      className={`relative flex flex-col ${className}`}
      animate={{ width }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Sidebar content */}
      <div className="h-full overflow-hidden">{children}</div>

      {/* Resize handle */}
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize hover:bg-studio-accent/20 transition-colors z-50"
        onMouseDown={handleMouseDown}
        title="Drag to resize"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-studio-border rounded-full flex items-center justify-center">
          <div className="w-0.5 h-3 bg-studio-text/50" />
          <div className="w-0.5 h-3 bg-studio-text/50 absolute" />
        </div>
      </div>

      {/* Toggle button (when collapsed) */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 p-2 bg-studio-panel border border-studio-border rounded-l hover:bg-studio-accent hover:text-white transition-colors"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Toggle button (when expanded) */}
      {isOpen && (
        <button
          onClick={handleToggle}
          className="absolute top-2 right-2 p-1.5 bg-studio-panel border border-studio-border rounded hover:bg-studio-accent hover:text-white transition-colors z-40"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};

// Full-screen toggle wrapper
export const FullScreenToggle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative">
      {children}

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors z-50"
        title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
        aria-label={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 text-white" />
        ) : (
          <Maximize2 className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
};
