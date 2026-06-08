import { VideoState, VideoClip, AudioBlock } from '../types';
import { opfsService } from './opfsService';
import { ffmpegProcessor } from '../lib/ffmpeg';
import { workerPool } from './workerPool';

/**
 * PRODUCTION-GRADE EXPORT ENGINE
 * Deterministic frame-by-frame extraction using isolated Workers.
 * No main-thread blocking, no HTMLVideoElement dependency.
 */
export const renderVideo = async (state: VideoState, onProgress: (progress: number) => void) => {
  const exportStart = state.exportRange?.start ?? 0;
  const exportEnd = state.exportRange?.end ?? state.duration;
  const renderDuration = exportEnd - exportStart;

  console.log(`Export: 🎬 Starting Deterministic Render (Streaming Mode: ${exportStart.toFixed(2)}s to ${exportEnd.toFixed(2)}s)`);

  const { fps } = state.projectSettings;
  
  return new Promise<string>(async (resolve, reject) => {
    const worker = workerPool.getWorker('export');
    
    // Initialize OPFS Writable Stream for zero-copy binary ingestion
    let fileHandle: FileSystemFileHandle;
    let writable: FileSystemWritableFileStream;
    let totalBytesWritten = 0;

    try {
        const root = await navigator.storage.getDirectory();
        fileHandle = await root.getFileHandle('export_stream.h264', { create: true });
        writable = await fileHandle.createWritable();
    } catch (e) {
        worker.terminate();
        return reject(new Error('Failed to initialize OPFS storage for streaming export.'));
    }

    worker.onmessage = async (e) => {
      const { type, payload } = e.data;

      if (type === 'ENCODED_CHUNK') {
        const { chunk } = payload;
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        
        try {
            await writable.write(data);
            totalBytesWritten += data.byteLength;
        } catch (err) {
            console.error('Export: OPFS Write Error', err);
            worker.terminate();
            reject(err);
        }
      } 
      
      else if (type === 'EXPORT_PROGRESS') {
        onProgress(payload * 0.8);
      } 
      
      else if (type === 'EXPORT_COMPLETE') {
        console.log(`Export: Video Encoding Complete (${(totalBytesWritten / 1024 / 1024).toFixed(2)}MB). Closing stream and Muxing...`);
        
        try {
          await writable.close();
          
          const videoFile = await fileHandle.getFile();
          const videoData = new Uint8Array(await videoFile.arrayBuffer());

          const inputFiles = [{ name: 'video.h264', data: videoData }];
          
          // Prepare Audio for Muxing
          for (const audio of state.audioTrack) {
              try {
                  // Only include audio if it overlaps with the export range
                  if (audio.startTime < exportEnd && audio.startTime + audio.duration > exportStart) {
                    const res = await fetch(audio.url);
                    if (res.ok) {
                        inputFiles.push({ name: `audio_${audio.id}.mp3`, data: new Uint8Array(await res.arrayBuffer()) });
                    }
                  }
              } catch (e) {
                  console.warn(`Export: Could not fetch audio track ${audio.id}, skipping sync.`);
              }
          }

          const outputData = await ffmpegProcessor.exportVideo(inputFiles, {
            format: 'mp4',
            resolution: '1080p',
            frameRate: fps as any,
            quality: 'high',
            codec: 'copy',
            totalDuration: renderDuration
          }, (p) => onProgress(80 + (p.percentage * 0.2)));

          const finalBlob = new Blob([outputData], { type: 'video/mp4' });
          const url = '/opfs/latest_export.mp4';
          
          await opfsService.saveFile('latest_export.mp4', finalBlob.stream());
          
          onProgress(100);
          resolve(url);
        } catch (error) {
          reject(error);
        } finally {
          worker.terminate();
        }
      }

      else if (type === 'EXPORT_ERROR') {
        await writable.abort();
        worker.terminate();
        reject(new Error(payload));
      }
    };

    worker.postMessage({ type: 'START_EXPORT', payload: { state, exportRange: { start: exportStart, end: exportEnd } } });
  });
};
