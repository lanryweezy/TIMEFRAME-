import { useEffect, useMemo } from 'react';
import { useVideoEditor } from './useVideoEditor';
import { getShortcuts } from '../lib/keyboard';

export const useKeyboardShortcuts = () => {
  const { 
    state, setState, togglePlay, handleSplit, handleDelete, handleUndo, handleRedo, handleTimeUpdate 
  } = useVideoEditor();

  const shortcuts = useMemo(() => getShortcuts(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

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
        handleTimeUpdate(Math.min(state.duration, state.currentTime + (e.shiftKey ? 5 : 1/30)));
      } else if (key === shortcuts.seekBackward) {
        e.preventDefault();
        handleTimeUpdate(Math.max(0, state.currentTime - (e.shiftKey ? 5 : 1/30)));
      } else if (key === shortcuts.modeMedia) {
        setState(prev => ({ ...prev, activeMode: 'media' }));
      } else if (key === shortcuts.modeText) {
        setState(prev => ({ ...prev, activeMode: 'text' }));
      } else if (key === '/') {
        e.preventDefault();
        setState(prev => ({ ...prev, showCommandPalette: true }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, togglePlay, handleSplit, handleDelete, handleUndo, handleRedo, handleTimeUpdate, state.currentTime, state.duration, setState]);
};
