import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';
import type { EngagementMatrix, AIInsightsOptions } from '@/types/ai-insights';

export const useEngagementMatrix = (options: AIInsightsOptions = {}) => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['engagement-matrix', user?.id, options],
    queryFn: async (): Promise<EngagementMatrix | null> => {
      if (!user?.id || !options.cohort_id) {
        return null;
      }

      try {
        let query = supabase
          .from('engagement_matrix')
          .select('*')
          .eq('cohort_id', options.cohort_id)
          .order('created_at', { ascending: false });

        if (options.window) {
          const windowDays = parseInt(options.window.replace('d', ''));
          const windowStart = new Date();
          windowStart.setDate(windowStart.getDate() - windowDays);
          query = query.gte('created_at', windowStart.toISOString());
        }

        const { data: matrixData, error } = await query.limit(1).single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          logger.error('Error fetching engagement matrix data', 'AI_INSIGHTS', error);
          throw error;
        }

        return matrixData || null;
      } catch (error) {
        logger.error('Failed to fetch engagement matrix data', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!user?.id && !!options.cohort_id
  });

  const totalStudents = data?.quadrants 
    ? Object.values(data.quadrants).reduce((sum, count) => sum + count, 0)
    : 0;

  const strugglingStudents = data?.quadrants.low_eng_low_mastery || 0;
  const excellentStudents = data?.quadrants.high_eng_high_mastery || 0;

  return {
    matrix: data,
    quadrants: data?.quadrants,
    thresholds: data?.thresholds,
    totalStudents,
    strugglingStudents,
    excellentStudents,
    cohortId: options.cohort_id,
    isLoading,
    error,
    refetch
  };
};