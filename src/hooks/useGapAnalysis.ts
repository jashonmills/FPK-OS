import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';
import type { GapAnalysisResponse, AIInsightsOptions } from '@/types/ai-insights';

export const useGapAnalysis = (options: AIInsightsOptions = {}) => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['gap-analysis', user?.id, options],
    queryFn: async (): Promise<GapAnalysisResponse> => {
      if (!user?.id || !options.course_id) {
        return {
          course_id: options.course_id || '',
          nodes: [],
          edges: []
        };
      }

      try {
        let query = supabase
          .from('gap_analysis')
          .select('*')
          .eq('course_id', options.course_id)
          .order('gap_score', { ascending: false });

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

        const { data: gapData, error } = await query;

        if (error) {
          logger.error('Error fetching gap analysis data', 'AI_INSIGHTS', error);
          throw error;
        }

        // Generate edges from blocker relationships
        const edges = (gapData || []).flatMap(node => 
          (node.blockers as Array<{ outcome_id: string }> || []).map(blocker => ({
            from: blocker.outcome_id,
            to: node.outcome_id
          }))
        );

        return {
          course_id: options.course_id || '',
          nodes: gapData || [],
          edges
        };
      } catch (error) {
        logger.error('Failed to fetch gap analysis data', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!user?.id && !!options.course_id
  });

  const criticalGaps = data?.nodes.filter(node => node.gap_score > 0.8) || [];
  const moderateGaps = data?.nodes.filter(node => node.gap_score > 0.5 && node.gap_score <= 0.8) || [];

  return {
    nodes: data?.nodes || [],
    edges: data?.edges || [],
    courseId: data?.course_id,
    criticalGaps,
    moderateGaps,
    isLoading,
    error,
    refetch
  };
};