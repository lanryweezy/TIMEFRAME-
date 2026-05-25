import { opfsService } from './opfsService';

/**
 * PRODUCTION-GRADE THUMBNAIL GENERATOR
 * Uses a hidden video element to extract real frames from assets.
 * Faster than full decoding for simple preview generation.
 */
export class ThumbnailService {
  private static readonly THUMB_WIDTH = 320;
  private static readonly THUMB_HEIGHT = 180;

  /**
   * Generates a single thumbnail for a given time.
   */
  static async generateThumbnail(url: string, time: number = 0): Promise<string> {
    const realUrl = url.startsWith('opfs://') 
        ? URL.createObjectURL(await opfsService.getFile(url.replace('opfs://', '')) as Blob)
        : url;

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.src = realUrl;

      video.onloadeddata = () => {
        video.currentTime = time;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.THUMB_WIDTH;
        canvas.height = this.THUMB_HEIGHT;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Could not create canvas context');

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        if (url.startsWith('opfs://')) URL.revokeObjectURL(realUrl);
        video.remove();
        canvas.remove();
        
        resolve(dataUrl);
      };

      video.onerror = (e) => reject(`Thumbnail generation failed: ${e}`);
    });
  }

  /**
   * Generates a sequence of thumbnails for an asset.
   */
  static async generateSequence(url: string, count: number = 5): Promise<string[]> {
      const thumbnails: string[] = [];
      const realUrl = url.startsWith('opfs://') 
        ? URL.createObjectURL(await opfsService.getFile(url.replace('opfs://', '')) as Blob)
        : url;

      return new Promise((resolve) => {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.src = realUrl;

          video.onloadedmetadata = async () => {
              const duration = video.duration;
              const step = duration / (count + 1);

              for (let i = 1; i <= count; i++) {
                  video.currentTime = step * i;
                  await new Promise(r => video.onseeked = r);
                  
                  const canvas = document.createElement('canvas');
                  canvas.width = this.THUMB_WIDTH;
                  canvas.height = this.THUMB_HEIGHT;
                  canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
                  thumbnails.push(canvas.toDataURL('image/jpeg', 0.6));
              }

              if (url.startsWith('opfs://')) URL.revokeObjectURL(realUrl);
              video.remove();
              resolve(thumbnails);
          };
      });
  }
}

export const thumbnailService = new ThumbnailService();
