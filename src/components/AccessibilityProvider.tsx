
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

    // Font family mapping with actual CSS font stacks
    const fontFamilyMap: Record<string, string> = {
      'OpenDyslexic': '"OpenDyslexic", "Comic Sans MS", cursive',
      'Arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'Georgia': 'Georgia, "Times New Roman", Times, serif',
      'Cursive': '"Dancing Script", "Brush Script MT", cursive',
      'System': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
    
    // Calculate values
    const selectedFont = fontFamilyMap[profile.font_family || 'System'];
    const baseSize = 16; // Base font size in px
    const sizeMultiplier = 0.75 + ((profile.text_size || 3) - 1) * 0.125; // Range: 0.75x to 1.25x
    const fontSize = `${baseSize * sizeMultiplier}px`;
    const lineHeightValue = 1 + ((profile.line_spacing || 3) - 1) * 0.25; // Range: 1 to 2
    const lineHeight = lineHeightValue.toString();
    
    console.log('🎨 Calculated styles:', { 
      selectedFont, 
      fontSize, 
      lineHeight,
      sizeMultiplier,
      lineHeightValue
    });

    // Set CSS variables on the root element with maximum priority
    root.style.setProperty('--accessibility-font-family', selectedFont, 'important');
    root.style.setProperty('--accessibility-font-size', fontSize, 'important');
    root.style.setProperty('--accessibility-line-height', lineHeight, 'important');
    root.style.setProperty('--mobile-text-size', fontSize, 'important');
    root.style.setProperty('--mobile-line-height', lineHeight, 'important');
    
    // Apply main accessibility class to activate the CSS
    body.classList.add('fpk-accessibility-active');
    
    // Apply specific font class for additional targeting
    const fontClass = `fpk-font-${(profile.font_family || 'system').toLowerCase()}`;
    body.classList.add(fontClass);
    console.log('🎨 Applied font class:', fontClass);
    
    // Apply contrast mode
    if (profile.color_contrast === 'High') {
      body.classList.add('fpk-high-contrast');
      console.log('🎨 Applied high contrast mode');
    }
    
    // Apply comfort mode
    body.classList.remove('fpk-focus-mode', 'fpk-low-stimulus');
    if (profile.comfort_mode === 'Focus Mode') {
      body.classList.add('fpk-focus-mode');
      console.log('🎨 Applied focus mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      body.classList.add('fpk-low-stimulus');
      console.log('🎨 Applied low-stimulus mode');
    }
    
    // Force immediate style application to body
    body.style.setProperty('font-family', selectedFont, 'important');
    body.style.setProperty('font-size', fontSize, 'important');
    body.style.setProperty('line-height', lineHeight, 'important');
    
    console.log('✅ Applied CSS variables:', {
      fontFamily: root.style.getPropertyValue('--accessibility-font-family'),
      fontSize: root.style.getPropertyValue('--accessibility-font-size'),
      lineHeight: root.style.getPropertyValue('--accessibility-line-height')
    });
    
    console.log('✅ Applied body styles:', {
      fontFamily: body.style.fontFamily,
      fontSize: body.style.fontSize,
      lineHeight: body.style.lineHeight
    });
    
    console.log('✅ Applied classes:', Array.from(body.classList).filter(c => c.startsWith('fpk-')));
    
    // Force multiple repaints to ensure changes are visible
    body.style.transform = 'translateZ(0)';
    requestAnimationFrame(() => {
      body.style.transform = '';
      body.offsetHeight; // Force reflow
    });
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
