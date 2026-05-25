import { useState, useCallback, DragEvent } from 'react';

export interface DragData {
  type: 'asset' | 'clip' | 'text' | 'audio' | 'effect';
  id: string;
  payload?: Record<string, unknown>;
}

export interface DropZone {
  id: string;
  accepts: DragData['type'][];
  onDrop: (data: DragData, position: { x: number; y: number }) => void;
}

export function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const startDrag = useCallback((data: DragData) => {
    setIsDragging(true);
    setDragData(data);
  }, []);

  const updateDragPosition = useCallback((e: DragEvent | MouseEvent) => {
    if (isDragging) {
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDragData(null);
    setDragPosition(null);
  }, []);

  // Handle drop on a target element
  const handleDrop = useCallback((e: DragEvent, onDrop: (data: DragData, position: { x: number; y: number }) => void) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragData) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      onDrop(dragData, position);
    }
    endDrag();
  }, [dragData, endDrag]);

  // Handle drag over to allow dropping
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // HTML5 drag attributes for draggable items
  const draggableProps = (data: DragData) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.setData('application/json', JSON.stringify(data));
      e.dataTransfer.effectAllowed = 'copy';
      startDrag(data);
    },
    onDragEnd: endDrag,
  });

  return {
    isDragging,
    dragData,
    dragPosition,
    startDrag,
    endDrag,
    updateDragPosition,
    handleDrop,
    handleDragOver,
    draggableProps,
  };
}

// Helper to parse drag data from event
export function getDragDataFromEvent(e: DragEvent): DragData | null {
  const data = e.dataTransfer.getData('application/json');
  if (data) {
    try {
      return JSON.parse(data) as DragData;
    } catch {
      return null;
    }
  }
  return null;
}