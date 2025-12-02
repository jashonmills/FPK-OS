import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AIGovernanceUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  ai_usage_count: number;
  last_ai_usage: string | null;
  status: 'active' | 'inactive';
}

export function useAIGovernanceUsers(orgId?: string | null) {
  const usersQuery = useQuery({
    queryKey: ['ai-governance-users', orgId],
    queryFn: async () => {
      // Get profiles with their AI tool session counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .limit(100);

      if (profilesError) throw profilesError;

      // Get AI usage per user
      const { data: sessions, error: sessionsError } = await supabase
        .from('ai_tool_sessions')
        .select('user_id, started_at')
        .order('started_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const userMap = new Map<string, AIGovernanceUser>();

      profiles?.forEach(profile => {
        const userSessions = sessions?.filter(s => s.user_id === profile.id) ?? [];
        const userRole = userRoles?.find(r => r.user_id === profile.id);
        
        userMap.set(profile.id, {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          role: userRole?.role ?? 'user',
          ai_usage_count: userSessions.length,
          last_ai_usage: userSessions[0]?.started_at ?? null,
          status: userSessions.length > 0 ? 'active' : 'inactive',
        });
      });

      return Array.from(userMap.values()).sort((a, b) => b.ai_usage_count - a.ai_usage_count);
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
  };
}
