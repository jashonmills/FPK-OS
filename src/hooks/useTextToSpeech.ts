
import { useCallback, useRef, useEffect } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useToast } from '@/hooks/use-toast';

export const useTextToSpeech = () => {
  const { settings, isSupported, initializeVoice } = useVoiceSettings();
  const { toast } = useToast();
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCurrentlySpeaking = useRef(false);

  // Initialize voice on mount
  useEffect(() => {
    initializeVoice();
  }, [initializeVoice]);

  // Stop any current speech
  const stopSpeech = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      console.log('🔊 Stopping current speech');
      window.speechSynthesis.cancel();
      isCurrentlySpeaking.current = false;
    }
  }, [isSupported]);

  // Speak the given text
  const speak = useCallback((text: string, options?: { interrupt?: boolean }) => {
    if (!isSupported) {
      console.warn('🔊 Speech synthesis not supported');
      return;
    }

    if (!settings.enabled) {
      console.log('🔊 Voice is disabled, skipping speech');
      return;
    }

    if (!text.trim()) {
      console.log('🔊 Empty text, skipping speech');
      return;
    }

    if (!settings.hasInteracted) {
      console.log('🔊 User has not interacted yet, speech may be blocked by browser');
    }

    // Stop current speech if interrupting or if auto-read is enabled
    if (options?.interrupt || settings.autoRead) {
      stopSpeech();
    }

    try {
      console.log('🔊 Speaking text:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply voice settings
      if (settings.selectedVoice) {
        const voice = window.speechSynthesis.getVoices().find(v => v.name === settings.selectedVoice);
        if (voice) {
          utterance.voice = voice;
          console.log('🔊 Using voice:', voice.name);
        } else {
          console.warn('🔊 Selected voice not found:', settings.selectedVoice);
        }
      }
      
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.lang = 'en-US';

      // Event handlers
      utterance.onstart = () => {
        console.log('🔊 Speech started');
        isCurrentlySpeaking.current = true;
      };

      utterance.onend = () => {
        console.log('🔊 Speech ended');
        isCurrentlySpeaking.current = false;
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('🔊 Speech synthesis error:', event.error);
        isCurrentlySpeaking.current = false;
        currentUtteranceRef.current = null;
        
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          toast({
            title: "Speech Error",
            description: `Voice synthesis failed: ${event.error}. Please try again.`,
            variant: "destructive"
          });
        }
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('🔊 Text-to-speech error:', error);
      toast({
        title: "Speech Not Available",
        description: "Text-to-speech is not available in your browser.",
        variant: "destructive"
      });
    }
  }, [isSupported, settings, stopSpeech, toast]);

  // Auto-read AI messages
  const readAIMessage = useCallback((message: string) => {
    if (!settings.autoRead) {
      console.log('🔊 Auto-read disabled, skipping speech');
      return;
    }
    
    console.log('🔊 Auto-reading AI message');
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
