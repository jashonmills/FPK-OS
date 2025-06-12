
import React, { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useUserProfile();

  useEffect(() => {
    console.log('🔧 AccessibilityProvider: Profile changed', profile);
    
    if (!profile) {
      console.log('🔧 AccessibilityProvider: No profile, skipping');
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    
    console.log('🔧 AccessibilityProvider: Current settings', {
      font_family: profile.font_family,
      text_size: profile.text_size,
      line_spacing: profile.line_spacing,
      color_contrast: profile.color_contrast,
      comfort_mode: profile.comfort_mode
    });

    // Remove all existing accessibility classes
    const existingClasses = Array.from(body.classList).filter(cls => 
      cls.startsWith('fpk-') || cls.startsWith('accessibility-')
    );
    if (existingClasses.length > 0) {
      console.log('🔧 Removing existing classes:', existingClasses);
      body.classList.remove(...existingClasses);
    }

    // Apply font family with both CSS variables and direct inline styles
    const fontFamilyMap: Record<string, string> = {
      'OpenDyslexic': '"OpenDyslexic", "Comic Sans MS", cursive',
      'Arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'Georgia': 'Georgia, "Times New Roman", Times, serif',
      'Cursive': '"Dancing Script", "Brush Script MT", cursive',
      'System': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
    
    const selectedFont = fontFamilyMap[profile.font_family || 'System'];
    const fontSize = `${0.5 + (profile.text_size || 3) * 0.25}rem`;
    const lineHeight = `${1 + (profile.line_spacing || 3) * 0.25}`;
    
    console.log('🔧 Applying styles:', { selectedFont, fontSize, lineHeight });
    
    // Set CSS variables
    html.style.setProperty('--accessibility-font-family', selectedFont);
    html.style.setProperty('--accessibility-font-size', fontSize);
    html.style.setProperty('--accessibility-line-height', lineHeight);
    
    // Apply direct styles to body and all elements
    body.style.fontFamily = `${selectedFont} !important`;
    body.style.fontSize = `${fontSize} !important`;
    body.style.lineHeight = `${lineHeight} !important`;
    
    // Add accessibility classes
    body.classList.add('fpk-accessibility-active');
    body.classList.add(`fpk-font-${profile.font_family?.toLowerCase() || 'system'}`);
    body.classList.add(`fpk-text-size-${profile.text_size || 3}`);
    body.classList.add(`fpk-line-spacing-${profile.line_spacing || 3}`);
    
    // Apply contrast mode
    if (profile.color_contrast === 'High') {
      body.classList.add('fpk-high-contrast');
    }
    
    // Apply comfort mode
    if (profile.comfort_mode === 'Focus Mode') {
      body.classList.add('fpk-focus-mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      body.classList.add('fpk-low-stimulus');
    }
    
    console.log('✅ Applied classes:', Array.from(body.classList).filter(c => c.startsWith('fpk-')));
    console.log('✅ Applied styles:', {
      fontFamily: body.style.fontFamily,
      fontSize: body.style.fontSize,
      lineHeight: body.style.lineHeight
    });
    
    // Force a style recalculation
    body.offsetHeight;
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
