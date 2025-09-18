import React from 'react';
import { Building2 } from 'lucide-react';
import { useEnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';
import { useOrgContext } from '@/components/organizations/OrgContext';
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
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useEnhancedOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Determine which logo to use based on variant
  const logoUrl = variant === 'light' 
    ? branding?.logo_light_url 
    : variant === 'dark' 
    ? branding?.logo_dark_url 
    : branding?.logo_light_url || branding?.logo_dark_url;

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