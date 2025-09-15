import { useState, useCallback } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const speak = useCallback(async (text: string, options?: { voice?: string; interrupt?: boolean; hasInteracted?: boolean }) => {
    if (!text.trim()) return false;

    // Handle both string and options parameter for backward compatibility
    const interrupt = typeof options === 'object' ? options?.interrupt : true;
    const hasInteracted = typeof options === 'object' ? options?.hasInteracted : true;

    try {
      setIsGenerating(true);
      console.log('Starting browser speech for:', text.substring(0, 50) + '...');

      // Stop current speech if interrupt is requested
      if (interrupt) {
        safeTextToSpeech.stop();
        setIsSpeaking(false);
      }

      // Use browser text-to-speech
      const success = safeTextToSpeech.speak(text, {
        interrupt,
        hasInteracted,
        rate: 1,
        pitch: 1,
        volume: 1
      });

      setIsGenerating(false);
      
      if (success) {
        setIsSpeaking(true);
        
        // Monitor speech synthesis events
        const checkSpeechEnd = () => {
          if (!window.speechSynthesis.speaking) {
            setIsSpeaking(false);
          } else {
            setTimeout(checkSpeechEnd, 100);
          }
        };
        setTimeout(checkSpeechEnd, 100);
        
        console.log('Browser speech started');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsGenerating(false);
      setIsSpeaking(false);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (isSpeaking) {
      safeTextToSpeech.stop();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const readAIMessage = useCallback(async (text: string) => {
    return await speak(text, { interrupt: true, hasInteracted: true });
  }, [speak]);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSpeaking,
    isGenerating,
    isSupported: safeTextToSpeech.isAvailable(),
    getVoices: () => {
      const browserVoices = safeTextToSpeech.getVoices();
      return browserVoices.map(voice => ({
        id: voice.name,
        name: voice.name,
        language: voice.lang || 'en-US'
      }));
    }
  };
};