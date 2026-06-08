import { FFmpeg } from '@ffmpeg/ffmpeg';
import { ffmpegPool } from './ffmpegPool';

/**
 * PRODUCTION-GRADE TRANSCODING SERVICE
 * Detects unsupported browser codecs (MOV, MKV, AVI, ProRES) 
 * and automatically transcodes them to H.264/MP4 using FFmpeg.wasm.
 */
export class TranscodingService {
  private static readonly SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/ogg'];
  private static readonly SUPPORTED_EXTENSIONS = ['.mp4', '.webm', '.ogg'];

  /**
   * Checks if a file requires transcoding.
   */
  static async needsTranscoding(file: File): Promise<boolean> {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    const type = file.type.toLowerCase();

    // 1. Basic format check
    if (!this.SUPPORTED_FORMATS.includes(type) && !this.SUPPORTED_EXTENSIONS.includes(extension)) {
      return true;
    }

    // 2. Pro-grade probe (check for HEVC/H.265 which has spotty browser support)
    // In a real app, we would use a lightweight probe or try to play it in a hidden video element.
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            resolve(false); // Browser can play it
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
            resolve(true); // Browser failed to decode
            URL.revokeObjectURL(video.src);
        };
        video.src = '/opfs/' + encodeURIComponent(file.name);
    });
  }

  /**
   * Transcodes an unsupported file to H.264 MP4.
   */
  static async transcodeToProxy(file: File, onProgress?: (p: number) => void): Promise<Blob> {
    const ffmpeg = await ffmpegPool.acquire();
    const inputName = `input_${Date.now()}_${file.name}`;
    const outputName = `output_${Date.now()}.mp4`;

    try {
      const data = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(inputName, data);

      ffmpeg.on('log', ({ message }) => {
          console.log('[Transcoder]', message);
      });

      // Optimized H.264 transcoding for web editing
      // -preset ultrafast for speed, -crf 23 for balanced quality
      await ffmpeg.exec([
        '-i', inputName,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        outputName
      ]);

      const outputData = await ffmpeg.readFile(outputName);
      return new Blob([outputData], { type: 'video/mp4' });
    } catch (error) {
      console.error('Transcoding failed:', error);
      throw error;
    } finally {
      ffmpegPool.release(ffmpeg);
    }
  }
}

export const transcodingService = new TranscodingService();
