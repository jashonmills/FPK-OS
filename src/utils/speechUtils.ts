
/**
 * Safe Text-to-Speech utilities that handle deprecated APIs properly
 */

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  interrupt?: boolean;
}

class SafeTextToSpeech {
  private isSupported: boolean;
  private hasUserInteracted: boolean = false;

  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    
    // Listen for user interaction to enable TTS
    this.setupUserInteractionListener();
  }

  private setupUserInteractionListener() {
    const enableTTS = () => {
      this.hasUserInteracted = true;
      // Remove listeners after first interaction
      document.removeEventListener('click', enableTTS);
      document.removeEventListener('touchstart', enableTTS);
      document.removeEventListener('keydown', enableTTS);
    };

    document.addEventListener('click', enableTTS, { once: true });
    document.addEventListener('touchstart', enableTTS, { once: true });
    document.addEventListener('keydown', enableTTS, { once: true });
  }

  speak(text: string, options: SpeechOptions = {}) {
    if (!this.isSupported) {
      console.warn('Text-to-speech not supported in this browser');
      return false;
    }

    if (!this.hasUserInteracted) {
      console.warn('Text-to-speech requires user interaction first');
      return false;
    }

    try {
      // Stop any current speech if interrupt is requested
      if (options.interrupt && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.voice) utterance.voice = options.voice;

      // Add error handling
      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error);
      };

      utterance.onend = () => {
        console.log('Speech synthesis completed');
      };

      window.speechSynthesis.speak(utterance);
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
