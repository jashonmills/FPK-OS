
import { useState, useCallback } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

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
  const { settings, getSelectedVoiceObject } = useVoiceSettings();
  const isSupported = 'speechSynthesis' in window;

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!text.trim() || !isSupported || !settings.hasInteracted) {
      console.warn('🔊 Cannot speak: missing requirements');
      return false;
    }

    try {
      // Stop any current speech if interrupt is requested
      if (options.interrupt && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(true);
      setIsPaused(false);

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use selected voice from context or provided voice
      const selectedVoice = getSelectedVoiceObject();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('🔊 Using selected voice:', selectedVoice.name);
      } else if (options.voice) {
        utterance.voice = options.voice;
        console.log('🔊 Using provided voice:', options.voice.name);
      }

      // Apply settings from context with option overrides
      utterance.rate = options.rate ?? settings.rate;
      utterance.pitch = options.pitch ?? settings.pitch;
      utterance.volume = options.volume ?? settings.volume;

      // Add event handlers
      utterance.onstart = () => {
        console.log('🔊 Speech started');
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        console.log('🔊 Speech ended');
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.warn('🔊 Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        console.log('🔊 Speech paused');
        setIsPaused(true);
      };

      utterance.onresume = () => {
        console.log('🔊 Speech resumed');
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('🔊 Speech synthesis failed:', error);
      setIsSpeaking(false);
      setIsPaused(false);
      return false;
    }
  }, [settings, getSelectedVoiceObject, isSupported]);

  const stop = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      console.log('🔊 Speech stopped');
    }
  }, [isSupported]);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (!isSupported || !isSpeaking) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      console.log('🔊 Speech resumed');
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
      console.log('🔊 Speech paused');
    }
  }, [isSpeaking, isPaused, isSupported]);

  const readAIMessage = useCallback((text: string) => {
    return speak(text, { interrupt: true });
  }, [speak]);

  const getVoices = useCallback(() => {
    return isSupported ? window.speechSynthesis.getVoices() : [];
  }, [isSupported]);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSpeaking,
    isPaused,
    isSupported,
    getVoices
  };
};
