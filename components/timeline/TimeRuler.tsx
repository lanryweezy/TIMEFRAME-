import React from 'react';
import { TimelineMarker, TimelineRegion } from '../../types';

interface TimeRulerProps {
  duration: number;
  pixelsPerSecond: number;
  viewportStart: number;
  viewportEnd: number;
  markers: TimelineMarker[];
  regions: TimelineRegion[];
}

export const TimeRuler = React.memo(
  ({ duration, pixelsPerSecond, viewportStart, viewportEnd, markers, regions }: TimeRulerProps) => {
    const renderTicks = () => {
      const ticks = [];
      const start = Math.max(0, Math.floor(viewportStart));
      const end = Math.min(duration, Math.ceil(viewportEnd));

      for (let i = start; i <= end; i++) {
        ticks.push(
          <div
            key={i}
            className="absolute top-0 bottom-0 text-[9px] text-zinc-600 font-mono select-none pointer-events-none"
            style={{ left: `${i * pixelsPerSecond}px`, borderLeft: '1px solid currentColor' }}
          >
            <span className="ml-1">{i}s</span>
          </div>,
        );
      }
      return ticks;
    };

    return (
      <div className="h-10 w-full bg-studio-bg border-b border-studio-border relative z-40 overflow-hidden">
        {renderTicks()}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute top-0 bottom-0 z-50 group"
            style={{ left: `${marker.time * pixelsPerSecond}px` }}
          >
            <div className="w-0.5 h-full" style={{ backgroundColor: marker.color }} />
            <div className="absolute top-0 left-1 w-20 px-1 text-[8px] truncate bg-zinc-800 text-white rounded-r-md">
              {marker.label}
            </div>
          </div>
        ))}
        {regions.map((region) => (
          <div
            key={region.id}
            className="absolute top-0 bottom-0 opacity-20 z-40"
            style={{
              left: `${region.startTime * pixelsPerSecond}px`,
              width: `${(region.endTime - region.startTime) * pixelsPerSecond}px`,
              backgroundColor: region.color,
            }}
          />
        ))}
      </div>
    );
  },
);
