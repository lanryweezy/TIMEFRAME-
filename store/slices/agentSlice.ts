import { StateCreator } from 'zustand';
import { AgentLayerState, AgentSuggestion, AIAgent, AgentTask } from '../../types/ai';

export interface AgentSlice {
  agentLayer: AgentLayerState;
  addSuggestion: (suggestion: AgentSuggestion) => void;
  updateSuggestion: (id: string, updates: Partial<AgentSuggestion>) => void;
  removeSuggestion: (id: string) => void;
  addAgentTask: (task: AgentTask) => void;
  updateAgentTask: (id: string, updates: Partial<AgentTask>) => void;
  setActiveAgent: (id: string) => void;
}

export const createAgentSlice: StateCreator<any, [], [], AgentSlice> = (set) => ({
  agentLayer: {
    agents: [
      {
        id: 'ag-zoe',
        name: 'Zoe',
        role: 'editor',
        description: 'Precision-focused rhythmic editor. Obsessed with narrative flow and dopamine pacing.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zoe',
        status: 'online',
        skills: ['sk-pacing', 'sk-narrative'],
        tasks: [],
        specialization: 'Rhythmic Cutting',
      },
      {
        id: 'ag-lens',
        name: 'Lens',
        role: 'cinematography',
        description: 'Visual storyteller focused on composition, color vibration, and lighting architecture.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lens',
        status: 'online',
        skills: ['sk-grading', 'sk-composition'],
        tasks: [],
        specialization: 'Visual Aesthetics',
      },
      {
        id: 'ag-echo',
        name: 'Echo',
        role: 'sound',
        description: 'Audio architect specializing in spatial soundscapes and spectral emotional mapping.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=echo',
        status: 'online',
        skills: ['sk-spatial', 'sk-mastering'],
        tasks: [],
        specialization: 'Audio Landscapes',
      }
    ],
    tasks: [],
    skills: [
      { id: 'sk-pacing', name: 'Pacing Engine', description: 'Analyze and optimize video rhythm.', capability: 'analysis' },
      { id: 'sk-narrative', name: 'Narrative Solver', description: 'Maintain story continuity.', capability: 'logic' },
      { id: 'sk-grading', name: 'Neural Colorist', description: 'Advanced color grading.', capability: 'vfx' },
      { id: 'sk-composition', name: 'Visual Balancer', description: 'Optimize frame composition.', capability: 'vision' },
      { id: 'sk-spatial', name: 'Spatial Audio', description: 'Apply 3D sound placement.', capability: 'audio' },
      { id: 'sk-mastering', name: 'AI Mastering', description: 'Professional audio finishing.', capability: 'audio' },
    ],
    suggestions: [],
    activeAgentId: 'ag-zoe',
  },

  addSuggestion: (suggestion) => set((state: any) => ({
    agentLayer: {
      ...state.agentLayer,
      suggestions: [suggestion, ...state.agentLayer.suggestions]
    }
  })),

  updateSuggestion: (id, updates) => set((state: any) => ({
    agentLayer: {
      ...state.agentLayer,
      suggestions: state.agentLayer.suggestions.map((s: any) => 
        s.id === id ? { ...s, ...updates } : s
      )
    }
  })),

  removeSuggestion: (id) => set((state: any) => ({
    agentLayer: {
      ...state.agentLayer,
      suggestions: state.agentLayer.suggestions.filter((s: any) => s.id !== id)
    }
  })),

  addAgentTask: (task) => set((state: any) => ({
    agentLayer: {
      ...state.agentLayer,
      tasks: [...state.agentLayer.tasks, task]
    }
  })),

  updateAgentTask: (id, updates) => set((state: any) => ({
    agentLayer: {
      ...state.agentLayer,
      tasks: state.agentLayer.tasks.map((t: any) => 
        t.id === id ? { ...t, ...updates } : t
      )
    }
  })),

  setActiveAgent: (id) => set((state: any) => ({
    agentLayer: {
      ...state.agentLayer,
      activeAgentId: id
    }
  })),
});
