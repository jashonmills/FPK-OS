
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
    
    // Clear all accessibility classes
    const existingClasses = Array.from(html.classList).filter(cls => 
      cls.startsWith('font-') || 
      cls.startsWith('high-') || 
      cls.startsWith('low-') || 
      cls.startsWith('focus-') ||
      cls === 'accessibility-active'
    );
    html.classList.remove(...existingClasses);
    
    // Remove any existing font override styles
    const existingOverrides = document.querySelectorAll('#accessibility-font-override');
    existingOverrides.forEach(el => el.remove());
    
    if (!profile) {
      console.log('🎨 AccessibilityProvider: No profile, clearing all accessibility');
      // Reset to system font
      body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
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
    const baseSize = 16;
    const sizeMultiplier = 0.75 + ((profile.text_size || 3) - 1) * 0.125;
    const fontSize = `${baseSize * sizeMultiplier}px`;
    const lineHeightValue = 1 + ((profile.line_spacing || 3) - 1) * 0.25;
    const lineHeight = lineHeightValue.toString();
    
    console.log('🎨 Setting CSS variables:', { fontSize, lineHeight });

    // Set CSS variables
    html.style.setProperty('--accessibility-font-size', fontSize);
    html.style.setProperty('--accessibility-line-height', lineHeight);
    html.classList.add('accessibility-active');
    
    // Apply font family directly to body - this is the key fix
    const fontFamily = profile.font_family || 'System';
    console.log('🎨 Setting font family:', fontFamily);
    
    switch (fontFamily) {
      case 'OpenDyslexic':
        // DIRECT BODY FONT APPLICATION - no CSS classes or overrides
        body.style.fontFamily = '"OpenDyslexic", "Comic Sans MS", cursive';
        console.log('🎨 Applied OpenDyslexic directly to body');
        break;
      case 'Arial':
        body.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
        break;
      case 'Georgia':
        body.style.fontFamily = 'Georgia, "Times New Roman", Times, serif';
        break;
      case 'Cursive':
        body.style.fontFamily = '"Dancing Script", "Brush Script MT", cursive';
        break;
      case 'System':
      default:
        body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        break;
    }
    
    // Apply contrast mode
    if (profile.color_contrast === 'High') {
      html.classList.add('high-contrast');
    }
    
    // Apply comfort mode
    if (profile.comfort_mode === 'Focus Mode') {
      html.classList.add('focus-mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      html.classList.add('low-stimulus');
    }
    
    console.log('✅ Accessibility settings applied successfully');
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
