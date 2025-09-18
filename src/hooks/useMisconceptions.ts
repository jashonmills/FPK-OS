import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';
import type { MisconceptionResponse, AIInsightsOptions } from '@/types/ai-insights';

export const useMisconceptions = (options: AIInsightsOptions = {}) => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['misconceptions', user?.id, options],
    queryFn: async (): Promise<MisconceptionResponse> => {
      if (!user?.id || !options.cohort_id) {
        return {
          cohort_id: options.cohort_id || '',
          clusters: []
        };
      }

      try {
        let query = supabase
          .from('misconception_clusters')
          .select('*')
          .eq('cohort_id', options.cohort_id)
          .order('confidence', { ascending: false });

        if (options.window) {
          const windowDays = parseInt(options.window.replace('d', ''));
          const windowStart = new Date();
          windowStart.setDate(windowStart.getDate() - windowDays);
          query = query.gte('created_at', windowStart.toISOString());
        }

        if (options.top_k) {
          query = query.limit(options.top_k);
        }

        const { data: misconceptionData, error } = await query;

        if (error) {
          logger.error('Error fetching misconception data', 'AI_INSIGHTS', error);
          throw error;
        }

        return {
          cohort_id: options.cohort_id || '',
          clusters: misconceptionData || []
        };
      } catch (error) {
        logger.error('Failed to fetch misconception data', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!user?.id && !!options.cohort_id
  });

  const highConfidenceClusters = data?.clusters.filter(cluster => cluster.confidence > 0.8) || [];
  const widespreadClusters = data?.clusters.filter(cluster => cluster.support_count > 10) || [];

  return {
    clusters: data?.clusters || [],
    cohortId: data?.cohort_id,
    highConfidenceClusters,
    widespreadClusters,
    isLoading,
    error,
    refetch
  };
};