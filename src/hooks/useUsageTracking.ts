import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UsageQuota {
  id: string;
  user_id: string;
  subscription_tier: string;
  period_start: string;
  period_end: string;
  
  // AI Chat & Voice
  ai_chat_messages_limit: number;
  ai_chat_messages_used: number;
  voice_minutes_limit: number;
  voice_minutes_used: number;
  
  // Knowledge & RAG
  rag_queries_limit: number;
  rag_queries_used: number;
  document_processing_limit: number;
  document_processing_used: number;
  
  // Advanced AI
  flashcard_generation_limit: number;
  flashcard_generation_used: number;
  ai_insights_limit: number;
  ai_insights_used: number;
  
  // Storage
  knowledge_base_storage_mb_limit: number;
  knowledge_base_storage_mb_used: number;
}

export interface UsageLog {
  id: string;
  user_id: string;
  feature_type: string;
  usage_amount: number;
  metadata: any;
  timestamp: string;
}

export type AIFeatureType = 
  | 'ai_chat' 
  | 'voice_processing' 
  | 'rag_query' 
  | 'document_processing' 
  | 'flashcard_generation' 
  | 'ai_insights';

export function useUsageTracking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current usage quotas
  const { data: quotas, isLoading: isLoadingQuotas } = useQuery({
    queryKey: ['usage-quotas', user?.id],
    queryFn: async (): Promise<UsageQuota | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('usage_quotas')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_end', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('Error fetching usage quotas:', error);
        throw error;
      }

      return data as UsageQuota;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch usage logs
  const { data: usageLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['usage-logs', user?.id],
    queryFn: async (): Promise<UsageLog[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching usage logs:', error);
        throw error;
      }

      return (data || []) as UsageLog[];
    },
    enabled: !!user,
  });

  // Initialize quotas for new users
  const initializeQuotasMutation = useMutation({
    mutationFn: async ({ userId, tier }: { userId: string; tier: string }) => {
      const { error } = await supabase.rpc('initialize_user_quotas', {
        p_user_id: userId,
        p_subscription_tier: tier
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-quotas'] });
    },
  });

  // Track usage mutation
  const trackUsageMutation = useMutation({
    mutationFn: async ({ 
      featureType, 
      amount = 1, 
      metadata = {} 
    }: { 
      featureType: AIFeatureType; 
      amount?: number; 
      metadata?: Record<string, any>; 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('track_usage', {
        p_user_id: user.id,
        p_feature_type: featureType,
        p_usage_amount: amount,
        p_metadata: metadata
      });

      if (error) throw error;
      return data; // Returns boolean indicating if usage is within limits
    },
    onSuccess: (canUse, variables) => {
      // Refresh quotas after tracking usage
      queryClient.invalidateQueries({ queryKey: ['usage-quotas'] });
      queryClient.invalidateQueries({ queryKey: ['usage-logs'] });

      if (!canUse) {
        toast({
          title: "Usage Limit Reached",
          description: `You've reached your ${variables.featureType.replace('_', ' ')} limit for this billing period. Please upgrade your plan to continue.`,
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error('Error tracking usage:', error);
      toast({
        title: "Error",
        description: "Failed to track usage. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Check if user can use a feature
  const canUseFeature = (featureType: AIFeatureType, amount: number = 1): boolean => {
    if (!quotas) return false;

    const fieldMap = {
      ai_chat: { used: quotas.ai_chat_messages_used, limit: quotas.ai_chat_messages_limit },
      voice_processing: { used: quotas.voice_minutes_used, limit: quotas.voice_minutes_limit },
      rag_query: { used: quotas.rag_queries_used, limit: quotas.rag_queries_limit },
      document_processing: { used: quotas.document_processing_used, limit: quotas.document_processing_limit },
      flashcard_generation: { used: quotas.flashcard_generation_used, limit: quotas.flashcard_generation_limit },
      ai_insights: { used: quotas.ai_insights_used, limit: quotas.ai_insights_limit },
    };

    const field = fieldMap[featureType];
    if (!field) return false;

    // -1 means unlimited
    if (field.limit === -1) return true;

    return (field.used + amount) <= field.limit;
  };

  // Get usage percentage for a feature
  const getUsagePercentage = (featureType: AIFeatureType): number => {
    if (!quotas) return 0;

    const fieldMap = {
      ai_chat: { used: quotas.ai_chat_messages_used, limit: quotas.ai_chat_messages_limit },
      voice_processing: { used: quotas.voice_minutes_used, limit: quotas.voice_minutes_limit },
      rag_query: { used: quotas.rag_queries_used, limit: quotas.rag_queries_limit },
      document_processing: { used: quotas.document_processing_used, limit: quotas.document_processing_limit },
      flashcard_generation: { used: quotas.flashcard_generation_used, limit: quotas.flashcard_generation_limit },
      ai_insights: { used: quotas.ai_insights_used, limit: quotas.ai_insights_limit },
    };

    const field = fieldMap[featureType];
    if (!field || field.limit === -1) return 0;

    return Math.min((field.used / field.limit) * 100, 100);
  };

  // Initialize quotas if they don't exist
  useEffect(() => {
    if (user && !quotas && !isLoadingQuotas) {
      initializeQuotasMutation.mutate({ 
        userId: user.id, 
        tier: 'basic' // Default tier, should be updated when subscription changes
      });
    }
  }, [user, quotas, isLoadingQuotas]);

  return {
    quotas,
    usageLogs,
    isLoading: isLoadingQuotas || isLoadingLogs,
    trackUsage: trackUsageMutation.mutate,
    isTrackingUsage: trackUsageMutation.isPending,
    canUseFeature,
    getUsagePercentage,
    initializeQuotas: initializeQuotasMutation.mutate,
  };
}