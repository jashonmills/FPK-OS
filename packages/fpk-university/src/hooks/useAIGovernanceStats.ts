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
      // Get total users - filter by org if provided
      let totalUsers = 0;
      if (orgId) {
        const { count } = await supabase
          .from('org_members')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', orgId);
        totalUsers = count ?? 0;
      } else {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        totalUsers = count ?? 0;
      }

      // Get active rules count - filter by org (include global rules where org_id is null)
      let activeRulesQuery = supabase
        .from('ai_governance_rules')
        .select('*', { count: 'exact', head: true })
        .eq('allowed', true);
      
      if (orgId) {
        activeRulesQuery = activeRulesQuery.or(`org_id.eq.${orgId},org_id.is.null`);
      }
      const { count: activeRules } = await activeRulesQuery;

      // Get today's activity - filter by org
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let activityQuery = supabase
        .from('ai_tool_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today.toISOString());
      
      if (orgId) {
        activityQuery = activityQuery.eq('org_id', orgId);
      }
      const { count: todaysActivity } = await activityQuery;

      // Get pending approvals - filter by org
      let pendingQuery = supabase
        .from('ai_governance_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (orgId) {
        pendingQuery = pendingQuery.eq('org_id', orgId);
      }
      const { count: pendingApprovals } = await pendingQuery;

      // Calculate compliance rate (approved / (approved + rejected)) - filter by org
      let approvedQuery = supabase
        .from('ai_governance_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      if (orgId) {
        approvedQuery = approvedQuery.eq('org_id', orgId);
      }
      const { count: approved } = await approvedQuery;

      let rejectedQuery = supabase
        .from('ai_governance_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');
      
      if (orgId) {
        rejectedQuery = rejectedQuery.eq('org_id', orgId);
      }
      const { count: rejected } = await rejectedQuery;

      const total = (approved ?? 0) + (rejected ?? 0);
      const complianceRate = total > 0 ? Math.round(((approved ?? 0) / total) * 100) : 100;

      return {
        totalUsers,
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
      let sessionsQuery = supabase
        .from('ai_tool_sessions')
        .select('id, user_id, tool_id, started_at, message_count')
        .order('started_at', { ascending: false })
        .limit(10);
      
      if (orgId) {
        sessionsQuery = sessionsQuery.eq('org_id', orgId);
      }
      
      const { data: sessions, error } = await sessionsQuery;

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
