import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AIGovernanceStats {
  totalUsers: number;
  activeRules: number;
  todaysActivity: number;
  pendingApprovals: number;
  complianceRate: number;
}

export interface RecentActivity {
  id: string;
  user_id: string;
  tool_id: string;
  started_at: string;
  message_count: number | null;
  user_name?: string | null;
  user_email?: string | null;
}

export function useAIGovernanceStats(orgId?: string | null) {
  const statsQuery = useQuery({
    queryKey: ['ai-governance-stats', orgId],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active rules count
      const { count: activeRules } = await supabase
        .from('ai_governance_rules')
        .select('*', { count: 'exact', head: true })
        .eq('allowed', true);

      // Get today's activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todaysActivity } = await supabase
        .from('ai_tool_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today.toISOString());

      // Get pending approvals
      const { count: pendingApprovals } = await supabase
        .from('ai_governance_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Calculate compliance rate (approved / (approved + rejected))
      const { count: approved } = await supabase
        .from('ai_governance_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejected } = await supabase
        .from('ai_governance_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      const total = (approved ?? 0) + (rejected ?? 0);
      const complianceRate = total > 0 ? Math.round(((approved ?? 0) / total) * 100) : 100;

      return {
        totalUsers: totalUsers ?? 0,
        activeRules: activeRules ?? 0,
        todaysActivity: todaysActivity ?? 0,
        pendingApprovals: pendingApprovals ?? 0,
        complianceRate,
      } as AIGovernanceStats;
    },
  });

  const recentActivityQuery = useQuery({
    queryKey: ['ai-governance-recent-activity', orgId],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('ai_tool_sessions')
        .select('id, user_id, tool_id, started_at, message_count')
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = [...new Set(sessions?.map(s => s.user_id) ?? [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? []);

      return sessions?.map(session => ({
        ...session,
        user_name: profileMap.get(session.user_id)?.full_name ?? null,
        user_email: profileMap.get(session.user_id)?.email ?? null,
      })) as RecentActivity[];
    },
  });

  return {
    stats: statsQuery.data ?? {
      totalUsers: 0,
      activeRules: 0,
      todaysActivity: 0,
      pendingApprovals: 0,
      complianceRate: 100,
    },
    recentActivity: recentActivityQuery.data ?? [],
    isLoading: statsQuery.isLoading || recentActivityQuery.isLoading,
    error: statsQuery.error || recentActivityQuery.error,
  };
}
