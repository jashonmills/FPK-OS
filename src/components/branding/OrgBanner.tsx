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
        'grid w-full max-w-7xl mx-auto overflow-hidden rounded-lg',
        'min-h-[300px]',
        className
      )}
      style={{ 
        gridTemplateAreas: '"stack"',
        placeItems: 'center'
      }}
    >
      {/* Background image - using img tag for better control */}
      {branding?.banner_url && (
        <img 
          src={branding.banner_url}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ gridArea: 'stack' }}
        />
      )}
      
      {/* Semi-transparent overlay for text readability */}
      {overlay && branding?.banner_url && (
        <div 
          className="w-full h-full bg-gradient-to-r from-black/40 via-black/20 to-black/40"
          style={{ gridArea: 'stack' }}
        />
      )}
      
      {/* Content container - completely independent from background */}
      <div 
        className="w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 text-center"
        style={{ gridArea: 'stack', zIndex: 10 }}
      >
        {children}
      </div>
    </div>
  );
}