
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { classes, getAccessibilityClasses, profile } = useAccessibility();

  useEffect(() => {
    if (!profile) return;

    // Apply accessibility classes to the body element with mobile optimization
    const body = document.body;
    const root = document.documentElement;
    
    // Remove existing accessibility classes
    body.className = body.className.replace(/font-\w+|text-\w+|leading-\w+|bg-\w+-?\w*|accessibility-\w+/g, '').trim();
    
    // Add accessibility active class for mobile detection
    body.classList.add('accessibility-active');
    
    // Add new accessibility classes to body with stronger specificity
    const containerClasses = getAccessibilityClasses('container');
    body.className = `${body.className} ${containerClasses} accessibility-text-size-override accessibility-line-height-override`.trim();

    // Set CSS custom properties for advanced styling including mobile overrides
    root.style.setProperty('--accessibility-bg', classes.backgroundColor);
    root.style.setProperty('--accessibility-text', classes.textColor);
    root.style.setProperty('--accessibility-border', classes.borderColor);
    
    // Mobile-specific CSS custom properties
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
    
    // Force repaint on mobile devices
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setTimeout(() => {
        body.style.display = 'none';
        body.offsetHeight; // Trigger reflow
        body.style.display = '';
      }, 50);
    }
    
  }, [classes, getAccessibilityClasses, profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
