
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AccessibilityState {
  fontFamily: string;
  textSize: number;
  lineSpacing: number;
  colorContrast: string;
  comfortMode: string;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_ACCESSIBILITY_STATE: AccessibilityState = {
  fontFamily: 'System',
  textSize: 3,
  lineSpacing: 3,
  colorContrast: 'Standard',
  comfortMode: 'Normal',
  isLoading: false,
  error: null,
};

export const useOptimizedAccessibility = () => {
  const { profile } = useUserProfile();
  const [state, setState] = useState<AccessibilityState>(DEFAULT_ACCESSIBILITY_STATE);
  const [appliedSettings, setAppliedSettings] = useState<any>(null);

  // Memoize settings to prevent unnecessary re-renders
  const currentSettings = useMemo(() => {
    if (!profile) return null;
    
    return {
      fontFamily: profile.font_family || 'System',
      textSize: profile.text_size || 3,
      lineSpacing: profile.line_spacing || 3,
      colorContrast: profile.color_contrast || 'Standard',
      comfortMode: profile.comfort_mode || 'Normal',
    };
  }, [profile]);

  // Apply settings with error handling and performance optimization
  const applyAccessibilitySettings = useCallback(async (settings: any) => {
    if (!settings) return;

    // Skip if settings haven't changed
    if (appliedSettings && JSON.stringify(settings) === JSON.stringify(appliedSettings)) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const html = document.documentElement;
      const body = document.body;

      // Clear existing accessibility classes with error handling
      try {
        const existingClasses = Array.from(html.classList).filter(cls => 
          cls.startsWith('font-') || 
          cls.startsWith('high-') || 
          cls.startsWith('low-') || 
          cls.startsWith('focus-') ||
          cls === 'accessibility-active'
        );
        html.classList.remove(...existingClasses);
      } catch (error) {
        console.warn('Error clearing existing classes:', error);
      }

      // Apply font with fallback handling
      try {
        const fontFamily = settings.fontFamily || 'System';
        
        switch (fontFamily) {
          case 'OpenDyslexic':
            html.classList.add('font-opendyslexic');
            body.style.fontFamily = 'Atkinson Hyperlegible, Comic Sans MS, Trebuchet MS, Verdana, sans-serif';
            break;
          case 'Arial':
            html.classList.add('font-arial');
            body.style.fontFamily = 'Arial, Helvetica Neue, Helvetica, sans-serif';
            break;
          case 'Georgia':
            html.classList.add('font-georgia');
            body.style.fontFamily = 'Georgia, Times New Roman, Times, serif';
            break;
          case 'Cursive':
            html.classList.add('font-cursive');
            body.style.fontFamily = 'Dancing Script, Brush Script MT, cursive';
            break;
          case 'System':
          default:
            html.classList.add('font-system');
            body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
            break;
        }
      } catch (error) {
        console.warn('Error applying font family:', error);
        // Fallback to system font
        body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      }

      // Apply size and spacing with validation
      try {
        const baseSize = 16;
        const textSize = Math.max(1, Math.min(5, settings.textSize || 3));
        const lineSpacing = Math.max(1, Math.min(5, settings.lineSpacing || 3));
        
        const sizeMultiplier = 0.75 + (textSize - 1) * 0.125;
        const fontSize = `${baseSize * sizeMultiplier}px`;
        const lineHeightValue = 1 + (lineSpacing - 1) * 0.25;
        
        html.style.setProperty('--accessibility-font-size', fontSize);
        html.style.setProperty('--accessibility-line-height', lineHeightValue.toString());
      } catch (error) {
        console.warn('Error applying text size/spacing:', error);
        // Fallback to default values
        html.style.setProperty('--accessibility-font-size', '16px');
        html.style.setProperty('--accessibility-line-height', '1.5');
      }

      // Apply contrast and comfort modes with error handling
      try {
        if (settings.colorContrast === 'High') {
          html.classList.add('high-contrast');
        }
        
        if (settings.comfortMode === 'Focus Mode') {
          html.classList.add('focus-mode');
        } else if (settings.comfortMode === 'Low-Stimulus') {
          html.classList.add('low-stimulus');
        }
      } catch (error) {
        console.warn('Error applying contrast/comfort modes:', error);
      }

      html.classList.add('accessibility-active');
      setAppliedSettings(settings);
      
      setState(prev => ({
        ...prev,
        ...settings,
        isLoading: false,
        error: null,
      }));

      console.log('✅ Accessibility settings applied successfully:', settings);
    } catch (error) {
      console.error('❌ Failed to apply accessibility settings:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to apply accessibility settings. Please try refreshing the page.',
      }));
    }
  }, [appliedSettings]);

  // Apply settings when profile changes
  useEffect(() => {
    if (currentSettings) {
      applyAccessibilitySettings(currentSettings);
    }
  }, [currentSettings, applyAccessibilitySettings]);

  // Provide fallback when no profile is available
  useEffect(() => {
    if (!profile && !appliedSettings) {
      setState(DEFAULT_ACCESSIBILITY_STATE);
    }
  }, [profile, appliedSettings]);

  const getAccessibilityClasses = useCallback((element: 'card' | 'container' | 'text' = 'container') => {
    const baseClasses = 'transition-all duration-200';
    
    switch (element) {
      case 'card':
        return `${baseClasses} bg-card text-card-foreground border-border`;
      case 'text':
        return `${baseClasses} ${state.colorContrast === 'High' ? 'text-black' : 'text-foreground'}`;
      case 'container':
      default:
        return `${baseClasses} bg-background text-foreground`;
    }
  }, [state.colorContrast]);

  return {
    ...state,
    getAccessibilityClasses,
    isHighContrast: state.colorContrast === 'High',
    applySettings: applyAccessibilitySettings,
  };
};
