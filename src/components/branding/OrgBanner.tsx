import React from 'react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { useOptionalOrgContext } from '@/components/organizations/OrgContext';
import { cn } from '@/lib/utils';

interface OrgBannerProps {
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function OrgBanner({ 
  className, 
  children, 
  overlay = true, 
  overlayOpacity = 0.6 
}: OrgBannerProps) {
  const orgContext = useOptionalOrgContext();
  const currentOrg = orgContext?.currentOrg;
  const isPersonalMode = orgContext?.isPersonalMode ?? true;
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg) {
    return (
      <div className={cn('relative bg-gradient-to-r from-primary/10 to-accent/10', className)}>
        {overlay && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: `hsl(var(--background) / ${overlayOpacity})` }}
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // If no banner URL, show transparent background
  if (!branding?.banner_url) {
    return (
      <div className={cn('relative', className)}>
        {overlay && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: `hsl(var(--background) / ${overlayOpacity})` }}
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative bg-center bg-no-repeat bg-cover',
        className
      )}
      style={{ 
        backgroundImage: `url(${branding.banner_url})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {overlay && (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundColor: `hsl(var(--background) / ${overlayOpacity})`
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}