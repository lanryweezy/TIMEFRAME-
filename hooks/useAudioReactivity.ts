import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import { audioEngine } from '../lib/audioEngine';

export const useAudioReactivity = () => {
  const isPlaying = useVideoStore(state => state.isPlaying);
  const setState = useVideoStore(state => state.setState);

  useEffect(() => {
    let animationFrameId: number;
    const updateAudioEnergy = () => {
      if (isPlaying) {
        const energy = audioEngine.getAudioEnergy();
        const spectral = audioEngine.getSpectralData();
        
        if (energy > 0) {
           setState({ 
             audioEnergy: energy,
             spectralData: spectral 
           } as any);
        }
      }
      animationFrameId = requestAnimationFrame(updateAudioEnergy);
    };
    updateAudioEnergy();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, setState]);
};
