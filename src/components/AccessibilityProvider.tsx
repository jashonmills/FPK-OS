
import React, { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { profile } = useAccessibility();

  useEffect(() => {
    const body = document.body;
    
    // Remove all existing accessibility classes
    const existingClasses = Array.from(body.classList).filter(cls => 
      cls.startsWith('accessibility-') || cls.startsWith('font-') || cls.startsWith('text-') || cls.startsWith('leading-')
    );
    body.classList.remove(...existingClasses);
    
    if (!profile) {
      console.log('🔧 AccessibilityProvider: No profile, removing accessibility classes');
      return;
    }

    console.log('🔧 AccessibilityProvider: Applying accessibility classes to body', {
      fontFamily: profile.font_family,
      textSize: profile.text_size,
      lineSpacing: profile.line_spacing,
      colorContrast: profile.color_contrast,
      comfortMode: profile.comfort_mode
    });
    
    // Apply font family class
    const fontMap: Record<string, string> = {
      'OpenDyslexic': 'accessibility-font-opendyslexic',
      'Arial': 'accessibility-font-arial', 
      'Georgia': 'accessibility-font-georgia',
      'Cursive': 'accessibility-font-cursive',
      'System': 'accessibility-font-system'
    };
    const fontClass = fontMap[profile.font_family || 'System'] || 'accessibility-font-system';
    body.classList.add(fontClass);
    
    // Apply text size class (1-5 range)
    const textSize = profile.text_size || 3;
    body.classList.add(`accessibility-text-size-${textSize}`);
    
    // Apply line spacing class (1-5 range)
    const lineSpacing = profile.line_spacing || 3;
    body.classList.add(`accessibility-line-spacing-${lineSpacing}`);
    
    // Apply contrast mode
    if (profile.color_contrast === 'High') {
      body.classList.add('accessibility-high-contrast');
    }
    
    // Apply comfort mode
    if (profile.comfort_mode === 'Focus Mode') {
      body.classList.add('accessibility-focus-mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      body.classList.add('accessibility-low-stimulus');
    }
    
    console.log('✅ Applied accessibility classes to body:', Array.from(body.classList));
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
