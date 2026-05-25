import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVideoEditor } from '../hooks/useVideoEditor';
import { useAIController } from '../hooks/useAIController';
import { useAudioLifecycle } from '../hooks/useAudioLifecycle';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useVideoStore } from '../store/videoStore';
import { saveProject } from '../constants';
import { saveProjectDraft } from '../services/indexedDbService';

import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import EditorSidebar from './EditorSidebar';
import Header from './Header';
import VideoPlayer from './VideoPlayer';
import AIChat from './AIChat';
import PropertiesPanel from './PropertiesPanel';
import ExportOverlay from './ExportOverlay';
import CommandPalette from './CommandPalette';
import { GenerativeLab } from './GenerativeLab';
import { ShortcutManager } from './ShortcutManager';
import { SystemTray } from './SystemTray';
import { DraftManager } from './DraftManager';
import { DockablePanel } from './ui/DockablePanel';
import { DirectorWheel } from './video-player/DirectorWheel';
import { RightPanelTab, EffectBlock, EffectType } from '../types';
import { Settings2, MessageSquare, Eye, Layout } from 'lucide-react';
import { VirtualizedTimeline } from './VirtualizedTimeline';
import VFXLab from './VFXLab';
import { AudioLab } from './AudioLab';
import { VideoScopes } from './video-player/VideoScopes';
import { ExportLab } from './ExportLab';
import { ColorLab } from './ColorLab';
import { SceneDetector } from './SceneDetector';
import { ReviewLab } from './ReviewLab';
import { SourceMonitor } from './SourceMonitor';

export const EditorView: React.FC = () => {
  const store = useVideoStore();
  const { ui } = store;
  const [showSourceMonitor, setShowSourceMonitor] = useState(false);

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
    handleUpdateTrackHeight,
    handleJumpToHistory,
  } = useVideoEditor();

  const { handleInteraction } = useAudioLifecycle(state as any);
  useKeyboardShortcuts();
  const { messages, isProcessing, handleSendMessage } = useAIController();

  const [rightPanel, setRightPanel] = useState<RightPanelTab>('properties');
  const panels = ui.panels;

  const selectedAsset = state.assetManager?.library?.find((a: any) => a.id === state.selectedAssetId);

  const handleClearSelection = useCallback(() => {
    setState((prev: any) => ({
      ...prev,
      selectedTextId: undefined,
      selectedClipId: undefined,
      selectedShapeId: undefined,
      selectedParticleId: undefined,
    }));
  }, [setState]);

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-app-bg text-white overflow-hidden font-sans">
        <WorkspaceSwitcher />

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Left: Library & Global Tools */}
          <AnimatePresence>
          {panels['sidebar-left'].isVisible && (
            <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: 280, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="border-r border-panel-border bg-panel-base/90 backdrop-blur-xl z-30 shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full">
              <EditorSidebar
                state={state}
                onSetMode={(mode: any) =>
                  setState((prev: any) => ({
                    ...prev,
                    activeMode: mode,
                    selectedTextId: undefined,
                    selectedClipId: undefined,
                  }))
                }
                onAddText={handleAddText}
                onAddAudio={handleAddAudio}
                onUpdateAudio={handleUpdateAudioProperty}
                onSetFilter={(f: any) => setState((prev: any) => ({ ...prev, activeFilter: f }))}
                handleSendMessage={handleSendMessage}
                onUpdateClip={handleUpdateClipProperty}
                onJumpToHistory={handleJumpToHistory}
                onAutoResize={handleAutoResize}
                onAddAdjustmentLayer={handleAddAdjustmentLayer}
                onToggleProxy={handleToggleProxy}
                onAddClip={handleAddClip as any}
                onAddSubtitle={() => {}}
                onAddEffect={() => {}}
                onFabricate={() => {}}
                onUpdateDucking={() => {}}
                onSetAspectRatio={() => {}}
                onSetSocialPlatform={() => {}}
                onApplyTemplate={() => {}}
                onUpdateBeatSync={() => {}}
                onGenerateAvatar={() => {}}
                onToggleFaceTracking={() => {}}
                onAIStoryteller={() => {}}
                onToggleMultiCam={() => {}}
                onOptimizeForPlatform={() => {}}
                onTrackTrends={() => {}}
                onSearchViralSounds={() => {}}
                onToggleDebugger={() => {}}
              />
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Main Workspace Area */}
          <main className="flex-1 flex flex-col relative min-w-0 bg-black" onClick={handleClearSelection}>
             <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 relative overflow-hidden">
                {/* Dual Monitor Layout (Elite) */}
                {ui.activeWorkspace === 'editing' && showSourceMonitor && (
                  <div className="flex-1 h-full min-w-0">
                    <SourceMonitor 
                      asset={selectedAsset} 
                      onAddToTimeline={(asset, inT, outT) => {
                         handleAddClip({
                            id: crypto.randomUUID(),
                            name: asset.name,
                            url: asset.url,
                            thumbnail: asset.thumbnail,
                            startTime: state.currentTime,
                            duration: outT - inT,
                            trackId: 1,
                            speed: 1,
                         } as any);
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 h-full min-w-0 relative">
                  <VideoPlayer
                    state={state}
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={(d: any) => setState((prev: any) => ({ ...prev, duration: d }))}
                    onTogglePlay={togglePlay}
                    onSelectText={(id: any) => {
                      setState((prev: any) => ({ ...prev, selectedTextId: id, selectedClipId: undefined }));
                      setRightPanel('properties');
                    }}
                  />
                  
                  {ui.activeWorkspace === 'color' && <VideoScopes currentTime={state.currentTime} />}
                </div>

                {/* Dual Monitor Toggle */}
                {ui.activeWorkspace === 'editing' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowSourceMonitor(!showSourceMonitor); }}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-zinc-500 hover:text-white transition-all"
                    title="Toggle Source Monitor"
                  >
                    <Layout className="w-4 h-4" />
                  </button>
                )}
             </div>

             {/* Specialized Interactive Overlays */}
             <AnimatePresence>
                {ui.activeWorkspace === 'vfx' && (
                  <VFXLab 
                    onClose={() => store.applyLayoutPreset('editing')} 
                    selectedClip={state.videoClips.find(c => c.id === state.selectedClipId)}
                    onUpdateClip={handleUpdateClipProperty}
                  />
                )}
                {ui.activeWorkspace === 'audio' && (
                  <AudioLab onClose={() => store.applyLayoutPreset('editing')} />
                )}
                {ui.activeWorkspace === 'color' && (
                  <ColorLab onClose={() => store.applyLayoutPreset('editing')} />
                )}
                {/* review and export are not in activeWorkspace enum but let's keep them if they are handled elsewhere */}
                {(ui.activeWorkspace as string) === 'review' && (
                  <ReviewLab onClose={() => store.applyLayoutPreset('editing')} />
                )}
                {(ui.activeWorkspace as string) === 'export' && (
                  <ExportLab />
                )}
             </AnimatePresence>

             {/* Timeline Area (Elite Virtualized) */}
             {panels['timeline'].isVisible && (
                <div 
                  className="border-t border-panel-border bg-panel-base"
                  style={{ height: panels['timeline'].height }}
                >
                  <VirtualizedTimeline
                    clips={state.videoClips}
                    audioTracks={state.audioTrack}
                    textOverlays={state.textTrack}
                    duration={state.duration}
                    currentTime={state.currentTime}
                    zoomLevel={state.zoomLevel}
                    onClipSelect={(id) => handleSelectItems([id], false)}
                    onClipMove={(id, newTime) => handleUpdateClipProperty(id, { startTime: newTime })}
                    onSeek={handleTimeUpdate}
                    onHydrateRange={store.hydrateTimelineRange}
                    isGraphVirtualized={state.isGraphVirtualized}
                    isHydrating={state.isHydrating}
                  />
                </div>
             )}
          </main>

          {/* Sidebar Right: Professional Inspector */}
          <AnimatePresence>
          {panels['sidebar-right'].isVisible && (
            <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: 320, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="border-l border-panel-border bg-panel-base/90 backdrop-blur-xl z-30 shrink-0 overflow-hidden"
            >
              <div className="w-[320px] h-full flex flex-col">
              <div className="flex bg-white/5 mx-4 mt-4 rounded-xl overflow-hidden p-1 gap-1">
                <button
                  onClick={() => setRightPanel('properties')}
                  className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-lg transition-all ${rightPanel === 'properties' ? 'text-studio-accent bg-white/5 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Settings2 className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-inherit">Properties</span>
                </button>
                <button
                  onClick={() => setRightPanel('assistant')}
                  className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-lg transition-all ${rightPanel === 'assistant' ? 'text-studio-accent bg-white/5 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-inherit">Assistant</span>
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={rightPanel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="h-full"
                  >
                    {rightPanel === 'properties' ? (
                      <PropertiesPanel
                        state={state}
                        onUpdateTransformProperty={handleUpdateTransform}
                        onChangeAdjustment={() => {}}
                        onToggleKeyframe={handleToggleKeyframe}
                        onChangeChromaKey={(c: any) => setState((prev: any) => ({ ...prev, chromaKey: c }))}
                        onUpdateText={handleUpdateTextProperty}
                        onUpdateClip={handleUpdateClipProperty}
                        onEnhance={handleEnhance}
                        onStabilize={handleStabilize}
                        onUpdateShape={handleUpdateShapeProperty}
                        onUpdateParticle={handleUpdateParticleProperty}
                        onUpdateKeyframeEasing={handleUpdateKeyframeEasing}
                      />
                    ) : (
                      <AIChat
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isProcessing={isProcessing}
                        aiActionSandbox={state.aiActionSandbox}
                        onApproveAction={() => {}}
                        onRejectAction={() => {}}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {state.isDetectingScenes && (
          <SceneDetector onClose={() => setState((prev: any) => ({ ...prev, isDetectingScenes: false }))} />
        )}
      </AnimatePresence>

      <CommandPalette 
        state={state}
        handleSendMessage={handleSendMessage}
        onClose={() => {}}
        onModeChange={() => {}}
      />
      <SystemTray state={state} />
      
      <AnimatePresence>
        {(state as any).exporting && (
          <ExportOverlay
            state={state}
            onClose={handleResetExport}
            onSeek={handleTimeUpdate}
            onDownload={() => {
              alert('Downloading Final Video...');
              handleResetExport();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
