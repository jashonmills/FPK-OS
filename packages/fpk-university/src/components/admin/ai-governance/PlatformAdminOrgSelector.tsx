import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Shield } from 'lucide-react';
import { useAdminOrganizations } from '@/hooks/useAdminOrganizations';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PlatformAdminOrgSelectorProps {
  selectedOrgId: string | null;
  onOrgChange: (orgId: string | null) => void;
}

export const PlatformAdminOrgSelector: React.FC<PlatformAdminOrgSelectorProps> = ({
  selectedOrgId,
  onOrgChange,
}) => {
  const { user } = useAuth();
  
  // Check if user is a platform admin
  const { data: isPlatformAdmin } = useQuery({
    queryKey: ['is-platform-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  // Get all organizations (for platform admins)
  const { organizations, isLoading: orgsLoading } = useAdminOrganizations();

  // Get user's own org memberships (for regular admins)
  const { data: userOrgMemberships } = useQuery({
    queryKey: ['user-org-memberships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('org_members')
        .select('org_id, role, organizations(id, name)')
        .eq('user_id', user.id)
        .in('role', ['owner', 'admin']);
      return data || [];
    },
    enabled: !!user && !isPlatformAdmin,
  });

  // Determine which orgs to show
  const availableOrgs = isPlatformAdmin 
    ? organizations.map(org => ({ id: org.id, name: org.name }))
    : (userOrgMemberships?.map(m => ({ 
        id: m.org_id, 
        name: (m.organizations as any)?.name || 'Unknown Org' 
      })) || []);

  // Auto-select first org if none selected and orgs are available
  React.useEffect(() => {
    if (!selectedOrgId && availableOrgs.length > 0) {
      onOrgChange(availableOrgs[0].id);
    }
  }, [selectedOrgId, availableOrgs, onOrgChange]);

  if (orgsLoading) {
    return <div className="text-sm text-muted-foreground">Loading organizations...</div>;
  }

  if (availableOrgs.length === 0) {
    return null;
  }

  const selectedOrg = availableOrgs.find(org => org.id === selectedOrgId);

  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg border">
      <Building2 className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">Managing Organization</span>
          {isPlatformAdmin && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Platform Admin
            </Badge>
          )}
        </div>
        <Select value={selectedOrgId || ''} onValueChange={onOrgChange}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select organization">
              {selectedOrg?.name || 'Select organization'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableOrgs.map(org => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PlatformAdminOrgSelector;
