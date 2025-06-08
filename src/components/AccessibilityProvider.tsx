
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { classes, getAccessibilityClasses } = useAccessibility();

  useEffect(() => {
    // Apply accessibility classes to the body element
    const body = document.body;
    const root = document.documentElement;
    
    // Remove existing accessibility classes
    body.className = body.className.replace(/font-\w+|text-\w+|leading-\w+|bg-\w+-?\w*|text-\w+-?\w*/g, '').trim();
    
    // Add new accessibility classes to body
    const containerClasses = getAccessibilityClasses('container');
    body.className = `${body.className} ${containerClasses}`.trim();

    // Set CSS custom properties for advanced styling
    root.style.setProperty('--accessibility-bg', classes.backgroundColor);
    root.style.setProperty('--accessibility-text', classes.textColor);
    root.style.setProperty('--accessibility-border', classes.borderColor);
    
  }, [classes, getAccessibilityClasses]);

  return <>{children}</>;
};

export default AccessibilityProvider;
