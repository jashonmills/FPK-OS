import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgBranding } from '@/hooks/useOrgBranding';

export function OrgBrandingBadge() {
  const { currentOrg, isPersonalMode } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);

  if (isPersonalMode || !currentOrg) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border">
      {branding?.logo_url ? (
        <img 
          src={branding.logo_url} 
          alt={`${currentOrg.organizations.name} logo`}
          className="w-5 h-5 object-contain rounded"
        />
      ) : (
        <Building2 className="w-4 h-4 text-muted-foreground" />
      )}
      <span className="text-sm font-medium truncate max-w-[120px]">
        {currentOrg.organizations.name}
      </span>
      <Badge variant="secondary" className="text-xs h-4 px-2">
        Org mode
      </Badge>
    </div>
  );
}