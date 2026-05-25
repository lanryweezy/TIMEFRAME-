import { VideoState } from '../types';

export const validateProject = (state: VideoState): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!state.videoClips || state.videoClips.length === 0) {
    errors.push('Project has no video clips.');
  }

  state.videoClips.forEach((clip) => {
    if (!clip.url) {
      errors.push(`Clip ${clip.id} has no URL.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
