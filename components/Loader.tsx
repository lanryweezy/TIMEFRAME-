/**
 * Loading States and Skeleton Loaders (#37)
 * Visual feedback for asynchronous operations
 */

import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Download, Play, Save, Zap } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'text-studio-accent',
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={fullScreen ? 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50' : 'flex items-center gap-3'}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} ${color}`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && <span className="text-sm text-studio-text">{text}</span>}
    </div>
  );
};

// Skeleton loader component
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
}) => (
  <motion.div
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-studio-border/50 rounded ${className}`}
    style={{ width, height, borderRadius }}
  />
);

// Card skeleton
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-studio-panel border border-studio-border rounded-lg p-4">
        <div className="flex gap-4">
          <Skeleton width="80px" height="80px" borderRadius="4px" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="14px" />
            <Skeleton width="80%" height="12px" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Timeline skeleton
export const TimelineSkeleton: React.FC<{ tracks?: number }> = ({ tracks = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: tracks }, (_, i) => (
      <div key={i} className="h-16 bg-studio-border/20 rounded" />
    ))}
  </div>
);

// Asset grid skeleton
export const AssetGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-studio-panel border border-studio-border rounded-lg overflow-hidden">
        <Skeleton width="100%" height="100px" borderRadius="0" />
        <div className="p-3 space-y-2">
          <Skeleton width="80%" height="14px" />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
    ))}
  </div>
);

// Progress bar with percentage
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'bg-studio-accent',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-studio-text">{label}</span>
          {showPercentage && (
            <span className="text-studio-text">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-studio-border rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

// Loading overlay for components
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text,
  children,
}) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
        <Loader text={text} />
      </div>
    )}
  </div>
);

// Button with loading state
interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  loadingText?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  loadingText = 'Loading...',
  icon,
  onClick,
  disabled,
  className = '',
}) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors ${
      isLoading || disabled
        ? 'bg-studio-border/50 text-studio-text/50 cursor-not-allowed'
        : 'bg-studio-accent hover:bg-studio-accent-hover text-white'
    } ${className}`}
  >
    {isLoading ? (
      <>
        <Loader size="sm" color="text-white" />
        {loadingText}
      </>
    ) : (
      <>
        {icon}
        {text}
      </>
    )}
  </button>
);

// Export progress indicator
export const ExportProgress: React.FC<{
  phase: string;
  percentage: number;
  currentStep?: string;
}> = ({ phase, percentage, currentStep }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-studio-text-high">{phase}</span>
      <span className="text-sm text-studio-text">{percentage.toFixed(0)}%</span>
    </div>
    <ProgressBar value={percentage} label={currentStep} />
  </div>
);