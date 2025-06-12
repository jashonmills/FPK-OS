
import React, { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useUserProfile();

  useEffect(() => {
    console.log('🎨 AccessibilityProvider: Profile changed', profile);
    
    if (!profile) {
      console.log('🎨 AccessibilityProvider: No profile, clearing all accessibility classes');
      // Clear all accessibility classes when no profile
      const body = document.body;
      const existingClasses = Array.from(body.classList).filter(cls => cls.startsWith('fpk-'));
      body.classList.remove(...existingClasses);
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    
    console.log('🎨 AccessibilityProvider: Applying settings', {
      font_family: profile.font_family,
      text_size: profile.text_size,
      line_spacing: profile.line_spacing,
      color_contrast: profile.color_contrast,
      comfort_mode: profile.comfort_mode
    });

    // Remove all existing accessibility classes
    const existingClasses = Array.from(body.classList).filter(cls => cls.startsWith('fpk-'));
    if (existingClasses.length > 0) {
      console.log('🧹 Removing existing classes:', existingClasses);
      body.classList.remove(...existingClasses);
    }

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
    root.style.setProperty('--accessibility-font-size', fontSize);
    root.style.setProperty('--accessibility-line-height', lineHeight);
    
    // Apply main accessibility class to activate the CSS
    body.classList.add('fpk-accessibility-active');
    
    // Apply font family class
    const fontClass = `fpk-font-${(profile.font_family || 'system').toLowerCase()}`;
    body.classList.add(fontClass);
    console.log('🎨 Applied font class:', fontClass);
    
    // Apply contrast mode
    if (profile.color_contrast === 'High') {
      body.classList.add('fpk-high-contrast');
      console.log('🎨 Applied high contrast mode');
    }
    
    // Apply comfort mode
    if (profile.comfort_mode === 'Focus Mode') {
      body.classList.add('fpk-focus-mode');
      console.log('🎨 Applied focus mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      body.classList.add('fpk-low-stimulus');
      console.log('🎨 Applied low-stimulus mode');
    }
    
    console.log('✅ Applied CSS variables:', {
      fontSize: root.style.getPropertyValue('--accessibility-font-size'),
      lineHeight: root.style.getPropertyValue('--accessibility-line-height')
    });
    
    console.log('✅ Applied classes:', Array.from(body.classList).filter(c => c.startsWith('fpk-')));
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
