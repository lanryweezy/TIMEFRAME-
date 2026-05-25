import { SocialPlatform } from './collaboration';

export interface AssetMetadata {
  tags: string[];
  duration?: number;
  faces?: { id: string; name: string; thumbnail: string }[];
  sceneDescription?: string;
  colors?: string[];
  bitrate?: number;
  codec?: string;
  resolution?: { width: number; height: number };
}

export interface CloudAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'font' | 'brand';
  url: string;
  thumbnail: string;
  size: number;
  path: string; // e.g. "/Brand/Logos"
  createdAt: number;
  updatedAt: number;
  metadata: AssetMetadata;
  isFavorite: boolean;
  isBrandAsset: boolean;
}

export interface SmartCollection {
  id: string;
  name: string;
  query: string; // The semantic search query or filter logic
  assetIds: string[];
  icon?: string;
}

export interface AssetManagerState {
  library: CloudAsset[];
  collections: SmartCollection[];
  searchQuery: string;
  isSearching: boolean;
  selectedAssetIds: string[];
  storageUsage: {
    total: number;
    used: number;
  };
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  status: 'active' | 'disabled' | 'error';
  permissions: string[];
  type: 'video_effect' | 'audio_fx' | 'automation' | 'ui_extension';
  isThirdParty: boolean;
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  trigger: {
    type: 'on_upload' | 'on_render_start' | 'on_segment_detected' | 'on_team_mention' | 'webhook';
    config?: any;
  };
  actions: {
    type: 'notify' | 'apply_preset' | 'generate_caption' | 'trigger_webhook' | 'run_agent';
    params: any;
  }[];
  enabled: boolean;
  lastRun?: number;
}

export interface EcosystemIntegration {
  id: string;
  platform: string;
  type: 'cloud_storage' | 'social_api' | 'communication' | 'asset_library';
  status: 'connected' | 'error' | 'disconnected';
  apiKeyHidden?: boolean;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  type: 'ai_model' | 'agent_persona' | 'workflow_template' | 'plugin';
  category: string;
  author: string;
  price: number;
  rating: number;
  isInstalled: boolean;
  thumbnail: string;
}

export interface APILog {
  id: string;
  timestamp: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WEBHOOK';
  endpoint: string;
  status: number;
  latency: number;
}

export interface EcosystemState {
  plugins: Plugin[];
  automations: WorkflowAutomation[];
  integrations: EcosystemIntegration[];
  marketplace: MarketplaceItem[];
  apiAccessEnabled: boolean;
  webhookUrl?: string;
  logs: APILog[];
  showDebugger?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  score: number;
  suggestions: string[];
}

export interface PublishingSchedule {
  id: string;
  platform: SocialPlatform;
  scheduledTime: number;
  status: 'scheduled' | 'published' | 'failed' | 'draft';
  caption: string;
  hashtags: string[];
  thumbnailUrl?: string;
  seoData?: SEOData;
}

export interface ABTest {
  id: string;
  name: string;
  variants: {
    id: string;
    thumbnailUrl: string;
    title: string;
    metrics?: {
      ctr: number;
      avgViewTime: number;
    };
  }[];
  status: 'running' | 'completed' | 'draft';
  winnerId?: string;
}

export interface DistributionState {
  schedules: PublishingSchedule[];
  abTests: ABTest[];
  connectedAccounts: {
    platform: SocialPlatform;
    username: string;
    isConnected: boolean;
  }[];
}

export interface ComputeNode {
  id: string;
  type: 'gpu' | 'edge' | 'cloud' | 'distributed';
  status: 'active' | 'idle' | 'busy' | 'offline';
  load: number;
  region: string;
  latency: number;
  temperature?: number;
  uptime?: number;
  powerConsumption?: number;
  logs?: string[];
}

export interface RenderingPipeline {
  id: string;
  name: string;
  progress: number;
  speed: string;
  steps: {
    name: string;
    status: 'complete' | 'processing' | 'pending';
  }[];
}

export interface InfrastructureState {
  nodes: ComputeNode[];
  pipelines: RenderingPipeline[];
  syncStatus: {
    lastSynced: number;
    platform: 'mobile' | 'desktop' | 'web';
    status: 'synced' | 'syncing' | 'failed';
  }[];
  offlineMode: boolean;
  networkThroughput?: number;
  totalStorage?: number;
  edgeCacheSize?: number;
  renderingTier: 'gpu' | 'edge' | 'cloud' | 'distributed';
}
