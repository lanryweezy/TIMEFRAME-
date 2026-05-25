import { useEffect } from 'react';
import { VideoState } from '../types';
import { audioEngine } from '../lib/audioEngine';

/**
 * PRODUCTION-GRADE AUDIO LIFECYCLE HOOK
 * Manages audio asset loading and interaction resume.
 * Playback sync is handled by the high-performance RAF loop in AudioEngine.
 */
export const useAudioLifecycle = (state: VideoState) => {
  useEffect(() => {
    // Load all audio tracks
    state.audioTrack.forEach((audio) => {
      if (audio.url) {
        audioEngine.loadAudio(audio.url);
      }
    });
  }, [state.audioTrack]);

  // AudioEngine.update(state) removed in favor of high-performance RAF loop

  const handleInteraction = () => {
    audioEngine.resume();
  };

  return { handleInteraction };
};
