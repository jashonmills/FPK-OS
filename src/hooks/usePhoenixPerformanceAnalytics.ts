import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PerformanceSummary {
  totalRequests: number;
  avgLatency: number;
  medianLatency: number;
  p90Latency: number;
  p99Latency: number;
  avgTTFT: number;
  stepBreakdown: {
    contextLoading: number;
    intentDetection: number;
    llmResponse: number;
    governorCheck: number;
    ttsGeneration: number;
  };
  errorRate: number;
  byPersona: Record<string, {
    count: number;
    avgLatency: number;
    errorRate: number;
  }>;
}

export interface NiteOwlEffectiveness {
  totalTriggers: number;
  avgTurnsBetween: number;
  triggerReasons: Record<string, number>;
  engagementRate: number;
  sessionEndRate: number;
  avgResponseTime: number;
  helpfulRate: number;
}

export interface IntentAccuracyReport {
  totalIntents: number;
  misinterpretationRate: number;
  intentDistribution: Record<string, number>;
  topMisinterpretedIntents: Array<{
    intent: string;
    count: number;
    rate: number;
  }>;
}

export interface FeatureUsageStats {
  [featureName: string]: {
    totalTriggers: number;
    totalExecutions: number;
    successRate: number;
    errorRate: number;
    avgExecutionTime: number;
    recentErrors?: Array<{
      timestamp: string;
      error: string;
    }>;
  };
}

export interface FrustrationReport {
  totalEvents: number;
  feedbackDistribution: Record<string, number>;
  byPersona: Record<string, {
    count: number;
    avgTurns: number;
  }>;
  escapeHatchRate: number;
  avgTurnsBeforeFrustration: number;
  recentFeedback: Array<{
    type: string;
    message: string;
    turns: number;
    timestamp: string;
  }>;
}

export function usePhoenixPerformanceAnalytics(daysBack: number = 7) {
  return useQuery({
    queryKey: ['phoenix-performance-analytics', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_phoenix_performance_summary', {
        p_user_id: null,
        p_days_back: daysBack
      });
      
      if (error) throw error;
      return data as unknown as PerformanceSummary;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useNiteOwlEffectiveness(daysBack: number = 7) {
  return useQuery({
    queryKey: ['nite-owl-effectiveness', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_nite_owl_effectiveness', {
        p_days_back: daysBack
      });
      
      if (error) throw error;
      return data as unknown as NiteOwlEffectiveness;
    },
    refetchInterval: 30000,
  });
}

export function useIntentAccuracy(daysBack: number = 7) {
  return useQuery({
    queryKey: ['intent-accuracy', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_intent_accuracy_report', {
        p_days_back: daysBack
      });
      
      if (error) throw error;
      return data as unknown as IntentAccuracyReport;
    },
    refetchInterval: 30000,
  });
}

export function useFeatureUsageStats(daysBack: number = 7) {
  return useQuery({
    queryKey: ['feature-usage-stats', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_feature_usage_stats', {
        p_days_back: daysBack
      });
      
      if (error) throw error;
      return data as unknown as FeatureUsageStats;
    },
    refetchInterval: 30000,
  });
}

export function useFrustrationReport(daysBack: number = 7) {
  return useQuery({
    queryKey: ['frustration-report', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_frustration_report', {
        p_days_back: daysBack
      });
      
      if (error) throw error;
      return data as unknown as FrustrationReport;
    },
    refetchInterval: 30000,
  });
}