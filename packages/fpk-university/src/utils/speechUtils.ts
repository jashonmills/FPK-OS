
/**
 * Safe Text-to-Speech utilities that handle deprecated APIs properly
 * Includes mobile browser compatibility fixes and OpenAI fallback
 */

import { isIOSBrowser, isMobileBrowser, speakWithOpenAIFallback } from './mobileAudioUtils';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  interrupt?: boolean;
  hasInteracted?: boolean;
  useFallback?: boolean;
}

class SafeTextToSpeech {
  private isSupported: boolean;
  private failureCount: number = 0;
  private readonly MAX_FAILURES = 2;

  constructor() {
    this.isSupported = 'speechSynthesis' in window;
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Text-to-speech not supported in this browser');
      
      // Try OpenAI fallback on mobile if available
      if (isMobileBrowser()) {
        console.log('📱 Attempting OpenAI TTS fallback...');
        return await speakWithOpenAIFallback(text);
      }
      
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

      // Track failures for fallback decision
      let speechFailed = false;

      // MOBILE FIX: Add mobile-specific error recovery
      utterance.onerror = async (event) => {
        console.warn('Speech synthesis error:', event.error);
        speechFailed = true;
        
        // Track failure count
        this.failureCount++;
        console.log(`📱 Speech failure count: ${this.failureCount}/${this.MAX_FAILURES}`);
        
        // After multiple failures, try OpenAI fallback on mobile
        if (isMobileBrowser() && this.failureCount >= this.MAX_FAILURES) {
          console.log('📱 Multiple Web Speech API failures detected, switching to OpenAI TTS fallback...');
          await speakWithOpenAIFallback(text);
          this.failureCount = 0; // Reset counter after fallback
          return;
        }
      };

      utterance.onend = () => {
        if (!speechFailed) {
          // Reset failure count on success
          this.failureCount = 0;
          console.log('Speech synthesis completed successfully');
        }
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
      
      // Try OpenAI fallback on mobile if browser TTS completely fails
      if (isMobileBrowser()) {
        console.log('📱 Browser TTS failed, attempting OpenAI TTS fallback...');
        return await speakWithOpenAIFallback(text);
      }
      
      return false;
    }
  }

  resetFailureCount() {
    this.failureCount = 0;
  }

  stop() {
    if (this.isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.failureCount = 0; // Reset counter when user stops
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
