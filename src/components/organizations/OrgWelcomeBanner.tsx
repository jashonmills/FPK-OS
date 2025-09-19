import React from 'react';
import { OrgCard as Card, OrgCardContent as CardContent } from '@/components/organizations/OrgCard';
import { Badge } from '@/components/ui/badge';
import { OrgLogo } from '@/components/branding/OrgLogo';
import { useOrgContext } from './OrgContext';

export function OrgWelcomeBanner() {
  const { currentOrg } = useOrgContext();

  if (!currentOrg) {
    return null;
  }

  return (
    <Card className="bg-orange-500/65 border-orange-400/50 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <OrgLogo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome to {currentOrg.organizations.name}
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
      </CardContent>
    </Card>
  );
}