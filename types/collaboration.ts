import type { VideoState } from './state';

export type SocialPlatform =
  | 'tiktok'
  | 'reels'
  | 'shorts'
  | 'youtube'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'none';

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
}

export interface AnalyticsData {
  views: AnalyticsMetric;
  engagement: AnalyticsMetric;
  retention: AnalyticsMetric;
  reach: AnalyticsMetric;
  heatmapData: { x: number; y: number }[]; // Retention heatmap data points
  dopamineMap: { x: number; y: number }[]; // Predicted dopamine/excitement levels
  sentimentTimeline: { x: number; label: string; intensity: number }[]; // Emotional markers
}

export interface BrandKit {
  name: string;
  colors: string[];
  fonts: string[];
  logos: string[];
  watermarkUrl?: string;
}

export interface CreatorTemplate {
  id: string;
  name: string;
  author: string;
  category: 'trending' | 'gaming' | 'vlog' | 'education' | 'promo';
  platform: SocialPlatform;
  thumbnail: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastActive: number;
  cursor?: { x: number; y: number };
  activeClipId?: string;
}

export interface ProjectComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: number;
  timecode: number;
  resolved: boolean;
  replies?: ProjectComment[];
}

export interface VersionEntry {
  id: string;
  name: string;
  commitHash: string;
  authorId: string;
  timestamp: number;
  snapshot: Partial<VideoState>;
  description?: string;
}

export interface CloudProject {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  comments: ProjectComment[];
  versions: VersionEntry[];
  sharedAssets: string[]; // URLs or IDs
  createdAt: number;
  updatedAt: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export interface CollaborationState {
  activeProjectId?: string;
  sessionUsers: TeamMember[];
  isMultiplayerActive: boolean;
  lastSyncTime: number;
  liveComments: ProjectComment[];
  activeAgents: {
    id: string;
    type: 'creative' | 'technical' | 'review';
    status: 'idle' | 'working' | 'thinking';
  }[];
}
