import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, options?: { voice?: string; interrupt?: boolean }) => {
    if (!text.trim()) return;

    // Handle both string and options parameter for backward compatibility
    const voice = typeof options === 'string' ? options : options?.voice || 'alloy';
    const interrupt = typeof options === 'object' ? options?.interrupt : true;

    try {
      // Stop current audio if interrupt is true (default)
      if (interrupt && audioRef.current) {
        audioRef.current.pause();
        setIsSpeaking(false);
      }

      setIsGenerating(true);
      console.log('Generating speech for:', text.substring(0, 50) + '...');

      // Call Supabase Edge Function for text-to-speech
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: { text, voice }
      });

      if (error) {
        console.error('Text-to-speech error:', error);
        throw new Error(error.message || 'Failed to generate speech');
      }

      setIsGenerating(false);

      if (data?.audioContent) {
        // Create audio blob from base64
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Stop current audio if playing
        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }

        // Create and play new audio
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          console.error('Audio playback error');
        };

        await audio.play();
        console.log('Audio playback started');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsGenerating(false);
      setIsSpeaking(false);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (audioRef.current) {
      if (isSpeaking) {
        audioRef.current.pause();
        setIsSpeaking(false);
      } else {
        audioRef.current.play();
        setIsSpeaking(true);
      }
    }
  }, [isSpeaking]);

  const readAIMessage = useCallback(async (text: string) => {
    return await speak(text, { interrupt: true });
  }, [speak]);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSpeaking,
    isGenerating,
    isSupported: true, // OpenAI TTS is always supported
    getVoices: () => [
      { id: 'alloy', name: 'Alloy', language: 'en-US' },
      { id: 'echo', name: 'Echo', language: 'en-US' },
      { id: 'fable', name: 'Fable', language: 'en-US' },
      { id: 'onyx', name: 'Onyx', language: 'en-US' },
      { id: 'nova', name: 'Nova', language: 'en-US' },
      { id: 'shimmer', name: 'Shimmer', language: 'en-US' }
    ]
  };
};