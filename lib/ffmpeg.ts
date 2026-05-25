/**
 * World-Class FFmpeg Processor
 * Integrated with FFmpegPool for high-performance parallel processing.
 * Supports fragmented MP4, CRF quality control, 2-pass encoding, and GIF optimization.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { ffmpegPool } from '../services/ffmpegPool';

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'gif';
  resolution: '480p' | '720p' | '1080p' | '1440p' | '4k' | 'custom';
  customResolution?: { width: number; height: number };
  frameRate: 24 | 30 | 60 | 120;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  codec: 'h264' | 'h265' | 'vp9' | 'av1' | 'copy';
  bitrate?: number; // kbps
  audioBitrate?: number; // kbps
  totalDuration?: number; // seconds
  isHighQuality?: boolean; // Enables 2-pass for WebM/VP9
  isFragmented?: boolean; // Enables fMP4 for streaming resilience
}

export interface ProgressCallback {
  (progress: {
    phase: 'loading' | 'processing' | 'encoding' | 'finalizing';
    percentage: number;
    timeRemaining?: number;
    currentStep?: string;
  }): void;
}

class FFmpegProcessor {
  /**
   * Main export method.
   * Acquires a worker from the pool, performs the export, and releases it.
   */
  async exportVideo(
    inputFiles: { name: string; data: Uint8Array }[],
    settings: ExportSettings,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array> {
    const ffmpeg = await ffmpegPool.acquire();

    try {
      onProgress?.({ phase: 'processing', percentage: 0, currentStep: 'Preparing files' });

      // Setup log listener for progress
      const logHandler = ({ message }: { message: string }) => {
        console.log('[FFmpeg]', message);
        
        if (settings.totalDuration && settings.totalDuration > 0) {
          const progressMatch = message.match(/time=(\d+):(\d+):(\d+\.\d+)/);
          if (progressMatch && onProgress) {
            const [, hours, minutes, seconds] = progressMatch;
            const currentTime = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
            const percentage = Math.min((currentTime / settings.totalDuration) * 100, 99);
            
            onProgress({
              phase: 'encoding',
              percentage: Math.round(percentage),
              currentStep: `Encoding... ${Math.round(percentage)}%`
            });
          }
        }
      };

      ffmpeg.on('log', logHandler);

      // Write input files
      for (const file of inputFiles) {
        await ffmpeg.writeFile(file.name, file.data);
      }

      const outputFileName = `output.${settings.format}`;

      // Handle 2-Pass Encoding for WebM/VP9
      if (settings.isHighQuality && (settings.codec === 'vp9' || settings.format === 'webm')) {
          onProgress?.({ phase: 'encoding', percentage: 25, currentStep: 'Starting Pass 1 (Analysis)...' });
          const pass1Command = this.buildExportCommand(inputFiles, settings, 1);
          await ffmpeg.exec(pass1Command);
          
          onProgress?.({ phase: 'encoding', percentage: 60, currentStep: 'Starting Pass 2 (Encoding)...' });
          const pass2Command = this.buildExportCommand(inputFiles, settings, 2);
          await ffmpeg.exec(pass2Command);
      } 
      
      // Handle Specialized GIF Optimization (Palettegen)
      else if (settings.format === 'gif') {
          onProgress?.({ phase: 'encoding', percentage: 30, currentStep: 'Generating Optimized Palette...' });
          // Stage 1: Generate palette
          await ffmpeg.exec([
              '-i', inputFiles[0].name,
              '-vf', `fps=${Math.min(settings.frameRate, 30)},scale=${this.getResolution(settings).width}:-1:flags=lanczos,palettegen`,
              'palette.png'
          ]);

          onProgress?.({ phase: 'encoding', percentage: 60, currentStep: 'Applying Palette...' });
          // Stage 2: Use palette
          await ffmpeg.exec([
              '-i', inputFiles[0].name,
              '-i', 'palette.png',
              '-filter_complex', `fps=${Math.min(settings.frameRate, 30)},scale=${this.getResolution(settings).width}:-1:flags=lanczos[x];[x][1:v]paletteuse`,
              outputFileName
          ]);
      }
      
      // Standard Single-Pass Encoding
      else {
          onProgress?.({ phase: 'encoding', percentage: 25, currentStep: 'Starting encoding...' });
          const command = this.buildExportCommand(inputFiles, settings);
          await ffmpeg.exec(command);
      }

      onProgress?.({ phase: 'finalizing', percentage: 95, currentStep: 'Reading output' });

      const data = await ffmpeg.readFile(outputFileName);
      
      // Cleanup log handler
      ffmpeg.off('log', logHandler);

      onProgress?.({ phase: 'finalizing', percentage: 100, currentStep: 'Export complete' });

      return data as Uint8Array;
    } catch (error) {
      console.error('FFmpeg export failed:', error);
      throw error;
    } finally {
      ffmpegPool.release(ffmpeg);
    }
  }

  private buildExportCommand(
    inputFiles: { name: string; data: Uint8Array }[],
    settings: ExportSettings,
    pass?: 1 | 2
  ): string[] {
    const command: string[] = [];
    const coreCount = navigator.hardwareConcurrency || 4;

    // Inputs
    inputFiles.forEach(file => {
      command.push('-i', file.name);
    });

    // 2. Intelligent Thread Saturation
    let threads = coreCount;
    if (settings.codec === 'h264' || settings.codec === 'h265') {
        threads = Math.floor(coreCount * 1.5);
    }
    command.push('-threads', threads.toString());

    // Video codec
    switch (settings.codec) {
      case 'h264': command.push('-c:v', 'libx264'); break;
      case 'h265': command.push('-c:v', 'libx265'); break;
      case 'vp9': command.push('-c:v', 'libvpx-vp9'); break;
      case 'av1': command.push('-c:v', 'libaom-av1'); break;
      case 'copy': command.push('-c:v', 'copy'); break;
      default: command.push('-c:v', 'libx264');
    }

    // 3. CRF over Bitrate
    if (settings.codec !== 'copy') {
        const crfValue = this.getCRFValue(settings);
        command.push('-crf', crfValue.toString());
        
        // VP9 specific optimizations
        if (settings.codec === 'vp9') {
            command.push('-tile-columns', '2', '-row-mt', '1');
        }
    }

    // 4. Two-Pass Logic
    if (pass === 1) {
        command.push('-pass', '1', '-an', '-f', settings.format === 'webm' ? 'webm' : 'mp4', '/dev/null');
        return command;
    } else if (pass === 2) {
        command.push('-pass', '2');
    }

    // Presets
    if (settings.codec === 'h264' || settings.codec === 'h265') {
        command.push('-preset', settings.quality === 'ultra' ? 'medium' : 'veryfast'); 
    }

    // Resolution & Scaling
    const res = this.getResolution(settings);
    if (res) {
      command.push('-vf', `scale=${res.width}:${res.height}:force_original_aspect_ratio=decrease,pad=${res.width}:${res.height}:(ow-iw)/2:(oh-ih)/2`);
    }

    // Frame rate
    command.push('-r', settings.frameRate.toString());

    // Audio
    command.push('-c:a', 'aac', '-b:a', `${settings.audioBitrate || 128}k`);

    // 1 & 7. Format specific optimizations (fMP4 & FastStart)
    if (settings.format === 'mp4') {
      let movflags = '+faststart';
      if (settings.isFragmented) {
          movflags += '+frag_keyframe+empty_moov+default_base_moof';
      }
      command.push('-movflags', movflags, '-pix_fmt', 'yuv420p');
    }

    command.push(`output.${settings.format}`);
    return command;
  }

  private getCRFValue(settings: ExportSettings): number {
    const isVP9 = settings.codec === 'vp9';
    const qualityMap = {
        'low': isVP9 ? 40 : 28,
        'medium': isVP9 ? 32 : 23,
        'high': isVP9 ? 24 : 18,
        'ultra': isVP9 ? 18 : 12
    };
    return qualityMap[settings.quality] || (isVP9 ? 32 : 23);
  }

  private getResolution(settings: ExportSettings) {
    if (settings.resolution === 'custom' && settings.customResolution) {
      return settings.customResolution;
    }
    const map = {
      '480p': { width: 854, height: 480 },
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '1440p': { width: 2560, height: 1440 },
      '4k': { width: 3840, height: 2160 },
    };
    return (map as any)[settings.resolution] || { width: 1920, height: 1080 };
  }

  /**
   * Fast waveform extraction remains same.
   */
  async extractAudioWaveform(audioFile: Uint8Array, width: number = 1000): Promise<number[]> {
    const ffmpeg = await ffmpegPool.acquire();
    try {
      await ffmpeg.writeFile('input.wav', audioFile);
      await ffmpeg.exec(['-i', 'input.wav', '-ac', '1', '-ar', '8000', '-f', 'f32le', 'waveform.raw']);
      const data = await ffmpeg.readFile('waveform.raw');
      const floatArray = new Float32Array((data as Uint8Array).buffer);
      const samplesPerPixel = Math.floor(floatArray.length / width);
      const waveform: number[] = [];
      for (let i = 0; i < width; i++) {
        const start = i * samplesPerPixel;
        const end = start + samplesPerPixel;
        let max = 0;
        for (let j = start; j < end && j < floatArray.length; j++) {
          max = Math.max(max, Math.abs(floatArray[j]));
        }
        waveform.push(max);
      }
      return waveform;
    } finally {
      ffmpegPool.release(ffmpeg);
    }
  }
}

export const ffmpegProcessor = new FFmpegProcessor();
