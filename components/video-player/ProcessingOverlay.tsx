import React from 'react';
import { Activity, ImageIcon, Sparkles, Loader2, Shield } from 'lucide-react';
import { VideoState } from '../../types';

interface ProcessingOverlayProps {
  state: VideoState;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = React.memo(({ state }) => {
  const isFullScreenProcessing = state.isGenerating || state.isEnhancing || state.isStabilizing;
  const isOverlayProcessing =
    state.isAnalyzing ||
    state.isAutoCaptioning ||
    state.isAutoCutting ||
    state.isRemovingSilence ||
    state.isDetectingScenes ||
    state.isOptimizingPacing ||
    state.isRemovingObject ||
    state.isSmoothingMotion ||
    state.isDubbing ||
    state.isGeneratingClips ||
    state.isStabilizingFootage ||
    state.isRemovingBackground ||
    state.isStoryboarding ||
    state.isCloningVoice ||
    state.isTranslating ||
    state.isCleaningAudio ||
    state.isReframing ||
    state.isStyleTransferring ||
    state.isGeneratingMusic ||
    state.isGeneratingSFX ||
    state.isGeneratingBroll ||
    state.isGeneratingScene ||
    state.isGeneratingCharacter ||
    state.isGeneratingEnvironment ||
    state.isGeneratingAnimation ||
    state.isGeneratingLighting ||
    state.isGeneratingCamera ||
    state.isPlatformOptimizing ||
    state.isTrackingTrends ||
    state.isGeneratingBrandAssets;

  if (!isFullScreenProcessing && !isOverlayProcessing) return null;

  return (
    <>
      {isOverlayProcessing && !isFullScreenProcessing && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative group/spinner">
            <div className="w-24 h-24 border border-studio-accent/20 rounded-full animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0 w-24 h-24 border-t-2 border-studio-accent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            <div className="absolute inset-4 border border-studio-accent/10 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-studio-accent animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <span className="text-studio-accent font-black tracking-[0.4em] text-[10px] uppercase animate-pulse text-center max-w-xs leading-relaxed">
                {state.isEnhancing
                  ? 'Improving video quality...'
                  : state.isStabilizing
                    ? 'Fixing shaky footage...'
                    : state.isAutoCaptioning
                      ? 'Adding captions...'
                      : state.isAutoCutting
                        ? 'Cutting best parts...'
                        : state.isRemovingSilence
                          ? 'Removing quiet parts...'
                          : state.isDetectingScenes
                            ? 'Finding scenes...'
                            : state.isOptimizingPacing
                              ? 'Perfecting the timing...'
                              : state.isRemovingObject
                                ? 'Removing items...'
                                : state.isSmoothingMotion
                                  ? 'Smoothing motion...'
                                  : state.isDubbing
                                    ? 'Adding voices...'
                                    : state.isGeneratingClips
                                      ? 'Creating short clips...'
                                      : state.isRemovingBackground
                                        ? 'Removing background...'
                                        : state.isReframing
                                          ? 'Adjusting frame...'
                                          : 'Processing...'}
              </span>
              <div className="h-[1px] w-12 bg-studio-accent/30" />
            </div>

            <div className="space-y-2 w-64">
              <div className="flex justify-between text-[7px] font-sans text-zinc-500 uppercase tracking-widest">
                <span>Progress</span>
                <span className="text-studio-accent">
                  {state.generationProgress > 0 ? state.generationProgress : 45}%
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-studio-accent shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-700 ease-out"
                  style={{
                    width: `${state.generationProgress > 0 ? state.generationProgress : 45}%`,
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isFullScreenProcessing && (
        <div className="absolute inset-0 z-[120] bg-black/90 flex flex-col items-center justify-center backdrop-blur-xl animate-in fade-in zoom-in duration-500">
          <div className="relative mb-8">
            <div className="absolute -inset-8 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
            {state.isStabilizing ? (
              <Shield className="w-16 h-16 text-emerald-500 relative animate-pulse" />
            ) : state.isEnhancing ? (
              <Sparkles className="w-16 h-16 text-cyan-400 relative animate-pulse" />
            ) : (
              <ImageIcon className="w-16 h-16 text-blue-500 relative animate-pulse" />
            )}
            <Loader2 className="w-16 h-16 text-white absolute inset-0 animate-spin opacity-20" />
          </div>

          <div className="text-center space-y-1 mb-8">
            <h2 className="text-[12px] font-black text-white tracking-[0.8em] uppercase">
              {state.isStabilizing
                ? 'Fixing Shaky Video'
                : state.isEnhancing
                  ? 'Making it Better'
                  : state.isGeneratingAvatar
                    ? 'Creating Digital Twin'
                    : 'Saving Video'}
            </h2>
          </div>

          <div className="w-80 h-1.5 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/10 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${state.generationProgress}%` }}
            />
          </div>

          <div className="flex items-center gap-4 text-[7px] font-sans text-slate-500 tracking-widest uppercase">
            <span className="text-white font-bold">{state.generationProgress}% DONE</span>
          </div>
        </div>
      )}
    </>
  );
});
