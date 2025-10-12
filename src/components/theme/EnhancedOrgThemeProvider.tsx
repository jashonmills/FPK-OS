import React, { useEffect } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext'; 
import { useOrgBranding } from '@/hooks/useOrgBranding';
import tinycolor from 'tinycolor2';

interface EnhancedOrgThemeProviderProps {
  children: React.ReactNode;
}

/**
 * EnhancedOrgThemeProvider - Layered Theming System
 * 
 * This component implements a two-layer theming architecture:
 * 1. User Theme Layer: Light/Dark mode (controlled by user preference)
 * 2. Brand Layer: Organization's brand colors (controlled by org admin)
 * 
 * The system dynamically injects TWO brand colors into CSS variables:
 * - --brand-accent (for light mode)
 * - --brand-accent (for dark mode, overridden in .dark selector)
 * 
 * This allows the brand color to adapt to the user's theme preference
 * while maintaining the organization's visual identity.
 */
export function EnhancedOrgThemeProvider({ children }: EnhancedOrgThemeProviderProps) {
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  useEffect(() => {
    const root = document.documentElement;

    // RESET: If in personal mode or no branding, remove all custom brand colors
    if (isPersonalMode || !branding?.theme_accent) {
      root.style.removeProperty('--brand-accent');
      root.style.removeProperty('--brand-accent-foreground');
      root.style.removeProperty('--sidebar');
      root.style.removeProperty('--sidebar-foreground');
      console.log('🎨 Theme Reset: Using default FPK colors');
      return;
    }

    console.log('🎨 Applying Layered Theme System:', {
      lightModeColor: branding.theme_accent,
      darkModeColor: branding.theme_dark_mode_accent || 'auto-generated'
    });

    // ============================================
    // LIGHT MODE BRAND COLOR
    // ============================================
    const lightModeAccent = branding.theme_accent;
    root.style.setProperty('--brand-accent', lightModeAccent);

    // Calculate contrast color for light mode
    const lightAccent = tinycolor(`hsl(${lightModeAccent})`);
    const lightLuminance = lightAccent.getLuminance();
    const lightContrast = lightLuminance > 0.6 ? '#0f172a' : '#ffffff';
    const lightContrastHsl = tinycolor(lightContrast).toHsl();
    
    root.style.setProperty(
      '--brand-accent-foreground', 
      `${Math.round(lightContrastHsl.h)} ${Math.round(lightContrastHsl.s * 100)}% ${Math.round(lightContrastHsl.l * 100)}%`
    );

    // ============================================
    // DARK MODE BRAND COLOR
    // ============================================
    let darkModeAccent: string;

    if (branding.theme_dark_mode_accent) {
      // Admin has set a custom dark mode color
      darkModeAccent = branding.theme_dark_mode_accent;
      console.log('🎨 Using admin-defined dark mode color:', darkModeAccent);
    } else {
      // Auto-generate a dark-mode-optimized version
      const baseColor = tinycolor(`hsl(${lightModeAccent})`);
      const darkOptimized = baseColor
        .darken(15)        // Make it darker
        .saturate(10);     // Slightly more saturated
      
      const darkHsl = darkOptimized.toHsl();
      darkModeAccent = `${Math.round(darkHsl.h)} ${Math.round(darkHsl.s * 100)}% ${Math.round(darkHsl.l * 100)}%`;
      console.log('🎨 Auto-generated dark mode color:', darkModeAccent);
    }

    // Inject dark mode color by creating a <style> tag
    // This allows us to target the .dark selector
    const styleId = 'org-dark-mode-theme';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Calculate contrast color for dark mode
    const darkAccent = tinycolor(`hsl(${darkModeAccent})`);
    const darkLuminance = darkAccent.getLuminance();
    const darkContrast = darkLuminance > 0.6 ? '#0f172a' : '#ffffff';
    const darkContrastHsl = tinycolor(darkContrast).toHsl();

    styleEl.textContent = `
      .dark {
        --brand-accent: ${darkModeAccent};
        --brand-accent-foreground: ${Math.round(darkContrastHsl.h)} ${Math.round(darkContrastHsl.s * 100)}% ${Math.round(darkContrastHsl.l * 100)}%;
        --sidebar: ${darkModeAccent};
        --sidebar-foreground: ${Math.round(darkContrastHsl.h)} ${Math.round(darkContrastHsl.s * 100)}% ${Math.round(darkContrastHsl.l * 100)}%;
      }
    `;

    // ============================================
    // SIDEBAR COLOR (uses brand accent)
    // ============================================
    root.style.setProperty('--sidebar', lightModeAccent);
    root.style.setProperty('--sidebar-foreground', `${Math.round(lightContrastHsl.h)} ${Math.round(lightContrastHsl.s * 100)}% ${Math.round(lightContrastHsl.l * 100)}%`);

    console.log('✅ Layered Theme Applied Successfully');

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--brand-accent');
      root.style.removeProperty('--brand-accent-foreground');
      root.style.removeProperty('--sidebar');
      root.style.removeProperty('--sidebar-foreground');
      
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [branding?.theme_accent, branding?.theme_dark_mode_accent, isPersonalMode]);

  return <>{children}</>;
}

