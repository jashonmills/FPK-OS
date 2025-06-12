
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
    
    // Clear all accessibility classes
    const existingClasses = Array.from(html.classList).filter(cls => 
      cls.startsWith('font-') || 
      cls.startsWith('high-') || 
      cls.startsWith('low-') || 
      cls.startsWith('focus-') ||
      cls === 'accessibility-active'
    );
    html.classList.remove(...existingClasses);
    
    if (!profile) {
      console.log('🎨 AccessibilityProvider: No profile, clearing all accessibility');
      // Reset CSS variables to defaults
      html.style.setProperty('--accessibility-font-size', '16px');
      html.style.setProperty('--accessibility-line-height', '1.5');
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
    
    // Apply font family class to HTML
    const fontClass = `font-${(profile.font_family || 'system').toLowerCase()}`;
    html.classList.add(fontClass);
    console.log('🎨 Applied font class:', fontClass);
    
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
      lineHeight: html.style.getPropertyValue('--accessibility-line-height')
    });
    
    console.log('✅ Applied classes to HTML:', Array.from(html.classList));
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
