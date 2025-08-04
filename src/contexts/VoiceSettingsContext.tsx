
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
  availableVoices: SpeechSynthesisVoice[];
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  toggle: () => void;
  setSelectedVoice: (voiceName: string) => void;
  getSelectedVoiceObject: () => SpeechSynthesisVoice | null;
}

const VoiceSettingsContext = createContext<VoiceSettingsContextType>({
  settings: {
    enabled: false,
    autoRead: false,
    selectedVoice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  },
  availableVoices: [],
  updateSettings: () => {},
  toggle: () => {},
  setSelectedVoice: () => {},
  getSelectedVoiceObject: () => null
});

export const VoiceSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: false,
    autoRead: false,
    selectedVoice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice if none selected
      if (!settings.selectedVoice && voices.length > 0) {
        const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        setSettings(prev => ({ ...prev, selectedVoice: englishVoice.name }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggle = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const setSelectedVoice = (voiceName: string) => {
    setSettings(prev => ({ ...prev, selectedVoice: voiceName }));
  };

  const getSelectedVoiceObject = () => {
    if (!settings.selectedVoice) return null;
    return availableVoices.find(v => v.name === settings.selectedVoice) || null;
  };

  return (
    <VoiceSettingsContext.Provider value={{
      settings,
      availableVoices,
      updateSettings,
      toggle,
      setSelectedVoice,
      getSelectedVoiceObject
    }}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export const useVoiceSettings = () => useContext(VoiceSettingsContext);
