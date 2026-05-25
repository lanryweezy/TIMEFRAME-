/**
 * Audio Fade Controls Component (#50)
 * Visual fade in/out controls with indicators
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioFadeControlsProps {
  fadeIn: number; // seconds
  fadeOut: number; // seconds
  duration: number; // total clip duration
  onFadeInChange: (value: number) => void;
  onFadeOutChange: (value: number) => void;
  width?: number;
  height?: number;
}

export const AudioFadeControls: React.FC<AudioFadeControlsProps> = ({
  fadeIn,
  fadeOut,
  duration,
  onFadeInChange,
  onFadeOutChange,
  width = 200,
  height = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<'fadeIn' | 'fadeOut' | null>(null);

  useEffect(() => {
    drawFadeCurve();
  }, [fadeIn, fadeOut, duration, width, height]);

  const drawFadeCurve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Calculate positions
    const fadeInX = (fadeIn / duration) * width;
    const fadeOutX = width - (fadeOut / duration) * width;

    // Draw volume curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Fade in curve
    if (fadeIn > 0) {
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(fadeInX / 2, height * 0.3, fadeInX, 0);
    } else {
      ctx.moveTo(0, 0);
    }

    // Sustain level
    ctx.lineTo(fadeOutX, 0);

    // Fade out curve
    if (fadeOut > 0) {
      ctx.quadraticCurveTo(fadeOutX + (width - fadeOutX) / 2, height * 0.3, width, height);
    } else {
      ctx.lineTo(width, 0);
    }

    ctx.stroke();

    // Draw fade handles
    if (fadeIn > 0) {
      drawHandle(ctx, fadeInX, 0, '#60a5fa');
    }
    if (fadeOut > 0) {
      drawHandle(ctx, fadeOutX, 0, '#f87171');
    }

    // Draw time labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    
    if (fadeIn > 0) {
      ctx.fillText(`${fadeIn.toFixed(1)}s`, fadeInX, height - 5);
    }
    if (fadeOut > 0) {
      ctx.fillText(`${fadeOut.toFixed(1)}s`, fadeOutX, height - 5);
    }
  };

  const drawHandle = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const fadeInX = (fadeIn / duration) * width;
    const fadeOutX = width - (fadeOut / duration) * width;

    // Check if clicking near fade handles
    if (Math.abs(x - fadeInX) < 10) {
      setIsDragging('fadeIn');
    } else if (Math.abs(x - fadeOutX) < 10) {
      setIsDragging('fadeOut');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / width) * duration;

    if (isDragging === 'fadeIn') {
      const maxFadeIn = Math.min(duration / 2, duration - fadeOut);
      onFadeInChange(Math.max(0, Math.min(maxFadeIn, time)));
    } else if (isDragging === 'fadeOut') {
      const timeFromEnd = duration - time;
      const maxFadeOut = Math.min(duration / 2, duration - fadeIn);
      onFadeOutChange(Math.max(0, Math.min(maxFadeOut, timeFromEnd)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-studio-text" />
          <span className="text-sm font-medium text-studio-text-high">Audio Fades</span>
        </div>
        <button
          onClick={() => {
            onFadeInChange(0);
            onFadeOutChange(0);
          }}
          className="text-xs text-studio-text hover:text-studio-text-high transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-studio-border rounded cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Fade indicators */}
        <div className="absolute -top-6 left-0 flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-studio-text">Fade In</span>
        </div>
        <div className="absolute -top-6 right-0 flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-studio-text">Fade Out</span>
        </div>
      </div>

      {/* Numeric controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-studio-text mb-1">Fade In (s)</label>
          <input
            type="number"
            min="0"
            max={duration / 2}
            step="0.1"
            value={fadeIn}
            onChange={(e) => onFadeInChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-studio-bg border border-studio-border rounded px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs text-studio-text mb-1">Fade Out (s)</label>
          <input
            type="number"
            min="0"
            max={duration / 2}
            step="0.1"
            value={fadeOut}
            onChange={(e) => onFadeOutChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-studio-bg border border-studio-border rounded px-2 py-1 text-xs"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            onFadeInChange(0.5);
            onFadeOutChange(0.5);
          }}
          className="px-2 py-1 text-xs bg-studio-border hover:bg-studio-border/80 rounded transition-colors"
        >
          Quick Fade
        </button>
        <button
          onClick={() => {
            onFadeInChange(2);
            onFadeOutChange(2);
          }}
          className="px-2 py-1 text-xs bg-studio-border hover:bg-studio-border/80 rounded transition-colors"
        >
          Smooth Fade
        </button>
      </div>
    </div>
  );
};