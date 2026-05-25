import React, { useRef, useEffect, useState } from 'react';
import { TrendingUp, MousePointer2, Spline } from 'lucide-react';
import { VideoClip, Keyframe } from '../types';

interface KeyframeEditorProps {
  selectedClip: VideoClip;
  property: string;
  onUpdateKeyframes: (prop: string, keyframes: Keyframe[]) => void;
}

export const KeyframeEditor: React.FC<KeyframeEditorProps> = ({
  selectedClip,
  property,
  onUpdateKeyframes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keyframes = selectedClip.transform?.keyframes?.[property] || [];
  const [dragState, setDragState] = useState<{
    id: string;
    type: 'keyframe' | 'cp1' | 'cp2';
    initialX: number;
    initialY: number;
  } | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      
      const y = (i / 10) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (keyframes.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const sorted = [...keyframes].sort((a, b) => a.time - b.time);

    // Draw curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    sorted.forEach((kf, i) => {
      const x = (kf.time / selectedClip.duration) * width;
      const y = height - (kf.value / 200) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prev = sorted[i - 1];
        const prevX = (prev.time / selectedClip.duration) * width;
        const prevY = height - (prev.value / 200) * height;

        if (kf.easing === 'bezier' && kf.bezierControls) {
          const cp1x = prevX + (x - prevX) * kf.bezierControls.cp1.x;
          const cp1y = prevY + (y - prevY) * kf.bezierControls.cp1.y;
          const cp2x = prevX + (x - prevX) * kf.bezierControls.cp2.x;
          const cp2y = prevY + (y - prevY) * kf.bezierControls.cp2.y;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.stroke();

    // Draw keyframes and handles
    sorted.forEach((kf, i) => {
      const x = (kf.time / selectedClip.duration) * width;
      const y = height - (kf.value / 200) * height;

      // Draw handles if bezier
      if (kf.easing === 'bezier' && kf.bezierControls && i > 0) {
        const prev = sorted[i - 1];
        const prevX = (prev.time / selectedClip.duration) * width;
        const prevY = height - (prev.value / 200) * height;

        const cp1x = prevX + (x - prevX) * kf.bezierControls.cp1.x;
        const cp1y = prevY + (y - prevY) * kf.bezierControls.cp1.y;
        const cp2x = prevX + (x - prevX) * kf.bezierControls.cp2.x;
        const cp2y = prevY + (y - prevY) * kf.bezierControls.cp2.y;

        // Lines to handles
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(cp1x, cp1y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(cp2x, cp2y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Handle dots
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cp1x, cp1y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cp2x, cp2y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Keyframe dot
      ctx.fillStyle = (dragState?.id === kf.id && dragState.type === 'keyframe') ? '#fff' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  useEffect(() => {
    draw();
  }, [keyframes, selectedClip.duration, dragState]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    const sorted = [...keyframes].sort((a, b) => a.time - b.time);

    for (let i = 0; i < sorted.length; i++) {
      const kf = sorted[i];
      const x = (kf.time / selectedClip.duration) * width;
      const y = height - (kf.value / 200) * height;

      // Check keyframe
      if (Math.hypot(x - mouseX, y - mouseY) < 10) {
        setDragState({ id: kf.id, type: 'keyframe', initialX: mouseX, initialY: mouseY });
        return;
      }

      // Check handles
      if (kf.easing === 'bezier' && kf.bezierControls && i > 0) {
        const prev = sorted[i - 1];
        const prevX = (prev.time / selectedClip.duration) * width;
        const prevY = height - (prev.value / 200) * height;

        const cp1x = prevX + (x - prevX) * kf.bezierControls.cp1.x;
        const cp1y = prevY + (y - prevY) * kf.bezierControls.cp1.y;
        const cp2x = prevX + (x - prevX) * kf.bezierControls.cp2.x;
        const cp2y = prevY + (y - prevY) * kf.bezierControls.cp2.y;

        if (Math.hypot(cp1x - mouseX, cp1y - mouseY) < 8) {
          setDragState({ id: kf.id, type: 'cp1', initialX: mouseX, initialY: mouseY });
          return;
        }
        if (Math.hypot(cp2x - mouseX, cp2y - mouseY) < 8) {
          setDragState({ id: kf.id, type: 'cp2', initialX: mouseX, initialY: mouseY });
          return;
        }
      }
    }

    // If nothing hit, maybe add new keyframe?
    const x = mouseX / width;
    const y = 1 - mouseY / height;
    const time = x * selectedClip.duration;
    const value = y * 200;

    const newKf: Keyframe = {
      id: crypto.randomUUID().slice(0, 8),

      time,
      value,
      easing: 'bezier',
      bezierControls: {
        cp1: { x: 0.25, y: 0.25 },
        cp2: { x: 0.75, y: 0.75 }
      }
    };
    onUpdateKeyframes(property, [...keyframes, newKf].sort((a, b) => a.time - b.time));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    const newKeyframes = keyframes.map(kf => {
      if (kf.id !== dragState.id) return kf;

      if (dragState.type === 'keyframe') {
        return {
          ...kf,
          time: Math.max(0, Math.min(selectedClip.duration, (mouseX / width) * selectedClip.duration)),
          value: Math.max(0, Math.min(200, (1 - mouseY / height) * 200))
        };
      }

      if (kf.easing === 'bezier' && kf.bezierControls) {
        const sorted = [...keyframes].sort((a, b) => a.time - b.time);
        const kfIndex = sorted.findIndex(k => k.id === kf.id);
        const prev = sorted[kfIndex - 1];
        if (!prev) return kf;

        const x = (kf.time / selectedClip.duration) * width;
        const y = height - (kf.value / 200) * height;
        const prevX = (prev.time / selectedClip.duration) * width;
        const prevY = height - (prev.value / 200) * height;

        if (dragState.type === 'cp1') {
          return {
            ...kf,
            bezierControls: {
              ...kf.bezierControls,
              cp1: {
                x: Math.max(0, Math.min(1, (mouseX - prevX) / (x - prevX))),
                y: (mouseY - prevY) / (y - prevY) // Can be outside 0-1
              }
            }
          };
        }
        if (dragState.type === 'cp2') {
          return {
            ...kf,
            bezierControls: {
              ...kf.bezierControls,
              cp2: {
                x: Math.max(0, Math.min(1, (mouseX - prevX) / (x - prevX))),
                y: (mouseY - prevY) / (y - prevY)
              }
            }
          };
        }
      }
      return kf;
    });

    onUpdateKeyframes(property, newKeyframes);
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  return (
    <div className="space-y-3 p-4 bg-zinc-950 border border-white/5 rounded-2xl select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-studio-accent" />
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{property} Graph</span>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => {
                const newKfs = keyframes.map(kf => ({ ...kf, easing: 'linear' as any }));
                onUpdateKeyframes(property, newKfs);
              }}
              className={`px-2 py-0.5 border rounded text-[7px] font-mono transition-all ${keyframes.every(k => k.easing !== 'bezier') ? 'bg-studio-accent text-black border-studio-accent' : 'bg-zinc-900 border-white/10 text-zinc-500 hover:text-white'}`}
            >
              LINEAR
            </button>
            <button 
              onClick={() => {
                const newKfs = keyframes.map(kf => ({ 
                  ...kf, 
                  easing: 'bezier' as any,
                  bezierControls: kf.bezierControls || { cp1: { x: 0.25, y: 0.25 }, cp2: { x: 0.75, y: 0.75 } }
                }));
                onUpdateKeyframes(property, newKfs);
              }}
              className={`px-2 py-0.5 border rounded text-[7px] font-black uppercase transition-all ${keyframes.some(k => k.easing === 'bezier') ? 'bg-studio-accent text-black border-studio-accent shadow-lg shadow-studio-accent/20' : 'bg-zinc-900 border-white/10 text-zinc-500 hover:text-white'}`}
            >
              BEZIER
            </button>
        </div>
      </div>
      
      <div className="relative h-48 bg-black/60 rounded-xl border border-white/5 overflow-hidden group cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={256}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <div className="absolute inset-0 pointer-events-none pattern-grid-sm opacity-[0.05]" />
        
        {/* Overlay info */}
        <div className="absolute top-2 left-2 flex gap-2 pointer-events-none">
          <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/5 flex items-center gap-1.5">
            <MousePointer2 className="w-2.5 h-2.5 text-studio-accent" />
            <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-tighter">Precision Mode</span>
          </div>
          <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/5 flex items-center gap-1.5">
            <Spline className="w-2.5 h-2.5 text-orange-400" />
            <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-tighter">Handle Interpolation</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-1">
        <p className="text-[7px] text-zinc-600 font-mono uppercase tracking-widest">
          {keyframes.length} KEYFRAMES • {property}
        </p>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-studio-accent rounded-full" />
              <span className="text-[6px] text-zinc-500 uppercase font-black">Value</span>
           </div>
           <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
              <span className="text-[6px] text-zinc-500 uppercase font-black">Easing</span>
           </div>
        </div>
      </div>
    </div>
  );
};
