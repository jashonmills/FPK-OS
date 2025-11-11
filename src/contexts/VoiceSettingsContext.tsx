import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';
import { isMobileBrowser, resumeAudioContextOnMobile } from '@/utils/mobileAudioUtils';

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
  setSelectedVoice: (voiceId: string | null) => void;
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
  const cleanup = useCleanup('VoiceSettingsProvider');
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
      
      // Don't auto-select a voice - let selectedVoice remain null
      // This allows persona-specific premium voices to be used by default
      console.log('🔊 Loaded', voices.length, 'voices. selectedVoice:', settings.selectedVoice || 'null (will use persona defaults)');
    };

    // Load voices immediately and also when they change
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  // Load settings from localStorage on mount
  const loadSettingsFromStorage = (): Partial<VoiceSettings> => {
    const stored = safeLocalStorage.getItem<Partial<VoiceSettings>>('voiceSettings', {
      fallbackValue: {},
      logErrors: false
    });
    
    if (stored && typeof stored === 'object') {
      console.log('🔊 Loaded voice settings from storage:', stored);
      return stored;
    }
    
    return {};
  };

  // Save settings to localStorage (safe)
  const saveSettingsToStorage = () => {
    const success = safeLocalStorage.setItem('voiceSettings', {
      enabled: settings.enabled,
      autoRead: settings.autoRead,
      selectedVoice: settings.selectedVoice,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume
    });
    
    if (success) {
      console.log('🔊 Saved voice settings to storage');
    }
  };

  // Load settings on mount
  useEffect(() => {
    const storedSettings = loadSettingsFromStorage();
    if (Object.keys(storedSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...storedSettings }));
    }
  }, []);

  // Save settings whenever they change - debounced to prevent performance issues
  useEffect(() => {
    cleanup.setTimeout(() => {
      saveSettingsToStorage();
    }, 1000); // Debounce saves by 1 second
  }, [settings.enabled, settings.autoRead, settings.selectedVoice, settings.rate, settings.pitch, settings.volume, cleanup]);

  // Track user interaction for TTS
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!settings.hasInteracted) {
        console.log('🔊 User interaction detected, enabling browser TTS');
        
        // MOBILE FIX: Resume audio context immediately on mobile
        if (isMobileBrowser()) {
          await resumeAudioContextOnMobile();
          console.log('📱 Mobile audio context resumed');
        }
        
        setSettings(prev => ({ ...prev, hasInteracted: true }));
      }
    };

    cleanup.addEventListener(document, 'click', handleUserInteraction);
    cleanup.addEventListener(document, 'touchstart', handleUserInteraction);
    cleanup.addEventListener(document, 'keydown', handleUserInteraction);
  }, [settings.hasInteracted, cleanup]);

  const initializeVoice = async (): Promise<void> => {
    console.log('🔊 Browser voice system initialized with', availableVoices.length, 'voices');
  };

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const setSelectedVoice = (voiceId: string | null) => {
    console.log('🔊 Setting selected voice to:', voiceId || 'null (persona defaults)');
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