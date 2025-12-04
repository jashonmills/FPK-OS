import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';
import type { EmbeddingJob } from '@/hooks/useEmbeddingJobStatus';

interface EmbeddingProgressTrackerProps {
  job: EmbeddingJob | null;
}

export function EmbeddingProgressTracker({ job }: EmbeddingProgressTrackerProps) {
  if (!job || job.status === 'pending') return null;

  const progress = job.total_documents > 0 
    ? (job.processed_documents / job.total_documents) * 100 
    : 0;

  // Check for API permission issues
  const hasApiPermissionError = job.error_message?.includes('insufficient permissions') || 
                                 job.error_message?.includes('Missing scopes');
  const allFailed = job.total_documents > 0 && job.successful_embeddings === 0 && job.status === 'completed';

  const getStatusIcon = () => {
    if (hasApiPermissionError || allFailed) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    switch (job.status) {
      case 'in_progress':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (hasApiPermissionError || allFailed) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    switch (job.status) {
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Processing</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Complete</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium text-sm">Embedding Generation</span>
            {getStatusBadge()}
          </div>
          <div className="text-sm text-muted-foreground">
            {job.processed_documents} / {job.total_documents}
          </div>
        </div>

        <div className="space-y-2">
          {job.current_document_title && job.status === 'in_progress' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span className="truncate">Processing: {job.current_document_title}</span>
            </div>
          )}

          <Progress 
            value={progress} 
            className="h-2"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              ✓ {job.successful_embeddings} successful
              {job.failed_embeddings > 0 && ` • ✕ ${job.failed_embeddings} failed`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          {hasApiPermissionError && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <div className="font-semibold mb-1">⚠️ OpenAI API Key Permission Error</div>
              <div>Your OpenAI API key lacks the required <code className="px-1 py-0.5 bg-red-100 dark:bg-red-900/40 rounded">model.request</code> scope.</div>
              <div className="mt-2">
                <strong>Fix:</strong> Go to OpenAI dashboard → API Keys → Edit your key → Enable "Model capabilities" permission
              </div>
            </div>
          )}

          {allFailed && !hasApiPermissionError && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <div className="font-semibold mb-1">❌ All embeddings failed</div>
              <div>{job.error_message || 'Check edge function logs for details'}</div>
            </div>
          )}

          {job.error_message && !hasApiPermissionError && !allFailed && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-2">
              {job.error_message}
            </div>
          )}

          {job.status === 'completed' && job.successful_embeddings > 0 && (
            <div className="text-sm text-green-600 dark:text-green-400 mt-2">
              🎉 All embeddings generated successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
