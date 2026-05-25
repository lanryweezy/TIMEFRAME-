import { StateCreator } from 'zustand';
import { AudioBlock } from '../../types';
import { audioEngine } from '../../lib/audioEngine';

export interface AudioSlice {
  isAnalyzingAudio: boolean;
  detectTransients: (id: string, url: string) => Promise<void>;
}

export const createAudioSlice: StateCreator<any, [], [], AudioSlice> = (set, get) => ({
  isAnalyzingAudio: false,

  detectTransients: async (id, url) => {
    set({ isAnalyzingAudio: true });
    try {
      const buffer = await audioEngine.loadAudio(url);
      if (buffer) {
        const transients = audioEngine.detectTransients(buffer);
        // Update the audio block in timelineSlice
        const state = get();
        if (state.updateAudio) {
          state.updateAudio(id, { transients });
        }
      }
    } catch (error) {
      console.error('DAW: Transient detection failed:', error);
    } finally {
      set({ isAnalyzingAudio: false });
    }
  },
});
