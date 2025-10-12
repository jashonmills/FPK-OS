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
      // Reset to default theme (keep default CSS variable values)
      root.style.removeProperty('--brand-accent');
      root.style.removeProperty('--brand-accent-foreground');
      root.style.removeProperty('--org-tile-bg');
      root.style.removeProperty('--org-tile-border');
      root.style.removeProperty('--org-tile-text');
      console.log('🎨 EnhancedOrgThemeProvider: Reset to default theme');
      return;
    }

    console.log('🎨 EnhancedOrgThemeProvider: Applying brand accent', branding.theme_accent);

    // Apply organization's brand accent color (overrides CSS variable)
    root.style.setProperty('--brand-accent', branding.theme_accent);
    
    // Calculate contrast color for text on the brand accent
    const accent = tinycolor(`hsl(${branding.theme_accent})`);
    const luminance = accent.getLuminance();
    
    // Luminance threshold: 0.6 means only very light colors get dark text
    const shouldUseDarkText = luminance > 0.6;
    const contrast = shouldUseDarkText ? '#0f172a' : '#ffffff';
    const contrastHsl = tinycolor(contrast).toHsl();
    
    root.style.setProperty('--brand-accent-foreground', `${Math.round(contrastHsl.h)} ${Math.round(contrastHsl.s * 100)}% ${Math.round(contrastHsl.l * 100)}%`);

    // Also apply to org-tile colors for backward compatibility
    root.style.setProperty('--org-tile-bg', branding.theme_accent);
    root.style.setProperty('--org-tile-border', branding.theme_accent);
    root.style.setProperty('--org-tile-text', contrast === '#ffffff' ? '255 255 255' : '15 23 42');

    console.log('🎨 EnhancedOrgThemeProvider: Set brand accent variables', {
      '--brand-accent': branding.theme_accent,
      '--brand-accent-foreground': `${Math.round(contrastHsl.h)} ${Math.round(contrastHsl.s * 100)}% ${Math.round(contrastHsl.l * 100)}%`,
      luminance: luminance.toFixed(3),
      usingWhiteText: contrast === '#ffffff'
    });

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--brand-accent');
      root.style.removeProperty('--brand-accent-foreground');
      root.style.removeProperty('--org-tile-bg');
      root.style.removeProperty('--org-tile-border');
      root.style.removeProperty('--org-tile-text');
    };
  }, [branding?.theme_accent, isPersonalMode]);

  return <>{children}</>;
}
