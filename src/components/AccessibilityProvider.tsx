
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { classes, getAccessibilityClasses } = useAccessibility();

  useEffect(() => {
    // Apply accessibility classes to the body element with mobile-specific handling
    const body = document.body;
    const root = document.documentElement;
    
    // Remove existing accessibility classes more thoroughly
    body.className = body.className.replace(/font-\w+|text-\w+|leading-\w+|bg-\w+-?\w*|text-\w+-?\w*/g, '').trim();
    
    // Add new accessibility classes to body with !important for mobile
    const containerClasses = getAccessibilityClasses('container');
    body.className = `${body.className} ${containerClasses}`.trim();

    // Set CSS custom properties for advanced styling
    root.style.setProperty('--accessibility-bg', classes.backgroundColor);
    root.style.setProperty('--accessibility-text', classes.textColor);
    root.style.setProperty('--accessibility-border', classes.borderColor);
    
    // Mobile-specific font application - force font family on all elements
    const fontFamily = classes.fontFamily.replace('font-', '');
    let fontFamilyValue = '';
    
    switch (fontFamily) {
      case 'opendyslexic':
        fontFamilyValue = "'OpenDyslexic', 'Comic Sans MS', cursive";
        break;
      case 'arial':
        fontFamilyValue = "'Arial', 'Helvetica', sans-serif";
        break;
      case 'georgia':
        fontFamilyValue = "'Georgia', 'Times New Roman', serif";
        break;
      default:
        fontFamilyValue = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        break;
    }

    // Apply font family directly to root and body for mobile compatibility
    root.style.setProperty('--accessibility-font-family', fontFamilyValue);
    body.style.fontFamily = `${fontFamilyValue} !important`;
    
    // Create and inject mobile-specific CSS to ensure font application
    let mobileStyleElement = document.getElementById('accessibility-mobile-styles');
    if (!mobileStyleElement) {
      mobileStyleElement = document.createElement('style');
      mobileStyleElement.id = 'accessibility-mobile-styles';
      document.head.appendChild(mobileStyleElement);
    }
    
    mobileStyleElement.textContent = `
      /* Mobile-specific accessibility font enforcement */
      @media (max-width: 768px) {
        * {
          font-family: ${fontFamilyValue} !important;
        }
        
        body, body * {
          font-family: ${fontFamilyValue} !important;
        }
        
        .font-opendyslexic, .font-opendyslexic * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', cursive !important;
        }
        
        .font-arial, .font-arial * {
          font-family: 'Arial', 'Helvetica', sans-serif !important;
        }
        
        .font-georgia, .font-georgia * {
          font-family: 'Georgia', 'Times New Roman', serif !important;
        }
        
        .font-system, .font-system * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      }
    `;

    // Clean up function to remove mobile styles when component unmounts
    return () => {
      const styleElement = document.getElementById('accessibility-mobile-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
    
  }, [classes, getAccessibilityClasses]);

  return <>{children}</>;
};

export default AccessibilityProvider;
