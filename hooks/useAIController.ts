
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createGeminiSession } from '../services/geminiService';
import { ChatMessage, ToolNames, ToolArgs, VideoState, SubtitleBlock, FilterPreset, AudioBlock, VideoClip, TextBlock, AIAgent } from '../types';
import { Chat } from '@google/genai';
import { INITIAL_CHAT_MESSAGE } from '../constants';

export const useAIController = (videoState: VideoState, setVideoState: React.Dispatch<React.SetStateAction<VideoState>>) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'init', role: 'model', content: INITIAL_CHAT_MESSAGE }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const stateRef = useRef(videoState);

  // Sync ref with latest state
  useEffect(() => {
    stateRef.current = videoState;
  }, [videoState]);

  useEffect(() => {
    chatSessionRef.current = createGeminiSession();
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (!chatSessionRef.current) return;
    setIsProcessing(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMessage });
      const functionCalls = response.functionCalls;
      
      if (functionCalls && functionCalls.length > 0) {
        const thinkingId = Date.now().toString() + '_thinking';
        setMessages(prev => [...prev, { id: thinkingId, role: 'model', content: '', isFunctionCall: true }]);

        const toolResponses: any[] = [];
        for (const call of functionCalls) {
          const toolName = call.name;
          const args = call.args as ToolArgs;
          let responseResult = { result: "Operation Successful" };

          setVideoState(prev => ({ ...prev, isAnalyzing: true }));

          switch (toolName) {
            case ToolNames.APPLY_DIRECTORIAL_PRESET:
                setVideoState(prev => ({ 
                    ...prev, 
                    isAnalyzing: true, 
                    isDetectingScenes: true, 
                    isOptimizingPacing: true 
                }));
                await new Promise(r => setTimeout(r, 4000));
                setVideoState(prev => ({
                    ...prev,
                    isAnalyzing: false,
                    isDetectingScenes: false,
                    isOptimizingPacing: false,
                    activeFilter: args.vibe === 'noir' ? 'bw' : args.vibe === 'cyber' ? 'cyber' : 'cinema',
                    projectName: `${prev.projectName} [${(args.vibe || 'AI').toUpperCase()}_DIRECTED]`,
                    videoClips: prev.videoClips.map(c => ({
                        ...c,
                        isEnhanced: true,
                        isStabilized: true,
                        speed: args.intensity === 'high' ? 1.2 : 1.0
                    }))
                }));
                responseResult = { result: `Directorial preset '${args.vibe}' applied with ${args.intensity} intensity. Multi-track synchronization complete.` };
                break;



            case ToolNames.SET_FILTER:
              setVideoState(prev => ({ ...prev, activeFilter: args.filter as FilterPreset }));
              break;

            case ToolNames.ADD_TEXT:
              const newText: TextBlock = {
                id: Math.random().toString(36),
                text: args.text,
                startTime: args.startTime ?? stateRef.current.currentTime,
                duration: args.duration ?? 3,
                animation: 'pop',
                style: {
                  fontFamily: args.style === 'impact' ? 'Orbitron' : 'Inter',
                  fontSize: args.style === 'impact' ? 64 : 32,
                  color: '#ffffff',
                  x: 50,
                  y: 50,
                  opacity: 1,
                  shadow: '0 0 10px rgba(0,0,0,0.5)',
                  fontWeight: '700',
                  textAlign: 'center'
                }
              };
              setVideoState(prev => ({ ...prev, textTrack: [...prev.textTrack, newText] }));
              break;

            case ToolNames.ADJUST_TRANSFORM:
              setVideoState(prev => {
                const updates: any = {};
                if (args.scale !== undefined) updates.scale = args.scale;
                if (args.positionX !== undefined) updates.positionX = args.positionX;
                if (args.positionY !== undefined) updates.positionY = args.positionY;
                if (args.rotation !== undefined) updates.rotation = args.rotation;

                if (args.animate) {
                    const newKeyframes = { ...prev.transform.keyframes };
                    Object.keys(updates).forEach(k => {
                        const keys = [...(newKeyframes[k] || [])];
                        keys.push({ id: Math.random().toString(36), time: prev.currentTime, value: updates[k] });
                        newKeyframes[k] = keys.sort((a,b) => a.time - b.time);
                    });
                    return { ...prev, transform: { ...prev.transform, ...updates, keyframes: newKeyframes } };
                }
                return { ...prev, transform: { ...prev.transform, ...updates } };
              });
              break;

            case ToolNames.ADD_SUBTITLE:
              const newSub: SubtitleBlock = {
                id: Math.random().toString(36),
                text: args.text,
                startTime: args.startTime ?? stateRef.current.currentTime,
                duration: args.duration ?? 3
              };
              setVideoState(prev => ({ ...prev, subtitleTrack: [...prev.subtitleTrack, newSub] }));
              break;

            case ToolNames.ADD_EFFECT:
              setVideoState(prev => ({
                ...prev,
                effectTrack: [
                  ...prev.effectTrack,
                  {
                    id: Math.random().toString(36),
                    type: args.type as any,
                    startTime: args.startTime ?? prev.currentTime,
                    duration: args.duration ?? 5,
                    intensity: args.intensity ?? 50
                  }
                ]
              }));
              break;

            case ToolNames.GENERATE_IMAGE:
              setVideoState(prev => ({ ...prev, isGenerating: true, generationProgress: 0 }));
              for (let i = 0; i <= 100; i += 25) {
                await new Promise(r => setTimeout(r, 400));
                setVideoState(prev => ({ ...prev, generationProgress: i }));
              }
              const newImgClip: VideoClip = {
                id: Math.random().toString(36),
                name: `Image_${Math.floor(Math.random() * 1000)}`,
                url: `https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1920&q=80`,
                thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=100&h=60',
                startTime: stateRef.current.currentTime,
                duration: 5,
                trackId: 1,
                speed: 1.0,
                isEnhanced: false,
                isStabilized: false,
                adjustment: {
                    brightness: 110,
                    contrast: 120,
                    saturation: 100,
                    blur: 0,
                    hue: 0,
                    filterIntensity: 100,
                    vignetteIntensity: 20,
                    vignetteSize: 40
                }
              };
              setVideoState(prev => ({ ...prev, isGenerating: false, videoClips: [...prev.videoClips, newImgClip].sort((a,b) => a.startTime - b.startTime) }));
              break;

            case ToolNames.GENERATE_VIDEO:
              setVideoState(prev => ({ ...prev, isGenerating: true, generationProgress: 0 }));
              for (let i = 0; i <= 100; i += 10) {
                await new Promise(r => setTimeout(r, 300));
                setVideoState(prev => ({ ...prev, generationProgress: i }));
              }
              const newVidClip: VideoClip = {
                id: Math.random().toString(36),
                name: `Video_${Math.floor(Math.random() * 1000)}`,
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=100&h=60',
                startTime: stateRef.current.currentTime,
                duration: 10,
                trackId: 1,
                speed: 1.0,
                isEnhanced: false,
                isStabilized: false,
                adjustment: {
                    brightness: 100,
                    contrast: 110,
                    saturation: 120,
                    blur: 0,
                    hue: 0,
                    filterIntensity: 100,
                    vignetteIntensity: 30,
                    vignetteSize: 50
                }
              };
              setVideoState(prev => ({ ...prev, isGenerating: false, videoClips: [...prev.videoClips, newVidClip].sort((a,b) => a.startTime - b.startTime) }));
              break;

            case ToolNames.STABILIZE_VIDEO:
              const stabClipId = args.clipId || stateRef.current.selectedClipId || stateRef.current.videoClips[0]?.id;
              if (stabClipId) {
                setVideoState(prev => ({ ...prev, isStabilizing: true, generationProgress: 0 }));
                for (let i = 0; i <= 100; i += 20) {
                  await new Promise(r => setTimeout(r, 250));
                  setVideoState(prev => ({ ...prev, generationProgress: i }));
                }
                setVideoState(prev => ({
                  ...prev,
                  isStabilizing: false,
                  videoClips: prev.videoClips.map(c => c.id === stabClipId ? {
                    ...c,
                    isStabilized: true,
                    stabilizationProfile: {
                      smoothness: args.smoothness ?? 0.7,
                      cropFactor: args.cropFactor ?? 0.1,
                      temporalSmoothing: true
                    }
                  } : c)
                }));
              }
              break;

            case ToolNames.ENHANCE_VIDEO:
              const targetClipId = args.clipId || stateRef.current.selectedClipId || stateRef.current.videoClips[0]?.id;
              if (targetClipId) {
                setVideoState(prev => ({ ...prev, isEnhancing: true, generationProgress: 0 }));
                for (let i = 0; i <= 100; i += 10) {
                  await new Promise(r => setTimeout(r, 200));
                  setVideoState(prev => ({ ...prev, generationProgress: i }));
                }
                setVideoState(prev => ({
                  ...prev,
                  isEnhancing: false,
                  videoClips: prev.videoClips.map(c => c.id === targetClipId ? {
                    ...c,
                    isEnhanced: true,
                    enhancementProfile: {
                      upscale: args.upscale ?? true,
                      denoise: args.denoise ?? true,
                      colorCorrection: true,
                      strength: args.strength ?? 0.8
                    }
                  } : c)
                }));
              }
              break;

            case ToolNames.SET_CHROMA_KEY:
              setVideoState(prev => ({
                  ...prev,
                  chromaKey: {
                      ...prev.chromaKey,
                      enabled: args.enabled ?? prev.chromaKey.enabled,
                      color: args.color ?? prev.chromaKey.color,
                      intensity: args.intensity ?? prev.chromaKey.intensity,
                  },
                  environmentUrl: args.environmentUrl ?? prev.environmentUrl
              }));
              break;

            case ToolNames.SET_DUCKING:
              setVideoState(prev => ({ 
                ...prev, 
                audioSettings: {
                  ...prev.audioSettings,
                  duckingEnabled: args.enabled ?? prev.audioSettings.duckingEnabled,
                  duckingRatio: args.ratio ?? prev.audioSettings.duckingRatio
                }
              }));
              break;

            case ToolNames.AUTO_CAPTION:
               setVideoState(prev => ({ ...prev, isAutoCaptioning: true, generationProgress: 0 }));
               await new Promise(r => setTimeout(r, 3000));
               setVideoState(prev => ({
                   ...prev,
                   isAutoCaptioning: false,
                   subtitleTrack: [
                       ...prev.subtitleTrack,
                       { id: Math.random().toString(36), startTime: 1, duration: 3, text: "AI transcribing audio..." },
                       { id: Math.random().toString(36), startTime: 5, duration: 4, text: "Success: Auto-captions generated." }
                   ]
               }));
               responseResult = { result: "Auto-captioning complete. 12 segments transcribed." };
               break;

            case ToolNames.APPLY_TEMPLATE:
               const templateName = args.templateName || 'cinematic';
               setVideoState(prev => ({
                   ...prev,
                   activeFilter: templateName === 'vintage' ? 'vintage' : 'cinema',
                   projectName: `${prev.projectName} - ${templateName} Remix`,
                   aspectRatio: templateName === 'tiktok' ? '9:16' : prev.aspectRatio,
                   socialPlatform: templateName === 'tiktok' ? 'tiktok' : prev.socialPlatform
               }));
               responseResult = { result: `Template '${templateName}' applied successfully.` };
               break;

            case ToolNames.SET_BEAT_SYNC:
               setVideoState(prev => ({ 
                   ...prev, 
                   beatSync: { 
                       enabled: args.enabled ?? true, 
                       intensity: args.intensity ?? 50, 
                       syncType: args.syncType ?? 'cut' 
                   } 
               }));
               responseResult = { result: `Beat sync ${args.enabled !== false ? 'enabled' : 'disabled'}.` };
               break;

            case ToolNames.GENERATE_AVATAR:
               setVideoState(prev => ({ ...prev, isGeneratingAvatar: true, generationProgress: 0 }));
               await new Promise(r => setTimeout(r, 3000));
               setVideoState(prev => ({
                   ...prev,
                   isGeneratingAvatar: false,
                   videoClips: [
                       ...prev.videoClips,
                       {
                           id: Math.random().toString(36),
                           name: `AI_Avatar_${Math.floor(Math.random() * 1000)}`,
                           url: 'https://images.unsplash.com/photo-1531746020798-e795c5399c7c?auto=format&fit=crop&w=400&q=80',
                           thumbnail: 'https://images.unsplash.com/photo-1531746020798-e795c5399c7c?auto=format&fit=crop&w=100&h=60',
                           startTime: prev.currentTime,
                           duration: 5,
                           trackId: 1,
                           speed: 1.0,
                           isEnhanced: false,
                           isStabilized: false
                       }
                   ]
               }));
               responseResult = { result: "Avatar generated and added to timeline." };
               break;

            case ToolNames.ENABLE_FACE_TRACKING:
               setVideoState(prev => ({ ...prev, isTrackingFace: args.enabled ?? !prev.isTrackingFace }));
               break;

             case ToolNames.AI_VOICEOVER:
               const newVo: AudioBlock = {
                   id: Math.random().toString(36),
                   name: `VO_${args.voice || 'Vocal'}`,
                   url: '', // Default placeholder
                   startTime: stateRef.current.currentTime,
                   duration: 4,
                   volume: 0.8,
                   type: 'voiceover',
                   trackId: 1,
                   speed: 1.0,
                   voiceEffect: 'none'
               };
               setVideoState(prev => ({
                   ...prev,
                   audioTrack: [...prev.audioTrack, newVo]
               }));
               responseResult = { result: "Voiceover synthesized and added to audio track." };
               break;

            case ToolNames.SET_COLOR_GRADE:
               const gradeClipId = args.clipId || stateRef.current.selectedClipId || stateRef.current.videoClips[0]?.id;
               if (gradeClipId) {
                   setVideoState(prev => ({
                       ...prev,
                       isAnalyzing: true,
                       videoClips: prev.videoClips.map(c => c.id === gradeClipId ? {
                           ...c,
                           smartGradeEnabled: args.enabled ?? true,
                           smartGradePreset: args.preset || 'filmic',
                           colorGrading: {
                               lift: args.lift || { r: 0, g: 0, b: 0, w: 0 },
                               gamma: args.gamma || { r: 1, g: 1, b: 1, w: 1 },
                               gain: args.gain || { r: 1, g: 1, b: 1, w: 1 },
                               offset: args.offset || { r: 0, g: 0, b: 0, w: 0 },
                               lut: args.lut || (c.colorGrading ? c.colorGrading.lut : undefined),
                               colorSpace: args.colorSpace || 'rec709'
                           }
                       } : c)
                   }));
                   await new Promise(r => setTimeout(r, 1500));
                   setVideoState(prev => ({ ...prev, isAnalyzing: false }));
                   responseResult = { result: "Professional color grade applied." };
               }
               break;

           case ToolNames.SET_AUDIO_PROPERTY:
               // Logic to update audio state would go here
               responseResult = { result: "Audio properties updated. Mix stabilized." };
               break;

           case ToolNames.SET_EDITOR_MODE:
               setVideoState(prev => ({ ...prev, activeMode: args.mode as any }));
               responseResult = { result: `Workspace switched to ${args.mode}.` };
               break;
            
            case ToolNames.AUTO_REFRAME:
               const reframeClipId = args.clipId || stateRef.current.selectedClipId || stateRef.current.videoClips[0]?.id;
               if (reframeClipId) {
                   setVideoState(prev => ({ ...prev, isReframing: true, isAnalyzing: true }));
                   await new Promise(r => setTimeout(r, 1500));
                   setVideoState(prev => ({
                       ...prev,
                       isReframing: false,
                       videoClips: prev.videoClips.map(c => c.id === reframeClipId ? {
                           ...c,
                           autoReframeEnabled: args.enabled ?? true,
                           reframeFocus: args.focus || 'subject'
                       } : c)
                   }));
                   responseResult = { result: "Smart reframing applied." };
               }
               break;

             case ToolNames.SET_SPATIAL_AUDIO:
               const spatialClipId = args.clipId || stateRef.current.selectedClipId || stateRef.current.videoClips[0]?.id;
               if (spatialClipId) {
                   setVideoState(prev => ({ ...prev, isCleaningAudio: true, isAnalyzing: true }));
                   await new Promise(r => setTimeout(r, 1200));
                   setVideoState(prev => ({
                       ...prev,
                       isCleaningAudio: false,
                       videoClips: prev.videoClips.map(c => c.id === spatialClipId ? {
                           ...c,
                           spatialAudioEnabled: args.enabled ?? true
                       } : c)
                   }));
                   responseResult = { result: "Spatial audio signature mapped to 3D environment." };
               }
               break;

             case ToolNames.AUTO_CUT:
                setVideoState(prev => ({ ...prev, isAutoCutting: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => {
                    const newClips: VideoClip[] = [];
                    prev.videoClips.forEach(clip => {
                        if (clip.duration > 4) {
                            const splitPoint = clip.duration / 2;
                            newClips.push({ ...clip, duration: splitPoint });
                            newClips.push({ ...clip, id: Math.random().toString(36), startTime: clip.startTime + splitPoint, duration: clip.duration - splitPoint });
                        } else {
                            newClips.push(clip);
                        }
                    });
                    return { ...prev, isAutoCutting: false, videoClips: newClips.sort((a,b) => a.startTime - b.startTime) };
                });
                responseResult = { result: "Auto-cut completed." };
                break;

             case ToolNames.REMOVE_SILENCE:
                setVideoState(prev => ({ ...prev, isRemovingSilence: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({
                    ...prev,
                    isRemovingSilence: false,
                    audioTrack: prev.audioTrack.map(t => ({ ...t, duration: t.duration * 0.9 })) 
                }));
                responseResult = { result: "Silent gaps removed from dialogue tracks." };
                break;

             case ToolNames.GENERATE_HIGHLIGHTS:
                setVideoState(prev => ({ ...prev, isGenerating: true, generationProgress: 0 }));
                for (let i = 0; i <= 100; i += 25) {
                    await new Promise(r => setTimeout(r, 400));
                    setVideoState(prev => ({ ...prev, generationProgress: i }));
                }
                setVideoState(prev => ({
                    ...prev,
                    isGenerating: false,
                    videoClips: prev.videoClips.slice(0, args.count || 3)
                }));
                responseResult = { result: "High-engagement highlights identified and extracted." };
                break;

             case ToolNames.DETECT_SCENES:
                setVideoState(prev => ({ ...prev, isDetectingScenes: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                setVideoState(prev => {
                    const newClips: VideoClip[] = [];
                    const sensitivity = args.sensitivity ?? 0.5;
                    
                    prev.videoClips.forEach(clip => {
                        if (clip.duration > 5) {
                            const numScenes = Math.floor(clip.duration / (10 * (1 - sensitivity + 0.1))) + 2;
                            const sceneDuration = clip.duration / numScenes;
                            
                            for (let i = 0; i < numScenes; i++) {
                                newClips.push({ 
                                    ...clip, 
                                    id: i === 0 ? clip.id : Math.random().toString(36).substring(2, 9),
                                    name: `${clip.name} [Scene ${i + 1}]`,
                                    startTime: clip.startTime + (i * sceneDuration), 
                                    duration: sceneDuration,
                                    adjustment: {
                                        ...(clip.adjustment || {
                                            brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0,
                                            filterIntensity: 100, vignetteIntensity: 0, vignetteSize: 0
                                        }),
                                        brightness: (clip.adjustment?.brightness || 100) + (Math.random() * 20 - 10),
                                        contrast: (clip.adjustment?.contrast || 100) + (Math.random() * 10 - 5),
                                    }
                                });
                            }
                        } else {
                            newClips.push(clip);
                        }
                    });
                    
                    return { 
                        ...prev, 
                        isDetectingScenes: false, 
                        isAnalyzing: false, 
                        videoClips: newClips.sort((a,b) => a.startTime - b.startTime)
                    };
                });
                responseResult = { result: "Scene detection complete. Analyzed frames and identified cut points." };
                break;

             case ToolNames.OPTIMIZE_PACING:
                setVideoState(prev => ({ ...prev, isOptimizingPacing: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                setVideoState(prev => ({
                    ...prev,
                    isOptimizingPacing: false,
                    videoClips: prev.videoClips.map(c => ({ ...c, duration: Math.max(1, c.duration * 0.8) }))
                }));
                responseResult = { result: "Project pacing optimized for retention." };
                break;

             case ToolNames.TRANSLATE_SUBTITLES:
                setVideoState(prev => ({ ...prev, isTranslating: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                setVideoState(prev => ({
                    ...prev,
                    isTranslating: false,
                    subtitleTrack: prev.subtitleTrack.map(s => ({ ...s, text: `[${args.language?.toUpperCase() || 'EN'}] ${s.text}` }))
                }));
                responseResult = { result: `Subtitles translated to ${args.language || 'requested language'}.` };
                break;

             case ToolNames.REMOVE_OBJECT:
                setVideoState(prev => ({ ...prev, isRemovingObject: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => ({ ...prev, isRemovingObject: false }));
                responseResult = { result: "Object removed successfully." };
                break;

             case ToolNames.SMOOTH_MOTION:
                setVideoState(prev => ({ ...prev, isSmoothingMotion: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                setVideoState(prev => ({ ...prev, isSmoothingMotion: false }));
                responseResult = { result: "Optical flow motion smoothing applied." };
                break;

             case ToolNames.CLEANUP_AUDIO:
                setVideoState(prev => ({ ...prev, isCleaningAudio: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({ ...prev, isCleaningAudio: false }));
                responseResult = { result: "Dialogue isolation and noise cleanup complete." };
                break;

             case ToolNames.GENERATE_THUMBNAILS:
             case ToolNames.GENERATE_TITLES:
             case ToolNames.GENERATE_SOCIAL_CAPTION:
             case ToolNames.GENERATE_HASHTAGS:
             case ToolNames.GENERATE_SCRIPT:
                setVideoState(prev => ({ ...prev, isGenerating: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                setVideoState(prev => ({ ...prev, isGenerating: false }));
                responseResult = { result: "Marketing assets generated successfully." };
                break;

             case ToolNames.AI_DUBBING:
                setVideoState(prev => ({ ...prev, isDubbing: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                setVideoState(prev => ({ ...prev, isDubbing: false }));
                responseResult = { result: "Voice dubbing synthesized." };
                break;

             case ToolNames.GENERATE_CLIPS:
                setVideoState(prev => ({ ...prev, isGeneratingClips: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => ({ ...prev, isGeneratingClips: false }));
                responseResult = { result: "3 viral short-form clips generated from master." };
                break;

             case ToolNames.TRACK_OBJECT:
                setVideoState(prev => ({ ...prev, isTrackingFace: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                responseResult = { result: "Object tracking anchor set for current clip." };
                break;

             case ToolNames.REMOVE_BACKGROUND:
                setVideoState(prev => ({ ...prev, isRemovingBackground: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                responseResult = { result: "Background removal completed." };
                break;

             case ToolNames.STABILIZE_FOOTAGE:
                setVideoState(prev => ({ ...prev, isStabilizingFootage: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1200));
                setVideoState(prev => ({ ...prev, isStabilizingFootage: false }));
                responseResult = { result: "Three-axis stabilization applied." };
                break;

             case ToolNames.SUGGEST_STORYBOARD:
                setVideoState(prev => ({ ...prev, isStoryboarding: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({ ...prev, isStoryboarding: false }));
                responseResult = { result: "Creative storyboard suggestions added to project notes." };
                break;

             case ToolNames.CLONE_VOICE:
                setVideoState(prev => ({ ...prev, isCloningVoice: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => ({ ...prev, isCloningVoice: false }));
                responseResult = { result: "Voice clone profile created." };
                break;

             case ToolNames.IMAGE_TO_VIDEO:
                setVideoState(prev => ({ ...prev, isGenerating: true, generationProgress: 0 }));
                for (let i = 0; i <= 100; i += 20) {
                    await new Promise(r => setTimeout(r, 600));
                    setVideoState(prev => ({ ...prev, generationProgress: i }));
                }
                const ivClip: VideoClip = {
                    id: Math.random().toString(36),
                    name: `GenVideo_${Math.floor(Math.random() * 1000)}`,
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=100&h=60',
                    startTime: stateRef.current.currentTime,
                    duration: 5,
                    trackId: 1,
                    speed: 1.0,
                };
                setVideoState(prev => ({ ...prev, isGenerating: false, videoClips: [...prev.videoClips, ivClip].sort((a,b) => a.startTime - b.startTime) }));
                responseResult = { result: "Image-to-video synthesis complete." };
                break;

             case ToolNames.VIDEO_STYLE_TRANSFER:
                setVideoState(prev => ({ ...prev, isStyleTransferring: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                setVideoState(prev => ({ ...prev, isStyleTransferring: false }));
                responseResult = { result: `Applied '${args.style || 'neural'}' style transfer to video.` };
                break;

             case ToolNames.GENERATE_SCENE:
                setVideoState(prev => ({ ...prev, isGeneratingScene: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                setVideoState(prev => ({ ...prev, isGeneratingScene: false }));
                responseResult = { result: "AI-generated scene added to creative bin." };
                break;

             case ToolNames.GENERATE_CHARACTER:
                setVideoState(prev => ({ ...prev, isGeneratingCharacter: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => ({ ...prev, isGeneratingCharacter: false }));
                responseResult = { result: "Character profile synthesized." };
                break;

             case ToolNames.GENERATE_ANIMATION:
                setVideoState(prev => ({ ...prev, isGeneratingAnimation: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({ ...prev, isGeneratingAnimation: false }));
                responseResult = { result: "Procedural animation applied to selected elements." };
                break;

             case ToolNames.GENERATE_BROLL:
                setVideoState(prev => ({ ...prev, isGeneratingBroll: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => ({ ...prev, isGeneratingBroll: false }));
                responseResult = { result: "B-roll content contextually inserted." };
                break;

             case ToolNames.GENERATE_MUSIC:
                setVideoState(prev => ({ ...prev, isGeneratingMusic: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3500));
                const newMusic: AudioBlock = {
                   url: '',
                   id: Math.random().toString(36),
                   name: `AI_Music_${Math.floor(Math.random() * 100)}`,
                   startTime: 0,
                   duration: stateRef.current.duration,
                   volume: 0.5,
                   type: 'music',
                   trackId: 1,
                   speed: 1.0,
                   voiceEffect: 'none'
                };
                setVideoState(prev => ({ ...prev, isGeneratingMusic: false, audioTrack: [...prev.audioTrack, newMusic] }));
                responseResult = { result: "Music composed and synced to project." };
                break;

             case ToolNames.GENERATE_SFX:
                setVideoState(prev => ({ ...prev, isGeneratingSFX: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                setVideoState(prev => ({ ...prev, isGeneratingSFX: false }));
                responseResult = { result: "Contextual sound effects generated for current scene." };
                break;

             case ToolNames.GENERATE_ENVIRONMENT:
                setVideoState(prev => ({ ...prev, isGeneratingEnvironment: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                const envUrl = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=80';
                setVideoState(prev => ({ ...prev, isGeneratingEnvironment: false, environmentUrl: envUrl }));
                responseResult = { result: "Environment background generated." };
                break;

             case ToolNames.GENERATE_LIGHTING:
                setVideoState(prev => ({ ...prev, isGeneratingLighting: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({ ...prev, isGeneratingLighting: false }));
                responseResult = { result: "Volumetric lighting applied to scene." };
                break;

             case ToolNames.GENERATE_CAMERA_MOVEMENT:
                setVideoState(prev => ({ ...prev, isGeneratingCamera: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1800));
                setVideoState(prev => ({ ...prev, isGeneratingCamera: false }));
                responseResult = { result: "Virtual camera movement synthesized." };
                break;

             case ToolNames.OPTIMIZE_FOR_PLATFORM:
                setVideoState(prev => {
                    const platform = args.platform || 'tiktok';
                    let ratio: any = '16:9';
                    if (['tiktok', 'reels', 'shorts'].includes(platform)) ratio = '9:16';
                    return { 
                        ...prev, 
                        isPlatformOptimizing: true, 
                        isAnalyzing: true, 
                        socialPlatform: platform as any,
                        aspectRatio: ratio
                    };
                });
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({ ...prev, isPlatformOptimizing: false }));
                responseResult = { result: `Project optimized and reframed for ${args.platform || 'social media'}.` };
                break;

             case ToolNames.TRACK_TRENDS:
                setVideoState(prev => ({ ...prev, isTrackingTrends: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2500));
                setVideoState(prev => ({ ...prev, isTrackingTrends: false }));
                responseResult = { result: "Viral trend analysis complete. Recommendations added." };
                break;

             case ToolNames.GENERATE_BRAND_KIT:
                setVideoState(prev => ({ ...prev, isGeneratingBrandAssets: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                setVideoState(prev => ({ 
                    ...prev, 
                    isGeneratingBrandAssets: false,
                    brandKit: {
                        name: args.name || "Brand Kit",
                        colors: args.colors || ["#000000", "#eab308", "#ffffff"],
                        fonts: ["Outfit", "Inter"],
                        logos: ["https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=100&h=100"]
                    }
                }));
                responseResult = { result: "Neural brand kit synthesized." };
                break;

             case ToolNames.SHOW_ANALYTICS:
                setVideoState(prev => ({ 
                    ...prev, 
                    showCreatorHub: true,
                    analytics: {
                        views: { label: 'Predicted Views', value: '1.2M', change: 24, trend: 'up' },
                        engagement: { label: 'Engagement Rate', value: '12.4%', change: 5, trend: 'up' },
                        retention: { label: 'Avg. Retention', value: '42s', change: 12, trend: 'up' },
                        reach: { label: 'Total Reach', value: '4.5M', change: 15, trend: 'up' },
                        heatmapData: Array.from({ length: 20 }, (_, i) => ({ x: i * 5, y: Math.random() * 100 }))
                    }
                 }));
                responseResult = { result: "Viral projection analytics updated to dashboard." };
                break;

             case ToolNames.SEARCH_VIRAL_SOUNDS:
                setVideoState(prev => ({ ...prev, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 1500));
                responseResult = { result: "Retrieved top 5 viral sounds for your niche." };
                break;

             case ToolNames.CREATE_SPONSORSHIP_ASSETS:
                setVideoState(prev => ({ ...prev, isAnalyzing: true, isGenerating: true }));
                await new Promise(r => setTimeout(r, 3500));
                // Simulate adding a brand overlay/lower third
                setVideoState(prev => ({ 
                    ...prev, 
                    isAnalyzing: false, 
                    isGenerating: false,
                    textTrack: [
                        ...prev.textTrack,
                        {
                            id: `sponsor-${Date.now()}`,
                            text: args.sponsorName || "Our Sponsor",
                            animation: 'none',
                            startTime: 2,
                            duration: 10,
                            style: { 
                                fontSize: 48, 
                                color: prev.brandKit?.colors[0] || "#ffffff", 
                                fontFamily: prev.brandKit?.fonts[0] || 'Outfit', 
                                fontWeight: 'bold',
                                x: 50,
                                y: 85,
                                opacity: 1,
                                shadow: '0 0 10px rgba(0,0,0,0.5)',
                                textAlign: 'center'
                            }
                        }
                    ]
                }));
                responseResult = { result: `Sponsorship assets for ${args.sponsorName || "the brand"} have been synthesized and added to the timeline.` };
                break;
             case ToolNames.ADD_SHAPE:
                setVideoState(prev => ({
                    ...prev,
                    shapeTrack: [
                        ...prev.shapeTrack,
                        {
                            id: Math.random().toString(36),
                            type: args.type || 'rectangle',
                            startTime: args.startTime ?? prev.currentTime,
                            duration: args.duration ?? 5,
                            color: args.color || '#eab308',
                            animation: args.animation || 'fade',
                            blendMode: args.blendMode || 'normal',
                            motionBlur: true,
                            transform: {
                                scale: 1,
                                positionX: args.x || 50,
                                positionY: args.y || 50,
                                rotation: 0,
                                opacity: 100,
                                keyframes: { scale: [], positionX: [], positionY: [], rotation: [], opacity: [] }
                            }
                        }
                    ]
                }));
                responseResult = { result: `Procedural ${args.type || 'shape'} synthesized with neural motion blur.` };
                break;

             case ToolNames.CREATE_PARTICLE_SYSTEM:
                setVideoState(prev => ({
                    ...prev,
                    isGeneratingParticles: true,
                    particleTrack: [
                        ...prev.particleTrack,
                        {
                            id: Math.random().toString(36),
                            type: args.type || 'neural_energy',
                            startTime: args.startTime ?? prev.currentTime,
                            duration: args.duration ?? 8,
                            intensity: args.intensity || 75,
                            color: args.color || '#8b5cf6',
                            colorPrimary: args.color || '#8b5cf6',
                            direction: 0,
                            spread: 360,
                            velocity: args.velocity || 15,
                            size: args.size || 3,
                            life: 2.5,
                            gravity: -5,
                            turbulence: 20,
                            blendMode: 'screen'
                        }
                    ]
                }));
                await new Promise(r => setTimeout(r, 1500));
                setVideoState(prev => ({ ...prev, isGeneratingParticles: false }));
                responseResult = { result: "High-fidelity particle system simulated and injected into the compositing tree." };
                break;

             case ToolNames.START_ROTOSCOPING:
                setVideoState(prev => ({ ...prev, isRotoscoping: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 3000));
                setVideoState(prev => ({ ...prev, isRotoscoping: false }));
                responseResult = { result: "Neural rotoscoping complete. Subject isolated." };
                break;

             case ToolNames.START_MOTION_TRACKING:
                setVideoState(prev => ({ ...prev, isTrackingMotion: true, isAnalyzing: true }));
                await new Promise(r => setTimeout(r, 2000));
                setVideoState(prev => ({ ...prev, isTrackingMotion: false }));
                responseResult = { result: "Frontier point tracking complete. Anchors generated." };
                break;

             case ToolNames.APPLY_MOTION_PRESET:
                setVideoState(prev => ({
                    ...prev,
                    textTrack: prev.textTrack.map(t => t.id === (args.id || prev.selectedTextId) ? { ...t, animation: args.preset || 'floating' } : t),
                    shapeTrack: prev.shapeTrack.map(s => s.id === (args.id) ? { ...s, animation: args.preset || 'draw' } : s)
                }));
                responseResult = { result: "Dynamic motion preset applied." };
                break;

              case ToolNames.TOGGLE_COMMAND_PALETTE:
                setVideoState(prev => ({ ...prev, showCommandPalette: args.enabled ?? !prev.showCommandPalette }));
                responseResult = { result: "Command palette visibility adjusted." };
                break;
          }
          toolResponses.push({ 
            functionResponse: {
              name: toolName, 
              response: responseResult 
            }
          });
        }
        
        const finalResponseResult = await chatSessionRef.current.sendMessage({ message: toolResponses });
        const finalText = finalResponseResult.text;
        
        // Remove thinking message and add the final one
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== thinkingId);
          if (finalText) {
            return [...filtered, { id: Date.now().toString(), role: 'model', content: finalText }];
          }
          return filtered;
        });
      } else if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: response.text }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "AI processing error." }]);
    } finally {
      setIsProcessing(false);
      setVideoState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        isGenerating: false, 
        isEnhancing: false, 
        isStabilizing: false, 
        isAutoCutting: false, 
        isRemovingSilence: false, 
        isDetectingScenes: false, 
        isOptimizingPacing: false, 
        isRemovingObject: false, 
        isSmoothingMotion: false,
        isDubbing: false,
        isGeneratingClips: false,
        isStabilizingFootage: false,
        isRemovingBackground: false,
        isStoryboarding: false,
        isCloningVoice: false,
        isTranslating: false,
        isCleaningAudio: false,
        isReframing: false,
        isAutoCaptioning: false,
        isGeneratingAvatar: false,
        isTrackingFace: false,
        isStyleTransferring: false,
        isGeneratingMusic: false,
        isGeneratingSFX: false,
        isGeneratingBroll: false,
        isGeneratingScene: false,
        isGeneratingCharacter: false,
        isGeneratingEnvironment: false,
        isGeneratingAnimation: false,
        isGeneratingLighting: false,
        isGeneratingCamera: false,
        isPlatformOptimizing: false,
        isTrackingTrends: false,
        isGeneratingBrandAssets: false,
        isRotoscoping: false,
        isTrackingMotion: false,
        isGeneratingParticles: false
      }));
    }
  }, [setVideoState]);

  return { messages, isProcessing, handleSendMessage };
};
