
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
    
    // Clear all accessibility classes from both html and body
    const existingClasses = Array.from(html.classList).filter(cls => 
      cls.startsWith('font-') || 
      cls.startsWith('high-') || 
      cls.startsWith('low-') || 
      cls.startsWith('focus-') ||
      cls === 'accessibility-active'
    );
    html.classList.remove(...existingClasses);
    
    // Also clear from body as a fallback
    const bodyClasses = Array.from(body.classList).filter(cls => 
      cls.startsWith('font-')
    );
    body.classList.remove(...bodyClasses);
    
    // Remove any existing font override styles
    const existingOverrides = document.querySelectorAll('#accessibility-font-override, #opendyslexic-override');
    existingOverrides.forEach(el => el.remove());
    
    if (!profile) {
      console.log('🎨 AccessibilityProvider: No profile, clearing all accessibility');
      // Reset CSS variables to defaults
      html.style.setProperty('--accessibility-font-size', '16px');
      html.style.setProperty('--accessibility-line-height', '1.5');
      html.style.setProperty('--active-font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
      // Ensure system font is applied when no profile
      html.classList.add('font-system');
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
    const baseSize = 16; // Base font size in px
    const sizeMultiplier = 0.75 + ((profile.text_size || 3) - 1) * 0.125; // Range: 0.75x to 1.25x
    const fontSize = `${baseSize * sizeMultiplier}px`;
    const lineHeightValue = 1 + ((profile.line_spacing || 3) - 1) * 0.25; // Range: 1 to 2
    const lineHeight = lineHeightValue.toString();
    
    console.log('🎨 Setting CSS variables:', { 
      fontSize, 
      lineHeight,
      sizeMultiplier,
      lineHeightValue
    });

    // Set CSS variables
    html.style.setProperty('--accessibility-font-size', fontSize);
    html.style.setProperty('--accessibility-line-height', lineHeight);
    
    // Apply main accessibility class to activate the CSS
    html.classList.add('accessibility-active');
    
    // Apply font family class to HTML with maximum specificity
    const fontFamily = profile.font_family || 'System';
    const fontClass = `font-${fontFamily.toLowerCase()}`;
    html.classList.add(fontClass);
    
    // Force font family application with CSS custom property and direct style
    const fontFamilyMap = {
      'system': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'opendyslexic': '"OpenDyslexic", "Comic Sans MS", cursive',
      'arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'georgia': 'Georgia, "Times New Roman", Times, serif',
      'cursive': '"Dancing Script", "Brush Script MT", cursive'
    };
    
    const fontFamilyValue = fontFamilyMap[fontFamily.toLowerCase()] || fontFamilyMap.system;
    html.style.setProperty('--active-font-family', fontFamilyValue);
    
    // NUCLEAR OPTION: Create the most aggressive font override possible
    if (fontFamily.toLowerCase() === 'opendyslexic') {
      console.log('🎨 Applying NUCLEAR OpenDyslexic override');
      
      // Remove all existing font styles from body
      body.style.fontFamily = '';
      body.className = body.className.replace(/font-\w+/g, '');
      
      // Create ultra-aggressive style injection
      const styleElement = document.createElement('style');
      styleElement.id = 'opendyslexic-override';
      styleElement.innerHTML = `
        /* NUCLEAR OPENDYSLEXIC OVERRIDE - Maximum possible specificity */
        html, html *, html body, html body *, 
        body, body *, 
        div, div *, 
        span, span *,
        p, p *,
        h1, h1 *, h2, h2 *, h3, h3 *, h4, h4 *, h5, h5 *, h6, h6 *,
        button, button *, 
        input, input *, 
        textarea, textarea *,
        label, label *,
        a, a *,
        li, li *,
        td, td *,
        th, th *,
        .font-cursive, .font-cursive *,
        .font-serif, .font-serif *,
        .font-sans, .font-sans *,
        .font-mono, .font-mono *,
        [class*="font-"], [class*="font-"] *,
        [style*="font-family"], [style*="font-family"] * {
          font-family: "OpenDyslexic", "Comic Sans MS", cursive !important;
        }
        
        /* Override any potential inherited cursive styles */
        * {
          font-family: "OpenDyslexic", "Comic Sans MS", cursive !important;
        }
        
        /* Force on all possible selectors */
        html.font-opendyslexic,
        html.font-opendyslexic *,
        html.font-opendyslexic **,
        html.font-opendyslexic ***,
        html.font-opendyslexic ****,
        html.font-opendyslexic *****,
        html.font-opendyslexic ****** {
          font-family: "OpenDyslexic", "Comic Sans MS", cursive !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Also set it directly on body with maximum priority
      body.style.setProperty('font-family', '"OpenDyslexic", "Comic Sans MS", cursive', 'important');
      
      // Set it on the HTML element too
      html.style.setProperty('font-family', '"OpenDyslexic", "Comic Sans MS", cursive', 'important');
      
      // Force it on all existing elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.setProperty('font-family', '"OpenDyslexic", "Comic Sans MS", cursive', 'important');
        }
      });
      
    } else {
      // For other fonts, use the previous method
      body.style.fontFamily = fontFamilyValue;
    }
    
    console.log('🎨 Applied font class and CSS property:', { 
      fontClass, 
      fontFamilyValue 
    });
    
    // Apply contrast mode to HTML
    if (profile.color_contrast === 'High') {
      html.classList.add('high-contrast');
      console.log('🎨 Applied high contrast mode');
    }
    
    // Apply comfort mode to HTML
    if (profile.comfort_mode === 'Focus Mode') {
      html.classList.add('focus-mode');
      console.log('🎨 Applied focus mode');
    } else if (profile.comfort_mode === 'Low-Stimulus') {
      html.classList.add('low-stimulus');
      console.log('🎨 Applied low-stimulus mode');
    }
    
    console.log('✅ Applied CSS variables:', {
      fontSize: html.style.getPropertyValue('--accessibility-font-size'),
      lineHeight: html.style.getPropertyValue('--accessibility-line-height'),
      fontFamily: html.style.getPropertyValue('--active-font-family')
    });
    
    console.log('✅ Applied classes to HTML:', Array.from(html.classList));
    
  }, [profile]);

  return <>{children}</>;
};

export default AccessibilityProvider;
