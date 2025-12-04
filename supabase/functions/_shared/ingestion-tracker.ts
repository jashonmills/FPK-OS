import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Helper to create and track ingestion jobs
 */
export class IngestionTracker {
  private supabase: any;
  private jobId: string | null = null;
  private familyId: string | null = null;

  constructor(supabaseUrl: string, supabaseKey: string, familyId: string | null = null) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.familyId = familyId;
  }

  /**
   * Create a new ingestion job
   */
  async createJob(functionName: string, totalDocs: number = 0): Promise<string> {
    const { data, error } = await this.supabase
      .from('ingestion_jobs')
      .insert({
        function_name: functionName,
        family_id: this.familyId,
        total_documents: totalDocs,
        status: 'running',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create ingestion job:', error);
      throw error;
    }

    if (!data?.id) {
      throw new Error('Failed to create ingestion job: no ID returned');
    }

    this.jobId = data.id as string;
    console.log(`Created ingestion job ${this.jobId} for family ${this.familyId}`);
    return this.jobId as string;
  }

  /**
   * Update job progress
   */
  async updateProgress(successful: number, failed: number) {
    if (!this.jobId) return;

    const { error } = await this.supabase
      .from('ingestion_jobs')
      .update({
        successful_documents: successful,
        failed_documents: failed,
      })
      .eq('id', this.jobId);

    if (error) {
      console.error('Failed to update job progress:', error);
    }
  }

  /**
   * Complete the job
   */
  async completeJob(successful: number, failed: number, status: 'completed' | 'failed' = 'completed') {
    if (!this.jobId) return;

    const { error } = await this.supabase
      .from('ingestion_jobs')
      .update({
        successful_documents: successful,
        failed_documents: failed,
        status,
        completed_at: new Date().toISOString(),
      })
      .eq('id', this.jobId);

    if (error) {
      console.error('Failed to complete job:', error);
    }

    console.log(`Completed job ${this.jobId}: ${successful} successful, ${failed} failed`);
  }

  /**
   * Log an error for this job
   */
  async logError(sourceUrl: string | null, errorType: string, errorMessage: string, errorStack?: string) {
    if (!this.jobId) return;

    const { error } = await this.supabase
      .from('ingestion_errors')
      .insert({
        job_id: this.jobId,
        family_id: this.familyId,
        source_url: sourceUrl,
        error_type: errorType,
        error_message: errorMessage,
        error_stack: errorStack,
      });

    if (error) {
      console.error('Failed to log error:', error);
    }
  }

  /**
   * Get the current job ID
   */
  getJobId(): string {
    return this.jobId || '';
  }
}
