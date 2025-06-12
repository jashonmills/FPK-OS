
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useAccessibility();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    console.log('🔧 AccessibilityProvider: Applying accessibility settings', profile);
    
    if (!profile) {
      console.log('🔧 AccessibilityProvider: No profile, using defaults');
      return;
    }

    // Remove existing accessibility classes
    const existingClasses = Array.from(body.classList).filter(cls => 
      cls.startsWith('accessibility-') || cls.startsWith('fpk-accessibility-')
    );
    body.classList.remove(...existingClasses);

    // Apply font family with CSS variables and direct style overrides
    const fontFamilyMap: Record<string, string> = {
      'OpenDyslexic': '"OpenDyslexic", "Comic Sans MS", cursive',
      'Arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'Georgia': 'Georgia, "Times New Roman", Times, serif',
      'Cursive': '"Dancing Script", "Brush Script MT", cursive',
      'System': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
    
    const selectedFont = fontFamilyMap[profile.font_family || 'System'];
    
    // Apply CSS variables for maximum compatibility
    html.style.setProperty('--accessibility-font-family', selectedFont);
    html.style.setProperty('--accessibility-font-size', `${0.5 + (profile.text_size || 3) * 0.25}rem`);
    html.style.setProperty('--accessibility-line-height', `${1 + (profile.line_spacing || 3) * 0.25}`);
    
    // Apply direct styles to body for immediate effect
    body.style.fontFamily = `${selectedFont} !important`;
    
    // Add accessibility classes for cascading
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
    
    console.log('✅ Applied accessibility settings:', {
      font: selectedFont,
      size: profile.text_size,
      spacing: profile.line_spacing,
      classes: Array.from(body.classList).filter(c => c.startsWith('fpk-'))
    });
    
    // Force a repaint to ensure changes are visible
    body.offsetHeight;
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
