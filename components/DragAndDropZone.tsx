/**
 * Drag and Drop Zone Component (#36)
 * Drop assets into timeline or canvas
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, File, Video, Music, Image, FileText } from 'lucide-react';

interface DragAndDropZoneProps {
  onDrop: (files: FileList) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  className?: string;
  multiple?: boolean;
  accept?: string[];
  hint?: string;
}

export const DragAndDropZone: React.FC<DragAndDropZoneProps> = ({
  onDrop,
  onDragOver,
  onDragLeave,
  className = '',
  multiple = true,
  accept = ['video/*', 'audio/*', 'image/*'],
  hint = 'Drag and drop files here',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const zoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDragOver) {
      onDragOver(e);
    }
    
    if (!isDragging) {
      setIsDragging(true);
    }
    
    // Check if files are being dragged
    const types = e.dataTransfer.types;
    if (types && types.includes('Files')) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        accept.some(acceptType => file.type.startsWith(acceptType.split('/')[0]))
      );
      setDraggedFiles(files);
    }
  }, [isDragging, accept, onDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDragLeave) {
      onDragLeave(e);
    }
    
    // Only reset if we're actually leaving the zone
    if (zoneRef.current && !zoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
      setDraggedFiles([]);
    }
  }, [onDragLeave]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDraggedFiles([]);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  }, [onDrop]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      ref={zoneRef}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging
          ? 'border-studio-accent bg-studio-accent/10'
          : 'border-studio-border hover:border-studio-accent/50'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: isDragging ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept.join(',')}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={!multiple && draggedFiles.length > 0}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <Upload className="w-12 h-12 text-studio-accent/50" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-studio-text-high">
            {isDragging ? 'Drop files to import' : hint}
          </h3>
          <p className="text-sm text-studio-text">
            Supports video, audio, and image files
          </p>
        </div>

        {/* Dragged files preview */}
        {draggedFiles.length > 0 && (
          <div className="bg-studio-bg border border-studio-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-studio-text" />
              <span className="text-xs font-medium text-studio-text-high">
                {draggedFiles.length} file{draggedFiles.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto studio-scrollbar">
              {draggedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {file.type.startsWith('video/') && <Video className="w-3 h-3 text-red-400" />}
                  {file.type.startsWith('audio/') && <Music className="w-3 h-3 text-blue-400" />}
                  {file.type.startsWith('image/') && <Image className="w-3 h-3 text-green-400" />}
                  <span className="flex-1 truncate text-studio-text">
                    {file.name}
                  </span>
                  <span className="text-studio-text/70">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = multiple;
              input.accept = accept.join(',');
              input.click();
            }}
            className="px-4 py-2 bg-studio-accent hover:bg-studio-accent-hover text-white rounded transition-colors text-sm"
          >
            Browse Files
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Timeline drop zone
export const TimelineDropZone: React.FC<{
  onDrop: (files: FileList) => void;
  onClipDrop: (clipId: string, time: number) => void;
  duration: number;
  currentTime: number;
}> = ({ onDrop, onClipDrop, duration, currentTime }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;
    setDragPosition(time);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragPosition(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    } else if (e.dataTransfer.getData('application/json')) {
      // Handle clip reordering
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.type === 'clip' && dragPosition !== null) {
          onClipDrop(data.id, dragPosition);
        }
      } catch {
        // Invalid data
      }
    }
  };

  return (
    <div
      className={`relative h-full border-t-2 transition-colors ${
        isDragging ? 'border-studio-accent bg-studio-accent/10' : 'border-studio-border/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop position indicator */}
      {dragPosition !== null && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-studio-accent z-10"
          style={{
            left: `${(dragPosition / duration) * 100}%`,
          }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-studio-accent text-white text-xs px-2 py-1 rounded">
            {dragPosition.toFixed(2)}s
          </div>
        </div>
      )}
    </div>
  );
};

// Canvas drop zone
export const CanvasDropZone: React.FC<{
  onDrop: (files: FileList) => void;
  onAssetDrop: (assetId: string, position: { x: number; y: number }) => void;
  width: number;
  height: number;
}> = ({ onDrop, onAssetDrop, width, height }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragPosition({ x, y });
  };

  const handleDragLeave = () => {
    setIsDragging(false);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragPosition(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    } else if (e.dataTransfer.getData('application/json')) {
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.type === 'asset' && dragPosition !== null) {
          onAssetDrop(data.id, dragPosition);
        }
      } catch {
        // Invalid data
      }
    }
  };

  return (
    <div
      className={`relative border-2 transition-colors ${
        isDragging ? 'border-studio-accent bg-studio-accent/10' : 'border-studio-border/50'
      }`}
      style={{ width, height }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop position indicator */}
      {dragPosition !== null && (
        <div
          className="absolute w-4 h-4 bg-studio-accent rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${(dragPosition.x / width) * 100}%`,
            top: `${(dragPosition.y / height) * 100}%`,
          }}
        />
      )}
    </div>
  );
};