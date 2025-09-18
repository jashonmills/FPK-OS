import React from 'react';
import { useEnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';
import { useOrgContext } from '@/components/organizations/OrgContext';
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
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useEnhancedOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg || !branding?.banner_url) {
    return (
      <div className={cn('relative bg-gradient-to-r from-primary/10 to-accent/10', className)}>
        {overlay && (
          <div 
            className="absolute inset-0 bg-background/60"
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
      className={cn('relative bg-cover bg-center bg-no-repeat', className)}
      style={{ backgroundImage: `url(${branding.banner_url})` }}
    >
      {overlay && (
        <div 
          className="absolute inset-0 bg-background"
          style={{ 
            backgroundColor: `hsl(var(--background) / ${overlayOpacity})`,
            opacity: branding.watermark_opacity || 0.6
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}