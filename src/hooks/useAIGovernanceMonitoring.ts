import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { Json } from '@/integrations/supabase/types';

export interface MonitoringSession {
  id: string;
  user_id: string;
  tool_id: string;
  started_at: string;
  ended_at: string | null;
  message_count: number | null;
  credits_used: number | null;
  metadata: Json | null;
  user_name?: string | null;
  user_email?: string | null;
}

export function useAIGovernanceMonitoring(orgId?: string | null) {
  const queryClient = useQueryClient();

  const monitoringQuery = useQuery({
    queryKey: ['ai-governance-monitoring', orgId],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('ai_tool_sessions')
        .select('id, user_id, tool_id, started_at, ended_at, message_count, credits_used, metadata')
        .order('started_at', { ascending: false })
        .limit(100);

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
      })) as MonitoringSession[];
    },
    refetchInterval: 30000,
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('ai-governance-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_tool_sessions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ai-governance-monitoring'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    sessions: monitoringQuery.data ?? [],
    isLoading: monitoringQuery.isLoading,
    error: monitoringQuery.error,
    refetch: monitoringQuery.refetch,
  };
}
