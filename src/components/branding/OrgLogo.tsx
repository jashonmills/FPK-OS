import React from 'react';
import { Building2 } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { useEnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';
import { useOptionalOrgContext } from '@/components/organizations/OrgContext';
import { cn } from '@/lib/utils';

interface OrgLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  fallback?: React.ReactNode;
}

export function OrgLogo({ 
  className, 
  size = 'md', 
  variant = 'auto', 
  fallback 
}: OrgLogoProps) {
  const orgContext = useOptionalOrgContext();
  const currentOrg = orgContext?.currentOrg;
  const isPersonalMode = orgContext?.isPersonalMode ?? true;
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);
  const { data: enhancedBranding } = useEnhancedOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Use the logo from enhanced branding first, then basic branding
  const getLogoUrl = () => {
    if (enhancedBranding) {
      // Enhanced branding has separate light/dark logos
      if (variant === 'light') {
        return enhancedBranding.logo_light_url;
      } else if (variant === 'dark') {
        return enhancedBranding.logo_dark_url;
      } else {
        // Auto mode - prefer light logo, fall back to dark
        return enhancedBranding.logo_light_url || enhancedBranding.logo_dark_url;
      }
    }
    
    // Fall back to basic branding
    return branding?.logo_url;
  };
  
  const logoUrl = getLogoUrl();

  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={`${currentOrg.organizations.name} logo`}
        className={cn(sizeClasses[size], 'object-contain', className)}
      />
    );
  }

  // Fallback component or default icon
  return (
    <div className={cn(sizeClasses[size], 'flex items-center justify-center', className)}>
      {fallback || <Building2 className="w-full h-full text-muted-foreground" />}
    </div>
  );
}