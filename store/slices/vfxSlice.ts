import { StateCreator } from 'zustand';
import { FilterPreset } from '../../types';

export interface VfxSlice {
  activeFilter: FilterPreset;
  isRotoscoping: boolean;
  isTrackingMotion: boolean;
  
  setFilter: (filter: FilterPreset) => void;
  setVfxStatus: (status: Partial<{ isRotoscoping: boolean, isTrackingMotion: boolean }>) => void;
}

export const createVfxSlice: StateCreator<any, [], [], VfxSlice> = (set) => ({
  activeFilter: 'none',
  isRotoscoping: false,
  isTrackingMotion: false,

  setFilter: (filter) => set({ activeFilter: filter }),
  setVfxStatus: (status) => set((state: any) => ({ ...state, ...status })),
});
