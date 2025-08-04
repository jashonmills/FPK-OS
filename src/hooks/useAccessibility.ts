
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!profile) return;

    console.log('🎨 useAccessibility: Updating classes for profile', {
      fontFamily: profile.font_family,
      textSize: profile.text_size,
      lineSpacing: profile.line_spacing,
      colorContrast: profile.color_contrast,
      comfortMode: profile.comfort_mode
    });

    // Apply accessibility settings globally via CSS variables
    const textSize = profile.text_size || 3;
    const lineSpacing = profile.line_spacing || 3;
    const fontFamily = profile.font_family || 'System';

    // Update CSS variables for immediate application
    const root = document.documentElement;
    root.style.setProperty('--accessibility-text-size', `${textSize * 0.25 + 0.75}rem`);
    root.style.setProperty('--accessibility-line-height', `${lineSpacing * 0.25 + 1}`);
    
    const fontMapping = {
      'System': 'system-ui, -apple-system, sans-serif',
      'OpenDyslexic': 'OpenDyslexic, system-ui, sans-serif',
      'Arial': 'Arial, sans-serif',
      'Times': 'Times, serif',
      'Verdana': 'Verdana, sans-serif'
    };
    root.style.setProperty('--accessibility-font-family', fontMapping[fontFamily as keyof typeof fontMapping] || fontMapping.System);

    // Component classes for fallback and component-specific styling
    const newClasses: AccessibilityClasses = {
      fontFamily: `font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`,
      textSize: 'text-accessibility', // Use CSS variable
      lineHeight: 'leading-accessibility', // Use CSS variable
      textColor: profile.color_contrast === 'High' ? 'text-black' : 'text-foreground',
      backgroundColor: 'bg-background',
      borderColor: 'border-border',
      cardClasses: 'bg-card text-card-foreground border-border',
      containerClasses: 'bg-background text-foreground'
    };

    setClasses(newClasses);
    
  }, [profile]);

  const getAccessibilityClasses = (element: 'card' | 'container' | 'text' = 'container') => {
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
  };

  return {
    classes,
    getAccessibilityClasses,
    profile,
    isHighContrast: profile?.color_contrast === 'High',
    comfortMode: profile?.comfort_mode || 'Normal',
    fontFamily: profile?.font_family || 'System',
    textSize: profile?.text_size || 3,
    lineSpacing: profile?.line_spacing || 3
  };
};
