
import { useEffect } from 'react';
import { VideoState } from '../types';
import { audioEngine } from '../lib/audioEngine';

export const useAudioLifecycle = (state: VideoState) => {
    useEffect(() => {
        // Load all audio tracks
        state.audioTrack.forEach(audio => {
            if (audio.url) {
                audioEngine.loadAudio(audio.url);
            }
        });
    }, [state.audioTrack]);

    useEffect(() => {
        audioEngine.update(state);
    }, [state]);

    const handleInteraction = () => {
        audioEngine.resume();
    };

    return { handleInteraction };
};
