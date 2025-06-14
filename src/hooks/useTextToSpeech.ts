
import { useCallback, useRef, useEffect } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useToast } from '@/hooks/use-toast';

export const useTextToSpeech = () => {
  const { settings, isSupported } = useVoiceSettings();
  const { toast } = useToast();
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCurrentlySpeaking = useRef(false);

  // Stop any current speech
  const stopSpeech = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      isCurrentlySpeaking.current = false;
    }
  }, [isSupported]);

  // Speak the given text
  const speak = useCallback((text: string, options?: { interrupt?: boolean }) => {
    if (!isSupported || !settings.enabled || !text.trim()) {
      return;
    }

    // Stop current speech if interrupting or if auto-read is enabled
    if (options?.interrupt || settings.autoRead) {
      stopSpeech();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply voice settings
      if (settings.selectedVoice) {
        const voice = window.speechSynthesis.getVoices().find(v => v.name === settings.selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.lang = 'en-US';

      // Event handlers
      utterance.onstart = () => {
        isCurrentlySpeaking.current = true;
      };

      utterance.onend = () => {
        isCurrentlySpeaking.current = false;
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        isCurrentlySpeaking.current = false;
        currentUtteranceRef.current = null;
        
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          toast({
            title: "Speech Error",
            description: "There was an issue with text-to-speech. Please try again.",
            variant: "destructive"
          });
        }
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Not Available",
        description: "Text-to-speech is not available in your browser.",
        variant: "destructive"
      });
    }
  }, [isSupported, settings, stopSpeech, toast]);

  // Auto-read AI messages
  const readAIMessage = useCallback((message: string) => {
    if (!settings.autoRead) return;
    
    // Add a small delay to let the UI update
    setTimeout(() => {
      speak(message, { interrupt: true });
    }, 300);
  }, [speak, settings.autoRead]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  return {
    speak,
    stopSpeech,
    readAIMessage,
    isSupported,
    isSpeaking: isCurrentlySpeaking.current
  };
};
