import { StateCreator } from 'zustand';
import { ChatMessage } from '../../types';

export interface AiSlice {
  isAnalyzing: boolean;
  isGenerating: boolean;
  generationProgress: number;
  aiMessages: ChatMessage[];
  isOptimizingPacing: boolean;
  isEnhancing: boolean;
  isStabilizing: boolean;
  
  setAiStatus: (status: Partial<AiSlice>) => void;
  addAiMessage: (message: ChatMessage) => void;
  setOptimizingPacing: (optimizing: boolean) => void;
}

export const createAiSlice: StateCreator<any, [], [], AiSlice> = (set) => ({
  isAnalyzing: false,
  isGenerating: false,
  generationProgress: 0,
  aiMessages: [],
  isOptimizingPacing: false,
  isEnhancing: false,
  isStabilizing: false,

  setAiStatus: (status) => set((state: any) => ({ ...state, ...status })),
  addAiMessage: (message) => set((state: any) => ({ aiMessages: [...state.aiMessages, message] })),
  setOptimizingPacing: (optimizing) => set({ isOptimizingPacing: optimizing }),
});
