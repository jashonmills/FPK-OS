import React, { useEffect } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext'; 
import { useEnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';
import tinycolor from 'tinycolor2';

interface EnhancedOrgThemeProviderProps {
  children: React.ReactNode;
}

export function EnhancedOrgThemeProvider({ children }: EnhancedOrgThemeProviderProps) {
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useEnhancedOrgBranding(currentOrg?.organization_id || null);

  useEffect(() => {
    const root = document.documentElement;

    if (isPersonalMode || !branding?.accent_hex) {
      // Reset to default theme
      root.style.removeProperty('--brand-accent');
      root.style.removeProperty('--brand-accent-600');
      root.style.removeProperty('--brand-accent-700');
      root.style.removeProperty('--brand-contrast');
      root.style.removeProperty('--brand-surface');
      root.style.removeProperty('--brand-ring');
      root.style.removeProperty('--brand-radius');
      return;
    }

    // Apply organization theme with tinycolor calculations
    const accent = tinycolor(branding.accent_hex);
    const accent600 = accent.darken(5).toHexString();
    const accent700 = accent.darken(12).toHexString();
    const contrast = accent.isLight() ? '#0f172a' : '#ffffff';
    const ring = accent.setAlpha(0.35).toRgbString();
    
    // Convert to HSL for CSS variables
    const accentHsl = accent.toHsl();
    const accent600Hsl = tinycolor(accent600).toHsl();
    const accent700Hsl = tinycolor(accent700).toHsl();
    const contrastHsl = tinycolor(contrast).toHsl();
    
    root.style.setProperty('--brand-accent', `${Math.round(accentHsl.h)} ${Math.round(accentHsl.s * 100)}% ${Math.round(accentHsl.l * 100)}%`);
    root.style.setProperty('--brand-accent-600', `${Math.round(accent600Hsl.h)} ${Math.round(accent600Hsl.s * 100)}% ${Math.round(accent600Hsl.l * 100)}%`);
    root.style.setProperty('--brand-accent-700', `${Math.round(accent700Hsl.h)} ${Math.round(accent700Hsl.s * 100)}% ${Math.round(accent700Hsl.l * 100)}%`);
    root.style.setProperty('--brand-contrast', `${Math.round(contrastHsl.h)} ${Math.round(contrastHsl.s * 100)}% ${Math.round(contrastHsl.l * 100)}%`);
    root.style.setProperty('--brand-surface', 'rgba(255,255,255,0.60)');
    root.style.setProperty('--brand-ring', ring);
    root.style.setProperty('--brand-radius', branding.radius_scale === 'lg' ? '1rem' : branding.radius_scale === 'sm' ? '0.5rem' : '0.75rem');

    // Apply to accent variables as well for consistency
    root.style.setProperty('--accent', `${Math.round(accentHsl.h)} ${Math.round(accentHsl.s * 100)}% ${Math.round(accentHsl.l * 100)}%`);
    root.style.setProperty('--accent-foreground', `${Math.round(contrastHsl.h)} ${Math.round(contrastHsl.s * 100)}% ${Math.round(contrastHsl.l * 100)}%`);

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--brand-accent');
      root.style.removeProperty('--brand-accent-600');
      root.style.removeProperty('--brand-accent-700');
      root.style.removeProperty('--brand-contrast');
      root.style.removeProperty('--brand-surface');
      root.style.removeProperty('--brand-ring');
      root.style.removeProperty('--brand-radius');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
    };
  }, [branding?.accent_hex, branding?.radius_scale, isPersonalMode]);

  return <>{children}</>;
}