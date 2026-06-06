/**
 * Timecode Display Component (#44)
 * Precise timecodes (HH:MM:SS:FF) for timeline and video player
 */

import React from 'react';
import { motion } from 'motion/react';
import { readSharedTime } from '../lib/sharedState';

interface TimecodeDisplayProps {
  currentTime: number;
  duration: number;
  frameRate?: number;
  showFrameCount?: boolean;
  format?: 'HH:MM:SS:FF' | 'MM:SS:FF' | 'SS:FF' | 'HH:MM:SS';
  onSeek?: (time: number) => void;
  className?: string;
}

export const TimecodeDisplay = React.memo<TimecodeDisplayProps>(({
  currentTime,
  duration,
  frameRate = 30,
  showFrameCount = true,
  format = 'HH:MM:SS:FF',
  onSeek,
  className = '',
}) => {
  const formatTimecode = React.useCallback((time: number): string => {
    const totalSeconds = Math.floor(time);
    const frames = Math.floor((time % 1) * frameRate);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    switch (format) {
      case 'HH:MM:SS:FF':
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
      case 'MM:SS:FF':
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
      case 'SS:FF':
        return `${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
      case 'HH:MM:SS':
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      default:
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }, [format, frameRate]);

  const handleClick = (e: React.MouseEvent) => {
    if (!onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;
    onSeek(Math.max(0, Math.min(duration, time)));
  };

const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let frameId: number;
    const update = () => {
      if (ref.current) {
        const time = typeof readSharedTime === 'function' ? readSharedTime() : currentTime;
        const timeStr = formatTimecode(time);
        const frameStr = showFrameCount ? ` <span class="text-studio-accent ml-1">(${Math.floor((time % 1) * frameRate).toString().padStart(2, '0')}f)</span>` : '';
        ref.current.innerHTML = timeStr + frameStr;
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [currentTime, frameRate, showFrameCount, format, formatTimecode]);

  return (
    <motion.div
      className={`font-mono text-xs font-bold text-studio-text-high ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Click to seek"
    >
      <span ref={ref} dangerouslySetInnerHTML={{ __html: formatTimecode(typeof readSharedTime === 'function' ? readSharedTime() : currentTime) + (showFrameCount ? ` <span class="text-studio-accent ml-1">(${Math.floor(((typeof readSharedTime === 'function' ? readSharedTime() : currentTime) % 1) * frameRate).toString().padStart(2, '0')}f)</span>` : '') }} />
    </motion.div>
  );
});

// Timeline timecode marker
export const TimelineTimecode: React.FC<{
  time: number;
  frameRate?: number;
  showFrameCount?: boolean;
  position?: 'top' | 'bottom';
}> = ({ time, frameRate = 30, showFrameCount = true, position = 'bottom' }) => {
  const formatTimecode = (t: number): string => {
    const totalSeconds = Math.floor(t);
    const frames = Math.floor((t % 1) * frameRate);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`absolute text-[9px] font-mono text-studio-text/70 ${position === 'top' ? 'top-0' : 'bottom-0'}`}>
      {formatTimecode(time)}
    </div>
  );
};

// Video player timecode display
export const PlayerTimecode: React.FC<{
  currentTime: number;
  duration: number;
  frameRate?: number;
  onSeek?: (time: number) => void;
}> = ({ currentTime, duration, frameRate = 30, onSeek }) => {
  return (
    <div className="flex items-center gap-4">
      <TimecodeDisplay
        currentTime={currentTime}
        duration={duration}
        frameRate={frameRate}
        onSeek={onSeek}
        className="cursor-pointer hover:text-studio-accent transition-colors"
      />
      <span className="text-studio-text/50">/</span>
      <TimecodeDisplay
        currentTime={duration}
        duration={duration}
        frameRate={frameRate}
        className="text-studio-text/70"
      />
    </div>
  );
};