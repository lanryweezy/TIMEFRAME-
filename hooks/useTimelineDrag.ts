import { useState, useCallback } from 'react';
import { VideoState } from '../types';

export const useTimelineDrag = (
  state: VideoState,
  onTrim: (
    trackName: keyof VideoState,
    id: string,
    startTime: number,
    duration: number,
    mode?: 'trim' | 'ripple' | 'roll' | 'slip' | 'slide',
  ) => void,
  onMove: (trackName: keyof VideoState, id: string, startTime: number, trackId?: number) => void,
  onMoveKeyframe: (prop: string, id: string, time: number) => void,
  onUpdateClipFade: (
    id: string,
    updates: { fadeInDuration?: number; fadeOutDuration?: number },
  ) => void,
  onCommitHistory: () => void,
  onSelectItems: (ids: string[], multi: boolean) => void,
) => {
  const [dragState, setDragState] = useState<{
    trackName?: keyof VideoState;
    prop?: string;
    id: string;
    type:
      | 'trim'
      | 'move'
      | 'fade-in'
      | 'fade-out'
      | 'keyframe'
      | 'ripple'
      | 'roll'
      | 'slip'
      | 'slide'
      | 'region';
    edge?: 'start' | 'end';
    initialMouseX: number;
    initialMouseY: number;
    initialStartTime: number;
    initialDuration: number; // Ensure this is always present
    initialFadeIn?: number;
    initialFadeOut?: number;
    dragDeltaX?: number; 
    dragDeltaY?: number; 
  } | null>(null);

  const [selectionBox, setSelectionBox] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [snapGuide, setSnapGuide] = useState<number | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent, timelineRef: React.RefObject<HTMLDivElement>) => {
      if (selectionBox) {
        setSelectionBox((prev) => (prev ? { ...prev, x2: e.clientX, y2: e.clientY } : null));
        return;
      }

      if (!dragState || !timelineRef.current) return;
      const timelineWidth = timelineRef.current.getBoundingClientRect().width;
      const dx = ((e.clientX - dragState.initialMouseX) / timelineWidth) * state.duration;
      const dy = e.clientY - dragState.initialMouseY;
      
      // Update local drag state for immediate visual feedback (Buttery Drag)
      setDragState(prev => prev ? { ...prev, dragDeltaX: e.clientX - dragState.initialMouseX, dragDeltaY: dy } : null);

      const getAllSnapPoints = () => {
        const points = new Set<number>();
        if (state.snapSettings?.playhead) points.add(state.currentTime);

        if (state.snapSettings?.clips) {
          [
            ...state.videoClips,
            ...state.audioTrack,
            ...state.textTrack,
            ...state.subtitleTrack,
          ].forEach((c) => {
            if (c.id !== dragState.id) {
              points.add(c.startTime);
              points.add(c.startTime + c.duration);
            }
          });

          // TRANSIENT SNAPPING: Add audio peaks to snap points
          state.audioTrack.forEach((audio: any) => {
            if (audio.transients && audio.transients.length > 0) {
                audio.transients.forEach((t: number) => {
                    points.add(audio.startTime + t);
                });
            }
          });
        }

        if (state.snapSettings?.markers) {
          state.markers.forEach((m) => points.add(m.time));
        }

        // Smart Snap-to-Beat
        if (state.beatSync?.enabled) {
          // Use real beats from analyzed audio tracks
          state.audioTrack.forEach((audio: any) => {
            if (audio.beats && audio.beats.length > 0) {
              audio.beats.forEach((beatTime: number) => {
                points.add(audio.startTime + beatTime);
              });
            }
          });
        }

        Object.values(state.transform.keyframes || {}).forEach((keys: any) => {
          if (Array.isArray(keys)) {
            keys.forEach((k: any) => points.add(k.time));
          }
        });

        return Array.from(points);
      };

      const findNearestSnap = (time: number, threshold = 0.2) => {
        const points = getAllSnapPoints();

        // Allow snapping to frame boundaries (assume 30fps) if zoomed in
        if (state.zoomLevel > 100) {
          const frameDuration = 1 / 30;
          const nearestFrame = Math.round(time / frameDuration) * frameDuration;
          points.push(nearestFrame);
        }

        let nearest = null;
        let minDist = threshold;
        for (const p of points) {
          const d = Math.abs(time - p);
          if (d < minDist) {
            minDist = d;
            nearest = p;
          }
        }
        return nearest;
      };

      if (
        dragState.type === 'trim' &&
        dragState.trackName &&
        dragState.initialDuration !== undefined
      ) {
        let newStartTime = dragState.initialStartTime;
        let newDuration = dragState.initialDuration;
        let activeSnap: number | null = null;

        if (dragState.edge === 'start') {
          newStartTime = Math.max(0, dragState.initialStartTime + dx);
          const snap = findNearestSnap(newStartTime);
          if (snap !== null) {
            newStartTime = snap;
            activeSnap = snap;
          }
          newDuration = Math.max(
            0.1,
            dragState.initialDuration - (newStartTime - dragState.initialStartTime),
          );
        } else {
          newDuration = Math.max(0.1, dragState.initialDuration + dx);
          const endTime = dragState.initialStartTime + newDuration;
          const snap = findNearestSnap(endTime);
          if (snap !== null) {
            newDuration = snap - dragState.initialStartTime;
            activeSnap = snap;
          }
        }
        setSnapGuide(activeSnap);
        const mode = (['ripple', 'roll', 'slip', 'slide'].includes(dragState.type) 
          ? dragState.type 
          : 'trim') as any;
        onTrim(dragState.trackName, dragState.id, newStartTime, newDuration, mode);
      } else if (dragState.type === 'move' && dragState.trackName) {
        let newStartTime = Math.max(0, dragState.initialStartTime + dx);
        let activeSnap: number | null = null;
        const dy = e.clientY - dragState.initialMouseY;
        const trackDelta = Math.round(dy / 40);
        const clip = (state[dragState.trackName] as any[]).find((c) => c.id === dragState.id);
        const newTrackId = Math.max(1, Math.min(10, (clip?.trackId || 1) + trackDelta));

        if (state.magneticTimeline) {
          const snapStart = findNearestSnap(newStartTime);
          if (snapStart !== null) {
            newStartTime = snapStart;
            activeSnap = snapStart;
          } else {
            const snapEnd = findNearestSnap(newStartTime + (dragState.initialDuration || 0));
            if (snapEnd !== null) {
              newStartTime = snapEnd - (dragState.initialDuration || 0);
              activeSnap = snapEnd;
            }
          }
        }
        setSnapGuide(activeSnap);
        onMove(dragState.trackName, dragState.id, newStartTime, newTrackId);
      } else if (dragState.type === 'region') {
        const newStartTime = Math.max(0, dragState.initialStartTime + dx);
        onMove('regions' as any, dragState.id, newStartTime);
      } else if (dragState.type === 'keyframe' && dragState.prop) {
        let newTime = Math.max(0, Math.min(state.duration, dragState.initialStartTime + dx));
        const snap = findNearestSnap(newTime);
        if (snap !== null) {
          newTime = snap;
          setSnapGuide(snap);
        } else {
          setSnapGuide(null);
        }
        onMoveKeyframe(dragState.prop, dragState.id, newTime);
      } else if (dragState.type === 'fade-in' && dragState.initialDuration !== undefined) {
        const newFade = Math.max(
          0,
          Math.min(dragState.initialDuration / 2, (dragState.initialFadeIn || 0) + dx),
        );
        onUpdateClipFade(dragState.id, { fadeInDuration: newFade });
      } else if (dragState.type === 'fade-out') {
        const newFade = Math.max(
          0,
          Math.min((dragState.initialDuration || 0) / 2, (dragState.initialFadeOut || 0) - dx),
        );
        onUpdateClipFade(dragState.id, { fadeOutDuration: newFade });
      }
    },
    [dragState, selectionBox, state, onTrim, onMove, onMoveKeyframe, onUpdateClipFade],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      // ... implementation from Timeline.tsx lines 261-290 ...
      if (selectionBox) {
        const xMin = Math.min(selectionBox.x1, selectionBox.x2);
        const xMax = Math.max(selectionBox.x1, selectionBox.x2);
        const yMin = Math.min(selectionBox.y1, selectionBox.y2);
        const yMax = Math.max(selectionBox.y1, selectionBox.y2);

        const selectedIds: string[] = [];
        const elements = document.querySelectorAll('[data-id]');
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.left < xMax && rect.right > xMin && rect.top < yMax && rect.bottom > yMin) {
            const id = el.getAttribute('data-id');
            if (id) selectedIds.push(id);
          }
        });

        if (selectedIds.length > 0) {
          onSelectItems(selectedIds, e.shiftKey);
        }
        setSelectionBox(null);
      }

      if (dragState) {
        onCommitHistory();
      }

      setDragState(null);
      setSnapGuide(null);
    },
    [selectionBox, dragState, onSelectItems, onCommitHistory],
  );

  return {
    dragState,
    setDragState,
    selectionBox,
    setSelectionBox,
    snapGuide,
    setSnapGuide,
    handleMouseMove,
    handleMouseUp,
  };
};
