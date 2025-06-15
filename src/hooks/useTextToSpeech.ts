
import { useCallback, useRef, useEffect } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { prepareTextForSpeech, supportsSSML } from '@/utils/speechUtils';

export const useTextToSpeech = () => {
  const { settings, isSupported, initializeVoice, togglePaused } = useVoiceSettings();
  const { toast } = useToast();
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCurrentlySpeaking = useRef(false);
  const lastSpokenMessageRef = useRef<string>('');

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
      lastSpokenMessageRef.current = '';
    }
  }, [isSupported]);

  // Pause current speech
  const pauseSpeech = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking && !settings.paused) {
      console.log('🔊 Pausing speech');
      window.speechSynthesis.pause();
      togglePaused();
    }
  }, [isSupported, settings.paused, togglePaused]);

  // Resume paused speech
  const resumeSpeech = useCallback(() => {
    if (isSupported && settings.paused) {
      console.log('🔊 Resuming speech');
      window.speechSynthesis.resume();
      togglePaused();
    }
  }, [isSupported, settings.paused, togglePaused]);

  // Toggle pause/resume
  const togglePauseSpeech = useCallback(() => {
    if (!isSupported) {
      console.log('🔊 Cannot toggle pause: speech synthesis not supported');
      return;
    }

    if (!window.speechSynthesis.speaking) {
      console.log('🔊 Cannot toggle pause: nothing is speaking');
      return;
    }

    if (settings.paused) {
      resumeSpeech();
    } else {
      pauseSpeech();
    }
  }, [isSupported, settings.paused, pauseSpeech, resumeSpeech]);

  // Speak the given text with intelligent preprocessing
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

    // Process text for optimal speech synthesis
    const processedText = prepareTextForSpeech(text, supportsSSML());
    console.log('🔊 Original text:', text.substring(0, 50) + '...');
    console.log('🔊 Processed text:', processedText.substring(0, 50) + '...');

    // Prevent speaking the same message multiple times
    if (lastSpokenMessageRef.current === processedText && isCurrentlySpeaking.current) {
      console.log('🔊 Already speaking this message, skipping');
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
      const utterance = new SpeechSynthesisUtterance(processedText);
      
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
        lastSpokenMessageRef.current = processedText;
      };

      utterance.onend = () => {
        console.log('🔊 Speech ended');
        isCurrentlySpeaking.current = false;
        currentUtteranceRef.current = null;
        lastSpokenMessageRef.current = '';
      };

      utterance.onpause = () => {
        console.log('🔊 Speech paused');
      };

      utterance.onresume = () => {
        console.log('🔊 Speech resumed');
      };

      utterance.onerror = (event) => {
        console.error('🔊 Speech synthesis error:', event.error);
        isCurrentlySpeaking.current = false;
        currentUtteranceRef.current = null;
        lastSpokenMessageRef.current = '';
        
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

  // Auto-read AI messages with duplicate prevention and text processing
  const readAIMessage = useCallback((message: string) => {
    if (!settings.autoRead) {
      console.log('🔊 Auto-read disabled, skipping speech');
      return;
    }

    // Process the message for speech before checking duplicates
    const processedMessage = prepareTextForSpeech(message, supportsSSML());
    
    // Prevent reading the same processed message multiple times
    if (lastSpokenMessageRef.current === processedMessage) {
      console.log('🔊 Message already spoken, skipping auto-read');
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
    pauseSpeech,
    resumeSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSupported,
    isSpeaking: isCurrentlySpeaking.current,
    isPaused: settings.paused
  };
};
