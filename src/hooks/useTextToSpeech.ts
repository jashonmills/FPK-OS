import { useState, useCallback, useEffect } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      safeTextToSpeech.stop();
    };
  }, []);

  const speak = useCallback((text: string, options?: { voice?: string; interrupt?: boolean; hasInteracted?: boolean }) => {
    if (!safeTextToSpeech.isAvailable()) {
      console.warn('Text-to-speech not available');
      return Promise.resolve(false);
    }

    setIsGenerating(true);

    // Stop any current speech if interrupt is requested
    if (options?.interrupt) {
      safeTextToSpeech.stop();
    }

    setIsSpeaking(true);
    setIsGenerating(false);

    const success = safeTextToSpeech.speak(text, {
      interrupt: options?.interrupt,
      hasInteracted: options?.hasInteracted
    });

    // Monitor when speech ends
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis?.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeechEnd);
      }
    }, 100);

    return Promise.resolve(success);
  }, []);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    setIsGenerating(false);
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    }
  }, []);

  const getVoices = useCallback(() => {
    return safeTextToSpeech.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService,
      voiceURI: voice.voiceURI
    }));
  }, []);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    isSpeaking,
    isGenerating,
    isSupported: safeTextToSpeech.isAvailable(),
    getVoices
  };
};
