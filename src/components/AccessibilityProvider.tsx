
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useAccessibility();

  useEffect(() => {
    if (!profile) {
      console.log('🔧 AccessibilityProvider: No profile, removing accessibility settings');
      // Remove accessibility attributes when no profile
      document.documentElement.removeAttribute('data-accessibility');
      document.documentElement.removeAttribute('data-font');
      document.documentElement.removeAttribute('data-text-size');
      document.documentElement.removeAttribute('data-line-spacing');
      document.documentElement.removeAttribute('data-contrast');
      document.documentElement.removeAttribute('data-comfort');
      return;
    }

    console.log('🔧 AccessibilityProvider: Applying global accessibility settings', {
      fontFamily: profile.font_family,
      textSize: profile.text_size,
      lineSpacing: profile.line_spacing,
      colorContrast: profile.color_contrast,
      comfortMode: profile.comfort_mode
    });

    const html = document.documentElement;
    
    // Set data attributes for CSS selectors
    html.setAttribute('data-accessibility', 'active');
    
    // Set font family with corrected mapping
    const fontMap: Record<string, string> = {
      'OpenDyslexic': 'opendyslexic',
      'Arial': 'arial', 
      'Georgia': 'georgia',
      'Cursive': 'cursive',
      'System': 'system'
    };
    html.setAttribute('data-font', fontMap[profile.font_family || 'System'] || 'system');
    
    // Set text size (1-5 range) with defaults
    html.setAttribute('data-text-size', String(profile.text_size || 3));
    
    // Set line spacing (1-5 range) with defaults
    html.setAttribute('data-line-spacing', String(profile.line_spacing || 3));
    
    // Set contrast mode
    if (profile.color_contrast === 'High') {
      html.setAttribute('data-contrast', 'high');
    } else {
      html.removeAttribute('data-contrast');
    }
    
    // Set comfort mode
    const comfortMap: Record<string, string> = {
      'Focus Mode': 'focus',
      'Low-Stimulus': 'low-stimulus'
    };
    if (profile.comfort_mode && comfortMap[profile.comfort_mode]) {
      html.setAttribute('data-comfort', comfortMap[profile.comfort_mode]);
    } else {
      html.removeAttribute('data-comfort');
    }
    
    // Set CSS custom properties for more granular control
    const root = document.documentElement;
    
    const fontFamilyMap: Record<string, string> = {
      'OpenDyslexic': "'OpenDyslexic', 'Atkinson Hyperlegible', 'Comic Sans MS', cursive",
      'Arial': "'Arial', 'Helvetica', sans-serif",
      'Georgia': "'Georgia', 'Times New Roman', serif",
      'Cursive': "'Dancing Script', 'Brush Script MT', cursive",
      'System': "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };
    
    const textSizeMap = ['0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem'];
    const lineHeightMap = ['1.1', '1.25', '1.5', '1.75', '2'];
    
    root.style.setProperty('--global-font-family', fontFamilyMap[profile.font_family || 'System']);
    root.style.setProperty('--global-font-size', textSizeMap[(profile.text_size || 3) - 1] || '1rem');
    root.style.setProperty('--global-line-height', lineHeightMap[(profile.line_spacing || 3) - 1] || '1.5');
    
    console.log('✅ Applied global accessibility settings:', {
      dataAttributes: {
        accessibility: 'active',
        font: fontMap[profile.font_family || 'System'],
        textSize: String(profile.text_size || 3),
        lineSpacing: String(profile.line_spacing || 3),
        contrast: profile.color_contrast === 'High' ? 'high' : 'none',
        comfort: comfortMap[profile.comfort_mode || ''] || 'none'
      },
      customProperties: {
        fontFamily: fontFamilyMap[profile.font_family || 'System'],
        fontSize: textSizeMap[(profile.text_size || 3) - 1],
        lineHeight: lineHeightMap[(profile.line_spacing || 3) - 1]
      }
    });
    
    // Force repaint for better browser compatibility
    requestAnimationFrame(() => {
      document.body.style.transform = 'translateZ(0)';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.transform = '';
    });
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
