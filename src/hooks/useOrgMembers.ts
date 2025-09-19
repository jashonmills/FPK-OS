import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assertOrg } from '@/lib/org/context';

export interface OrgMember {
  user_id: string;
  role: 'owner' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  profiles?: {
    display_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export function useOrgMembers() {
  const orgId = assertOrg();

  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_members')
        .select(`
          user_id,
          role,
          status,
          joined_at,
          profiles:user_id (
            display_name,
            email,
            avatar_url
          )
        `)
        .eq('org_id', orgId)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching org members:', error);
        throw error;
      }

      return data as OrgMember[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    members,
    isLoading,
    error,
    refetch,
  };
}