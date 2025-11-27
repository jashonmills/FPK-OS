import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { supabase } from '@/integrations/supabase/client';

interface OrgBranding {
  logo_url?: string;
  banner_url?: string;
  primary_color?: string;
  accent_color?: string;
}

interface OrgThemeContextType {
  branding: OrgBranding | null;
  isLoading: boolean;
}

const OrgThemeContext = createContext<OrgThemeContextType>({
  branding: null,
  isLoading: true,
});

export function useOrgTheme() {
  return useContext(OrgThemeContext);
}

interface OrgThemeProviderProps {
  children: React.ReactNode;
}

export function OrgThemeProvider({ children }: OrgThemeProviderProps) {
  const { currentOrg } = useOrgContext();
  const [branding, setBranding] = useState<OrgBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentOrg) {
      setBranding(null);
      setIsLoading(false);
      return;
    }

    const loadBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('branding')
          .eq('id', currentOrg.organization_id)
          .single();

        if (error) {
          console.error('Error loading org branding:', error);
          setBranding(null);
        } else {
          setBranding((data?.branding as OrgBranding) || null);
        }
      } catch (error) {
        console.error('Error loading org branding:', error);
        setBranding(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();
  }, [currentOrg]);

  // Apply branding CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (branding) {
      if (branding.primary_color) {
        root.style.setProperty('--org-primary', branding.primary_color);
      }
      if (branding.accent_color) {
        root.style.setProperty('--org-accent', branding.accent_color);
      }
    } else {
      // Reset to defaults when no branding
      root.style.removeProperty('--org-primary');
      root.style.removeProperty('--org-accent');
    }

    return () => {
      // Cleanup on unmount
      root.style.removeProperty('--org-primary');
      root.style.removeProperty('--org-accent');
    };
  }, [branding]);

  return (
    <OrgThemeContext.Provider value={{ branding, isLoading }}>
      {children}
    </OrgThemeContext.Provider>
  );
}