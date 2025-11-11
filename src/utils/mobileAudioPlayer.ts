import { isMobileBrowser, resumeAudioContextOnMobile } from './mobileAudioUtils';

interface AudioPlayerOptions {
  onEnded?: () => void;
  onError?: (error: any) => void;
  hasUserInteracted?: boolean;
}

/**
 * Mobile-aware audio player that handles mobile browser restrictions
 * Wraps HTML5 Audio API with proper mobile support
 */
export class MobileAwareAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  
  /**
   * Play an audio file with mobile-specific handling
   */
  async play(audioUrl: string, options: AudioPlayerOptions = {}): Promise<boolean> {
    // MOBILE FIX 1: Check user interaction on mobile
    if (isMobileBrowser() && !options.hasUserInteracted) {
      console.warn('[Mobile Audio] User interaction required before playback');
      return false;
    }
    
    // MOBILE FIX 2: Resume AudioContext on mobile
    if (isMobileBrowser()) {
      await resumeAudioContextOnMobile();
    }
    
    // Clean up existing audio
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    
    // Create and configure audio
    this.audio = new Audio(audioUrl);
    
    return new Promise((resolve) => {
      if (!this.audio) {
        resolve(false);
        return;
      }
      
      this.audio.onended = () => {
        options.onEnded?.();
        this.audio = null;
        resolve(true);
      };
      
      this.audio.onerror = (error) => {
        console.error('[Mobile Audio] Playback error:', error);
        options.onError?.(error);
        this.audio = null;
        resolve(false);
      };
      
      // MOBILE FIX 3: Handle play() promise rejection
      this.audio.play()
        .then(() => {
          console.log('[Mobile Audio] Playback started successfully');
        })
        .catch((error) => {
          console.error('[Mobile Audio] Play failed:', error);
          if (isMobileBrowser()) {
            console.error('[Mobile Audio] Common mobile issue - ensure user interaction occurred');
          }
          this.audio = null;
          resolve(false);
        });
    });
  }
  
  /**
   * Stop playback and clean up
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}
