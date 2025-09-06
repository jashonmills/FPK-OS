import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserOrganizationMembership {
  organization_id: string;
  role: 'owner' | 'instructor' | 'student';
  status: 'active' | 'pending' | 'inactive';
  organizations: {
    id: string;
    name: string;
    subscription_tier: string;
  };
}

// Hook to get the current user's organization memberships
export function useUserOrganizations() {
  return useQuery({
    queryKey: ['user-organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_members')
        .select(`
          organization_id,
          role,
          status,
          organizations!inner (
            id,
            name,
            subscription_tier
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching user organizations:', error);
        throw error;
      }

      return data as UserOrganizationMembership[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get the current user's primary organization (first active one)
export function useUserPrimaryOrganization() {
  const { data: organizations, isLoading, error } = useUserOrganizations();
  
  return {
    organization: organizations?.[0] ? {
      organization_id: organizations[0].organization_id,
      ...organizations[0].organizations
    } : null,
    isLoading,
    error,
  };
}