import type { VideoState } from './state';

export interface AIAction {
  id: string;
  toolName: string;
  args: any;
  proposedState: Partial<VideoState>;
  description: string;
  timestamp: number;
  status: 'pending' | 'applied' | 'rejected';
}

export interface AIActionSandbox {
  actions: AIAction[];
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  capability: string; // The underlying model capability or tool
}

export type AgentRole =
  | 'editor'
  | 'thumbnail'
  | 'marketing'
  | 'storytelling'
  | 'cinematography'
  | 'branding'
  | 'sound'
  | 'vfx'
  | 'optimizer'
  | 'specialist';

export interface AIAgent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  skills: string[]; // Skill IDs
  tasks: string[]; // Active task IDs
  specialization: string;
  isInstalledFromEcosystem?: boolean;
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  createdAt: number;
  updatedAt: number;
}

export interface AgentSuggestion {
  id: string;
  agentId: string;
  type: 'edit' | 'vfx' | 'audio' | 'strategy' | 'brand';
  title: string;
  description: string;
  actionPrompt: string; // The prompt to send to AI if user accepts
  impact: number; // 0-1, predicted improvement
  status: 'new' | 'accepted' | 'dismissed';
  startTime?: number; // Optional: start time for visual grounding
  duration?: number; // Optional: duration for visual grounding
  createdAt: number;
}

export interface AgentLayerState {
  agents: AIAgent[];
  tasks: AgentTask[];
  skills: AgentSkill[];
  suggestions: AgentSuggestion[];
  activeAgentId?: string;
}
