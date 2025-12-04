/**
 * TypeScript type definitions for Analysis System
 * CRITICAL FIX #4: Type-safe metadata structures
 */

export interface AnalysisJobMetadata {
  report_id?: string;
  report_generated?: boolean;
  report_error?: string;
  estimatedMinutes?: number;
  avgTimePerDoc?: number;
  processing_mode?: 'queue_parallel' | 'queue_sequential';
  document_count?: number;
  estimated_time_minutes?: number;
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'completed_with_errors' | 'failed';
  total_documents: number;
  processed_documents: number;
  failed_documents: number;
  started_at: string | null;
  completed_at: string | null;
  metadata?: AnalysisJobMetadata;
  job_type: 're-analysis' | 'initial' | 'manual';
  error_message?: string | null;
}

export interface DocumentStatus {
  id: string;
  document_name: string;
  status: 'pending' | 'extracting' | 'analyzing' | 'complete' | 'failed';
  metrics_extracted: number;
  insights_extracted: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  current_phase?: string | null;
  progress_percent?: number;
  status_message?: string | null;
}

export interface DocumentReport {
  id: string;
  report_id?: string;
  report_content: string;
  generated_at: string;
  statistics: {
    documentCount: number;
    metricsExtracted: number;
    insightsGenerated: number;
    progressRecords: number;
  };
  metadata: {
    focusArea: string;
    format: 'markdown' | 'pdf';
  };
  document_ids: string[];
}

export interface QueueStats {
  total_items: number;
  pending_items: number;
  processing_items: number;
  completed_items: number;
  failed_items: number;
  avg_processing_time_sec: number;
}
