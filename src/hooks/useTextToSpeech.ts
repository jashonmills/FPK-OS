import { useState, useCallback, useRef, useEffect } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
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
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useVoiceSettings();
  const isSupported = safeTextToSpeech.isAvailable();

  // Monitor speechSynthesis speaking state
  useEffect(() => {
    const checkSpeakingState = () => {
      const speaking = window.speechSynthesis.speaking;
      const paused = window.speechSynthesis.paused;
      
      if (speaking && !paused && !isSpeaking) {
        setIsSpeaking(true);
        setIsPaused(false);
      } else if (!speaking && isSpeaking) {
        setIsSpeaking(false);
        setIsPaused(false);
      } else if (speaking && paused && !isPaused) {
        setIsPaused(true);
      } else if (speaking && !paused && isPaused) {
        setIsPaused(false);
      }
    };

    const interval = setInterval(checkSpeakingState, 100);
    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  const speak = useCallback(async (text: string, options: SpeechOptions = {}): Promise<boolean> => {
    console.log('🔊 Browser TTS SPEAK START:', { text: text.substring(0, 30), options });
    
    if (!text.trim()) {
      console.warn('🔊 Cannot speak: empty text');
      return false;
    }

    if (!settings.hasInteracted) {
      console.warn('🔊 Cannot speak: user interaction required');
      return false;
    }

    if (!settings.enabled) {
      console.log('🔊 TTS is disabled in settings');
      return false;
    }

    try {
      // Stop any current speech if interrupt is requested
      if (options.interrupt) {
        stop();
      }

      setIsLoading(true);

      // Get the selected voice
      let selectedVoice: SpeechSynthesisVoice | undefined;
      if (settings.selectedVoice) {
        const voices = safeTextToSpeech.getVoices();
        selectedVoice = voices.find(v => v.name === settings.selectedVoice);
      }

      // Use voice settings or provided options
      const speechOptions = {
        rate: options.rate ?? settings.rate,
        pitch: options.pitch ?? settings.pitch, 
        volume: options.volume ?? settings.volume,
        voice: options.voice ?? selectedVoice,
        interrupt: options.interrupt ?? true
      };

      console.log('🔊 Using browser TTS with options:', speechOptions);

      const success = safeTextToSpeech.speak(text, speechOptions);
      
      setIsLoading(false);
      
      if (success) {
        setIsSpeaking(true);
        setIsPaused(false);
        console.log('🔊 Browser TTS speech started');
      } else {
        console.warn('🔊 Browser TTS failed to start');
      }

      return success;
    } catch (error) {
      console.error('🔊 Browser TTS failed:', error);
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoading(false);
      return false;
    }
  }, [settings]);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoading(false);
    console.log('🔊 Browser TTS stopped');
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (!isSpeaking) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      console.log('🔊 Browser TTS resumed');
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
      console.log('🔊 Browser TTS paused');
    }
  }, [isSpeaking, isPaused]);

  const readAIMessage = useCallback((text: string) => {
    return speak(text, { interrupt: true });
  }, [speak]);

  const getVoices = useCallback(() => {
    return safeTextToSpeech.getVoices().map(voice => ({
      id: voice.name,
      name: `${voice.name} (${voice.lang})`,
      gender: voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') ? 'female' : 'male'
    }));
  }, []);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSpeaking,
    isPaused,
    isLoading,
    isSupported,
    getVoices
  };
};