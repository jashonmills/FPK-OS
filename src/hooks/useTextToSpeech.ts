
import { useState, useCallback, useRef } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { supabase } from '@/integrations/supabase/client';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string; // ElevenLabs voice ID
  interrupt?: boolean;
  model?: string;
}

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useVoiceSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSupported = true; // ElevenLabs is always supported

  const speak = useCallback(async (text: string, options: SpeechOptions = {}) => {
    console.log('🔊 TTS SPEAK START:', { text: text.substring(0, 30), options });
    
    if (!text.trim()) {
      console.warn('🔊 Cannot speak: empty text');
      return false;
    }

    if (!settings.hasInteracted) {
      console.warn('🔊 Cannot speak: user interaction required');
      return false;
    }

    // Don't check settings.enabled for ElevenLabs TTS - let it work regardless
    console.log('🔊 TTS Settings:', { 
      enabled: settings.enabled, 
      hasInteracted: settings.hasInteracted,
      selectedVoice: settings.selectedVoice 
    });

    try {
      // Stop any current speech if interrupt is requested
      if (options.interrupt) {
        stop();
      }

      setIsLoading(true);
      console.log('🔊 About to call ElevenLabs function...');

      // Test with a simple function call first
      console.log('🔊 Supabase client available:', !!supabase);
      console.log('🔊 Functions available:', !!supabase.functions);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: text.substring(0, 500), // Limit text size for testing
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Use fixed voice ID for testing
          model: 'eleven_multilingual_v2'
        }
      });

      console.log('🔊 Function invoke completed:', { 
        hasData: !!data, 
        hasError: !!error,
        errorMessage: error?.message,
        dataKeys: data ? Object.keys(data) : 'no data'
      });

      if (error) {
        console.error('🔊 ElevenLabs TTS error:', error);
        console.error('🔊 Error details:', JSON.stringify(error, null, 2));
        setIsLoading(false);
        return false;
      }

      if (!data) {
        console.error('🔊 No data received from ElevenLabs function');
        setIsLoading(false);
        return false;
      }

      if (!data.audioContent) {
        console.error('🔊 No audio content in response:', data);
        setIsLoading(false);
        return false;
      }

      // Create audio blob and play
      const audioData = atob(data.audioContent);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }

      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = options.volume ?? settings.volume;

      // Set up event listeners
      audioRef.current.onloadstart = () => {
        setIsLoading(false);
        setIsSpeaking(true);
        setIsPaused(false);
        console.log('🔊 ElevenLabs speech started');
      };

      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        console.log('🔊 ElevenLabs speech ended');
      };

      audioRef.current.onerror = (event) => {
        console.error('🔊 Audio playback error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.onpause = () => {
        setIsPaused(true);
        console.log('🔊 ElevenLabs speech paused');
      };

      audioRef.current.onplay = () => {
        setIsPaused(false);
        console.log('🔊 ElevenLabs speech resumed');
      };

      // Start playback
      await audioRef.current.play();
      return true;

    } catch (error) {
      console.error('🔊 ElevenLabs TTS failed:', error);
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoading(false);
      return false;
    }
  }, [settings]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoading(false);
      console.log('🔊 ElevenLabs speech stopped');
    }
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (!audioRef.current || !isSpeaking) return;

    if (isPaused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isSpeaking, isPaused]);

  const readAIMessage = useCallback((text: string) => {
    return speak(text, { interrupt: true });
  }, [speak]);

  const getVoices = useCallback(() => {
    // Return ElevenLabs voices
    return [
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah - Warm Female', gender: 'female' },
      { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica - Professional Female', gender: 'female' },
      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily - Youthful Female', gender: 'female' },
      { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte - Clear Female', gender: 'female' },
      { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian - Professional Male', gender: 'male' },
      { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel - Natural Male', gender: 'male' },
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam - Clear Male', gender: 'male' },
      { id: 'bIHbv24MWmeRgasZH58o', name: 'Will - Conversational Male', gender: 'male' }
    ];
  }, []);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    readAIMessage,
    isSpeaking,
    isPaused,
    isLoading,
    isSupported,
    getVoices
  };
};
