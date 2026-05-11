import React from 'react';

export const Playhead = React.memo(({ percentage }: { percentage: number }) => (
    <div className="absolute top-0 bottom-0 w-[2px] bg-studio-accent z-50 pointer-events-none" style={{ left: `${percentage}%` }}>
        <div className="absolute -top-0 -left-[5px] w-2.5 h-2.5 bg-studio-accent rounded-full shadow-[0_0_15px_rgba(var(--studio-accent-rgb),0.6)]">
            <div className="absolute inset-[1.5px] bg-white/40 rounded-full" />
        </div>
    </div>
));
