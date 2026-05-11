
import { AudioBlock, VideoState } from '../types';

class AudioEngine {
  private context: AudioContext | null = null;
  private mainGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voGain: GainNode | null = null;
  private nodes: Map<string, { source: AudioBufferSourceNode, gain: GainNode, panner: StereoPannerNode }> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.mainGain = this.context.createGain();
      this.mainGain.connect(this.context.destination);

      this.musicGain = this.context.createGain();
      this.sfxGain = this.context.createGain();
      this.voGain = this.context.createGain();

      this.musicGain.connect(this.mainGain);
      this.sfxGain.connect(this.mainGain);
      this.voGain.connect(this.mainGain);
    }
  }

  async loadAudio(url: string) {
    if (!this.context || !url) return;
    if (this.audioBuffers.has(url)) return;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(url, audioBuffer);
    } catch (error) {
      console.error('Failed to load audio:', url, error);
      // We could add UI feedback here using a global state or callback.
    }
  }

  update(state: VideoState) {
    if (!this.context) return;

    // Handle Master Volume
    if (this.mainGain) {
      this.mainGain.gain.setTargetAtTime(state.volume / 100, this.context.currentTime, 0.05);
    }

    // Handle Ducking
    if (state.audioSettings.duckingEnabled) {
      const isVOActive = state.audioTrack.some(a => 
        a.type === 'voiceover' && 
        state.isPlaying && 
        state.currentTime >= a.startTime && 
        state.currentTime <= a.startTime + a.duration
      );

      const targetMusicGain = isVOActive ? (1 - state.audioSettings.duckingRatio) : 1.0;
      this.musicGain?.gain.setTargetAtTime(targetMusicGain, this.context.currentTime, 0.1);
    } else {
      this.musicGain?.gain.setTargetAtTime(1.0, this.context.currentTime, 0.1);
    }

    // Sync individual clips
    state.audioTrack.forEach(audio => {
      const isVisible = state.currentTime >= audio.startTime && state.currentTime <= audio.startTime + audio.duration;
      
      if (isVisible && state.isPlaying) {
        if (!this.nodes.has(audio.id)) {
          this.playClip(audio, state.currentTime);
        } else {
          // If already playing, update its properties
          const node = this.nodes.get(audio.id);
          if (node) {
            node.gain.gain.setTargetAtTime(audio.volume / 100, this.context.currentTime, 0.05);
            // Handle spatial audio
            const pan = Math.min(1, Math.max(-1, (audio as any).pan || 0));
            node.panner.pan.setTargetAtTime(pan, this.context.currentTime, 0.1);
          }
        }
      } else {
        this.stopClip(audio.id);
      }
    });

    // Cleanup tracks that are no longer in state
    const trackIds = new Set(state.audioTrack.map(a => a.id));
    for (const id of this.nodes.keys()) {
      if (!trackIds.has(id)) {
        this.stopClip(id);
      }
    }
  }

  private playClip(audio: AudioBlock, currentTime: number) {
    if (!audio.url) return;
    if (!this.context || !this.audioBuffers.has(audio.url)) {
        this.loadAudio(audio.url); // Fire and forget load if not ready
        return;
    }

    const buffer = this.audioBuffers.get(audio.url);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = audio.speed || 1;

    const gain = this.context.createGain();
    gain.gain.value = audio.volume / 100;

    const panner = this.context.createStereoPanner();
    panner.pan.value = (audio as any).pan || 0;

    source.connect(panner);
    panner.connect(gain);

    // Route based on type
    if (audio.type === 'music') {
      gain.connect(this.musicGain!);
    } else if (audio.type === 'voiceover') {
      gain.connect(this.voGain!);
    } else {
      gain.connect(this.sfxGain!);
    }

    const offset = currentTime - audio.startTime;
    source.start(0, offset);
    
    this.nodes.set(audio.id, { source, gain, panner });
  }

  private stopClip(id: string) {
    const node = this.nodes.get(id);
    if (node) {
      try {
        node.source.stop();
      } catch (e) {}
      node.source.disconnect();
      node.gain.disconnect();
      node.panner.disconnect();
      this.nodes.delete(id);
    }
  }

  resume() {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }
}

export const audioEngine = new AudioEngine();
