
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
    
    console.log('✅ Applied global accessibility settings:', {
      dataAttributes: {
        accessibility: 'active',
        font: fontMap[profile.font_family || 'System'],
        textSize: String(profile.text_size || 3),
        lineSpacing: String(profile.line_spacing || 3),
        contrast: profile.color_contrast === 'High' ? 'high' : 'none',
        comfort: comfortMap[profile.comfort_mode || ''] || 'none'
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
