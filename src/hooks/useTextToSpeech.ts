import { useState, useCallback, useEffect, useRef } from 'react';
import { safeTextToSpeech } from '@/utils/speechUtils';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import type { Persona } from '@/types/aiCoach';

export const useTextToSpeech = () => {
  const { settings: voiceSettings } = useVoiceSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechMonitorRef = useRef<NodeJS.Timeout | null>(null);

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
      // Clear monitoring interval
      if (speechMonitorRef.current) {
        clearInterval(speechMonitorRef.current);
        speechMonitorRef.current = null;
      }
      
      // Stop all speech
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
    console.log(`[TTS DIAGNOSTIC] ========================================`);
    console.log(`[TTS DIAGNOSTIC] Starting voice search for persona: ${persona}`);
    console.log(`[TTS DIAGNOSTIC] Total voices available: ${voices.length}`);
    
    if (voices.length === 0) {
      console.warn('[TTS DIAGNOSTIC] ❌ Voices not loaded yet');
      return undefined;
    }

    // If no persona specified, use default English voice
    if (!persona) {
      const defaultVoice = voices.find(v => v.lang.startsWith('en-') && v.localService) || 
                          voices.find(v => v.lang.startsWith('en-'));
      console.log('[TTS DIAGNOSTIC] ℹ️ No persona specified, using default voice:', defaultVoice?.name);
      console.log(`[TTS DIAGNOSTIC] ========================================`);
      return defaultVoice;
    }

    // --- PREMIUM VOICE MAP ---
    // Curated list of known high-quality voices by persona
    const premiumVoiceMap: Record<Persona, string[]> = {
      BETTY: [
        'Google UK English Female',                  // Chrome high-quality (PRIMARY)
        'Microsoft Zira - English (United States)',  // Windows 11 Neural
        'Google US English',                         // Chrome alternative
        'Samantha',                                  // macOS (US)
      ],
      AL: [
        'Microsoft David - English (United States)', // Windows 11 Neural
        'Google UK English Male',                    // Chrome high-quality
        'Daniel',                                    // macOS (UK)
        'Alex',                                      // macOS (US)
        'Tom'                                        // macOS (US)
      ],
      NITE_OWL: [
        'Google UK English Female',                  // Chrome high-quality (PRIMARY - same as Betty!)
        'Microsoft Zira - English (United States)',  // Windows fallback
        'Google US English',                         // Chrome alternative
        'Victoria',                                  // macOS (UK)
      ],
      USER: []                                       // User doesn't speak
    };

    // --- PERSONA SPEECH CONFIG ---
    // Character-specific speech parameters for distinct personalities
    const personaSpeechConfig: Record<Persona, { rate: number; pitch: number; volume: number }> = {
      BETTY: {
        rate: 1.1,    // Slightly faster - energetic, enthusiastic coach
        pitch: 1.0,   // Normal pitch - friendly and clear
        volume: 1.0   // Full volume
      },
      AL: {
        rate: 1.0,    // Normal speed - measured teaching pace
        pitch: 0.9,   // Slightly lower - authoritative instructor
        volume: 1.0   // Full volume
      },
      NITE_OWL: {
        rate: 1.0,    // Normal speed - deliberate and wise
        pitch: 0.6,   // Much lower - deep, mysterious sage voice
        volume: 1.0   // Full volume
      },
      USER: {
        rate: 1.0,    // Default (unused)
        pitch: 1.0,   // Default (unused)
        volume: 1.0   // Default (unused)
      }
    };

    const targetVoiceNames = premiumVoiceMap[persona] || premiumVoiceMap['BETTY'];
    console.log(`[TTS DIAGNOSTIC] 🎯 Target premium voices for ${persona}:`, targetVoiceNames);

    // Priority 1: Find exact premium voice match
    console.log(`[TTS DIAGNOSTIC] 🔍 Searching for exact premium voice matches...`);
    for (const name of targetVoiceNames) {
      const foundVoice = voices.find(v => v.name === name);
      if (foundVoice) {
        console.log(`[TTS DIAGNOSTIC] ✅ SUCCESS: Found premium voice match: ${foundVoice.name}`);
        console.log(`[TTS DIAGNOSTIC] ========================================`);
        return foundVoice;
      } else {
        console.log(`[TTS DIAGNOSTIC] ❌ MISS: Did not find premium voice: ${name}`);
      }
    }

    console.log(`[TTS DIAGNOSTIC] ⚠️ No premium voices found. Starting fallback sequence...`);

    // Priority 2: Find high-quality local voice of correct gender
    const personaGender = (persona === 'AL') ? 'Male' : 'Female';
    console.log(`[TTS DIAGNOSTIC] 🔍 FALLBACK 1: Searching for local ${personaGender} voice...`);
    const localBest = voices.find(v => 
      v.lang.startsWith('en-') && 
      v.localService && 
      (v.name.toLowerCase().includes(personaGender.toLowerCase()) ||
       v.name.toLowerCase().includes(persona === 'AL' ? 'male' : 'female'))
    );
    if (localBest) {
      console.log(`[TTS DIAGNOSTIC] 🔸 FALLBACK 1 SUCCESS: Found local ${personaGender} voice: ${localBest.name}`);
      console.log(`[TTS DIAGNOSTIC] ========================================`);
      return localBest;
    }
    console.log(`[TTS DIAGNOSTIC] ❌ FALLBACK 1 FAILED: No local ${personaGender} voice found`);

    // Priority 3: Find ANY local English voice
    console.log(`[TTS DIAGNOSTIC] 🔍 FALLBACK 2: Searching for any local English voice...`);
    const anyLocal = voices.find(v => v.lang.startsWith('en-') && v.localService);
    if (anyLocal) {
      console.log(`[TTS DIAGNOSTIC] 🔹 FALLBACK 2 SUCCESS: Found local English voice: ${anyLocal.name}`);
      console.log(`[TTS DIAGNOSTIC] ========================================`);
      return anyLocal;
    }
    console.log(`[TTS DIAGNOSTIC] ❌ FALLBACK 2 FAILED: No local English voice found`);

    // Priority 4: First available English voice
    console.log(`[TTS DIAGNOSTIC] 🔍 FALLBACK 3: Searching for first available English voice...`);
    const firstAvailable = voices.find(v => v.lang.startsWith('en-'));
    if (firstAvailable) {
      console.log(`[TTS DIAGNOSTIC] ⚠️ FALLBACK 3 (BASIC): Using first available English voice: ${firstAvailable.name}`);
      console.log(`[TTS DIAGNOSTIC] ========================================`);
      return firstAvailable;
    }

    console.warn(`[TTS DIAGNOSTIC] ❌ CRITICAL: No suitable voice found for ${persona}`);
    console.log(`[TTS DIAGNOSTIC] ========================================`);
    return undefined;
  }, [voices]);

  const speak = useCallback(async (
    text: string, 
    personaOrOptions?: Persona | { voice?: string; interrupt?: boolean; hasInteracted?: boolean }
  ) => {
    if (!safeTextToSpeech.isAvailable()) {
      console.warn('[TTS] Text-to-speech not available');
      return false;
    }

    setIsGenerating(true);

    // Handle both persona and legacy options parameter
    let selectedVoice: SpeechSynthesisVoice | undefined;
    let interrupt = true;
    let hasInteracted = true;
    let persona: Persona | undefined;

    if (typeof personaOrOptions === 'string') {
      // New API: persona passed as string
      persona = personaOrOptions as Persona;
      
      // Check if user has EXPLICITLY selected a voice (not null/undefined/empty)
      if (voiceSettings.selectedVoice && voiceSettings.selectedVoice.trim() !== '') {
        const userVoice = voices.find(v => v.name === voiceSettings.selectedVoice);
        if (userVoice) {
          console.log(`[TTS] 🎯 Using user-selected voice override: ${userVoice.name}`);
          selectedVoice = userVoice;
        } else {
          console.log(`[TTS] ⚠️ User-selected voice "${voiceSettings.selectedVoice}" not found, using persona default`);
          selectedVoice = getVoiceForPersona(persona);
        }
      } else {
        // No user override - use premium persona voice selection
        console.log(`[TTS] 🎭 No user override - using premium persona voice for ${persona}`);
        selectedVoice = getVoiceForPersona(persona);
      }
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

    // Get base persona-specific speech parameters
    let basePersonaConfig = persona ? {
      rate: 1.1,    // Betty default - energetic, enthusiastic coach
      pitch: 1.0,   // Normal pitch - friendly and clear
      volume: 1.0   // Full volume
    } : undefined;

    // Apply persona-specific adjustments
    if (persona === 'AL') {
      basePersonaConfig!.rate = 1.0;    // Normal speed - measured teaching pace
      basePersonaConfig!.pitch = 0.9;   // Slightly lower - authoritative instructor
    } else if (persona === 'NITE_OWL') {
      basePersonaConfig!.rate = 1.0;    // Normal speed - deliberate and wise
      basePersonaConfig!.pitch = 0.6;   // Much lower - deep, mysterious sage voice
    }

    // NOW apply user overrides from Voice Settings
    const finalConfig = {
      rate: voiceSettings.rate !== 1.0 ? voiceSettings.rate : basePersonaConfig?.rate || 1.0,
      pitch: voiceSettings.pitch !== 1.0 ? voiceSettings.pitch : basePersonaConfig?.pitch || 1.0,
      volume: voiceSettings.volume !== 1.0 ? voiceSettings.volume : basePersonaConfig?.volume || 1.0,
    };

    console.log(`[TTS] 🎭 Base persona config for ${persona}:`, basePersonaConfig);
    console.log(`[TTS] 🎚️ User settings override:`, {
      rate: voiceSettings.rate,
      pitch: voiceSettings.pitch,
      volume: voiceSettings.volume
    });
    console.log(`[TTS] ✅ Final speech config:`, finalConfig);

    const success = await safeTextToSpeech.speak(text, {
      voice: selectedVoice,
      rate: finalConfig.rate,
      pitch: finalConfig.pitch,
      volume: finalConfig.volume,
      interrupt,
      hasInteracted
    });

    console.log(`[TTS] 🎤 Voice selection summary:`, {
      persona: persona,
      userOverride: voiceSettings.selectedVoice || 'None (using persona defaults)',
      selectedVoice: selectedVoice?.name,
      isPremiumVoice: selectedVoice?.name.includes('Google UK') || selectedVoice?.name.includes('Microsoft David'),
    });

    console.log(`[TTS] 📊 Final speech parameters:`, {
      voice: selectedVoice?.name,
      rate: finalConfig.rate,
      pitch: finalConfig.pitch,
      volume: finalConfig.volume,
      persona: persona
    });

    // Clear any existing monitor first
    if (speechMonitorRef.current) {
      clearInterval(speechMonitorRef.current);
    }

    // Monitor when speech ends
    speechMonitorRef.current = setInterval(() => {
      if (!window.speechSynthesis?.speaking) {
        setIsSpeaking(false);
        if (speechMonitorRef.current) {
          clearInterval(speechMonitorRef.current);
          speechMonitorRef.current = null;
        }
      }
    }, 100);

    return success;
  }, [getVoiceForPersona]);

  const stop = useCallback(() => {
    safeTextToSpeech.stop();
    setIsSpeaking(false);
    setIsGenerating(false);
    
    // Clear monitoring interval if exists
    if (speechMonitorRef.current) {
      clearInterval(speechMonitorRef.current);
      speechMonitorRef.current = null;
    }
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
