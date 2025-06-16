
import React, { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useUserProfile();

  useEffect(() => {
    console.log('🎨 AccessibilityProvider: Profile changed', profile);
    
    const html = document.documentElement;
    const body = document.body;
    
    // Clear all accessibility classes from both html and body
    const existingClasses = Array.from(html.classList).filter(cls => 
      cls.startsWith('font-') || 
      cls.startsWith('high-') || 
      cls.startsWith('low-') || 
      cls.startsWith('focus-') ||
      cls === 'accessibility-active'
    );
    html.classList.remove(...existingClasses);
    
    // Also clear from body as a fallback
    const bodyClasses = Array.from(body.classList).filter(cls => 
      cls.startsWith('font-')
    );
    body.classList.remove(...bodyClasses);
    
    if (!profile) {
      console.log('🎨 AccessibilityProvider: No profile, clearing all accessibility');
      // Reset CSS variables to defaults
      html.style.setProperty('--accessibility-font-size', '16px');
      html.style.setProperty('--accessibility-line-height', '1.5');
      html.style.setProperty('--active-font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
      // Ensure system font is applied when no profile
      html.classList.add('font-system');
      return;
    }

    console.log('🎨 AccessibilityProvider: Applying settings', {
      font_family: profile.font_family,
      text_size: profile.text_size,
      line_spacing: profile.line_spacing,
      color_contrast: profile.color_contrast,
      comfort_mode: profile.comfort_mode
    });

    // Calculate and set CSS variables for text size and line height
    const baseSize = 16; // Base font size in px
    const sizeMultiplier = 0.75 + ((profile.text_size || 3) - 1) * 0.125; // Range: 0.75x to 1.25x
    const fontSize = `${baseSize * sizeMultiplier}px`;
    const lineHeightValue = 1 + ((profile.line_spacing || 3) - 1) * 0.25; // Range: 1 to 2
    const lineHeight = lineHeightValue.toString();
    
    console.log('🎨 Setting CSS variables:', { 
      fontSize, 
      lineHeight,
      sizeMultiplier,
      lineHeightValue
    });

    // Set CSS variables
    html.style.setProperty('--accessibility-font-size', fontSize);
    html.style.setProperty('--accessibility-line-height', lineHeight);
    
    // Apply main accessibility class to activate the CSS
    html.classList.add('accessibility-active');
    
    // Apply font family class to HTML with more robust handling
    const fontFamily = profile.font_family || 'System';
    const fontClass = `font-${fontFamily.toLowerCase()}`;
    html.classList.add(fontClass);
    
    // Force font family application with CSS custom property and direct style
    const fontFamilyMap = {
      'system': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'opendyslexic': '"OpenDyslexic", "Comic Sans MS", cursive',
      'arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'georgia': 'Georgia, "Times New Roman", Times, serif',
      'cursive': '"Dancing Script", "Brush Script MT", cursive'
    };
    
    const fontFamilyValue = fontFamilyMap[fontFamily.toLowerCase()] || fontFamilyMap.system;
    html.style.setProperty('--active-font-family', fontFamilyValue);
    
    // Force immediate font application on body and all elements
    body.style.fontFamily = fontFamilyValue;
    
    console.log('🎨 Applied font class and CSS property:', { 
      fontClass, 
      fontFamilyValue 
    });
    
    // Apply contrast mode to HTML
    if (profile.color_contrast === 'High') {
      html.classList.add('high-contrast');
      console.log('🎨 Applied high contrast mode');
    }
    
    // Apply comfort mode to HTML
    if (profile.comfort_mode === 'Focus Mode') {
      html.classList.add('focus-mode');
      console.log('🎨 Applied focus mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      html.classList.add('low-stimulus');
      console.log('🎨 Applied low-stimulus mode');
    }
    
    console.log('✅ Applied CSS variables:', {
      fontSize: html.style.getPropertyValue('--accessibility-font-size'),
      lineHeight: html.style.getPropertyValue('--accessibility-line-height'),
      fontFamily: html.style.getPropertyValue('--active-font-family')
    });
    
    console.log('✅ Applied classes to HTML:', Array.from(html.classList));
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
