
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useAccessibility();

  useEffect(() => {
    const html = document.documentElement;
    
    if (!profile) {
      console.log('🔧 AccessibilityProvider: No profile, removing accessibility settings');
      // Remove accessibility attributes when no profile
      html.removeAttribute('data-accessibility');
      html.removeAttribute('data-font');
      html.removeAttribute('data-text-size');
      html.removeAttribute('data-line-spacing');
      html.removeAttribute('data-contrast');
      html.removeAttribute('data-comfort');
      
      // Reset CSS custom properties
      html.style.removeProperty('--accessibility-font-family');
      html.style.removeProperty('--accessibility-font-size');
      html.style.removeProperty('--accessibility-line-height');
      return;
    }

    console.log('🔧 AccessibilityProvider: Applying global accessibility settings', {
      fontFamily: profile.font_family,
      textSize: profile.text_size,
      lineSpacing: profile.line_spacing,
      colorContrast: profile.color_contrast,
      comfortMode: profile.comfort_mode
    });
    
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
    const fontKey = fontMap[profile.font_family || 'System'] || 'system';
    html.setAttribute('data-font', fontKey);
    
    // Set text size (1-5 range) with defaults
    const textSize = String(profile.text_size || 3);
    html.setAttribute('data-text-size', textSize);
    
    // Set line spacing (1-5 range) with defaults
    const lineSpacing = String(profile.line_spacing || 3);
    html.setAttribute('data-line-spacing', lineSpacing);
    
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
    
    // Set CSS custom properties for immediate effect
    const fontFamilyMap: Record<string, string> = {
      'system': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      'opendyslexic': '"OpenDyslexic", "Atkinson Hyperlegible", "Comic Sans MS", "Trebuchet MS", cursive',
      'arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'georgia': 'Georgia, "Times New Roman", Times, serif',
      'cursive': '"Dancing Script", "Brush Script MT", cursive'
    };
    
    const fontSizeMap: Record<string, string> = {
      '1': '0.75rem',
      '2': '0.875rem',
      '3': '1rem',
      '4': '1.125rem',
      '5': '1.25rem'
    };
    
    const lineHeightMap: Record<string, string> = {
      '1': '1.1',
      '2': '1.25',
      '3': '1.5',
      '4': '1.75',
      '5': '2'
    };
    
    html.style.setProperty('--accessibility-font-family', fontFamilyMap[fontKey] || fontFamilyMap.system);
    html.style.setProperty('--accessibility-font-size', fontSizeMap[textSize] || fontSizeMap['3']);
    html.style.setProperty('--accessibility-line-height', lineHeightMap[lineSpacing] || lineHeightMap['3']);
    
    console.log('✅ Applied global accessibility settings:', {
      dataAttributes: {
        accessibility: 'active',
        font: fontKey,
        textSize: textSize,
        lineSpacing: lineSpacing,
        contrast: profile.color_contrast === 'High' ? 'high' : 'none',
        comfort: comfortMap[profile.comfort_mode || ''] || 'none'
      },
      cssProperties: {
        fontFamily: fontFamilyMap[fontKey],
        fontSize: fontSizeMap[textSize],
        lineHeight: lineHeightMap[lineSpacing]
      }
    });
    
    // Force immediate repaint to ensure changes take effect
    requestAnimationFrame(() => {
      // Force DOM reflow to apply new styles immediately
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
      
      // Additional force repaint
      document.body.style.transform = 'translateZ(0)';
      setTimeout(() => {
        document.body.style.transform = '';
      }, 10);
    });
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
