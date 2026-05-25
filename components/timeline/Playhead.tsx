import React, { useEffect, useRef } from 'react';
import { readSharedTime } from '../../lib/sharedState';

export const Playhead = React.memo(({ duration }: { duration: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (ref.current && duration > 0) {
        const time = readSharedTime();
        const percentage = (time / duration) * 100;
        ref.current.style.left = `${percentage}%`;
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [duration]);

  return (
    <div
      ref={ref}
      className="absolute top-0 bottom-0 w-[2px] bg-studio-accent z-50 pointer-events-none"
    >
      <div className="absolute -top-0 -left-[5px] w-2.5 h-2.5 bg-studio-accent rounded-full shadow-[0_0_15px_rgba(var(--studio-accent-rgb),0.6)]">
        <div className="absolute inset-[1.5px] bg-white/40 rounded-full" />
      </div>
    </div>
  );
});
