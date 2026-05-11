import React, { useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'motion/react';

interface WaveformProps {
    id?: string;
    data?: number[];
    progress: number;
    color: string;
}

export const Waveform: React.FC<WaveformProps> = ({ id, data, progress, color }) => {
    const [bars, setBars] = useState<number[]>(data || []);

    useEffect(() => {
        if (data) {
            setBars(data);
            return;
        }
        if (!id) return;

        const worker = new Worker(new URL('../../workers/waveformWorker.ts', import.meta.url));
        worker.postMessage({ id });
        worker.onmessage = (e: MessageEvent<number[]>) => {
            setBars(e.data);
            worker.terminate();
        };

        return () => worker.terminate();
    }, [id, data]);

    return (
        <div className="flex items-center gap-[1px] h-full w-full opacity-60">
            {bars.map((height, i) => {
                const isActive = (i / bars.length) * 100 <= progress;
                return (
                    <div 
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{ 
                            height: `${height}%`,
                            backgroundColor: isActive ? color : 'rgba(255,255,255,0.05)',
                        }}
                    />
                );
            })}
        </div>
    );
};
