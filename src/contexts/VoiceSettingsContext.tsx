
import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  autoRead: boolean;
  selectedVoice: string | null;
  rate: number;
  pitch: number;
  volume: number;
  hasInteracted: boolean;
  paused: boolean;
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
  toggle: () => void;
  togglePaused: () => void;
  initializeVoice: () => Promise<void>;
  setSelectedVoice: (voiceName: string) => void;
  getSelectedVoiceObject: () => SpeechSynthesisVoice | null;
  saveSettingsToStorage: () => void;
  loadSettingsFromStorage: () => Partial<VoiceSettings>;
}

const VoiceSettingsContext = createContext<VoiceSettingsContextType | undefined>(undefined);

export const useVoiceSettings = () => {
  const context = useContext(VoiceSettingsContext);
  if (!context) {
    throw new Error('useVoiceSettings must be used within a VoiceSettingsProvider');
  }
  return context;
};

// Enhanced voice selection logic for finding good female English voices
const findBestEnglishVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  if (voices.length === 0) return null;

  // Priority list of female-sounding English voices
  const femaleVoiceNames = [
    'Zira', 'Hazel', 'Karen', 'Samantha', 'Victoria', 'Susan', 'Allison',
    'Kate', 'Serena', 'Tessa', 'Moira', 'Fiona', 'Ava', 'Emma', 'Joanna',
    'Kendra', 'Kimberly', 'Salli', 'Nicole', 'Amy', 'Emma', 'Brian', 'Aditi'
  ];

  // First try to find voices with female-sounding names
  for (const femaleName of femaleVoiceNames) {
    const voice = voices.find(v => 
      v.lang.startsWith('en') && 
      v.name.toLowerCase().includes(femaleName.toLowerCase())
    );
    if (voice) {
      console.log('🔊 Found preferred female voice:', voice.name);
      return voice;
    }
  }

  // Fallback: look for any English voice that doesn't have obviously male names
  const maleVoiceNames = ['david', 'mark', 'daniel', 'alex', 'thomas', 'james', 'male'];
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  
  const nonMaleVoices = englishVoices.filter(v => 
    !maleVoiceNames.some(maleName => v.name.toLowerCase().includes(maleName))
  );

  if (nonMaleVoices.length > 0) {
    console.log('🔊 Found English non-male voice:', nonMaleVoices[0].name);
    return nonMaleVoices[0];
  }

  // Final fallback: any English voice
  if (englishVoices.length > 0) {
    console.log('🔊 Fallback to first English voice:', englishVoices[0].name);
    return englishVoices[0];
  }

  // Last resort: any voice
  console.log('🔊 Last resort - using first available voice:', voices[0].name);
  return voices[0];
};

export const VoiceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    autoRead: true,
    selectedVoice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    hasInteracted: false,
    paused: false
  });
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = 'speechSynthesis' in window;

  // Load settings from localStorage on mount
  const loadSettingsFromStorage = (): Partial<VoiceSettings> => {
    try {
      const stored = localStorage.getItem('voiceSettings');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🔊 Loaded voice settings from storage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load voice settings from storage:', error);
    }
    return {};
  };

  // Save settings to localStorage
  const saveSettingsToStorage = () => {
    try {
      localStorage.setItem('voiceSettings', JSON.stringify({
        enabled: settings.enabled,
        autoRead: settings.autoRead,
        selectedVoice: settings.selectedVoice,
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume
      }));
      console.log('🔊 Saved voice settings to storage');
    } catch (error) {
      console.warn('Failed to save voice settings to storage:', error);
    }
  };

  // Load settings on mount
  useEffect(() => {
    const storedSettings = loadSettingsFromStorage();
    if (Object.keys(storedSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...storedSettings }));
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    saveSettingsToStorage();
  }, [settings.enabled, settings.autoRead, settings.selectedVoice, settings.rate, settings.pitch, settings.volume]);

  // Track user interaction for browser speech policies
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!settings.hasInteracted) {
        console.log('🔊 User interaction detected, enabling voice capabilities');
        setSettings(prev => ({ ...prev, hasInteracted: true }));
        
        // Test voice synthesis after first interaction
        if (isSupported && settings.enabled) {
          try {
            const testUtterance = new SpeechSynthesisUtterance('');
            testUtterance.volume = 0;
            window.speechSynthesis.speak(testUtterance);
            console.log('🔊 Voice synthesis test successful');
          } catch (error) {
            console.error('🔊 Voice synthesis test failed:', error);
          }
        }
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isSupported, settings.enabled, settings.hasInteracted]);

  // Monitor speech synthesis state changes
  useEffect(() => {
    if (!isSupported) return;

    const checkSpeechState = () => {
      if (!window.speechSynthesis.speaking) {
        // If nothing is speaking, reset pause state
        if (settings.paused) {
          console.log('🔊 Speech ended, resetting pause state');
          setSettings(prev => ({ ...prev, paused: false }));
        }
      }
    };

    const interval = setInterval(checkSpeechState, 500);
    return () => clearInterval(interval);
  }, [isSupported, settings.paused]);

  // Load voices when they become available
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🔊 Loading voices:', voices.length, 'voices found');
      setAvailableVoices(voices);
      
      // Auto-select a good voice if none selected or if stored voice is not available
      if (voices.length > 0) {
        const storedVoice = settings.selectedVoice;
        const voiceExists = storedVoice && voices.some(v => v.name === storedVoice);
        
        if (!storedVoice || !voiceExists) {
          const bestVoice = findBestEnglishVoice(voices);
          if (bestVoice) {
            console.log('🔊 Auto-selecting best voice:', bestVoice.name);
            setSettings(prev => ({ ...prev, selectedVoice: bestVoice.name }));
          }
        } else {
          console.log('🔊 Using stored voice:', storedVoice);
        }
      }
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Trigger voice loading with a silent utterance
    if (availableVoices.length === 0) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      setTimeout(loadVoices, 100);
    }
  }, [isSupported, settings.selectedVoice, availableVoices.length]);

  const initializeVoice = async (): Promise<void> => {
    if (!isSupported) {
      console.warn('🔊 Speech synthesis not supported in this browser');
      return;
    }

    try {
      if (availableVoices.length === 0) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      }

      console.log('🔊 Voice initialization complete');
    } catch (error) {
      console.error('🔊 Voice initialization failed:', error);
    }
  };

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const setSelectedVoice = (voiceName: string) => {
    console.log('🔊 Setting selected voice to:', voiceName);
    setSettings(prev => ({ ...prev, selectedVoice: voiceName }));
  };

  const getSelectedVoiceObject = (): SpeechSynthesisVoice | null => {
    if (!settings.selectedVoice) return null;
    return availableVoices.find(v => v.name === settings.selectedVoice) || null;
  };

  const toggle = () => {
    const newEnabled = !settings.enabled;
    console.log('🔊 Voice toggled:', newEnabled ? 'enabled' : 'disabled');
    
    if (!newEnabled && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setSettings(prev => ({ ...prev, enabled: newEnabled, paused: false }));
  };

  const togglePaused = () => {
    const newPaused = !settings.paused;
    console.log('🔊 Pause state toggled to:', newPaused);
    setSettings(prev => ({ ...prev, paused: newPaused }));
  };

  const value = {
    settings,
    updateSettings,
    availableVoices,
    isSupported,
    toggle,
    togglePaused,
    initializeVoice,
    setSelectedVoice,
    getSelectedVoiceObject,
    saveSettingsToStorage,
    loadSettingsFromStorage
  };

  return (
    <VoiceSettingsContext.Provider value={value}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};
