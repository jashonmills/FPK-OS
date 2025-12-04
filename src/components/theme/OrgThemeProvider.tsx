import React, { useEffect } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgBranding } from '@/hooks/useOrgBranding';

interface OrgThemeProviderProps {
  children: React.ReactNode;
}

export function OrgThemeProvider({ children }: OrgThemeProviderProps) {
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  useEffect(() => {
    const root = document.documentElement;

    if (isPersonalMode || !branding?.theme_accent) {
      // Reset to default theme
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      return;
    }

    // Apply organization theme
    const accent = branding.theme_accent;
    
    // Convert hex to HSL if needed, or use CSS variable format
    if (accent.startsWith('#')) {
      const hsl = hexToHsl(accent);
      root.style.setProperty('--accent', hsl);
      // Calculate contrasting foreground color
      const foreground = isLightColor(accent) ? '0 0% 10%' : '0 0% 98%';
      root.style.setProperty('--accent-foreground', foreground);
    } else if (accent.includes('hsl') || accent.includes('%')) {
      // Already in HSL format
      root.style.setProperty('--accent', accent);
    } else {
      // Assume it's a CSS variable format like "280 100% 70%"
      root.style.setProperty('--accent', accent);
    }

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
    };
  }, [branding?.theme_accent, isPersonalMode]);

  return <>{children}</>;
}

// Utility function to convert hex to HSL
function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '280 100% 70%'; // fallback
  
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Utility to determine if a color is light (for contrast calculation)
function isLightColor(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return false;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}