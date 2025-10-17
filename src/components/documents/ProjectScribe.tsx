import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ProjectScribeProps {
  jobId: string;
  onComplete?: () => void;
}

interface JobStatus {
  id: string;
  status: string;
  total_documents: number;
  processed_documents: number;
  failed_documents: number;
  started_at: string;
  completed_at: string | null;
}

interface DocumentStatus {
  id: string;
  document_name: string;
  status: string;
  metrics_extracted: number;
  insights_extracted: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export const ProjectScribe = ({ jobId, onComplete }: ProjectScribeProps) => {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch job details
      const { data: jobData } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobData) {
        setJob(jobData);
      }

      // Fetch document statuses
      const { data: docsData } = await supabase
        .from('document_analysis_status')
        .select('*')
        .eq('job_id', jobId)
        .order('started_at', { ascending: true });

      if (docsData) {
        setDocuments(docsData);
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
          setJob(payload.new as JobStatus);
          
          // Check if job is complete
          if (payload.new.status === 'completed' && onComplete) {
            onComplete();
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
          if (payload.eventType === 'INSERT') {
            setDocuments(prev => [...prev, payload.new as DocumentStatus]);
          } else if (payload.eventType === 'UPDATE') {
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === payload.new.id ? (payload.new as DocumentStatus) : doc
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
          <span className="text-sm text-muted-foreground">
            {job.processed_documents} of {job.total_documents} documents
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        {job.status === 'completed' && (
          <p className="text-sm text-green-600">
            ✅ Analysis complete! {job.failed_documents > 0 && `(${job.failed_documents} failed)`}
          </p>
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
                  <div className="mt-1">
                    <div className="text-xs text-muted-foreground">
                      Estimated: 30-90 seconds
                    </div>
                  </div>
                )}
                
                {doc.status === 'complete' && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {doc.metrics_extracted} metrics, {doc.insights_extracted} insights extracted
                  </p>
                )}
                
                {doc.status === 'failed' && doc.error_message && !doc.error_message.startsWith('{') && (
                  <p className="text-sm text-red-500 mt-1">{doc.error_message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
