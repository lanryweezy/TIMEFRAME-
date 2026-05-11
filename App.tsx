
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVideoEditor } from './hooks/useVideoEditor';
import { useAIController } from './hooks/useAIController';
import VideoPlayer from './components/VideoPlayer';
import Timeline from './components/Timeline';
import AIChat from './components/AIChat';
import EditorSidebar from './components/EditorSidebar';
import PropertiesPanel from './components/PropertiesPanel';
import Header from './components/Header';
import ExportOverlay from './components/ExportOverlay';
import CommandPalette from './components/CommandPalette';
import { GenerativeEngine } from './components/GenerativeEngine';
import { ShortcutManager } from './components/ShortcutManager';
import { DraftManager } from './components/DraftManager';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import { AssetUniverse } from './components/AssetUniverse';
import { LandingPage } from './components/LandingPage';
import { RightPanelTab, SubtitleBlock, EffectBlock, EffectType, VideoState, ProjectFormat, ProjectTemplate } from './types';
import { Settings2, MessageSquare } from 'lucide-react';

import { saveProject, loadProject } from './constants';
import { saveProjectDraft } from './services/indexedDbService';
import { INITIAL_STATE, INITIAL_CHAT_MESSAGE } from './constants';
import { useAudioLifecycle } from './hooks/useAudioLifecycle';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const MemoizedEditorSidebar = React.memo(EditorSidebar, (prev, next) => {
  // Only re-render if essential state changes, ignore playhead
  return prev.state.activeMode === next.state.activeMode &&
         prev.state.activeFilter === next.state.activeFilter &&
         prev.state.isAnalyzing === next.state.isAnalyzing &&
         prev.state.projectName === next.state.projectName;
});

const MemoizedHeader = React.memo(Header, (prev, next) => {
  return prev.projectName === next.projectName &&
         prev.canUndo === next.canUndo &&
         prev.canRedo === next.canRedo;
});

const MemoizedAIChat = React.memo(AIChat, (prev, next) => {
  return prev.messages === next.messages && prev.isProcessing === next.isProcessing;
});

const MemoizedPropertiesPanel = React.memo(PropertiesPanel, (prev, next) => {
  // Only re-render if selected items change or their properties change
  return prev.state.selectedClipId === next.state.selectedClipId &&
         prev.state.selectedTextId === next.state.selectedTextId &&
         prev.state.selectedShapeId === next.state.selectedShapeId &&
         prev.state.selectedParticleId === next.state.selectedParticleId &&
         prev.state.transform === next.state.transform &&
         prev.state.adjustment === next.state.adjustment;
});

const MemoizedVideoPlayer = React.memo(VideoPlayer, (prev, next) => {
    return prev.state.currentTime === next.state.currentTime &&
           prev.state.duration === next.state.duration &&
           prev.state.isPlaying === next.state.isPlaying &&
           prev.state.aspectRatio === next.state.aspectRatio &&
           prev.state.activeFilter === next.state.activeFilter &&
           prev.state.videoClips === next.state.videoClips &&
           prev.state.textTrack === next.state.textTrack;
});

const MemoizedTimeline = React.memo(Timeline, (prev, next) => {
    return prev.state.videoClips === next.state.videoClips &&
           prev.state.audioTrack === next.state.audioTrack &&
           prev.state.textTrack === next.state.textTrack &&
           prev.state.currentTime === next.state.currentTime &&
           prev.state.zoomLevel === next.state.zoomLevel &&
           prev.state.activeSequenceId === next.state.activeSequenceId &&
           prev.state.markers === next.state.markers &&
           prev.state.regions === next.state.regions;
});

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'editor' | 'settings' | 'assets' | 'generative' | 'vfx' | 'audio'>('landing');

  const { 
    state, 
    setState, 
    handleTimeUpdate, 
    togglePlay, 
    handleSplit, 
    handleTrim, 
    handleMove,
    handleDelete, 
    handleAddText, 
    handleUpdateTextProperty,
    handleUpdateClipProperty,
    handleUpdateAudioProperty,
    handleSelectClip,
    handleSelectItems,
    handleAddAudio,
    handleToggleKeyframe,
    handleMoveKeyframe,
    handleUpdateTransform,
    handleEnhance,
    handleStabilize,
    handleSyncAudio,
    handleGroupSelected,
    handleAddAdjustmentLayer,
    handleMultiCamSwitch,
    handleAutoResize,
    handleUndo,
    handleRedo,
    commitHistory,
    handleEnterSequence,
    handleExitSequence,
    handleUpdateShapeProperty,
    handleUpdateParticleProperty,
    handleUpdateKeyframeEasing,
    handleAddClip,
    handleExport,
    handleToggleProxy,
    handleOptimizePacing,
    handleResetExport,
    handleResetProject,
    handleDuplicate,
    handleToggleLockTrack,
    handleRenameTrack,
    handleUpdateTrackHeight
  } = useVideoEditor();

  const { handleInteraction } = useAudioLifecycle(state);

  useKeyboardShortcuts();

  useEffect(() => {
    localStorage.clear();
  }, []);
  
  const { messages, isProcessing, handleSendMessage } = useAIController(state, setState);
  const [rightPanel, setRightPanel] = useState<RightPanelTab>('assistant');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Dashboard handlers
  const handleOpenProject = (projectState: VideoState) => {
    setState(projectState);
    setView('editor');
  };

  const handleNewProject = (format: ProjectFormat, template: ProjectTemplate) => {
    setState({ 
      ...INITIAL_STATE, 
      projectName: 'Untitled Project',
      projectSettings: {
        ...INITIAL_STATE.projectSettings,
        resolution: format.dimensions
      }
    });
    setView('editor');
  };

  useEffect(() => {
    if (view !== 'editor') return;
      
    // Only auto-save if something important changed (not just cursor positions)
    // We use a timeout to debounce and show status
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      try {
        saveProject(state);
        saveProjectDraft(state.projectName || "project", state);
        setSaveStatus('saved');
      } catch (e) {
        setSaveStatus('error');
      }
    }, 10000); // Increased to 10s to be less aggressive

    return () => clearTimeout(timer);
  }, [
    state.videoClips, 
    state.audioTrack, 
    state.textTrack, 
    state.subtitleTrack, 
    state.adjustment, 
    state.transform, 
    state.projectName,
    view
  ]);

  const handleApplyTemplate = (template: string) => {
      handleSendMessage(`Apply the ${template} template to my project.`);
  };

  const handleClearSelection = useCallback(() => {
    setState(prev => {
      if (!prev.selectedTextId && !prev.selectedClipId && !prev.selectedShapeId && !prev.selectedParticleId) return prev;
      return { ...prev, selectedTextId: undefined, selectedClipId: undefined, selectedShapeId: undefined, selectedParticleId: undefined };
    });
  }, [setState]);

  const handleSelectClipInTimeline = useCallback((id: string) => {
    if (id === 'detect-scenes-trigger') {
        handleSendMessage("Find the scenes in my video.");
        return;
    }
    handleSelectItems([id], false);
    setRightPanel('properties');
  }, [handleSendMessage, handleSelectItems]);

  return (
    <div 
      className={`flex h-screen w-screen bg-studio-bg text-studio-text select-none overflow-hidden font-sans relative ${state.isAnalyzing ? 'chromatic-aberration' : ''}`}
      onClick={handleInteraction}
    >
          {view === 'landing' && <LandingPage onStart={() => setView('dashboard')} />}
          {view === 'dashboard' && <Dashboard onNewProject={handleNewProject} onOpenProject={handleOpenProject} onOpenSettings={() => setView('settings')} />}
          {view === 'settings' && <Settings onClose={() => setView('dashboard')} />}
          {view === 'assets' && <AssetUniverse state={state} />}
          {view === 'editor' && (
            <>
              {/* Cinematic Frame */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 opacity-50" />
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/20" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/20" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/20" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20" />

      {/* Cinematic Background Grid */}
      <div className="absolute inset-0 studio-grid pointer-events-none opacity-[0.05]" />
      <div className="absolute inset-0 studio-grid-fine pointer-events-none opacity-[0.02]" />
      
      {/* Global Processing Scanline */}
      {state.isDetectingScenes && <div className="processing-scanline" />}

      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="z-30"
      >
        <MemoizedEditorSidebar 
          state={state}
          onSetMode={(mode) => setState(prev => ({ ...prev, activeMode: mode, selectedTextId: undefined, selectedClipId: undefined }))}
          onAddText={handleAddText} 
          onAddAudio={handleAddAudio}
          onUpdateAudio={handleUpdateAudioProperty}
          onSetFilter={(f) => setState(prev => ({ ...prev, activeFilter: f }))}
          onUpdateDucking={(enabled, ratio) => setState(prev => ({ ...prev, audioSettings: { duckingEnabled: enabled, duckingRatio: ratio } }))}
          onAddSubtitle={() => handleSendMessage("Add subtitles to my video.")}
          onAddClip={handleAddClip}
          onAddEffect={(type) => {
              if (type as string === 'none') {
                  handleSendMessage("Remove the background from the video.");
                  return;
              }
              const newFx: EffectBlock = {
                  id: Math.random().toString(36),
                  type: type as EffectType,
                  startTime: state.currentTime,
                  duration: 5,
                  intensity: 50
              };
              setState(prev => ({ ...prev, effectTrack: [...prev.effectTrack, newFx] }));
          }}
          onFabricate={(prompt, type) => {
              const command = type === 'video' ? `Generate a video scene: ${prompt}` : `Generate an image: ${prompt}`;
              handleSendMessage(command);
          }}
          handleSendMessage={handleSendMessage}
          onSetAspectRatio={(ratio) => setState(prev => ({ ...prev, aspectRatio: ratio }))}
          onSetSocialPlatform={(platform) => setState(prev => ({ ...prev, socialPlatform: platform }))}
          onApplyTemplate={handleApplyTemplate}
          onUpdateBeatSync={(settings) => setState(prev => ({ ...prev, beatSync: { ...prev.beatSync, ...settings } }))}
          onGenerateAvatar={() => handleSendMessage("Generate an AI Avatar for my video.")}
          onToggleFaceTracking={() => handleSendMessage("Enable face tracking on the current clip.")}
          onAIStoryteller={() => {
              const text = prompt("Enter text for AI Voiceover:");
              if (text) handleSendMessage(`Generate an AI voiceover for this text: ${text}`);
          }}
          onAutoResize={handleAutoResize}
          onAddAdjustmentLayer={handleAddAdjustmentLayer}
          onToggleProxy={handleToggleProxy}
          onToggleMultiCam={() => setState(prev => ({ ...prev, multiCamMode: !prev.multiCamMode }))}
          onOptimizeForPlatform={(p) => handleSendMessage(`Optimize my project for ${p}.`)}
          onTrackTrends={(p) => handleSendMessage(`Analyze current viral trends for ${p} and suggest optimizations.`)}
          onSearchViralSounds={(p) => handleSendMessage(`Search for trending viral sounds for my project niche on ${p}.`)}
        />
      </motion.div>

      <div className="flex-1 flex flex-col min-w-0 relative" onClick={handleClearSelection}>
        <MemoizedHeader 
          projectName={state.projectName} 
          onProjectNameChange={(name) => setState(prev => ({ ...prev, projectName: name }))}
          onExport={handleExport} 
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={handleResetProject}
          onToggleCreatorHub={() => setState(prev => ({ ...prev, showCreatorHub: !prev.showCreatorHub }))}
          onToggleCommandPalette={() => setState(prev => ({ ...prev, showCommandPalette: !prev.showCommandPalette }))}
          onOptimize={() => handleSendMessage("Make my video fix horizontal and vertical sizes.")}
          canUndo={state.history.past.length > 0}
          canRedo={state.history.future.length > 0}
        />

        <div className="flex-1 flex justify-center items-center bg-[#0a0a0a] relative overflow-hidden">
          <MemoizedVideoPlayer 
            state={state} 
            onTimeUpdate={handleTimeUpdate} 
            onDurationChange={(d) => setState(prev => ({...prev, duration: d}))} 
            onTogglePlay={togglePlay}
            onSelectText={(id) => {
                setState(prev => ({ ...prev, selectedTextId: id, selectedClipId: undefined }));
                setRightPanel('properties');
            }}
            onMultiCamSelect={handleMultiCamSwitch}
          />
        </div>

        <div className="h-56 bg-zinc-950/20 backdrop-blur-md z-20 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
          <MemoizedTimeline 
            state={state} 
            onSeek={handleTimeUpdate} 
            onSplit={handleSplit} 
            onDelete={handleDelete} 
            onDuplicate={handleDuplicate}
            onLockTrack={handleToggleLockTrack}
            onRenameTrack={handleRenameTrack}
            onUpdateTrackHeight={handleUpdateTrackHeight}
            onTrim={handleTrim} 
            onMove={handleMove}
            onSelectClip={handleSelectClipInTimeline}
            onSelectItems={handleSelectItems}
            onCommitHistory={commitHistory}
            onSelectShape={(id) => {
                setState(prev => ({ ...prev, selectedShapeId: id, selectedTextId: undefined, selectedClipId: undefined, selectedParticleId: undefined }));
                setRightPanel('properties');
            }}
            onSelectParticle={(id) => {
                setState(prev => ({ ...prev, selectedParticleId: id, selectedTextId: undefined, selectedClipId: undefined, selectedShapeId: undefined }));
                setRightPanel('properties');
            }}
            onUpdateClipFade={(id, updates) => handleUpdateClipProperty(id, updates)}
            onUpdateVolume={(id, volume) => {
              const clip = state.videoClips.find(c => c.id === id);
              if (clip) {
                handleUpdateClipProperty(id, { audio: { ...(clip.audio || { pan: 0, eq: { low: 100, mid: 100, high: 100 }, voiceClarity: false, voiceIsolation: 0, spectralRepair: false, loudnessStandard: 'EBU_R128' }), volume } });
              } else {
                handleUpdateAudioProperty(id, { volume });
              }
            }}
            onMoveKeyframe={handleMoveKeyframe}
            onZoom={(level) => setState(prev => ({ ...prev, zoomLevel: level }))}
            onFitAll={() => {}}
            onFitSelection={() => {}}
            onAddMarker={(time, label, color) => setState(prev => ({ ...prev, markers: [...prev.markers, { id: Math.random().toString(36), time, label, color }] }))}
            onAddRegion={(startTime, endTime, label, color) => setState(prev => ({ ...prev, regions: [...prev.regions, { id: Math.random().toString(36), startTime, endTime, label, color }] }))}
            onAnalyzeTimeline={() => {
                handleOptimizePacing();
                handleSendMessage("Optimizing timeline pacing based on beat markers and cinematic flow.");
            }}
            onSummarizeTimeline={() => {
                const prompt = `Summarize the following timeline structure for a video project:
                - Number of video clips: ${state.videoClips.length}
                - Number of audio tracks: ${state.audioTrack.length}
                - Markers at: ${state.markers.map(m => `${m.label} (${m.time.toFixed(1)}s)`).join(', ')}
                Provide a structured summary and outline for potential storyboard improvements.`;
                handleSendMessage(prompt);
            }}
            onGenerateRoughCut={() => handleSendMessage(`Generate a rough cut by arranging the available clips based on markers ${state.markers.map(m => m.label).join(', ')}.`)}
            onUpdateSnapSettings={(settings) => setState(prev => ({ ...prev, snapSettings: settings }))}
            onToggleMagnetic={() => setState(prev => ({ ...prev, magneticTimeline: !prev.magneticTimeline }))}
            onToggleRipple={() => setState(prev => ({ ...prev, rippleEdit: !prev.rippleEdit }))}
            onSyncAudio={handleSyncAudio}
            onGroupSelected={handleGroupSelected}
            onEnterSequence={handleEnterSequence}
            onExitSequence={handleExitSequence}
          />
        </div>
      </div>

      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="w-56 bg-zinc-950/20 backdrop-blur-md flex flex-col z-30 border-l border-white/5" 
        onClick={(e) => e.stopPropagation()}
      >
         <div className="flex bg-white/5 mx-6 mt-6 rounded-xl overflow-hidden p-1 gap-1">
           <button onClick={() => setRightPanel('properties')} className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-lg transition-all ${rightPanel === 'properties' ? 'text-studio-accent bg-white/5 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>
               <Settings2 className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-inherit">Properties</span>
           </button>
           <button onClick={() => setRightPanel('assistant')} className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-lg transition-all ${rightPanel === 'assistant' ? 'text-studio-accent bg-white/5 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>
               <MessageSquare className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-inherit">Assistant</span>
           </button>
           <button onClick={() => setRightPanel('shortcuts')} className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-lg transition-all ${rightPanel === 'shortcuts' ? 'text-studio-accent bg-white/5 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>
               <Settings2 className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-inherit">Shortcuts</span>
           </button>
         </div>
         <div className="flex-1 overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div 
               key={rightPanel}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.05 }}
               className="h-full"
             >
               {rightPanel === 'assistant' ? (
                <MemoizedAIChat messages={messages} onSendMessage={handleSendMessage} isProcessing={isProcessing} />
               ) : rightPanel === 'properties' ? (
                <MemoizedPropertiesPanel 
                  state={state}
                  onChangeTransform={(t) => setState(prev => ({...prev, transform: t}))}
                  onUpdateTransformProperty={handleUpdateTransform}
                  onChangeAdjustment={(a) => setState(prev => ({...prev, adjustment: a}))}
                  onToggleKeyframe={handleToggleKeyframe}
                  onChangeChromaKey={(c) => setState(prev => ({...prev, chromaKey: c}))}
                  onUpdateText={handleUpdateTextProperty}
                  onUpdateClip={handleUpdateClipProperty}
                  onEnhance={handleEnhance}
                  onStabilize={handleStabilize}
                  onUpdateShape={handleUpdateShapeProperty}
                  onUpdateParticle={handleUpdateParticleProperty}
                  onUpdateKeyframeEasing={handleUpdateKeyframeEasing}
                />
               ) : rightPanel === 'shortcuts' ? (
                <ShortcutManager />
               ) : (
                <DraftManager onSelectDraft={(s) => setState(prev => ({...prev, ...s}))} />
               )}

             </motion.div>
           </AnimatePresence>
         </div>
      </motion.div>

      <AnimatePresence>
        {state.showCreatorHub && (
          <GenerativeEngine 
            state={state} 
            onSendMessage={handleSendMessage}
            onClose={() => setState(prev => ({ ...prev, showCreatorHub: false }))} 
          />
        )}

        {state.showCommandPalette && (
          <CommandPalette 
            state={state} 
            handleSendMessage={handleSendMessage} 
            onClose={() => setState(prev => ({ ...prev, showCommandPalette: true }))}
            onModeChange={(mode) => setState(prev => ({ ...prev, activeMode: mode }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.isGenerating && (
          <ExportOverlay 
            state={state} 
            onClose={handleResetExport} 
            onSeek={handleTimeUpdate}
            onDownload={() => {
              alert("Downloading Final Video...");
              handleResetExport();
            }} 
          />
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};

export default App;
