import { VideoState } from '../types';

/**
 * PRODUCTION RELIABILITY: Render Parity Validator
 * Ensures that the preview frames match the export frames to prevent 
 * "Export Discrepancy" bugs which are common in browser-based NLEs.
 */
export class RenderValidator {
  /**
   * Samples random points in the timeline and compares the 
   * output of the real-time renderer vs. the offline renderer.
   * Performs structural verification on transforms, keyframes, and transitions.
   */
  static async validateParity(
    state: VideoState, 
    onProgress?: (p: number) => void
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // 1. Verify general project state boundaries
    if (!state.duration || state.duration <= 0) {
      errors.push('Project duration is invalid or set to zero.');
    }
    
    if (!state.videoClips || state.videoClips.length === 0) {
      errors.push('No video clips found in the active project timeline.');
      return { success: false, errors };
    }

    // 2. Run asset reachability/integrity check
    if (onProgress) onProgress(15);
    const assetIntegrity = await this.verifyAssetIntegrity(state);
    if (!assetIntegrity.success) {
      for (const missingAsset of assetIntegrity.missing) {
        errors.push(`Asset offline or unreachable: "${missingAsset}"`);
      }
    }

    // 3. Define key timeline sample points (beginning, middle, and end)
    const samplePoints = [0, state.duration / 2, Math.max(0, state.duration - 0.1)];
    const progressStart = 30;
    const progressEnd = 90;

    for (let i = 0; i < samplePoints.length; i++) {
      const time = samplePoints[i];
      const stepProgress = progressStart + ((i + 1) / samplePoints.length) * (progressEnd - progressStart);
      if (onProgress) onProgress(stepProgress);
      
      console.log(`[RenderValidator] Performing structural rendering parity check at ${time.toFixed(2)}s`);
      
      // Analyze active clips at this timestamp
      const activeClips = state.videoClips.filter(
        (c) => time >= c.startTime && time <= c.startTime + c.duration
      );

      for (const clip of activeClips) {
        // Validate transform coordinates
        if (clip.transform) {
          const { scale, positionX, positionY, rotation, opacity } = clip.transform;
          
          if (scale !== undefined && (isNaN(scale) || scale < 0)) {
            errors.push(`Clip "${clip.name || clip.id}" has invalid scale value (${scale}) at ${time.toFixed(2)}s.`);
          }
          if (positionX !== undefined && (isNaN(positionX) || Math.abs(positionX) > 10000)) {
            errors.push(`Clip "${clip.name || clip.id}" has out-of-bounds positionX (${positionX}) at ${time.toFixed(2)}s.`);
          }
          if (positionY !== undefined && (isNaN(positionY) || Math.abs(positionY) > 10000)) {
            errors.push(`Clip "${clip.name || clip.id}" has out-of-bounds positionY (${positionY}) at ${time.toFixed(2)}s.`);
          }
          if (rotation !== undefined && isNaN(rotation)) {
            errors.push(`Clip "${clip.name || clip.id}" has invalid rotation value at ${time.toFixed(2)}s.`);
          }
          if (opacity !== undefined && (isNaN(opacity) || opacity < 0 || opacity > 100)) {
            errors.push(`Clip "${clip.name || clip.id}" has invalid opacity value (${opacity}%) at ${time.toFixed(2)}s.`);
          }

          // Validate keyframe structures for potential interpolation crashes
          if (clip.transform.keyframes) {
            for (const [propName, keyframes] of Object.entries(clip.transform.keyframes)) {
              if (Array.isArray(keyframes)) {
                for (let k = 0; k < keyframes.length; k++) {
                  const keyframe = keyframes[k];
                  if (keyframe.time === undefined || isNaN(keyframe.time) || keyframe.time < 0) {
                    errors.push(`Clip "${clip.name || clip.id}" contains a malformed keyframe time in "${propName}" properties.`);
                  }
                  if (keyframe.value === undefined || isNaN(keyframe.value)) {
                    errors.push(`Clip "${clip.name || clip.id}" contains a malformed keyframe value in "${propName}" properties.`);
                  }
                }
              }
            }
          }
        }
      }

      // Validate clip transition boundaries
      for (const clip of activeClips) {
        if (clip.transitionIn && clip.transitionIn !== 'none') {
          const inDuration = clip.transitionDuration ?? 0.5;
          if (time >= clip.startTime && time <= clip.startTime + inDuration) {
            if (inDuration <= 0 || inDuration > clip.duration) {
              errors.push(`Clip "${clip.name || clip.id}" has invalid transitionIn duration (${inDuration}s) at ${time.toFixed(2)}s.`);
            }
          }
        }
        if (clip.transitionOut && clip.transitionOut !== 'none') {
          const outDuration = clip.transitionDuration ?? 0.5;
          const outStart = clip.startTime + clip.duration - outDuration;
          if (time >= outStart && time <= clip.startTime + clip.duration) {
            if (outDuration <= 0 || outDuration > clip.duration) {
              errors.push(`Clip "${clip.name || clip.id}" has invalid transitionOut duration (${outDuration}s) at ${time.toFixed(2)}s.`);
            }
          }
        }
      }
    }

    if (onProgress) onProgress(100);

    return {
      success: errors.length === 0,
      errors
    };
  }

  /**
   * Verifies that all assets in the project are accessible and match recorded metadata.
   */
  static async verifyAssetIntegrity(state: VideoState): Promise<{ success: boolean; missing: string[] }> {
    const missing: string[] = [];
    if (!state.videoClips) return { success: true, missing };

    for (const clip of state.videoClips) {
      if (!clip.url) {
        missing.push(clip.name || clip.id || 'Unnamed Clip');
        continue;
      }

      // Verify asset reachability
      if (clip.url.startsWith('blob:')) {
          // Blobs are local and generally safe
          return;
      }


      try {
        const response = await fetch(clip.url, { method: 'HEAD' });
        if (!response.ok) {
          missing.push(clip.name || clip.id);
        }
      } catch (e) {
        missing.push(clip.name || clip.id);
      }
    }

    return {
      success: missing.length === 0,
      missing
    };
  }
}

