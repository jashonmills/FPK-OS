
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { classes, profile } = useAccessibility();

  useEffect(() => {
    if (!profile) return;

    console.log('🔧 AccessibilityProvider: Applying global accessibility settings', {
      fontFamily: profile.font_family,
      textSize: profile.text_size,
      lineSpacing: profile.line_spacing,
      colorContrast: profile.color_contrast,
      comfortMode: profile.comfort_mode
    });

    const body = document.body;
    const root = document.documentElement;
    
    // Remove all existing accessibility classes
    body.classList.remove(
      'accessibility-active',
      'font-opendyslexic', 'font-arial', 'font-georgia', 'font-system',
      'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
      'leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose',
      'high-contrast', 'focus-mode', 'low-stimulus'
    );
    
    // Add the accessibility-active class to enable global overrides
    body.classList.add('accessibility-active');
    
    // Add font family class
    body.classList.add(classes.fontFamily);
    
    // Add text size class
    body.classList.add(classes.textSize);
    
    // Add line height class
    body.classList.add(classes.lineHeight);
    
    // Add color contrast mode
    if (profile.color_contrast === 'High Contrast') {
      body.classList.add('high-contrast');
    }
    
    // Add comfort mode classes
    switch (profile.comfort_mode) {
      case 'Focus Mode':
        body.classList.add('focus-mode');
        break;
      case 'Low-Stimulus':
        body.classList.add('low-stimulus');
        break;
    }
    
    // Set CSS custom properties for more granular control
    const fontFamilyMap = {
      'font-opendyslexic': "'OpenDyslexic', 'Comic Sans MS', cursive",
      'font-arial': "'Arial', 'Helvetica', sans-serif",
      'font-georgia': "'Georgia', 'Times New Roman', serif",
      'font-system': "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };
    
    const textSizeMap = {
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem'
    };
    
    const lineHeightMap = {
      'leading-tight': '1.25',
      'leading-normal': '1.5',
      'leading-relaxed': '1.625',
      'leading-loose': '2'
    };
    
    // Apply CSS custom properties
    root.style.setProperty('--accessibility-font-family', fontFamilyMap[classes.fontFamily as keyof typeof fontFamilyMap] || fontFamilyMap['font-system']);
    root.style.setProperty('--accessibility-font-size', textSizeMap[classes.textSize as keyof typeof textSizeMap] || '1rem');
    root.style.setProperty('--accessibility-line-height', lineHeightMap[classes.lineHeight as keyof typeof lineHeightMap] || '1.5');
    
    console.log('✅ Applied global accessibility classes:', {
      fontFamily: classes.fontFamily,
      textSize: classes.textSize,
      lineHeight: classes.lineHeight,
      customProperties: {
        fontFamily: fontFamilyMap[classes.fontFamily as keyof typeof fontFamilyMap],
        fontSize: textSizeMap[classes.textSize as keyof typeof textSizeMap],
        lineHeight: lineHeightMap[classes.lineHeight as keyof typeof lineHeightMap]
      }
    });
    
    // Force repaint for better browser compatibility
    requestAnimationFrame(() => {
      body.style.transform = 'translateZ(0)';
      body.offsetHeight; // Trigger reflow
      body.style.transform = '';
    });
    
  }, [classes, profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
