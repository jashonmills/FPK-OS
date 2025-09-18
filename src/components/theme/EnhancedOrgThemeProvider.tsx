import React, { useEffect } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext'; 
import { useOrgBranding } from '@/hooks/useOrgBranding';
import tinycolor from 'tinycolor2';

interface EnhancedOrgThemeProviderProps {
  children: React.ReactNode;
}

export function EnhancedOrgThemeProvider({ children }: EnhancedOrgThemeProviderProps) {
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  useEffect(() => {
    const root = document.documentElement;

    if (isPersonalMode || !branding?.theme_accent) {
      // Reset to default theme
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--org-tile-bg');
      root.style.removeProperty('--org-tile-border');
      root.style.removeProperty('--org-tile-text');
      return;
    }

    // Apply organization theme using existing theme_accent (already in HSL format)
    root.style.setProperty('--accent', branding.theme_accent);
    
    // Calculate contrast color
    const accent = tinycolor(`hsl(${branding.theme_accent})`);
    const contrast = accent.isLight() ? '#0f172a' : '#ffffff';
    const contrastHsl = tinycolor(contrast).toHsl();
    
    root.style.setProperty('--accent-foreground', `${Math.round(contrastHsl.h)} ${Math.round(contrastHsl.s * 100)}% ${Math.round(contrastHsl.l * 100)}%`);

    // Set organization tile colors based on accent
    const accentRgb = accent.toRgb();
    root.style.setProperty('--org-tile-bg', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`);
    root.style.setProperty('--org-tile-border', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`);
    root.style.setProperty('--org-tile-text', contrast === '#ffffff' ? '255 255 255' : '15 23 42');

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--org-tile-bg');
      root.style.removeProperty('--org-tile-border');
      root.style.removeProperty('--org-tile-text');
    };
  }, [branding?.theme_accent, isPersonalMode]);

  return <>{children}</>;
}