
import { useCallback } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  interrupt?: boolean;
}

export const useTextToSpeech = () => {
  const { settings, getSelectedVoiceObject } = useVoiceSettings();

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!settings.enabled) return;

    // Stop current speech if interrupting
    if (options.interrupt) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use provided voice or selected voice
    const voice = options.voice || getSelectedVoiceObject();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    speechSynthesis.speak(utterance);
  }, [settings, getSelectedVoiceObject]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  return { speak, stop };
};
