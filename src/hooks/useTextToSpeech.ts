
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
  const [isSupported] = useState(() => safeTextToSpeech.isAvailable());

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!text.trim()) return false;

    setIsSpeaking(true);
    
    const success = safeTextToSpeech.speak(text, {
      ...options,
      interrupt: options.interrupt ?? true
    });

    if (success) {
      // Set speaking to false after a reasonable delay
      // Note: We can't reliably detect when speech ends without proper event handling
      setTimeout(() => {
        setIsSpeaking(false);
      }, text.length * 50); // Rough estimate based on text length
    } else {
      setIsSpeaking(false);
    }

    return success;
  }, []);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
  }, []);

  const getVoices = useCallback(() => {
    return safeTextToSpeech.getVoices();
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: safeTextToSpeech.isAvailable(),
    getVoices
  };
};
