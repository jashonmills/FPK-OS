import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';
import type { RiskRadarAlert, RiskRadarResponse, AIInsightsOptions } from '@/types/ai-insights';

export const useRiskRadar = (options: AIInsightsOptions = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['risk-radar', user?.id, options],
    queryFn: async (): Promise<RiskRadarResponse> => {
      if (!user?.id) {
        return {
          window: options.window || '7d',
          generated_at: new Date().toISOString(),
          data: [],
          next_cursor: null
        };
      }

      try {
        let query = supabase
          .from('risk_radar_alerts')
          .select('*')
          .eq('resolved', false)
          .order('risk_score', { ascending: false });

        if (options.cohort_id) {
          query = query.eq('cohort_id', options.cohort_id);
        }

        if (options.window) {
          const windowDays = parseInt(options.window.replace('d', ''));
          const windowStart = new Date();
          windowStart.setDate(windowStart.getDate() - windowDays);
          query = query.gte('created_at', windowStart.toISOString());
        }

        if (options.top_k) {
          query = query.limit(options.top_k);
        }

        const { data: alertsData, error } = await query;

        if (error) {
          logger.error('Error fetching risk radar data', 'AI_INSIGHTS', error);
          throw error;
        }

        return {
          cohort_id: options.cohort_id,
          window: options.window || '7d',
          generated_at: new Date().toISOString(),
          data: alertsData || [],
          next_cursor: null
        };
      } catch (error) {
        logger.error('Failed to fetch risk radar data', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user?.id
  });

  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('risk_radar_alerts')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', alertId);

      if (error) {
        logger.error('Error resolving risk alert', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-radar'] });
    }
  });

  const highRiskStudents = data?.data.filter(alert => alert.risk_score > 0.8) || [];
  const mediumRiskStudents = data?.data.filter(alert => alert.risk_score > 0.6 && alert.risk_score <= 0.8) || [];

  return {
    alerts: data?.data || [],
    highRiskStudents,
    mediumRiskStudents,
    cohortId: data?.cohort_id,
    generatedAt: data?.generated_at,
    isLoading,
    error,
    refetch,
    resolveAlert: resolveAlert.mutate,
    isResolving: resolveAlert.isPending
  };
};