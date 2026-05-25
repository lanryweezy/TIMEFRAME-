/**
 * Waveform Visualization Component (#49)
 * Real-time audio waveform display for timeline
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface WaveformVisualizationProps {
  audioData: number[] | null;
  width: number;
  height: number;
  currentTime: number;
  duration: number;
  color?: string;
  backgroundColor?: string;
  showProgress?: boolean;
  onSeek?: (time: number) => void;
}

export const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({
  audioData,
  width,
  height,
  currentTime,
  duration,
  color = '#3b82f6',
  backgroundColor = 'transparent',
  showProgress = true,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    drawWaveform(ctx, audioData, width, height, color, currentTime, duration, showProgress);
  }, [audioData, width, height, color, backgroundColor, currentTime, duration, showProgress]);

  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    w: number,
    h: number,
    waveColor: string,
    time: number,
    dur: number,
    progress: boolean
  ) => {
    const centerY = h / 2;
    const barWidth = w / data.length;

    // Draw waveform bars
    data.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * centerY * 0.8; // Scale amplitude

      // Determine color based on progress
      let fillColor = waveColor;
      if (progress && dur > 0) {
        const barTime = (index / data.length) * dur;
        if (barTime <= time) {
          fillColor = '#60a5fa'; // Played portion (lighter blue)
        } else {
          fillColor = '#1e40af'; // Unplayed portion (darker blue)
        }
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(x, centerY - barHeight / 2, Math.max(1, barWidth - 1), barHeight);
    });

    // Draw progress line
    if (progress && dur > 0) {
      const progressX = (time / dur) * w;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, h);
      ctx.stroke();
    }

    // Draw hover line
    if (isHovering && onSeek) {
      const hoverX = (hoverTime / dur) * w;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!onSeek || duration === 0) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const time = (x / width) * duration;
    setHoverTime(Math.max(0, Math.min(duration, time)));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!onSeek || duration === 0) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const time = (x / width) * duration;
    onSeek(Math.max(0, Math.min(duration, time)));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`block ${onSeek ? 'cursor-pointer' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      />

      {/* Hover tooltip */}
      {isHovering && onSeek && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{
            left: `${(hoverTime / duration) * width}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {formatTime(hoverTime)}
        </motion.div>
      )}

      {/* Loading state */}
      {!audioData && (
        <div className="absolute inset-0 flex items-center justify-center bg-studio-border/20">
          <div className="text-xs text-studio-text">Loading waveform...</div>
        </div>
      )}
    </div>
  );
};

/**
 * Hook for generating waveform data from audio file
 */
export const useWaveformData = (audioFile: File | null, samples: number = 1000) => {
  const [waveformData, setWaveformData] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!audioFile) {
      setWaveformData(null);
      return;
    }

    setIsLoading(true);
    generateWaveformData(audioFile, samples)
      .then(setWaveformData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [audioFile, samples]);

  return { waveformData, isLoading };
};

async function generateWaveformData(audioFile: File, samples: number): Promise<number[]> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await audioFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0); // Use first channel
  const samplesPerPixel = Math.floor(channelData.length / samples);
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = i * samplesPerPixel;
    const end = start + samplesPerPixel;
    let max = 0;

    for (let j = start; j < end && j < channelData.length; j++) {
      max = Math.max(max, Math.abs(channelData[j]));
    }

    waveform.push(max);
  }

  audioContext.close();
  return waveform;
}