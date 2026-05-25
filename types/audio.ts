import { Keyframe } from './common';

export interface AudioBlock {
  id: string;
  url: string;
  name: string;
  startTime: number;
  duration: number;
  volume: number;
  type: 'music' | 'sfx' | 'voiceover';
  trackId: number; // For multi-track
  speed: number;
  voiceEffect?: 'none' | 'robot' | 'deep' | 'radio' | 'echo';
  pan: number;
  pan3D?: { x: number; y: number; z: number };
  eqBands?: number[];
  isDeEsserEnabled?: boolean;
  isPlosiveControlEnabled?: boolean;
  isEnhanced?: boolean;
  stemType?: 'vocals' | 'drums' | 'bass' | 'other';
  plugins?: string[];
  automation?: {
    volume?: Keyframe[];
    pan?: Keyframe[];
  };
  sentimentBias?: {
    intensity: number; // 0 to 1
    reverbBias: number; // -1 (dry/intimate) to 1 (large/epic)
    characterBias: number; // -1 (vintage/warm) to 1 (aggressive/bright)
  };
  neuralModel?: '1176' | 'neve_1073' | 'pultec_eqp1a' | 'none';
  transients?: number[]; // Timestamps (s) relative to clip start
}

export interface AudioSettings {
  duckingEnabled: boolean;
  duckingRatio: number; // 0 to 1, amount to reduce
  deClickEnabled?: boolean;
}
