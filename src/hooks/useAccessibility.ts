
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
        case 'Cursive':
          return 'font-cursive';
        case 'System':
        default:
          return 'font-system';
      }
    };

    const getTextSize = () => {
      const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];
      return sizes[(profile.text_size || 3) - 1] || 'text-base';
    };

    const getLineHeight = () => {
      const heights = ['leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'];
      return heights[(profile.line_spacing || 3) - 1] || 'leading-normal';
    };

    const getTextColor = () => {
      return profile.color_contrast === 'High' ? 'text-black' : 'text-foreground';
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

    console.log('🎨 useAccessibility: Generated classes', {
      profile: {
        fontFamily: profile.font_family,
        textSize: profile.text_size,
        lineSpacing: profile.line_spacing,
        colorContrast: profile.color_contrast,
        comfortMode: profile.comfort_mode
      },
      classes: newClasses
    });
    
  }, [profile]);

  const getAccessibilityClasses = (element: 'card' | 'container' | 'text' = 'container') => {
    // Since we now use global CSS, these classes are mainly for fallback
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
