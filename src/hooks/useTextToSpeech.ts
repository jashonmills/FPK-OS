import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { safeTextToSpeech } from '@/utils/speechUtils';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const isSupported = 'speechSynthesis' in window;

  // Cleanup function to remove all audio and reset state
  const cleanup = useCallback(() => {
    // Stop browser speech synthesis
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Clear any polling intervals
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    // Stop current audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current.remove();
      currentAudioRef.current = null;
    }

    // Find and stop any orphaned audio elements
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.src = '';
      audio.remove();
    });
  }, []);

  const speak = useCallback(async (
    text: string,
    options: { voice?: string; interrupt?: boolean; hasInteracted?: boolean } = {}
  ): Promise<boolean> => {
    // Debounce: Ignore rapid clicks within 300ms
    const now = Date.now();
    if (now - lastClickTimeRef.current < 300) {
      logger.info('🚫 TTS click debounced', 'TTS');
      return false;
    }
    lastClickTimeRef.current = now;

    const { interrupt = false } = options;

    try {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        logger.info('🚫 Cancelled previous TTS request', 'TTS');
      }

      // Stop any current speech if interrupt is requested
      if (interrupt || isSpeaking) {
        cleanup();
      }

      // Set states IMMEDIATELY before API call
      setIsGenerating(true);
      setIsSpeaking(true);

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      logger.info('🎵 Attempting TTS using Google Cloud TTS', 'TTS');

      // Try Google Cloud TTS first (most natural voice)
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: { text, voice: options.voice || 'alloy' }
      });

      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        logger.info('🚫 TTS request was cancelled', 'TTS');
        setIsGenerating(false);
        setIsSpeaking(false);
        return false;
      }

      if (error) {
        logger.error('Google Cloud TTS error, falling back to browser TTS', 'TTS', error);
        setIsGenerating(false);
        return fallbackToBrowserTTS(text, interrupt);
      }

      if (!data?.audioContent) {
        logger.error('No audio content received from Google Cloud TTS', 'TTS');
        setIsGenerating(false);
        return fallbackToBrowserTTS(text, interrupt);
      }

      logger.info('✅ Google Cloud TTS audio received', 'TTS');

      // Clean up any existing audio (single instance management)
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
        currentAudioRef.current.remove();
        currentAudioRef.current = null;
      }

      // Create and play audio (single managed instance)
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      currentAudioRef.current = audio;

      setIsGenerating(false);
      // isSpeaking already set to true above

      audio.onended = () => {
        logger.info('✅ Audio playback completed', 'TTS');
        setIsSpeaking(false);
        abortControllerRef.current = null;
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null;
        }
      };

      audio.onerror = (e) => {
        logger.error('Audio playback error', 'TTS', e);
        setIsSpeaking(false);
        setIsGenerating(false);
        abortControllerRef.current = null;
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null;
        }
      };

      await audio.play();

      return true;
    } catch (error: any) {
      // Don't log if request was cancelled
      if (error.name === 'AbortError') {
        logger.info('🚫 TTS request cancelled', 'TTS');
      } else {
        logger.error('TTS error', 'TTS', error);
      }
      setIsGenerating(false);
      setIsSpeaking(false);
      abortControllerRef.current = null;
      return false;
    }
  }, [isSpeaking, cleanup]);

  const fallbackToBrowserTTS = useCallback((text: string, interrupt: boolean) => {
    try {
      logger.info('🔄 Falling back to browser TTS', 'TTS');
      
      const success = safeTextToSpeech.speak(text, {
        interrupt,
        hasInteracted: true,
        rate: 1,
        pitch: 1,
        volume: 1
      });

      if (success) {
        setIsSpeaking(true);
        
        // Poll for speech completion
        const checkSpeechEnd = () => {
          if (!window.speechSynthesis.speaking) {
            setIsSpeaking(false);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
          }
        };

        pollIntervalRef.current = setInterval(checkSpeechEnd, 100);
        
        logger.info('✅ Browser TTS started', 'TTS');
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Browser TTS error', 'TTS', error);
      setIsSpeaking(false);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    logger.info('⏹️ Stopping TTS immediately', 'TTS');
    
    // Cancel any pending API requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Use cleanup function
    cleanup();

    // Reset states IMMEDIATELY
    setIsSpeaking(false);
    setIsGenerating(false);
  }, [cleanup]);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

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
    isSupported,
    getVoices: () => {
      // Return Google Cloud TTS voices
      const googleVoices = [
        { id: 'alloy', name: 'Alloy (Neutral)', language: 'en-US' },
        { id: 'echo', name: 'Echo (Male)', language: 'en-US' },
        { id: 'fable', name: 'Fable (British)', language: 'en-US' },
        { id: 'onyx', name: 'Onyx (Deep Male)', language: 'en-US' },
        { id: 'nova', name: 'Nova (Female)', language: 'en-US' },
        { id: 'shimmer', name: 'Shimmer (Warm Female)', language: 'en-US' },
      ];
      
      // Also include browser voices as fallback
      const browserVoices = safeTextToSpeech.getVoices().map(voice => ({
        id: voice.name,
        name: `${voice.name} (Browser)`,
        language: voice.lang || 'en-US'
      }));
      
      return [...googleVoices, ...browserVoices];
    }
  };
};
