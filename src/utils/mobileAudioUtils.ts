/**
 * Mobile browser audio utilities
 * Handles mobile-specific audio context and TTS requirements
 */

import { supabase } from '@/integrations/supabase/client';

// Detect mobile browsers
export const isMobileBrowser = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Check if iOS specifically (strictest requirements)
export const isIOSBrowser = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Resume AudioContext on mobile (required for audio playback)
export const resumeAudioContextOnMobile = async (): Promise<void> => {
  if (!isMobileBrowser()) return;
  
  console.log('📱 Resuming audio context for mobile browser...');
  
  // Resume any suspended AudioContext instances
  if (typeof AudioContext !== 'undefined') {
    try {
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('📱 AudioContext resumed successfully');
      }
      audioContext.close();
    } catch (error) {
      console.warn('📱 Failed to resume AudioContext:', error);
    }
  }
};

/**
 * Fallback TTS using OpenAI API for mobile devices
 * Used when Web Speech API fails on mobile browsers
 */
export const speakWithOpenAIFallback = async (
  text: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'
): Promise<boolean> => {
  console.log('📱 Using OpenAI TTS fallback for mobile...');
  
  try {
    const { data, error } = await supabase.functions.invoke('text-to-voice', {
      body: { text, voice }
    });

    if (error) {
      console.error('📱 OpenAI TTS error:', error);
      return false;
    }

    if (!data?.audioContent) {
      console.error('📱 No audio content received from OpenAI TTS');
      return false;
    }

    // Convert base64 to audio blob and play
    const audioBlob = base64ToBlob(data.audioContent, 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Play the audio
    await audio.play();
    
    // Cleanup when done
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      console.log('📱 OpenAI TTS playback completed');
    };

    audio.onerror = (e) => {
      console.error('📱 OpenAI TTS playback error:', e);
      URL.revokeObjectURL(audioUrl);
    };

    return true;
  } catch (error) {
    console.error('📱 OpenAI TTS fallback failed:', error);
    return false;
  }
};

/**
 * Convert base64 string to Blob
 */
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};
