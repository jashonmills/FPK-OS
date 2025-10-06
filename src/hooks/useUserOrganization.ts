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
        console.log('🔍 [useUserOrganizations] No authenticated user found');
        return [];
      }
      
      console.log('🔍 [useUserOrganizations] Fetching organizations for user:', user.id, user.email);
      
      // First get the user's memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('org_members')
        .select('org_id, role, status')
        .eq('status', 'active')
        .eq('user_id', user.id);

      if (membershipsError) {
        console.error('❌ [useUserOrganizations] Error fetching user memberships:', membershipsError);
        throw new Error(`Failed to fetch memberships: ${membershipsError.message}`);
      }

      console.log('✅ [useUserOrganizations] Memberships found:', memberships?.length || 0, memberships);

      if (!memberships || memberships.length === 0) {
        console.log('ℹ️ [useUserOrganizations] No active memberships found for user');
        return [];
      }

      // Then get the organization details
      const orgIds = memberships.map(m => m.org_id);
      console.log('🔍 [useUserOrganizations] Fetching details for org IDs:', orgIds);
      
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, plan')
        .in('id', orgIds);

      if (orgsError) {
        console.error('❌ [useUserOrganizations] Error fetching organizations:', orgsError);
        console.error('❌ [useUserOrganizations] This might be an RLS policy issue. Check if the user has permission to view these organizations.');
        throw new Error(`Failed to fetch organization details: ${orgsError.message}`);
      }

      console.log('✅ [useUserOrganizations] Organizations fetched:', organizations?.length || 0, organizations);

      if (!organizations || organizations.length === 0) {
        console.warn('⚠️ [useUserOrganizations] No organization details found for org IDs:', orgIds);
        console.warn('⚠️ [useUserOrganizations] This suggests an RLS policy issue - memberships exist but organizations are not visible');
      }

      // Combine the data
      const result = memberships.map(membership => {
        const org = organizations?.find(o => o.id === membership.org_id);
        if (!org) {
          console.warn(`⚠️ [useUserOrganizations] Missing organization data for org_id: ${membership.org_id}`);
        }
        return {
          organization_id: membership.org_id,
          role: membership.role,
          status: membership.status,
          organizations: {
            id: org?.id || '',
            name: org?.name || 'Unknown Organization',
            plan: org?.plan || '',
            subscription_tier: org?.plan || ''
          }
        };
      }) as UserOrganizationMembership[];
      
      console.log('✅ [useUserOrganizations] Final result:', result.length, 'organizations');
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
    retry: 2, // Retry failed requests
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