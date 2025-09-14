
import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  autoRead: boolean;
  selectedVoice: string | null; // ElevenLabs voice ID
  rate: number;
  pitch: number;
  volume: number;
  hasInteracted: boolean;
  paused: boolean;
}

interface ElevenLabsVoice {
  id: string;
  name: string;
  gender: string;
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  availableVoices: ElevenLabsVoice[];
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

// ElevenLabs voice definitions
const getElevenLabsVoices = (): ElevenLabsVoice[] => [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah - Warm Female', gender: 'female' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica - Professional Female', gender: 'female' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily - Youthful Female', gender: 'female' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte - Clear Female', gender: 'female' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian - Professional Male', gender: 'male' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel - Natural Male', gender: 'male' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam - Clear Male', gender: 'male' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will - Conversational Male', gender: 'male' }
];

export const VoiceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    autoRead: true,
    selectedVoice: 'EXAVITQu4vr4xnSDxMaL', // Default to Sarah
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    hasInteracted: false,
    paused: false
  });
  
  const availableVoices = getElevenLabsVoices();
  const isSupported = true; // ElevenLabs is always supported

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

  // Track user interaction for ElevenLabs TTS
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!settings.hasInteracted) {
        console.log('🔊 User interaction detected, enabling ElevenLabs TTS');
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
    console.log('🔊 ElevenLabs voice system initialized with', availableVoices.length, 'voices');
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
    console.log('🔊 ElevenLabs TTS toggled:', newEnabled ? 'enabled' : 'disabled');
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
