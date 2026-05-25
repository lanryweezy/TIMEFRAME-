import { AspectRatio, EffectType, FilterPreset, ProjectFormat, ProjectTemplate } from './types';
import {
  Monitor,
  Smartphone,
  Instagram as InstagramIcon,
  Video,
  Sparkles,
  Music,
  Zap,
  Film,
} from 'lucide-react';

/**
 * Application-wide constants and configuration.
 * Adheres to Item #8: "Move hardcoded configuration and magic numbers into a dedicated constants or config file."
 */

export const CONFIG = {
  APP_NAME: 'Timeframe Studio',
  VERSION: '0.1.0',
  STORAGE_KEYS: {
    PROJECT_SAVE: 'vision_editor_save_v1',
    USER_PREFERENCES: 'timeframe_user_prefs',
  },
  LIMITS: {
    MAX_TEXTURE_CACHE_SIZE: 50,
    VIDEO_POOL_SIZE: 3,
    UNDO_HISTORY_LIMIT: 50,
  },
  AUDIO: {
    DEFAULT_VOLUME: 0.8,
    DEFAULT_DUCKING_RATIO: 0.6,
  },
  VIDEO: {
    DEFAULT_FPS: 24,
    DEFAULT_DURATION: 30,
    DEFAULT_BIT_DEPTH: 10 as const,
    DEFAULT_COLOR_SPACE: 'rec709' as const,
  },
  ASSETS: {
    SAMPLE_VIDEO_URL: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    DEFAULT_ENVIRONMENT_URL: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=80',
  },
};

export const INITIAL_CHAT_MESSAGE =
  'Timeframe Studio AI active. I can help you synthesize high-frontier content:\n- Gen-AI: Text-to-Video, Image-to-Video & Environment synthesis\n- Smart Editing: Auto-cut, Pacing optimization & Beat-sync\n- Visual FX: Background removal, Neural rotoscoping & Tracking\n- Audio: Voice cloning, Noise cleanup & Immersive soundscapes\n\nWhat are we creating today?';

export const DEFAULT_ADJUSTMENT = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hue: 0,
  filterIntensity: 100,
  vignetteIntensity: 0,
  vignetteSize: 50,
};

export const PROJECT_FORMATS: ProjectFormat[] = [
  {
    id: 'yt-long',
    name: 'YouTube Long',
    ratio: '16:9',
    dimensions: { width: 1920, height: 1080 },
    icon: 'Monitor',
  },
  {
    id: 'tiktok',
    name: 'TikTok / Shorts',
    ratio: '9:16',
    dimensions: { width: 1080, height: 1920 },
    icon: 'Smartphone',
  },
  {
    id: 'insta',
    name: 'Instagram',
    ratio: '1:1',
    dimensions: { width: 1080, height: 1080 },
    icon: 'Instagram',
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    ratio: '16:9',
    dimensions: { width: 1920, height: 1080 },
    icon: 'Video',
  },
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'cinematic',
    name: 'Cinematic Masterpiece',
    description: 'Deep color grading, slow pacing.',
    category: 'Cinematic',
    icon: 'Sparkles',
  },
  {
    id: 'music-video',
    name: 'Music Video',
    description: 'Beat-synced transitions.',
    category: 'Music',
    icon: 'Music',
  },
  {
    id: 'vlog-fast',
    name: 'Viral Vlog',
    description: 'Fast cuts, high motion.',
    category: 'Social',
    icon: 'Zap',
  },
  {
    id: 'doc',
    name: 'Documentary',
    description: 'Clear narrative, subtle.',
    category: 'Cinematic',
    icon: 'Film',
  },
];
