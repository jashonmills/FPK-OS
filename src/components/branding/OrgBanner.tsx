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
    <div className={cn('relative w-full max-w-7xl mx-auto overflow-hidden', className)}>
      {/* Background image container */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: branding?.banner_url ? `url(${branding.banner_url})` : 'none',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Semi-transparent overlay for text readability */}
      {overlay && branding?.banner_url && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"
        />
      )}
      
      {/* Content container with proper z-index */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </div>
  );
}