import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserOrganizationMembership {
  organization_id: string;
  role: 'owner' | 'instructor' | 'student';
  status: 'active' | 'pending' | 'inactive';
  organizations: {
    id: string;
    name: string;
    plan: string;
    subscription_tier: string;
  };
}

  // Hook to get the current user's organization memberships
export function useUserOrganizations() {
  return useQuery({
    queryKey: ['user-organizations'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }
      
      console.log('useUserOrganizations - Fetching organizations for user:', user.id, user.email);
      console.log('useUserOrganizations - User authenticated:', !!user);
      
      // First get the user's memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('org_members')
        .select('org_id, role, status')
        .eq('status', 'active')
        .eq('user_id', user.id);

      if (membershipsError) {
        console.error('useUserOrganizations - Error fetching user memberships:', membershipsError);
        throw membershipsError;
      }

      console.log('useUserOrganizations - Memberships found:', memberships);

      if (!memberships || memberships.length === 0) {
        console.log('useUserOrganizations - No memberships found for user');
        return [];
      }

      // Then get the organization details
      const orgIds = memberships.map(m => m.org_id);
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, plan')
        .in('id', orgIds);

      if (orgsError) {
        console.error('useUserOrganizations - Error fetching organizations:', orgsError);
        throw orgsError;
      }

      console.log('useUserOrganizations - Organizations found:', organizations);

      // Combine the data
      const result = memberships.map(membership => {
        const org = organizations?.find(o => o.id === membership.org_id);
        return {
          organization_id: membership.org_id,
          role: membership.role,
          status: membership.status,
          organizations: {
            id: org?.id || '',
            name: org?.name || '',
            plan: org?.plan || '',
            subscription_tier: org?.plan || ''
          }
        };
      }) as UserOrganizationMembership[];
      
      console.log('useUserOrganizations - Final result:', result);
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
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