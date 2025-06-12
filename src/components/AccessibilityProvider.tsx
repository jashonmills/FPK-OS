
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
    
    console.log('🔧 AccessibilityProvider: Applying settings', {
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

    // Remove existing inline styles
    body.style.removeProperty('font-family');
    body.style.removeProperty('font-size');
    body.style.removeProperty('line-height');

    // Apply font family - both class and inline style for maximum effect
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
    
    // Apply CSS classes for specificity
    body.classList.add('fpk-accessibility-active');
    body.classList.add(`fpk-font-${profile.font_family?.toLowerCase() || 'system'}`);
    body.classList.add(`fpk-text-size-${profile.text_size || 3}`);
    body.classList.add(`fpk-line-spacing-${profile.line_spacing || 3}`);
    
    // Apply inline styles with !important through style attribute manipulation
    body.setAttribute('style', `
      font-family: ${selectedFont} !important;
      font-size: ${fontSize} !important;
      line-height: ${lineHeight} !important;
      ${body.getAttribute('style') || ''}
    `);
    
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
    console.log('✅ Applied inline styles:', body.getAttribute('style'));
    
    // Force a style recalculation and repaint
    body.offsetHeight;
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight;
    document.documentElement.style.display = '';
    
    // Create a style element to inject global styles as backup
    let styleElement = document.getElementById('fpk-accessibility-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'fpk-accessibility-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.innerHTML = `
      body.fpk-accessibility-active *,
      body.fpk-accessibility-active *::before,
      body.fpk-accessibility-active *::after {
        font-family: ${selectedFont} !important;
        font-size: ${fontSize} !important;
        line-height: ${lineHeight} !important;
      }
      
      body.fpk-font-${profile.font_family?.toLowerCase() || 'system'} *,
      body.fpk-font-${profile.font_family?.toLowerCase() || 'system'} *::before,
      body.fpk-font-${profile.font_family?.toLowerCase() || 'system'} *::after {
        font-family: ${selectedFont} !important;
      }
      
      body.fpk-text-size-${profile.text_size || 3} *,
      body.fpk-text-size-${profile.text_size || 3} *::before,
      body.fpk-text-size-${profile.text_size || 3} *::after {
        font-size: ${fontSize} !important;
      }
      
      body.fpk-line-spacing-${profile.line_spacing || 3} *,
      body.fpk-line-spacing-${profile.line_spacing || 3} *::before,
      body.fpk-line-spacing-${profile.line_spacing || 3} *::after {
        line-height: ${lineHeight} !important;
      }
    `;
    
    console.log('✅ Injected global styles');
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
