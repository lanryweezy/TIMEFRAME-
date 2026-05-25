import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

/**
 * Robust FFmpeg Worker Pool
 * Manages a pool of FFmpeg instances with proper lifecycle management,
 * resource limits, and error recovery.
 */
class FFmpegPool {
  private pool: FFmpeg[] = [];
  private activeCount = 0;
  private maxWorkers: number;
  private queue: ((ffmpeg: FFmpeg) => void)[] = [];
  private baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd';
  private isLoading = false;

  constructor() {
    // Multi-threaded FFmpeg works best when it matches the number of logical cores,
    // but we limit it to 4 to avoid over-saturating the browser's main thread and memory.
    this.maxWorkers = Math.min(navigator.hardwareConcurrency || 4, 4);
  }

  /**
   * Acquires an FFmpeg worker from the pool.
   * If the pool is empty and max workers haven't been reached, creates a new one.
   * Otherwise, queues the request.
   */
  async acquire(): Promise<FFmpeg> {
    if (this.pool.length > 0) {
      this.activeCount++;
      return this.pool.pop()!;
    }

    if (this.activeCount < this.maxWorkers) {
      this.activeCount++;
      try {
        return await this.createWorker();
      } catch (error) {
        this.activeCount--;
        throw error;
      }
    }

    // Wait for a worker to be released
    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  /**
   * Releases an FFmpeg worker back into the pool.
   */
  release(ffmpeg: FFmpeg) {
    this.activeCount--;
    
    // Clean up FFmpeg FS before returning to pool
    // Note: We don't terminate here to keep it ready for reuse
    this.cleanupFileSystem(ffmpeg).catch(console.error);

    if (this.queue.length > 0) {
      this.activeCount++;
      const next = this.queue.shift()!;
      next(ffmpeg);
    } else {
      this.pool.push(ffmpeg);
    }
  }

  private async createWorker(): Promise<FFmpeg> {
    const ffmpeg = new FFmpeg();
    
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      return ffmpeg;
    } catch (error) {
      console.error('Failed to load FFmpeg MT worker:', error);
      // Fallback to single-threaded if MT fails (though SAB should be guaranteed by headers)
      return this.createSingleThreadedWorker();
    }
  }

  private async createSingleThreadedWorker(): Promise<FFmpeg> {
    const stBaseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${stBaseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${stBaseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
  }

  private async cleanupFileSystem(ffmpeg: FFmpeg) {
    try {
      // List and delete all files in the root of FFmpeg's virtual FS
      // This is a bit tricky with the new API as it doesn't provide a direct list method
      // We rely on standard naming conventions used in our app or try common names
      const commonFiles = ['input.wav', 'waveform.raw', 'output.mp4', 'output.webm', 'output.mov', 'output.avi', 'output.mkv', 'output.gif'];
      for (const file of commonFiles) {
        try {
          await ffmpeg.deleteFile(file);
        } catch (e) {
          // Ignore files that don't exist
        }
      }
    } catch (error) {
      console.warn('FFmpeg FS cleanup failed:', error);
    }
  }

  /**
   * Terminates all workers in the pool.
   */
  async terminateAll() {
    const all = [...this.pool];
    this.pool = [];
    this.activeCount = 0;
    this.queue = [];
    
    await Promise.all(all.map(f => {
      try {
        return f.terminate();
      } catch (e) {
        return Promise.resolve();
      }
    }));
  }
}

export const ffmpegPool = new FFmpegPool();
