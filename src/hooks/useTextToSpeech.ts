import { useState, useCallback, useEffect } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';
import type { Persona } from '@/types/aiCoach';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = safeTextToSpeech.getVoices();
      setVoices(availableVoices);
      console.log('[TTS] Loaded voices:', availableVoices.length);
    };

    loadVoices();
    
    // Voices are loaded asynchronously in some browsers
    if (window.speechSynthesis?.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      // CRITICAL: Stop all speech when component unmounts (prevents audio playing after navigation)
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
        console.log('[TTS] 🛑 Stopped speech due to component unmount');
      }
      safeTextToSpeech.stop();
    };
  }, []);

  /**
   * 🎯 PREMIUM VOICE SELECTOR - Intelligently selects the best available voice
   * Priority order:
   * 1. Exact premium voice match (Windows 11 Neural, Google Chrome, macOS)
   * 2. High-quality local voice of correct gender
   * 3. Any local English voice
   * 4. First available English voice
   */
  const getVoiceForPersona = useCallback((persona?: Persona): SpeechSynthesisVoice | undefined => {
    if (voices.length === 0) {
      console.warn('[TTS] Voices not loaded yet');
      return undefined;
    }

    // If no persona specified, use default English voice
    if (!persona) {
      const defaultVoice = voices.find(v => v.lang.startsWith('en-') && v.localService) || 
                          voices.find(v => v.lang.startsWith('en-'));
      console.log('[TTS] Using default voice:', defaultVoice?.name);
      return defaultVoice;
    }

    // --- PREMIUM VOICE MAP ---
    // Curated list of known high-quality voices by persona
    const premiumVoiceMap: Record<Persona, string[]> = {
      BETTY: [
        'Microsoft Zira - English (United States)',  // Windows 11 Neural
        'Google US English',                         // Chrome high-quality
        'Samantha',                                  // macOS (US)
        'Karen',                                     // macOS (Australian)
        'Tessa',                                     // macOS (South African)
        'Victoria'                                   // macOS (UK)
      ],
      AL: [
        'Microsoft David - English (United States)', // Windows 11 Neural
        'Google UK English Male',                    // Chrome high-quality
        'Daniel',                                    // macOS (UK)
        'Alex',                                      // macOS (US)
        'Tom'                                        // macOS (US)
      ],
      NITE_OWL: [
        'Fiona',                                     // macOS (Scottish)
        'Moira',                                     // macOS (Irish)
        'Victoria',                                  // macOS (UK)
        'Google UK English Female'                   // Chrome
      ],
      USER: []                                       // User doesn't speak
    };

    const targetVoiceNames = premiumVoiceMap[persona] || premiumVoiceMap['BETTY'];

    // Priority 1: Find exact premium voice match
    for (const name of targetVoiceNames) {
      const foundVoice = voices.find(v => v.name === name);
      if (foundVoice) {
        console.log(`[TTS] ✅ Found premium voice for ${persona}: ${foundVoice.name}`);
        return foundVoice;
      }
    }

    // Priority 2: Find high-quality local voice of correct gender
    const personaGender = (persona === 'AL') ? 'Male' : 'Female';
    const localBest = voices.find(v => 
      v.lang.startsWith('en-') && 
      v.localService && 
      (v.name.toLowerCase().includes(personaGender.toLowerCase()) ||
       v.name.toLowerCase().includes(persona === 'AL' ? 'male' : 'female'))
    );
    if (localBest) {
      console.log(`[TTS] 🔸 Found local ${personaGender} voice for ${persona}: ${localBest.name}`);
      return localBest;
    }

    // Priority 3: Find ANY local English voice
    const anyLocal = voices.find(v => v.lang.startsWith('en-') && v.localService);
    if (anyLocal) {
      console.log(`[TTS] 🔹 Found local fallback for ${persona}: ${anyLocal.name}`);
      return anyLocal;
    }

    // Priority 4: First available English voice
    const firstAvailable = voices.find(v => v.lang.startsWith('en-'));
    if (firstAvailable) {
      console.log(`[TTS] ⚠️ Using basic fallback for ${persona}: ${firstAvailable.name}`);
      return firstAvailable;
    }

    console.warn(`[TTS] ❌ No suitable voice found for ${persona}`);
    return undefined;
  }, [voices]);

  const speak = useCallback((
    text: string, 
    personaOrOptions?: Persona | { voice?: string; interrupt?: boolean; hasInteracted?: boolean }
  ) => {
    if (!safeTextToSpeech.isAvailable()) {
      console.warn('[TTS] Text-to-speech not available');
      return Promise.resolve(false);
    }

    setIsGenerating(true);

    // Handle both persona and legacy options parameter
    let selectedVoice: SpeechSynthesisVoice | undefined;
    let interrupt = true;
    let hasInteracted = true;

    if (typeof personaOrOptions === 'string') {
      // New API: persona passed as string
      selectedVoice = getVoiceForPersona(personaOrOptions as Persona);
    } else if (personaOrOptions) {
      // Legacy API: options object
      interrupt = personaOrOptions.interrupt ?? true;
      hasInteracted = personaOrOptions.hasInteracted ?? true;
      selectedVoice = undefined; // Will use default voice
    } else {
      // No parameter: use default voice
      selectedVoice = getVoiceForPersona();
    }

    // Stop any current speech if interrupt is requested
    if (interrupt) {
      safeTextToSpeech.stop();
    }

    setIsSpeaking(true);
    setIsGenerating(false);

    const success = safeTextToSpeech.speak(text, {
      voice: selectedVoice,
      interrupt,
      hasInteracted
    });

    // Monitor when speech ends
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis?.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeechEnd);
      }
    }, 100);

    return Promise.resolve(success);
  }, [getVoiceForPersona]);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    setIsGenerating(false);
  }, []);

  const stopSpeech = useCallback(() => {
    stop();
  }, [stop]);

  const togglePauseSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    }
  }, []);

  const getVoices = useCallback(() => {
    return voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService,
      voiceURI: voice.voiceURI
    }));
  }, [voices]);

  return {
    speak,
    stop,
    stopSpeech,
    togglePauseSpeech,
    isSpeaking,
    isGenerating,
    isSupported: safeTextToSpeech.isAvailable(),
    isAvailable: safeTextToSpeech.isAvailable(),
    getVoices
  };
};
