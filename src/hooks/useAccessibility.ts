
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

    const getFontClass = () => {
      switch (profile.font_family) {
        case 'OpenDyslexic':
          return 'font-opendyslexic';
        case 'Arial':
          return 'font-arial';
        case 'Georgia':
          return 'font-georgia';
        case 'System':
          return 'font-system';
        default:
          return 'font-system';
      }
    };

    const getTextSize = () => {
      const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
      return sizes[(profile.text_size || 2) - 1] || 'text-base';
    };

    const getLineHeight = () => {
      const heights = ['leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose'];
      return heights[(profile.line_spacing || 2) - 1] || 'leading-normal';
    };

    const getTextColor = () => {
      return profile.color_contrast === 'High Contrast' ? 'text-black' : 'text-foreground';
    };

    const getBackgroundClasses = () => {
      switch (profile.comfort_mode) {
        case 'Low-Stimulus':
          return {
            backgroundColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            cardClasses: 'bg-gray-50 text-gray-900 border-gray-200',
            containerClasses: 'bg-gray-50 text-gray-900'
          };
        case 'Focus Mode':
          return {
            backgroundColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            cardClasses: 'bg-blue-50 text-blue-900 border-blue-200 shadow-lg',
            containerClasses: 'bg-blue-50 text-blue-900'
          };
        default:
          return {
            backgroundColor: 'bg-background',
            borderColor: 'border-border',
            cardClasses: 'bg-card text-card-foreground border-border',
            containerClasses: 'bg-background text-foreground'
          };
      }
    };

    const backgroundClasses = getBackgroundClasses();
    
    const newClasses: AccessibilityClasses = {
      fontFamily: getFontClass(),
      textSize: getTextSize(),
      lineHeight: getLineHeight(),
      textColor: getTextColor(),
      backgroundColor: backgroundClasses.backgroundColor,
      borderColor: backgroundClasses.borderColor,
      cardClasses: backgroundClasses.cardClasses,
      containerClasses: backgroundClasses.containerClasses
    };

    setClasses(newClasses);

    // Apply global CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--accessibility-font-family', getFontClass().replace('font-', ''));
    root.style.setProperty('--accessibility-text-size', getTextSize());
    root.style.setProperty('--accessibility-line-height', getLineHeight().replace('leading-', ''));
    
  }, [profile]);

  const getAccessibilityClasses = (element: 'card' | 'container' | 'text' = 'container') => {
    const baseClasses = `${classes.fontFamily} ${classes.textSize} ${classes.lineHeight} transition-all duration-300`;
    
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
    isHighContrast: profile?.color_contrast === 'High Contrast',
    comfortMode: profile?.comfort_mode || 'Normal',
    fontFamily: profile?.font_family || 'System',
    textSize: profile?.text_size || 2,
    lineSpacing: profile?.line_spacing || 2
  };
};
