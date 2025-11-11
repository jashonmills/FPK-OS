/**
 * Mobile browser audio utilities
 * Handles mobile-specific audio context and TTS requirements
 */

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
