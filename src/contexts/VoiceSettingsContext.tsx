
import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  autoRead: boolean;
  selectedVoice: string | null;
  rate: number;
  pitch: number;
  volume: number;
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
  toggle: () => void;
}

const VoiceSettingsContext = createContext<VoiceSettingsContextType | undefined>(undefined);

export const useVoiceSettings = () => {
  const context = useContext(VoiceSettingsContext);
  if (!context) {
    throw new Error('useVoiceSettings must be used within a VoiceSettingsProvider');
  }
  return context;
};

export const VoiceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: false,
    autoRead: true,
    selectedVoice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  });
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = 'speechSynthesis' in window;

  // Load voices when they become available
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Auto-select a good English voice if none selected
      if (!settings.selectedVoice && voices.length > 0) {
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (englishVoice) {
          setSettings(prev => ({ ...prev, selectedVoice: englishVoice.name }));
        }
      }
    };

    // Load voices immediately
    loadVoices();
    
    // Also load when voices change (some browsers load them asynchronously)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported, settings.selectedVoice]);

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggle = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const value = {
    settings,
    updateSettings,
    availableVoices,
    isSupported,
    toggle
  };

  return (
    <VoiceSettingsContext.Provider value={value}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};
