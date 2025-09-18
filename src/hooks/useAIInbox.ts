import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';
import type { AIInboxCard, AIInboxResponse, AIInsightsOptions } from '@/types/ai-insights';

export const useAIInbox = (options: AIInsightsOptions = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-inbox', user?.id, options],
    queryFn: async (): Promise<AIInboxResponse> => {
      if (!user?.id) {
        return { data: [], next_cursor: null };
      }

      try {
        let query = supabase
          .from('ai_inbox')
          .select('*')
          .eq('dismissed', false)
          .order('created_at', { ascending: false });

        if (options.org_id) {
          query = query.eq('org_id', options.org_id);
        } else {
          query = query.eq('user_id', user.id);
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: inboxData, error } = await query;

        if (error) {
          logger.error('Error fetching AI inbox data', 'AI_INSIGHTS', error);
          throw error;
        }

        return {
          data: inboxData || [],
          next_cursor: null
        };
      } catch (error) {
        logger.error('Failed to fetch AI inbox data', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!user?.id
  });

  const dismissCard = useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase
        .from('ai_inbox')
        .update({ dismissed: true })
        .eq('id', cardId);

      if (error) {
        logger.error('Error dismissing AI inbox card', 'AI_INSIGHTS', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-inbox'] });
    }
  });

  const trackCardInteraction = (cardId: string, action: string) => {
    // Track analytics event
    logger.info(`AI inbox card ${action}`, 'AI_INSIGHTS', { cardId, action });
  };

  return {
    inboxCards: data?.data || [],
    isLoading,
    error,
    refetch,
    dismissCard: dismissCard.mutate,
    isDismissing: dismissCard.isPending,
    trackCardInteraction,
    nextCursor: data?.next_cursor
  };
};