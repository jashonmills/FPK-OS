import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, AlertCircle, RotateCcw, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentReportModal } from './DocumentReportModal';
import type { JobStatus, DocumentStatus, AnalysisJobMetadata } from '@/types/analysis';

interface ProjectScribeProps {
  jobId: string;
  onComplete?: () => void;
}

export const ProjectScribe = ({ jobId, onComplete }: ProjectScribeProps) => {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch job details
      const { data: jobData } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobData) {
        setJob({
          ...jobData,
          status: jobData.status as JobStatus['status'],
          job_type: jobData.job_type as JobStatus['job_type'],
          metadata: jobData.metadata as AnalysisJobMetadata | undefined
        });
      }

      // Fetch document statuses
      const { data: docsData } = await supabase
        .from('document_analysis_status')
        .select('*')
        .eq('job_id', jobId)
        .order('started_at', { ascending: true });

      if (docsData) {
        setDocuments(docsData.map(d => ({
          ...d,
          status: d.status as DocumentStatus['status']
        })));
      }

      setIsLoading(false);
    };

    fetchInitialData();

    // Subscribe to realtime updates for job
    const jobChannel = supabase
      .channel(`job-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'analysis_jobs',
          filter: `id=eq.${jobId}`
        },
        (payload) => {
          const newJob = payload.new as any;
          setJob({
            ...newJob,
            status: newJob.status as JobStatus['status'],
            job_type: newJob.job_type as JobStatus['job_type'],
            metadata: newJob.metadata as AnalysisJobMetadata | undefined
          });
          
          // Auto-complete for completed or completed_with_errors
          if ((payload.new.status === 'completed' || payload.new.status === 'completed_with_errors') && onComplete) {
            setTimeout(() => onComplete(), 2000); // 2 second delay to let users see final status
          }
        }
      )
      .subscribe();

    // Subscribe to realtime updates for document statuses
    const docsChannel = supabase
      .channel(`docs-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analysis_status',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          const newDoc = payload.new as any;
          const typedDoc: DocumentStatus = {
            ...newDoc,
            status: newDoc.status as DocumentStatus['status']
          };
          
          if (payload.eventType === 'INSERT') {
            setDocuments(prev => [...prev, typedDoc]);
          } else if (payload.eventType === 'UPDATE') {
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === newDoc.id ? typedDoc : doc
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobChannel);
      supabase.removeChannel(docsChannel);
    };
  }, [jobId, onComplete]);

  const handleViewReport = async () => {
    // CRITICAL FIX #4: Type-safe metadata access
    const metadata = job?.metadata as AnalysisJobMetadata | undefined;
    if (!metadata?.report_id) {
      toast.error('No report available');
      return;
    }
    
    const { data, error } = await supabase
      .from('document_reports')
      .select('*')
      .eq('id', metadata.report_id)
      .single();
    
    if (error) {
      toast.error('Failed to load report');
      console.error('Report load error:', error);
      return;
    }
    
    setReportData(data);
    setReportModalOpen(true);
  };

  if (isLoading || !job) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Initializing analysis job...</span>
        </div>
      </Card>
    );
  }

  const progress = job.total_documents > 0
    ? (job.processed_documents / job.total_documents) * 100
    : 0;
  
  // CRITICAL FIX #4: Type-safe metadata access
  const metadata = job.metadata as AnalysisJobMetadata | undefined;
  
  // Check if job appears stuck (processing for >2 minutes with no progress)
  const isJobStuck = job.status === 'processing' && 
    job.started_at && 
    job.processed_documents === 0 &&
    (Date.now() - new Date(job.started_at).getTime()) > 120000; // 2 minutes
  
  const handleResetJob = async () => {
    if (!job) return;
    
    setIsResetting(true);
    const toastId = toast.loading('Resetting stuck analysis job...');
    
    try {
      const { error } = await supabase.functions.invoke('reset-stuck-analysis-job', {
        body: { job_id: job.id }
      });
      
      if (error) throw error;
      
      toast.success('Job reset! You can now retry the analysis.', { id: toastId });
      
      // Refresh job status
      const { data: jobData } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (jobData) {
        setJob({
          ...jobData,
          status: jobData.status as JobStatus['status'],
          job_type: jobData.job_type as JobStatus['job_type'],
          metadata: jobData.metadata as AnalysisJobMetadata | undefined
        });
      }
      
      // Refresh document statuses
      const { data: docsData } = await supabase
        .from('document_analysis_status')
        .select('*')
        .eq('job_id', jobId)
        .order('started_at', { ascending: true });
      
      if (docsData) {
        setDocuments(docsData.map(d => ({
          ...d,
          status: d.status as DocumentStatus['status']
        })));
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Reset error:', error);
      toast.error('Failed to reset job: ' + error.message, { id: toastId });
    } finally {
      setIsResetting(false);
    }
  };

  const getStatusIcon = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case 'extracting':
      case 'analyzing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (doc: DocumentStatus) => {
    const { status, error_message, started_at } = doc;
    
    // Calculate elapsed time for analyzing status
    const getElapsedTime = () => {
      if (!started_at) return '';
      const elapsed = Math.floor((Date.now() - new Date(started_at).getTime()) / 1000);
      if (elapsed < 60) return `${elapsed}s`;
      return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    };
    
    // Parse stage from error_message (we use it to store progress)
    let stage = null;
    let elapsedMs = 0;
    try {
      if (error_message && error_message.startsWith('{')) {
        const progress = JSON.parse(error_message);
        stage = progress.stage;
        elapsedMs = progress.elapsed_ms || 0;
      }
    } catch (e) {
      // Not progress data, actual error
    }
    
    switch (status) {
      case 'pending':
        return 'Queued for analysis';
      case 'extracting':
        return 'Extracting text with Claude Vision AI';
      case 'analyzing':
        if (stage === 'calling_ai_model') {
          return `Calling AI Model (${getElapsedTime()} elapsed)`;
        } else if (stage === 'processing_response') {
          return `Processing AI Response (${getElapsedTime()} elapsed)`;
        } else if (stage === 'distributing_data') {
          return `Saving Extracted Data (${getElapsedTime()} elapsed)`;
        }
        const elapsed = getElapsedTime();
        const warning = started_at && (Date.now() - new Date(started_at).getTime() > 60000) 
          ? ' ⚠️ Long analysis' 
          : '';
        return `Analyzing document (${elapsed})${warning}`;
      case 'complete':
        return 'Complete';
      case 'failed':
        if (error_message?.includes('timeout')) {
          return 'Failed: Timeout (can retry)';
        }
        return 'Failed';
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Scribe - Live Analysis Log</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {job.processed_documents} of {job.total_documents} documents
            </span>
            {isJobStuck && (
              <Button
                onClick={handleResetJob}
                variant="destructive"
                size="sm"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Stuck Job
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        {isJobStuck && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ This job appears to be stuck. Click "Reset Stuck Job" to clear it and try again.
          </p>
        )}
        <Progress value={progress} className="h-2" />
        {job.status === 'completed' && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-green-600">
                ✅ Analysis complete! {job.failed_documents > 0 && `(${job.failed_documents} failed)`}
              </p>
              {metadata?.report_generated && metadata.report_id && (
                <Button onClick={handleViewReport} size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Comprehensive Report
                </Button>
              )}
              {metadata?.report_error && (
                <p className="text-sm text-amber-600">
                  ⚠️ Report generation failed: {metadata.report_error}
                </p>
              )}
            </div>
            <Button onClick={() => onComplete?.()} variant="ghost" size="sm">
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        )}
        {job.status === 'failed' && (
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <p className="text-sm text-red-600">
                ❌ Job stopped: {job.processed_documents} of {job.total_documents} documents completed
                {job.failed_documents > 0 && `, ${job.failed_documents} failed`}
              </p>
              {job.error_message && (
                <p className="text-sm text-muted-foreground">{job.error_message}</p>
              )}
            </div>
            <Button onClick={() => onComplete?.()} variant="ghost" size="sm" className="flex-shrink-0">
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        )}
        {job.status === 'completed_with_errors' && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-amber-600">
              ⚠️ Completed with errors: {job.processed_documents} succeeded, {job.failed_documents} failed
            </p>
            <Button onClick={() => onComplete?.()} variant="ghost" size="sm">
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="mt-0.5">{getStatusIcon(doc.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{doc.document_name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {getStatusText(doc)}
                </div>
                
                {doc.status === 'analyzing' && doc.started_at && (
                  <div className="mt-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Smart batching with auto-retry on rate limits
                    </div>
                  </div>
                )}
                
                {doc.status === 'complete' && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {doc.metrics_extracted} metrics, {doc.insights_extracted} insights extracted
                  </p>
                )}
                
                {doc.status === 'failed' && doc.error_message && !doc.error_message.startsWith('{') && (
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-red-500">{doc.error_message}</p>
                    {doc.error_message?.includes('not_found_error') && (
                      <p className="text-xs text-amber-500">🤖 AI model not found - contact support</p>
                    )}
                    {doc.error_message?.includes('model:') && doc.error_message?.includes('404') && (
                      <p className="text-xs text-amber-500">🤖 AI model error - extraction service needs update</p>
                    )}
                    {doc.error_message?.includes('100-page limit') && (
                      <p className="text-xs text-amber-500">📄 Document is too large - please split into smaller files (max 100 pages)</p>
                    )}
                    {doc.error_message?.includes('too large') && (
                      <p className="text-xs text-amber-500">📄 Document is too large - please split into smaller files</p>
                    )}
                    {doc.error_message?.includes('FILE_TOO_LARGE') && (
                      <p className="text-xs text-amber-500">📄 File exceeds 5MB limit - split PDF and re-upload</p>
                    )}
                    {doc.error_message?.includes('Rate limited') && (
                      <p className="text-xs text-amber-500">⏸️ Will auto-retry with backoff</p>
                    )}
                    {doc.error_message?.includes('credits') && (
                      <p className="text-xs text-amber-500">💳 Add AI credits to continue</p>
                    )}
                    {doc.error_message?.includes('Max retries') && (
                      <p className="text-xs text-muted-foreground">❌ Permanent failure after retries</p>
                    )}
                    {doc.error_message?.includes('stack') && (
                      <p className="text-xs text-amber-500">⚠️ Technical error - retry extraction</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <DocumentReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        reportData={reportData}
        documents={documents}
      />
    </Card>
  );
};
