export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string; // hex color
}

export interface TimelineRegion {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
  color: string; // hex color
}

export type Sentiment = 'neutral' | 'anger' | 'joy' | 'urgency' | 'proverb' | 'sarcasm';

export type EasingType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'elastic'
  | 'bounce'
  | 'backIn'
  | 'backOut'
  | 'bezier';

export interface Keyframe {
  id: string;
  time: number;
  value: number;
  easing?: EasingType;
  bezierControls?: {
    cp1: { x: number; y: number };
    cp2: { x: number; y: number };
  };
}

export interface ProjectFormat {
  id: string;
  name: string;
  ratio: string;
  dimensions: { width: number; height: number };
  icon: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  isFunctionCall?: boolean;
}
