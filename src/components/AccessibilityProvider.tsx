
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AccessibilitySettings {
  fontFamily: string;
  textSize: number;
  lineSpacing: number;
  colorContrast: string;
  comfortMode: string;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  getAccessibilityClasses: (element: string) => string;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  isLoading: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const defaultSettings: AccessibilitySettings = {
  fontFamily: 'System',
  textSize: 2,
  lineSpacing: 2,
  colorContrast: 'Standard',
  comfortMode: 'Normal'
};

const STORAGE_KEY = 'fpk-accessibility-settings';

const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings immediately from localStorage on mount
  useEffect(() => {
    const loadImmediateSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          console.log('🎨 AccessibilityProvider: Loaded settings from localStorage:', parsedSettings);
          setSettings(parsedSettings);
          applySettingsToDOM(parsedSettings);
        }
      } catch (error) {
        console.error('Failed to load accessibility settings from localStorage:', error);
      }
      setIsLoading(false);
    };

    loadImmediateSettings();
  }, []);

  // Apply settings to DOM
  const applySettingsToDOM = useCallback((newSettings: AccessibilitySettings) => {
    const html = document.documentElement;
    
    // Apply font family
    html.setAttribute('data-font-family', newSettings.fontFamily);
    
    // Apply text size
    html.setAttribute('data-text-size', newSettings.textSize.toString());
    
    // Apply line spacing
    html.setAttribute('data-line-spacing', newSettings.lineSpacing.toString());
    
    // Apply color contrast
    html.setAttribute('data-color-contrast', newSettings.colorContrast);
    
    // Apply comfort mode
    html.setAttribute('data-comfort-mode', newSettings.comfortMode);

    console.log('🎨 AccessibilityProvider: Applied settings to DOM:', newSettings);
  }, []);

  // Update settings from profile when available
  useEffect(() => {
    if (profile && !profileLoading) {
      const profileSettings: AccessibilitySettings = {
        fontFamily: profile.font_family || defaultSettings.fontFamily,
        textSize: profile.text_size || defaultSettings.textSize,
        lineSpacing: profile.line_spacing || defaultSettings.lineSpacing,
        colorContrast: profile.color_contrast || defaultSettings.colorContrast,
        comfortMode: profile.comfort_mode || defaultSettings.comfortMode
      };

      console.log('🎨 AccessibilityProvider: Loading settings from profile:', profileSettings);
      setSettings(profileSettings);
      applySettingsToDOM(profileSettings);
      
      // Save to localStorage for immediate future access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileSettings));
    }
  }, [profile, profileLoading, applySettingsToDOM]);

  // Apply settings whenever they change
  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings, applySettingsToDOM]);

  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      console.log('🎨 AccessibilityProvider: Updating settings:', updated);
      
      // Apply immediately to DOM
      applySettingsToDOM(updated);
      
      // Save to localStorage for persistence
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      return updated;
    });
  }, [applySettingsToDOM]);

  const getAccessibilityClasses = useCallback((element: string) => {
    const baseClasses = 'accessibility-protected';
    
    switch (element) {
      case 'container':
        return `${baseClasses} transition-all duration-200`;
      case 'text':
        return `${baseClasses}`;
      case 'card':
        return `${baseClasses} fpk-card`;
      default:
        return baseClasses;
    }
  }, []);

  const contextValue: AccessibilityContextType = {
    settings,
    getAccessibilityClasses,
    updateSettings,
    isLoading: isLoading && profileLoading
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;
