
import { useState, useCallback } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  interrupt?: boolean;
}

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported] = useState(() => safeTextToSpeech.isAvailable());

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!text.trim()) return false;

    setIsSpeaking(true);
    setIsPaused(false);
    
    const success = safeTextToSpeech.speak(text, {
      ...options,
      interrupt: options.interrupt ?? true
    });

    if (success) {
      // Set speaking to false after a reasonable delay
      // Note: We can't reliably detect when speech ends without proper event handling
      setTimeout(() => {
        setIsSpeaking(false);
        setIsPaused(false);
      }, text.length * 50); // Rough estimate based on text length
    } else {
      setIsSpeaking(false);
      setIsPaused(false);
    }

    return success;
  }, []);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const stopSpeech = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const togglePauseSpeech = useCallback(() => {
    if (isSpeaking) {
      if (isPaused) {
        // Resume speech - Note: Web Speech API doesn't support pause/resume
        // This is a simplified implementation
        setIsPaused(false);
      } else {
        // Pause speech - Note: Web Speech API doesn't support pause/resume
        // This is a simplified implementation
        setIsPaused(true);
      }
    }
  }, [isSpeaking, isPaused]);

  const readAIMessage = useCallback((text: string) => {
    return speak(text, { interrupt: true });
  }, [speak]);

  const getVoices = useCallback(() => {
    return safeTextToSpeech.getVoices();
  }, []);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSpeaking,
    isPaused,
    isSupported: safeTextToSpeech.isAvailable(),
    getVoices
  };
};
