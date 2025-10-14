import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface PhoenixAnalytics {
  totalSessions: number;
  totalInteractions: number;
  avgTurnsPerSession: number;
  intentDistribution: Array<{ intent: string; count: number }>;
  personaUsage: Array<{ persona: string; count: number }>;
  engagementOverTime: Array<{ date: string; sessions: number }>;
  governorActivity: Array<{
    id: string;
    persona: string;
    reason: string;
    severity: string;
    is_safe: boolean;
    is_on_topic: boolean;
    persona_adherence: string;
    blocked: boolean;
    created_at: string;
  }>;
}

export const usePhoenixAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['phoenix-analytics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_phoenix_analytics', {
        p_user_id: user?.id || null
      });

      if (error) throw error;
      
      return data as unknown as PhoenixAnalytics;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
