
/**
 * Safe Text-to-Speech utilities that handle deprecated APIs properly
 * Includes mobile browser compatibility fixes
 */

import { isIOSBrowser } from './mobileAudioUtils';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  interrupt?: boolean;
  hasInteracted?: boolean;
}

class SafeTextToSpeech {
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'speechSynthesis' in window;
  }

  speak(text: string, options: SpeechOptions = {}) {
    if (!this.isSupported) {
      console.warn('Text-to-speech not supported in this browser');
      return false;
    }

    try {
      // MOBILE FIX: Stop current speech synchronously
      if (options.interrupt && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // MOBILE FIX: Create utterance immediately (no delays)
      const utterance = new SpeechSynthesisUtterance(text);
      
      // MOBILE FIX: Set all properties before speaking
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      if (options.voice) utterance.voice = options.voice;

      // MOBILE FIX: Add mobile-specific error recovery
      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error);
        
        // Retry on mobile if interrupted or canceled
        if (event.error === 'interrupted' || event.error === 'canceled') {
          console.log('📱 Speech interrupted, retrying...');
          setTimeout(() => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
          }, 100);
        }
      };

      utterance.onend = () => {
        console.log('Speech synthesis completed');
      };

      // MOBILE FIX: For iOS, must speak() in same event loop tick
      window.speechSynthesis.speak(utterance);
      
      // MOBILE FIX: iOS workaround - resume if paused
      if (isIOSBrowser() && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      return true;
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      return false;
    }
  }

  stop() {
    if (this.isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    return window.speechSynthesis.getVoices();
  }

  isAvailable(): boolean {
    return this.isSupported;
  }
}

// Export singleton instance
export const safeTextToSpeech = new SafeTextToSpeech();

// Export the class for direct instantiation if needed
export { SafeTextToSpeech };
