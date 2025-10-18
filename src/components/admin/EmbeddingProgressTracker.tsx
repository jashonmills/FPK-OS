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

  const getStatusIcon = () => {
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

          {job.error_message && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-2">
              {job.error_message}
            </div>
          )}

          {job.status === 'completed' && (
            <div className="text-sm text-green-600 dark:text-green-400 mt-2">
              🎉 All embeddings generated successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
