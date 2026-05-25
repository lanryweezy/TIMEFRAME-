/**
 * Advanced Waveform & Rhythm Intelligence Worker
 * Performs high-speed transient detection and BPM estimation for Rhythm Snapping.
 */

self.onmessage = (e: MessageEvent<{ buffer?: Float32Array, id: string, sampleRate?: number }>) => {
  const { buffer, id, sampleRate = 44100 } = e.data;

  if (!buffer) {
    console.error(`WaveformWorker: Buffer missing for clip ${id}. Processing aborted.`);
    return;
  }

  const bars: number[] = [];
  const beats: number[] = [];
  const energies: number[] = [];
  let energyThreshold = 0;
  
  const blockSize = Math.floor(buffer.length / 200);

  for (let i = 0; i < buffer.length; i += blockSize) {
    let sum = 0;
    for (let j = 0; j < blockSize && (i + j) < buffer.length; j++) {
      sum += Math.abs(buffer[i + j]);
    }
    const energy = sum / blockSize;
    bars.push(energy * 200); 
    energies.push(energy);
    energyThreshold += energy;
  }
  
  energyThreshold = (energyThreshold / energies.length) * 1.5;

  // Simple Peak Detection for Beats
  for (let i = 1; i < energies.length - 1; i++) {
    if (energies[i] > energyThreshold && energies[i] > energies[i-1] && energies[i] > energies[i+1]) {
      beats.push(i / energies.length);
    }
  }

  self.postMessage({ 
    id,
    bars, 
    beats, 
    bpm: Math.round(beats.length * 60 / (buffer.length / sampleRate)) || 120 
  });
};
