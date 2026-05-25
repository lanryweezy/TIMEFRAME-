// @ts-nocheck
/**
 * Snapping Controls Component (#45)
 * Grid snapping for timeline clips
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Grid, Magnet, Snap, Ruler } from 'lucide-react';

interface SnappingControlsProps {
  snapEnabled: boolean;
  snapInterval: number;
  onSnapToggle: (enabled: boolean) => void;
  onSnapIntervalChange: (interval: number) => void;
  frameRate?: number;
}

export const SnappingControls: React.FC<SnappingControlsProps> = ({
  snapEnabled,
  snapInterval,
  onSnapToggle,
  onSnapIntervalChange,
  frameRate = 30,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate frame interval based on frame rate
  const frameInterval = 1 / frameRate;

  const snapPresets = [
    { label: 'Frames', value: frameInterval, icon: Grid },
    { label: '1/10s', value: 0.1, icon: Ruler },
    { label: '1/4s', value: 0.25, icon: Ruler },
    { label: '1s', value: 1, icon: Ruler },
    { label: '5s', value: 5, icon: Ruler },
    { label: '10s', value: 10, icon: Ruler },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Magnet className="w-4 h-4 text-studio-accent" />
          <h3 className="font-medium text-studio-text-high">Snapping</h3>
        </div>
        <button
          onClick={() => onSnapToggle(!snapEnabled)}
          className={`w-10 h-5 rounded-full relative transition-colors ${
            snapEnabled ? 'bg-studio-accent' : 'bg-studio-border'
          }`}
        >
          <motion.div
            className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm"
            animate={{ x: snapEnabled ? 15 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </button>
      </div>

      {/* Snap presets */}
      <div className="grid grid-cols-3 gap-1">
        {snapPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onSnapIntervalChange(preset.value)}
            className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
              Math.abs(snapInterval - preset.value) < 0.001
                ? 'bg-studio-accent/20 text-studio-accent'
                : 'bg-studio-border/20 text-studio-text hover:bg-studio-border/40'
            }`}
          >
            <preset.icon className="w-3 h-3 mb-1" />
            <span className="text-[9px] font-medium">{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced settings */}
      <div className="border-t border-studio-border pt-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs text-studio-accent hover:text-studio-accent-hover transition-colors"
        >
          <Snap className="w-3 h-3" />
          Advanced Settings
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-3 space-y-3"
          >
            <div>
              <label className="block text-xs text-studio-text mb-1">
                Custom Interval (seconds)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={snapInterval}
                onChange={(e) => onSnapIntervalChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-studio-bg border border-studio-border rounded px-2 py-1 text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-studio-text">Snap to clips</span>
              <div className="w-8 h-4 bg-studio-accent rounded-full relative">
                <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-studio-text">Snap to markers</span>
              <div className="w-8 h-4 bg-studio-accent rounded-full relative">
                <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Current snap status */}
      <div className="flex items-center justify-between text-xs text-studio-text">
        <span>Snapping:</span>
        <span className="font-medium text-studio-text-high">
          {snapEnabled ? `${snapInterval.toFixed(2)}s` : 'Off'}
        </span>
      </div>
    </div>
  );
};

// Visual snapping guide
export const SnappingGuide: React.FC<{
  currentTime: number;
  snapInterval: number;
  duration: number;
  width: number;
}> = ({ currentTime, snapInterval, duration, width }) => {
  const snapTime = Math.round(currentTime / snapInterval) * snapInterval;
  const snapPosition = (snapTime / duration) * width;

  return (
    <div className="absolute top-0 bottom-0 pointer-events-none z-0">
      {/* Snap lines */}
      {Array.from({ length: Math.ceil(duration / snapInterval) + 1 }, (_, i) => {
        const time = i * snapInterval;
        const x = (time / duration) * width;
        
        return (
          <div
            key={time}
            className="absolute top-0 bottom-0 w-px bg-studio-accent/20"
            style={{ left: `${x}px` }}
          />
        );
      })}

      {/* Current position indicator */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
        style={{ left: `${(currentTime / duration) * width}px` }}
      />

      {/* Snap target indicator */}
      {Math.abs(snapTime - currentTime) < snapInterval / 2 && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-studio-accent/50 z-10"
          style={{ left: `${snapPosition}px` }}
        />
      )}
    </div>
  );
};