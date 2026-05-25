import { useEffect, useMemo } from 'react';
import { useVideoEditor } from './useVideoEditor';
import { getShortcuts } from '../lib/keyboard';
import { useUIStore } from '../store/videoStore';

export const useKeyboardShortcuts = () => {
  const {
    state,
    setState,
    togglePlay,
    handleSplit,
    handleDelete,
    handleUndo,
    handleRedo,
    handleTimeUpdate,
    handleMultiCamSwitch,
  } = useVideoEditor();

  const { toggleZenMode, applyLayoutPreset } = useUIStore();

  const shortcuts = useMemo(() => getShortcuts(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Workspace/UI Shortcuts
      if (key === 'z' && (e.altKey || e.ctrlKey)) {
        e.preventDefault();
        toggleZenMode();
      } else if (key === '1' && e.altKey) {
        e.preventDefault();
        applyLayoutPreset('editing');
      } else if (key === '2' && e.altKey) {
        e.preventDefault();
        applyLayoutPreset('color');
      } else if (key === '3' && e.altKey) {
        e.preventDefault();
        applyLayoutPreset('audio');
      } else if (key === '4' && e.altKey) {
        e.preventDefault();
        applyLayoutPreset('vfx');
      }

      // Global Shortcuts
      if (key === shortcuts.playPause) {
        e.preventDefault();
        togglePlay();
      } else if (key === shortcuts.split) {
        e.preventDefault();
        handleSplit();
      } else if (key === shortcuts.delete) {
        handleDelete();
      } else if (key === shortcuts.undo && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUndo();
      } else if (key === shortcuts.redo && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRedo();
      } else if (key === shortcuts.seekForward) {
        e.preventDefault();
        handleTimeUpdate(Math.min(state.duration, state.currentTime + (e.shiftKey ? 5 : 1 / 30)));
      } else if (key === shortcuts.seekBackward) {
        e.preventDefault();
        handleTimeUpdate(Math.max(0, state.currentTime - (e.shiftKey ? 5 : 1 / 30)));
      } else if (key === shortcuts.modeMedia) {
        setState((prev) => ({ ...prev, activeMode: 'media' }));
      } else if (key === shortcuts.modeText) {
        setState((prev) => ({ ...prev, activeMode: 'text' }));
      } else if (key === '/') {
        e.preventDefault();
        setState((prev) => ({ ...prev, showCommandPalette: true }));
      }

      // ELITE JKL SCRUBBING
      if (key === 'j') {
        e.preventDefault();
        const currentSpeed = state.playbackSpeed || 1;
        if (currentSpeed >= 0) {
            setState(prev => ({ ...prev, playbackSpeed: -1, isPlaying: true }));
        } else {
            setState(prev => ({ ...prev, playbackSpeed: Math.max(-8, currentSpeed * 2) }));
        }
      } else if (key === 'k') {
        e.preventDefault();
        setState(prev => ({ ...prev, isPlaying: false, playbackSpeed: 1 }));
      } else if (key === 'l') {
        e.preventDefault();
        const currentSpeed = state.playbackSpeed || 1;
        if (currentSpeed <= 0) {
            setState(prev => ({ ...prev, playbackSpeed: 1, isPlaying: true }));
        } else {
            setState(prev => ({ ...prev, playbackSpeed: Math.min(8, currentSpeed * 2) }));
        }
      }

      // ELITE MULTI-CAM SWITCHING
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key) && !e.altKey) {
        e.preventDefault();
        handleMultiCamSwitch(key);
      }

      // Contextual Shortcuts
      if (state.activeMode === 'audio') {
         if (key === 'm') {
            e.preventDefault();
            setState(prev => ({ ...prev, volume: prev.volume === 0 ? 1 : 0 }));
         }
      } else if (state.activeMode === 'color') {
         if (key === 'r') {
            e.preventDefault();
            // Reset active clip color grade if possible
            if (state.selectedClipId) {
               setState(prev => ({
                  ...prev,
                  videoClips: prev.videoClips.map(c => c.id === prev.selectedClipId ? { ...c, colorGrading: undefined } : c)
               }));
            }
         }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    shortcuts,
    togglePlay,
    handleSplit,
    handleDelete,
    handleUndo,
    handleRedo,
    handleTimeUpdate,
    state.currentTime,
    state.duration,
    setState,
  ]);
};
