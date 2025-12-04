import React from 'react';
import { Building2 } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { Badge } from '@/components/ui/badge';
import { OrgLogo } from '@/components/branding/OrgLogo';

export function OrgBrandingBadge() {
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border">
      <OrgLogo size="sm" />
      <span className="text-sm font-medium truncate max-w-[120px]">
        {currentOrg.organizations.name}
      </span>
      <Badge variant="secondary" className="text-xs h-4 px-2">
        Org mode
      </Badge>
    </div>
  );
}