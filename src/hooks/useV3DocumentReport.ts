import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  target_value?: number;
  measurement_date?: string;
  context?: string;
}

export interface AIInsight {
  id: string;
  insight_type: string;
  title: string;
  content: string;
  priority: string;
  confidence_score?: number;
}

export interface ProgressTracking {
  id: string;
  metric_type: string;
  baseline_value: number;
  current_value: number;
  target_value: number;
  progress_percentage: number;
  trend: string;
  notes: string;
}

export function useV3DocumentReport(documentId: string, familyId: string) {
  return useQuery({
    queryKey: ['v3-document-report', documentId],
    queryFn: async () => {
      // Fetch document
      const { data: document, error: docError } = await supabase
        .from('v3_documents')
        .select('*')
        .eq('id', documentId)
        .eq('family_id', familyId)
        .single();
      
      if (docError) throw docError;
      
      // Fetch metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('document_metrics')
        .select('*')
        .eq('document_id', documentId)
        .eq('family_id', familyId)
        .order('measurement_date', { ascending: false });
      
      if (metricsError) throw metricsError;
      
      // Fetch insights
      const { data: insights, error: insightsError } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('document_id', documentId)
        .eq('family_id', familyId)
        .eq('is_active', true)
        .order('priority', { ascending: true });
      
      if (insightsError) throw insightsError;
      
      // Fetch progress tracking
      const { data: progress, error: progressError } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('document_id', documentId)
        .eq('family_id', familyId)
        .order('created_at', { ascending: false });
      
      if (progressError) throw progressError;
      
      return {
        document,
        metrics: (metrics || []) as DocumentMetric[],
        insights: (insights || []) as AIInsight[],
        progressTracking: (progress || []) as ProgressTracking[],
        goals: []
      };
    },
    enabled: !!documentId && !!familyId
  });
}
