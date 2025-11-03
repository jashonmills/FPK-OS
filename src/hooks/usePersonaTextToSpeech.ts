import { useState, useCallback, useEffect } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';
import type { Persona } from '@/types/aiCoach';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = safeTextToSpeech.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    
    // Voices are loaded asynchronously in some browsers
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      safeTextToSpeech.stop();
    };
  }, []);

  const getVoiceForPersona = useCallback((persona: Persona): SpeechSynthesisVoice | undefined => {
    if (voices.length === 0) return undefined;

    // Persona voice mapping - find the best voice for each AI persona
    switch (persona) {
      case 'BETTY':
        // Prefer warm, friendly female voices for Betty (Socratic Guide)
        return voices.find(v => 
          v.name.includes('Samantha') || 
          v.name.includes('Karen') ||
          v.name.includes('Victoria') ||
          (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
        ) || voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male'));

      case 'AL':
        // Prefer clear, professional male voices for Al (Direct Expert)
        return voices.find(v => 
          v.name.includes('Daniel') || 
          v.name.includes('Alex') ||
          v.name.includes('Tom') ||
          (v.lang.startsWith('en') && v.name.toLowerCase().includes('male'))
        ) || voices.find(v => v.lang.startsWith('en'));

      case 'NITE_OWL':
        // Unique, distinct voice for Nite Owl (Fun Facts)
        return voices.find(v => 
          v.name.includes('Fiona') || 
          v.name.includes('Moira') ||
          v.name.includes('Tessa')
        ) || voices.find(v => v.lang.startsWith('en'));

      default:
        return voices.find(v => v.lang.startsWith('en'));
    }
  }, [voices]);

  const speak = useCallback((text: string, persona: Persona) => {
    if (!safeTextToSpeech.isAvailable()) {
      console.warn('Text-to-speech not available');
      return false;
    }

    // Stop any currently playing speech
    if (isSpeaking) {
      safeTextToSpeech.stop();
    }

    const voice = getVoiceForPersona(persona);
    setIsSpeaking(true);

    const success = safeTextToSpeech.speak(text, {
      voice,
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      interrupt: true
    });

    // Monitor when speech ends
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeechEnd);
      }
    }, 100);

    return success;
  }, [getVoiceForPersona, isSpeaking]);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isAvailable: safeTextToSpeech.isAvailable()
  };
};
