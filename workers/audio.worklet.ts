/**
 * ELITE MULTI-TRACK AUDIO MIXER (AudioWorklet)
 * Operates in a high-priority real-time thread.
 * Handles 100+ tracks with sample-accurate sync and zero-latency DSP.
 */

class TIMEFRAMEMixer extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            { name: 'masterGain', defaultValue: 1.0, minValue: 0, maxValue: 2.0 },
        ];
    }

    constructor() {
        super();
        this.tracks = new Map();
        this.sharedBuffer = null;
        this.playbackState = null;
        
        this.port.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'INIT_SHARED') {
                this.sharedBuffer = payload.sharedBuffer;
                this.playbackState = new Float64Array(this.sharedBuffer);
            } else if (type === 'ADD_TRACK') {
                this.tracks.set(payload.id, {
                    pcm: payload.pcm,
                    startTime: payload.startTime,
                    duration: payload.duration,
                    volume: payload.volume || 1.0,
                    pan: payload.pan || 0.0
                });
            } else if (type === 'REMOVE_TRACK') {
                this.tracks.delete(payload.id);
            }
        };
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const masterGain = parameters.masterGain[0];
        const sampleRate = 48000;

        // ELITE SYNC: Lock to Shared Memory Master Clock
        if (!this.playbackState) return true;
        const currentTime = this.playbackState[0];
        const isPlaying = this.playbackState[1] === 1.0;

        if (!isPlaying) return true;

        for (let channel = 0; channel < output.length; channel++) {
            output[channel].fill(0);
        }

        for (const [id, track] of this.tracks) {
            const trackRelativeTime = currentTime - track.startTime;
            
            if (trackRelativeTime >= 0 && trackRelativeTime < track.duration) {
                const startSample = Math.floor(trackRelativeTime * sampleRate);
                const blockLen = output[0].length;

                for (let i = 0; i < blockLen; i++) {
                    const sampleIdx = startSample + i;
                    if (sampleIdx < track.pcm.length) {
                        const sample = track.pcm[sampleIdx] * track.volume;
                        const leftGain = Math.min(1.0, 1.0 - track.pan);
                        const rightGain = Math.min(1.0, 1.0 + track.pan);

                        // MIX & SOFT-CLIP (Prevent digital harshness)
                        output[0][i] += sample * leftGain * masterGain;
                        if (output[1]) output[1][i] += sample * rightGain * masterGain;
                    }
                }
            }
        }

        // Apply global tanh soft-clipper
        for (let channel = 0; channel < output.length; channel++) {
            for (let i = 0; i < output[channel].length; i++) {
                output[channel][i] = Math.tanh(output[channel][i]);
            }
        }

        return true;
    }
}

registerProcessor('timeframe-mixer', TIMEFRAMEMixer);
