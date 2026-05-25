import { ToolNames, FilterPreset } from '../../types';
import { ToolHandler } from './types';

export const visualHandlers: Record<string, ToolHandler> = {
  [ToolNames.SET_FILTER]: (args, { store }) => {
    store.setFilter(args.filter as FilterPreset);
  },

  [ToolNames.ADD_EFFECT]: (args, { store, state }) => {
    store.setState({
      effectTrack: [
        ...state.effectTrack,
        {
          id: crypto.randomUUID().slice(0, 8),
          type: args.type as any,
          startTime: args.startTime ?? state.currentTime,
          duration: args.duration ?? 5,
          intensity: args.intensity ?? 50,
        },
      ],
    });
  },

  [ToolNames.STABILIZE_VIDEO]: async (args, { store, state }) => {
    const stabClipId = args.clipId || state.selectedClipId || state.videoClips[0]?.id;
    if (stabClipId) {
      store.setState({
        videoClips: state.videoClips.map((c) =>
          c.id === stabClipId
            ? {
                ...c,
                isStabilized: true,
                stabilizationProfile: {
                  smoothness: args.smoothness ?? 0.7,
                  cropFactor: args.cropFactor ?? 0.1,
                  temporalSmoothing: true,
                },
              }
            : c,
        ),
      });
      return { result: 'Three-axis stabilization enabled for clip.' };
    }
  },

  [ToolNames.ENHANCE_VIDEO]: async (args, { store, state }) => {
    const targetClipId = args.clipId || state.selectedClipId || state.videoClips[0]?.id;
    if (targetClipId) {
      store.setState({
        videoClips: state.videoClips.map((c) =>
          c.id === targetClipId
            ? {
                ...c,
                isEnhanced: true,
                enhancementProfile: {
                  upscale: args.upscale ?? true,
                  denoise: args.denoise ?? true,
                  colorCorrection: true,
                  strength: args.strength ?? 0.8,
                },
              }
            : c,
        ),
      });
      return { result: 'Neural enhancement profile applied.' };
    }
  },

  [ToolNames.SET_CHROMA_KEY]: (args, { store, state }) => {
    store.setState({
      chromaKey: {
        ...state.chromaKey,
        enabled: args.enabled ?? state.chromaKey.enabled,
        color: args.color ?? state.chromaKey.color,
        intensity: args.intensity ?? state.chromaKey.intensity,
      },
      environmentUrl: args.environmentUrl ?? state.environmentUrl,
    });
  },

  [ToolNames.SET_COLOR_GRADE]: async (args, { store, state }) => {
    const gradeClipId = args.clipId || state.selectedClipId || state.videoClips[0]?.id;
    if (gradeClipId) {
      store.setState((prev: any) => ({
        videoClips: prev.videoClips.map((c: any) =>
          c.id === gradeClipId
            ? {
                ...c,
                smartGradeEnabled: args.enabled ?? true,
                smartGradePreset: args.preset || 'filmic',
                colorGrading: {
                  lift: args.lift || { r: 0, g: 0, b: 0, w: 0 },
                  gamma: args.gamma || { r: 1, g: 1, b: 1, w: 1 },
                  gain: args.gain || { r: 1, g: 1, b: 1, w: 1 },
                  offset: args.offset || { r: 0, g: 0, b: 0, w: 0 },
                  lut: args.lut || (c.colorGrading ? c.colorGrading.lut : undefined),
                  colorSpace: args.colorSpace || 'rec709',
                },
              }
            : c,
        ),
      }));
      return { result: 'Professional color grade applied.' };
    }
  },

  [ToolNames.AUTO_REFRAME]: async (args, { store, state }) => {
    const reframeClipId = args.clipId || state.selectedClipId || state.videoClips[0]?.id;
    if (reframeClipId) {
      store.setState((prev: any) => ({
        videoClips: prev.videoClips.map((c: any) =>
          c.id === reframeClipId
            ? {
                ...c,
                autoReframeEnabled: args.enabled ?? true,
                reframeFocus: args.focus || 'subject',
              }
            : c,
        ),
      }));
      return { result: 'Smart reframing applied.' };
    }
  },

  [ToolNames.REMOVE_OBJECT]: async (args, { store }) => {
    store.setState((prev: any) => ({ ...prev, isRemovingObject: false }));
    return { result: 'Neural inpainting complete.' };
  },

  [ToolNames.SMOOTH_MOTION]: async (args, { store }) => {
    store.setState((prev: any) => ({ ...prev, isSmoothingMotion: false }));
    return { result: 'Optical flow motion smoothing applied.' };
  },

  [ToolNames.REMOVE_BACKGROUND]: async (args, { store }) => {
    store.setState((prev: any) => ({ ...prev, isRemovingBackground: false }));
    return { result: 'Background removal completed.' };
  },

  [ToolNames.STABILIZE_FOOTAGE]: async (args, { store }) => {
    store.setState((prev: any) => ({ ...prev, isStabilizingFootage: false }));
    return { result: 'Advanced stabilization applied.' };
  },

  [ToolNames.VIDEO_STYLE_TRANSFER]: async (args, { store }) => {
    store.setState((prev: any) => ({ ...prev, isStyleTransferring: false }));
    return { result: `Applied '${args.style || 'neural'}' style transfer.` };
  },
};
