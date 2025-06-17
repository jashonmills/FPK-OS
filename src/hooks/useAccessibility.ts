
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

    // Since we now apply accessibility settings globally via CSS variables,
    // these classes are mainly for fallback and component-specific styling
    const newClasses: AccessibilityClasses = {
      fontFamily: `font-${(profile.font_family || 'System').toLowerCase().replace(/\s+/g, '-')}`,
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
