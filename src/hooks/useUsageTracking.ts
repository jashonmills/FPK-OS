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

  // Fetch current usage quotas with real usage data
  const { data: quotas, isLoading: isLoadingQuotas } = useQuery({
    queryKey: ['usage-quotas', user?.id],
    queryFn: async (): Promise<UsageQuota | null> => {
      if (!user) return null;

      // Get quota data
      const { data: quotaData, error: quotaError } = await supabase
        .from('usage_quotas')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_end', new Date().toISOString())
        .maybeSingle();

      if (quotaError) {
        console.error('Error fetching usage quotas:', quotaError);
        throw quotaError;
      }

      if (!quotaData) return null;

      // Get real usage counts from actual data tables
      const [
        { count: flashcardCount },
        { count: fileCount },
        { count: chatCount },
        { data: storageData },
        { count: ragQueryCount },
        { count: aiInsightsCount },
        { count: voiceSessionCount }
      ] = await Promise.all([
        supabase.from('flashcards').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('file_uploads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('file_uploads').select('file_size').eq('user_id', user.id),
        supabase.from('knowledge_base_usage').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id).or('category.eq.ai-insights,tags.cs.["AI Insights"]'),
        supabase.from('usage_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('feature_type', 'voice_processing')
      ]);

      // Calculate storage usage in MB
      const storageUsedMB = storageData?.reduce((total, file) => total + (file.file_size || 0), 0) / (1024 * 1024) || 0;

      // Update quota data with real usage counts
      const updatedQuota: UsageQuota = {
        ...quotaData,
        flashcard_generation_used: flashcardCount || 0,
        document_processing_used: fileCount || 0,
        ai_chat_messages_used: chatCount || 0,
        rag_queries_used: ragQueryCount || 0,
        ai_insights_used: aiInsightsCount || 0,
        voice_minutes_used: voiceSessionCount || 0, // Voice sessions count as minutes for now
        knowledge_base_storage_mb_used: Math.round(storageUsedMB * 100) / 100, // Round to 2 decimal places
      };

      return updatedQuota;
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds for development
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

  // Check if user can use a feature - Always return true for unlimited access
  const canUseFeature = (featureType: AIFeatureType, amount: number = 1): boolean => {
    // Always return true for unlimited access for all users
    return true;
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