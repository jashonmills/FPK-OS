
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { classes, getAccessibilityClasses, profile } = useAccessibility();

  useEffect(() => {
    if (!profile) return;

    console.log('🔧 AccessibilityProvider: Applying settings', {
      fontFamily: profile.font_family,
      textSize: profile.text_size,
      lineSpacing: profile.line_spacing,
      colorContrast: profile.color_contrast,
      comfortMode: profile.comfort_mode
    });

    // Apply accessibility classes to the body element with maximum mobile specificity
    const body = document.body;
    const root = document.documentElement;
    
    // Remove existing accessibility classes
    body.className = body.className.replace(/font-\w+|text-\w+|leading-\w+|bg-\w+-?\w*|accessibility-\w+/g, '').trim();
    
    // Add accessibility active class for stronger CSS targeting
    body.classList.add('accessibility-active');
    body.classList.add('accessibility-mobile-override');
    
    // Add font family class to body for stronger inheritance
    body.classList.add(classes.fontFamily);
    body.classList.add(classes.textSize);
    body.classList.add(classes.lineHeight);
    
    // Add new accessibility classes to body with stronger specificity
    const containerClasses = getAccessibilityClasses('container');
    body.className = `${body.className} ${containerClasses} accessibility-text-size-override accessibility-line-height-override`.trim();

    // Set CSS custom properties for advanced styling including mobile overrides
    root.style.setProperty('--accessibility-bg', classes.backgroundColor);
    root.style.setProperty('--accessibility-text', classes.textColor);
    root.style.setProperty('--accessibility-border', classes.borderColor);
    
    // Mobile-specific CSS custom properties with more granular sizing
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
    
    const currentTextSize = textSizeMap[classes.textSize as keyof typeof textSizeMap] || '1rem';
    const currentLineHeight = lineHeightMap[classes.lineHeight as keyof typeof lineHeightMap] || '1.5';
    
    root.style.setProperty('--mobile-text-size', currentTextSize);
    root.style.setProperty('--mobile-line-height', currentLineHeight);
    
    console.log('📱 Mobile CSS properties set:', {
      textSize: currentTextSize,
      lineHeight: currentLineHeight,
      fontFamily: classes.fontFamily
    });
    
    // Force mobile repaint with stronger DOM manipulation
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      console.log('📱 Mobile device detected, forcing repaint...');
      
      // Use multiple methods to force mobile update
      requestAnimationFrame(() => {
        // Force style recalculation
        body.style.transform = 'translateZ(0)';
        body.offsetHeight; // Trigger reflow
        body.style.transform = '';
        
        // Add mobile-specific classes
        body.classList.add('accessibility-mobile-text');
        
        // Force another repaint
        setTimeout(() => {
          const elements = document.querySelectorAll('*');
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = ''; // Clear inline styles
              el.offsetHeight; // Trigger reflow
            }
          });
        }, 100);
      });
    }
    
  }, [classes, getAccessibilityClasses, profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
