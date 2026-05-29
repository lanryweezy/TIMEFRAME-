import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Plus, Scissors } from 'lucide-react';
import { CloudAsset } from '@/types';
import { useVideoStore } from '@/store/videoStore';

interface SourceMonitorProps {
  asset?: CloudAsset;
  onAddToTimeline: (asset: CloudAsset, inTime: number, outTime: number) => void;
}

export const SourceMonitor: React.FC<SourceMonitorProps> = ({ asset, onAddToTimeline }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [inPoint, setInPoint] = useState(0);
  const [outPoint, setOutPoint] = useState(10); // Default 10s or asset duration
  const videoRef = useRef<HTMLVideoElement>(null);

  const duration = asset?.metadata?.duration || 10;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const setIn = () => setInPoint(currentTime);
  const setOut = () => setOutPoint(currentTime);

  if (!asset) {
    return (
      <div className="w-full h-full bg-zinc-900/50 flex flex-col items-center justify-center border border-white/5 rounded-xl">
        <video className="hidden" />
        <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">Source Monitor</span>
        <span className="text-[8px] text-zinc-700 mt-2">Select an asset to preview</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black rounded-xl overflow-hidden border border-white/10 group shadow-2xl">
      {/* Top Bar */}
      <div className="px-3 py-2 bg-zinc-900 border-b border-white/5 flex justify-between items-center">
        <span className="text-[9px] font-black uppercase text-zinc-400 truncate max-w-[150px]">
          {asset.name}
        </span>
        <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center bg-[#050505]">
        <video
          ref={videoRef}
          src={asset.url}
          className="max-w-full max-h-full"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Play Overlay */}
        <div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/20"
            onClick={togglePlay}
        >
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="p-3 bg-zinc-950 space-y-3">
        {/* Scrub Bar */}
        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
                className="absolute top-0 bottom-0 bg-studio-accent"
                style={{ left: `${(currentTime / duration) * 100}%`, width: '2px' }}
            />
            {/* In/Out indicators */}
            <div 
                className="absolute top-0 bottom-0 bg-blue-500/30 border-x border-blue-400"
                style={{ left: `${(inPoint / duration) * 100}%`, right: `${100 - (outPoint / duration) * 100}%` }}
            />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={setIn} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Mark In (I)" aria-label="Mark In">
                <span className="text-[10px] font-black text-blue-400">IN</span>
            </button>
            <button onClick={setOut} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Mark Out (O)" aria-label="Mark Out">
                <span className="text-[10px] font-black text-rose-400">OUT</span>
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <button className="text-zinc-500 hover:text-white transition-colors" aria-label="Skip Back">
                <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button className="text-zinc-500 hover:text-white transition-colors">
                <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[10px] font-mono text-zinc-500">
                <span className="text-white">{currentTime.toFixed(2)}</span> / {duration.toFixed(2)}s
            </div>
            <button 
                onClick={() => onAddToTimeline(asset, inPoint, outPoint)}
                className="flex items-center gap-2 px-3 py-1.5 bg-studio-accent text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 transition-all"
            >
                <Plus className="w-3 h-3" />
                Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
