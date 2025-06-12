
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
      console.log('🎨 AccessibilityProvider: No profile, skipping');
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
    const existingClasses = Array.from(body.classList).filter(cls => 
      cls.startsWith('fpk-') || cls.startsWith('accessibility-')
    );
    if (existingClasses.length > 0) {
      console.log('🧹 Removing existing classes:', existingClasses);
      body.classList.remove(...existingClasses);
    }

    // Font family mapping
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
    
    console.log('🎨 Calculated styles:', { selectedFont, fontSize, lineHeight });

    // Set CSS variables on the root element
    root.style.setProperty('--accessibility-font-family', selectedFont);
    root.style.setProperty('--accessibility-font-size', fontSize);
    root.style.setProperty('--accessibility-line-height', lineHeight);
    root.style.setProperty('--mobile-text-size', fontSize);
    root.style.setProperty('--mobile-line-height', lineHeight);
    
    // Apply CSS classes for additional styling hooks
    body.classList.add('fpk-accessibility-active');
    body.classList.add(`fpk-font-${profile.font_family?.toLowerCase() || 'system'}`);
    body.classList.add(`fpk-text-size-${profile.text_size || 3}`);
    body.classList.add(`fpk-line-spacing-${profile.line_spacing || 3}`);
    
    // Apply contrast mode
    if (profile.color_contrast === 'High') {
      body.classList.add('fpk-high-contrast');
      root.style.setProperty('--accessibility-text', '#000000');
      root.style.setProperty('--accessibility-bg', '#ffffff');
    } else {
      root.style.setProperty('--accessibility-text', 'var(--foreground)');
      root.style.setProperty('--accessibility-bg', 'var(--background)');
    }
    
    // Apply comfort mode
    if (profile.comfort_mode === 'Focus Mode') {
      body.classList.add('fpk-focus-mode');
      root.style.setProperty('--accessibility-bg', '#eff6ff');
      root.style.setProperty('--accessibility-border', '#dbeafe');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      body.classList.add('fpk-low-stimulus');
      root.style.setProperty('--accessibility-bg', '#f9fafb');
      root.style.setProperty('--accessibility-border', '#f3f4f6');
    } else {
      root.style.setProperty('--accessibility-border', 'var(--border)');
    }
    
    console.log('✅ Applied CSS variables:', {
      fontFamily: root.style.getPropertyValue('--accessibility-font-family'),
      fontSize: root.style.getPropertyValue('--accessibility-font-size'),
      lineHeight: root.style.getPropertyValue('--accessibility-line-height')
    });
    
    console.log('✅ Applied classes:', Array.from(body.classList).filter(c => c.startsWith('fpk-')));
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
