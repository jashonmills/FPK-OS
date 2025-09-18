import React from 'react';
import { Building2 } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
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
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Use the logo from the organizations table
  const logoUrl = branding?.logo_url;

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