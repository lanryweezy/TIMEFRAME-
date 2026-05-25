import { useEffect, useState, useCallback } from 'react';
import { useVideoEditor } from './useVideoEditor';

export const useVoiceControl = (enabled: boolean = false) => {
  const { togglePlay, handleSplit, handleDelete, handleUndo, handleRedo } = useVideoEditor();
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  const processCommand = useCallback((transcript: string) => {
    const command = transcript.toLowerCase();
    
    if (command.includes('play') || command.includes('stop') || command.includes('pause') || command.includes('resume')) {
      togglePlay();
    } else if (command.includes('split') || command.includes('cut')) {
      handleSplit();
    } else if (command.includes('delete') || command.includes('remove')) {
      handleDelete();
    } else if (command.includes('undo')) {
      handleUndo();
    } else if (command.includes('redo')) {
      handleRedo();
    }
  }, [togglePlay, handleSplit, handleDelete, handleUndo, handleRedo]);

  useEffect(() => {
    if (!enabled || !('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setLastTranscript(transcript);
      processCommand(transcript);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [enabled, processCommand]);

  return { isListening, lastTranscript };
};
