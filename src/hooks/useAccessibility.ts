
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AccessibilityClasses {
  fontFamily: string;
  textSize: string;
  lineHeight: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  cardClasses: string;
  containerClasses: string;
}

export const useAccessibility = () => {
  const { profile } = useUserProfile();
  const [classes, setClasses] = useState<AccessibilityClasses>({
    fontFamily: 'font-system',
    textSize: 'text-base',
    lineHeight: 'leading-normal',
    textColor: 'text-foreground',
    backgroundColor: 'bg-background',
    borderColor: 'border-border',
    cardClasses: 'bg-card text-card-foreground',
    containerClasses: 'bg-background text-foreground'
  });

  // Memoize profile values to prevent unnecessary re-renders
  const profileSettings = useMemo(() => {
    if (!profile) return null;
    
    return {
      fontFamily: profile.font_family || 'System',
      textSize: profile.text_size || 3,
      lineSpacing: profile.line_spacing || 3,
      colorContrast: profile.color_contrast || 'Standard',
      comfortMode: profile.comfort_mode || 'Normal'
    };
  }, [
    profile?.font_family,
    profile?.text_size,
    profile?.line_spacing,
    profile?.color_contrast,
    profile?.comfort_mode
  ]);

  useEffect(() => {
    if (!profileSettings) return;

    // Only log when settings actually change
    console.log('🎨 useAccessibility: Updating classes for profile', profileSettings);

    // Apply accessibility settings globally via CSS variables
    const root = document.documentElement;
    root.style.setProperty('--accessibility-text-size', `${profileSettings.textSize * 0.25 + 0.75}rem`);
    root.style.setProperty('--accessibility-line-height', `${profileSettings.lineSpacing * 0.25 + 1}`);
    
    const fontMapping = {
      'System': 'system-ui, -apple-system, sans-serif',
      'OpenDyslexic': 'OpenDyslexic, system-ui, sans-serif',
      'Arial': 'Arial, sans-serif',
      'Times': 'Times, serif',
      'Verdana': 'Verdana, sans-serif'
    };
    root.style.setProperty('--accessibility-font-family', fontMapping[profileSettings.fontFamily as keyof typeof fontMapping] || fontMapping.System);

    // Component classes for fallback and component-specific styling
    const newClasses: AccessibilityClasses = {
      fontFamily: `font-${profileSettings.fontFamily.toLowerCase().replace(/\s+/g, '-')}`,
      textSize: 'text-accessibility', // Use CSS variable
      lineHeight: 'leading-accessibility', // Use CSS variable
      textColor: profileSettings.colorContrast === 'High' ? 'text-black' : 'text-foreground',
      backgroundColor: 'bg-background',
      borderColor: 'border-border',
      cardClasses: 'bg-card text-card-foreground border-border',
      containerClasses: 'bg-background text-foreground'
    };

    setClasses(newClasses);
    
  }, [profileSettings]);

  const getAccessibilityClasses = useCallback((element: 'card' | 'container' | 'text' = 'container') => {
    const baseClasses = `transition-all duration-200`;
    
    switch (element) {
      case 'card':
        return `${baseClasses} ${classes.cardClasses}`;
      case 'text':
        return `${baseClasses} ${classes.textColor}`;
      case 'container':
      default:
        return `${baseClasses} ${classes.containerClasses}`;
    }
  }, [classes]);

  return useMemo(() => ({
    classes,
    getAccessibilityClasses,
    profile,
    isHighContrast: profileSettings?.colorContrast === 'High',
    comfortMode: profileSettings?.comfortMode || 'Normal',
    fontFamily: profileSettings?.fontFamily || 'System',
    textSize: profileSettings?.textSize || 3,
    lineSpacing: profileSettings?.lineSpacing || 3
  }), [classes, getAccessibilityClasses, profile, profileSettings]);
};
