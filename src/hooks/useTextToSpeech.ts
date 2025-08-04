
import { useCallback, useState } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  interrupt?: boolean;
}

export const useTextToSpeech = () => {
  const { settings, getSelectedVoiceObject } = useVoiceSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!settings.enabled || !isSupported) return;

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

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [settings, getSelectedVoiceObject, isSupported]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isSupported };
};
