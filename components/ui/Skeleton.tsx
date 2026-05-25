import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => {
  return <div className={`animate-pulse bg-white/10 rounded-md ${className || ''}`} />;
};
