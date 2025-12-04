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
      if (!orgId) return [];

      // Get org members with their profiles
      const { data: orgMembers, error: membersError } = await supabase
        .from('org_members')
        .select(`
          user_id,
          role,
          profiles:user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('org_id', orgId);

      if (membersError) throw membersError;

      // Get AI usage per user filtered by org
      const { data: sessions, error: sessionsError } = await supabase
        .from('ai_tool_sessions')
        .select('user_id, started_at')
        .eq('org_id', orgId)
        .order('started_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Combine the data
      const users: AIGovernanceUser[] = [];

      orgMembers?.forEach(member => {
        const profile = member.profiles as unknown as { id: string; full_name: string | null; email: string | null } | null;
        if (!profile) return;

        const userSessions = sessions?.filter(s => s.user_id === profile.id) ?? [];
        
        users.push({
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          role: member.role,
          ai_usage_count: userSessions.length,
          last_ai_usage: userSessions[0]?.started_at ?? null,
          status: userSessions.length > 0 ? 'active' : 'inactive',
        });
      });

      return users.sort((a, b) => b.ai_usage_count - a.ai_usage_count);
    },
    enabled: !!orgId,
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
  };
}
