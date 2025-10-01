import { useState, useCallback } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const speak = useCallback(async (text: string, options?: { voice?: string; interrupt?: boolean; hasInteracted?: boolean }) => {
    if (!text.trim()) return false;

    const interrupt = typeof options === 'object' ? options?.interrupt : true;
    const voice = typeof options === 'object' ? options?.voice : undefined;

    try {
      setIsGenerating(true);
      console.log('Starting Google Cloud TTS for:', text.substring(0, 50) + '...');

      // Stop current speech if interrupt is requested
      if (interrupt) {
        safeTextToSpeech.stop();
        setIsSpeaking(false);
        // Stop any playing audio
        const audioElements = document.querySelectorAll('audio[data-tts]');
        audioElements.forEach(el => {
          (el as HTMLAudioElement).pause();
          el.remove();
        });
      }

      // Try Google Cloud TTS first
      try {
        const { data, error } = await supabase.functions.invoke('google-text-to-speech', {
          body: { 
            text, 
            voice: voice || 'en-US-Journey-D', // Journey voices are very natural and conversational
            speakingRate: 1.0,
            pitch: 0
          }
        });

        if (error) throw error;
        
        if (data?.audioContent) {
          // Convert base64 to audio and play
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          audio.setAttribute('data-tts', 'true');
          
          audio.onplay = () => {
            setIsSpeaking(true);
            setIsGenerating(false);
          };
          
          audio.onended = () => {
            setIsSpeaking(false);
            audio.remove();
          };
          
          audio.onerror = () => {
            console.error('Audio playback error, falling back to browser TTS');
            setIsSpeaking(false);
            setIsGenerating(false);
            // Fallback to browser TTS
            fallbackToBrowserTTS(text, interrupt);
          };
          
          await audio.play();
          console.log('Google Cloud TTS playback started');
          return true;
        }
      } catch (googleError) {
        console.warn('Google Cloud TTS failed, falling back to browser TTS:', googleError);
        // Fallback to browser TTS
        return fallbackToBrowserTTS(text, interrupt);
      }
      
      return false;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsGenerating(false);
      setIsSpeaking(false);
      return false;
    }
  }, []);

  const fallbackToBrowserTTS = useCallback((text: string, interrupt: boolean) => {
    const success = safeTextToSpeech.speak(text, {
      interrupt,
      hasInteracted: true,
      rate: 1,
      pitch: 1,
      volume: 1
    });

    setIsGenerating(false);
    
    if (success) {
      setIsSpeaking(true);
      
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
  }, []);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    // Stop any playing Google TTS audio
    const audioElements = document.querySelectorAll('audio[data-tts]');
    audioElements.forEach(el => {
      (el as HTMLAudioElement).pause();
      el.remove();
    });
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
      // Return Google Cloud TTS voices (most natural Journey voices)
      const googleVoices = [
        { id: 'en-US-Journey-D', name: 'Journey D (Male, Conversational)', language: 'en-US' },
        { id: 'en-US-Journey-F', name: 'Journey F (Female, Conversational)', language: 'en-US' },
        { id: 'en-US-Neural2-A', name: 'Neural2 A (Male, Natural)', language: 'en-US' },
        { id: 'en-US-Neural2-C', name: 'Neural2 C (Female, Natural)', language: 'en-US' },
        { id: 'en-US-Neural2-D', name: 'Neural2 D (Male, Warm)', language: 'en-US' },
        { id: 'en-US-Neural2-E', name: 'Neural2 E (Female, Warm)', language: 'en-US' },
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