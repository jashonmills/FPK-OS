import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  autoRead: boolean;
  selectedVoice: string | null; // Browser voice name
  rate: number;
  pitch: number;
  volume: number;
  hasInteracted: boolean;
  paused: boolean;
}

interface BrowserVoice {
  id: string;
  name: string;
  gender: string;
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  availableVoices: BrowserVoice[];
  isSupported: boolean;
  toggle: () => void;
  togglePaused: () => void;
  initializeVoice: () => Promise<void>;
  setSelectedVoice: (voiceId: string) => void;
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

// Get browser voices and map them to our interface
const getBrowserVoices = (): BrowserVoice[] => {
  if (!('speechSynthesis' in window)) return [];
  
  const voices = window.speechSynthesis.getVoices();
  return voices.map(voice => ({
    id: voice.name,
    name: `${voice.name} (${voice.lang})`,
    gender: voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') ? 'female' : 'male'
  }));
};

export const VoiceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    autoRead: true,
    selectedVoice: null, // Will be set to first available voice
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    hasInteracted: false,
    paused: false
  });
  
  const [availableVoices, setAvailableVoices] = useState<BrowserVoice[]>([]);
  const isSupported = 'speechSynthesis' in window;

  // Load voices when available
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = getBrowserVoices();
      setAvailableVoices(voices);
      
      // Set default voice if none selected
      if (!settings.selectedVoice && voices.length > 0) {
        const defaultVoice = voices.find(v => v.name.includes('English')) || voices[0];
        setSettings(prev => ({ ...prev, selectedVoice: defaultVoice.id }));
      }
    };

    // Load voices immediately and also when they change
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, settings.selectedVoice]);

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
      // Always ensure TTS is enabled by default, even if stored settings say otherwise
      setSettings(prev => ({ ...prev, ...storedSettings, enabled: true }));
    }
  }, []);

  // Save settings whenever they change - debounced to prevent performance issues
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSettingsToStorage();
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [settings.enabled, settings.autoRead, settings.selectedVoice, settings.rate, settings.pitch, settings.volume]);

  // Track user interaction for TTS
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!settings.hasInteracted) {
        console.log('🔊 User interaction detected, enabling browser TTS');
        setSettings(prev => ({ ...prev, hasInteracted: true }));
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [settings.hasInteracted]);

  const initializeVoice = async (): Promise<void> => {
    console.log('🔊 Browser voice system initialized with', availableVoices.length, 'voices');
  };

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const setSelectedVoice = (voiceId: string) => {
    console.log('🔊 Setting selected voice to:', voiceId);
    setSettings(prev => ({ ...prev, selectedVoice: voiceId }));
  };

  const toggle = () => {
    const newEnabled = !settings.enabled;
    console.log('🔊 Browser TTS toggled:', newEnabled ? 'enabled' : 'disabled');
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
    saveSettingsToStorage,
    loadSettingsFromStorage
  };

  return (
    <VoiceSettingsContext.Provider value={value}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};