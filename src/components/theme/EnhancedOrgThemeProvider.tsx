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

    // FEATURE TEMPORARILY DISABLED: Dark Mode Theming
    console.log('🎨 Applying Organization Brand Color (Light Mode Only):', {
      lightModeColor: branding.theme_accent
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

    // FEATURE TEMPORARILY DISABLED: Dark Mode Brand Color Logic
    // The following dark mode theming code is commented out until feature is re-enabled
    
    // ============================================
    // DARK MODE BRAND COLOR (DISABLED)
    // ============================================
    // let darkModeAccent: string;
    // if (branding.theme_dark_mode_accent) {
    //   darkModeAccent = branding.theme_dark_mode_accent;
    //   console.log('🎨 Using admin-defined dark mode color:', darkModeAccent);
    // } else {
    //   const baseColor = tinycolor(`hsl(${lightModeAccent})`);
    //   const darkOptimized = baseColor.darken(15).saturate(10);
    //   const darkHsl = darkOptimized.toHsl();
    //   darkModeAccent = `${Math.round(darkHsl.h)} ${Math.round(darkHsl.s * 100)}% ${Math.round(darkHsl.l * 100)}%`;
    // }
    
    // Remove any existing dark mode style injection
    const styleId = 'org-dark-mode-theme';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

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
  }, [branding?.theme_accent, isPersonalMode]);

  return <>{children}</>;
}

