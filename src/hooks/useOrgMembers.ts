import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assertOrg } from '@/lib/org/context';

export interface OrgMember {
  user_id: string;
  role: 'owner' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  id?: string; // For compatibility with existing code
  last_activity?: string;
  progress?: number;
  courses_completed?: number;
  full_name?: string;
  display_name?: string;
  profiles?: {
    display_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export function useOrgMembers(searchQuery?: string, roleFilter?: string) {
  const orgId = assertOrg();

  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-members', orgId, searchQuery, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('org_members')
        .select(`
          user_id,
          role,
          status,
          joined_at
        `)
        .eq('org_id', orgId)
        .eq('status', 'active');

      if (roleFilter) {
        query = query.eq('role', roleFilter as 'owner' | 'instructor' | 'student');
      }

      const { data, error } = await query.order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching org members:', error);
        throw error;
      }

      return data.map(member => ({
        user_id: member.user_id,
        role: member.role,
        status: member.status,
        joined_at: member.joined_at,
        id: member.user_id, // For compatibility
        display_name: `User ${member.user_id.slice(0, 8)}`, // Fallback display name
        full_name: `User ${member.user_id.slice(0, 8)}`, // Fallback full name
        last_activity: member.joined_at, // Default to joined_at
        progress: Math.floor(Math.random() * 100), // Mock progress for now
        courses_completed: Math.floor(Math.random() * 5), // Mock completed courses
        profiles: {
          display_name: `User ${member.user_id.slice(0, 8)}`,
          email: undefined,
          avatar_url: undefined,
        }
      })) as OrgMember[];
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