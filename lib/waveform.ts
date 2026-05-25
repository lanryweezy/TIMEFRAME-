import { opfsService } from '../services/opfsService';

/**
 * Audio Waveform Extraction Utility (Item #49).
 * Decodes audio data and generates amplitude peaks for visualization.
 * SCALED: Uses OPFS to cache the generated waveform to prevent memory meltdowns on reload.
 */

export const getWaveformData = async (
  url: string,
  samples: number = 100,
): Promise<number[]> => {
  if (!url) return Array.from({ length: samples }, (_, i) => Math.abs(Math.sin(i * 0.1)) * 50 + 10);

  const cacheKey = `waveform_${btoa(url).substring(0, 20)}.json`;

  try {
    // 1. Try to load from OPFS Cache
    const root = await navigator.storage.getDirectory();
    try {
        const fileHandle = await root.getFileHandle(cacheKey);
        const file = await fileHandle.getFile();
        const text = await file.text();
        console.log(`Scale: 🌊 Loaded Waveform from OPFS Cache: ${cacheKey}`);
        return JSON.parse(text);
    } catch (e) {
        // File doesn't exist, proceed to generate
    }

    // 2. Generate Waveform without full-file Fetch overhead if OPFS
    let arrayBuffer: ArrayBuffer;
    if (url.startsWith('opfs://')) {
        const filename = url.replace('opfs://', '');
        const file = await opfsService.getFile(filename);
        if (!file) throw new Error("File not found in OPFS");
        arrayBuffer = await file.arrayBuffer(); // In a true production app, use AudioDecoder for streaming chunks
    } else {
        const response = await fetch(url);
        arrayBuffer = await response.arrayBuffer();
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const peaks: number[] = [];

    for (let i = 0; i < samples; i++) {
      let max = 0;
      for (let j = 0; j < blockSize; j++) {
        const val = Math.abs(channelData[i * blockSize + j]);
        if (val > max) max = val;
      }
      peaks.push(Math.round(max * 100));
    }

    await audioContext.close();

    // 3. Save to OPFS for future sessions
    try {
        const fileHandle = await root.getFileHandle(cacheKey, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(peaks));
        await writable.close();
        console.log(`Scale: 💾 Saved Waveform to OPFS Cache: ${cacheKey}`);
    } catch (e) {
        console.error('Scale: Failed to save waveform to OPFS', e);
    }

    return peaks;
  } catch (error) {
    console.error('Failed to generate real waveform:', error);
    // Fallback to deterministic wave if real decode fails
    return Array.from({ length: samples }, (_, i) => Math.abs(Math.sin(i * 0.1)) * 50 + 10);
  }
};
