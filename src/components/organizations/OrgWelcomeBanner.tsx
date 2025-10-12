import React from 'react';
import { OrgCard as Card, OrgCardContent as CardContent } from '@/components/organizations/OrgCard';
import { Badge } from '@/components/ui/badge';
import { OrgLogo } from '@/components/branding/OrgLogo';
import { useOrgContext } from './OrgContext';
import { useIsMobile } from '@/hooks/use-mobile';

export function OrgWelcomeBanner() {
  const { currentOrg, isLoading } = useOrgContext();
  const isMobile = useIsMobile();

  // Don't show while loading
  if (isLoading) {
    return null;
  }

  if (!currentOrg) {
    return null;
  }

  // Sanitize organization name - take only the first line and limit length
  const sanitizeOrgName = (name: string) => {
    // Take only the first line (split by newline or common error patterns)
    const firstLine = name.split(/\n|at |https?:\/\//)[0].trim();
    // Limit to 100 characters max
    return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
  };

  const displayName = sanitizeOrgName(currentOrg.organizations.name);

  return (
    <Card className="bg-brand-accent/65 border-brand-accent/50 mb-4 sm:mb-6">
      <CardContent className={isMobile ? "p-4" : "p-6"}>
        {isMobile ? (
          // Mobile Layout: Logo at top, content stacked
          <div className="space-y-4">
            {/* Logo and role badge at top */}
            <div className="flex items-center justify-between">
              <OrgLogo size="md" />
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 px-2 py-1">
                {currentOrg.role.charAt(0).toUpperCase() + currentOrg.role.slice(1)}
              </Badge>
            </div>
            
            {/* Content below */}
            <div className="space-y-2">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight break-words">
                Welcome to {displayName}
              </h1>
              <p className="text-white/80 text-sm leading-relaxed">
                {currentOrg.organizations.plan.charAt(0).toUpperCase() + currentOrg.organizations.plan.slice(1)} Plan Organization
              </p>
            </div>
          </div>
        ) : (
          // Desktop Layout: Original horizontal layout
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <OrgLogo size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-white break-words">
                  Welcome to {displayName}
                </h1>
                <p className="text-white/80 mt-1">
                  {currentOrg.organizations.plan.charAt(0).toUpperCase() + currentOrg.organizations.plan.slice(1)} Plan Organization
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm bg-white/20 text-white border-white/30">
              {currentOrg.role.charAt(0).toUpperCase() + currentOrg.role.slice(1)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}