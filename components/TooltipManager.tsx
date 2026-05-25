// @ts-nocheck
/**
 * Comprehensive Tooltip System (#31)
 * Tooltips for all icons and buttons
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  delay = 300,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [positionStyle, setPositionStyle] = useState({ top: 0, left: 0 });
  const [tooltipText, setTooltipText] = useState(text);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      setTooltipText(text);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = 120;
    const tooltipHeight = 32;
    
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - 8;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + 8;
        break;
    }

    setPositionStyle({ top, left });
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 max-w-xs bg-black/90 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap"
            style={positionStyle}
          >
            {tooltipText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tooltip wrapper for buttons
export const TooltipButton: React.FC<{
  text: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ text, children, onClick, className = '' }) => (
  <Tooltip text={text}>
    <button
      onClick={onClick}
      className={`p-2 rounded transition-colors hover:bg-white/10 ${className}`}
    >
      {children}
    </button>
  </Tooltip>
);

// Tooltip wrapper for icons
export const TooltipIcon: React.FC<{
  text: string;
  icon: React.ReactNode;
  className?: string;
}> = ({ text, icon, className = '' }) => (
  <Tooltip text={text}>
    <div className={`cursor-help ${className}`}>
      {icon}
    </div>
  </Tooltip>
);

// Tooltip wrapper for menu items
export const TooltipMenuItem: React.FC<{
  text: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ text, children, onClick }) => (
  <Tooltip text={text}>
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors"
    >
      {children}
    </button>
  </Tooltip>
);

// Tooltip wrapper for input fields
export const TooltipInput: React.FC<{
  text: string;
  children: React.ReactNode;
}> = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
      <Tooltip text={text}>
        <div className="w-4 h-4 text-studio-text/50 hover:text-studio-text cursor-help">
          ?
        </div>
      </Tooltip>
    </div>
  </div>
);

// Tooltip wrapper for tabs
export const TooltipTab: React.FC<{
  text: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ text, children, active, onClick }) => (
  <Tooltip text={text}>
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded transition-colors ${
        active ? 'bg-studio-accent text-white' : 'text-studio-text hover:text-studio-text-high'
      }`}
    >
      {children}
    </button>
  </Tooltip>
);

// Tooltip wrapper for toolbar items
export const TooltipToolbarItem: React.FC<{
  text: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ text, children, active, onClick }) => (
  <Tooltip text={text}>
    <button
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        active ? 'bg-studio-accent/20 text-studio-accent' : 'text-studio-text hover:text-studio-text-high hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  </Tooltip>
);