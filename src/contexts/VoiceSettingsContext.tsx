
import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  autoRead: boolean;
  selectedVoice: string | null;
  rate: number;
  pitch: number;
  volume: number;
  hasInteracted: boolean;
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
  toggle: () => void;
  initializeVoice: () => Promise<void>;
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
    enabled: true, // Enable by default
    autoRead: true,
    selectedVoice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    hasInteracted: false
  });
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = 'speechSynthesis' in window;

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
            testUtterance.volume = 0; // Silent test
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

  // Load voices when they become available
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🔊 Loading voices:', voices.length, 'voices found');
      setAvailableVoices(voices);
      
      // Auto-select a good English voice if none selected
      if (!settings.selectedVoice && voices.length > 0) {
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (englishVoice) {
          console.log('🔊 Auto-selecting voice:', englishVoice.name);
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

    // Force voice loading in some browsers
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
      // Ensure voices are loaded
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

  const toggle = () => {
    const newEnabled = !settings.enabled;
    console.log('🔊 Voice toggled:', newEnabled ? 'enabled' : 'disabled');
    setSettings(prev => ({ ...prev, enabled: newEnabled }));
  };

  const value = {
    settings,
    updateSettings,
    availableVoices,
    isSupported,
    toggle,
    initializeVoice
  };

  return (
    <VoiceSettingsContext.Provider value={value}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};
