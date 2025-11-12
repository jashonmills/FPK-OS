import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface DocumentQueueStatusProps {
  documentId: string;
  familyId: string;
}

export function DocumentQueueStatus({ documentId, familyId }: DocumentQueueStatusProps) {
  const queryClient = useQueryClient();

  // Fetch queue status for this document
  const { data: queueJob, isLoading } = useQuery({
    queryKey: ["document-queue", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_processing_queue')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`queue-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_processing_queue',
          filter: `document_id=eq.${documentId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["document-queue", documentId] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, queryClient]);

  const handleRetry = async () => {
    try {
      const { error } = await supabase
        .from('document_processing_queue')
        .update({ 
          status: 'queued', 
          last_error: null,
          retry_count: (queueJob?.retry_count || 0) + 1
        })
        .eq('id', queueJob?.id);

      if (error) throw error;
      toast.success('Document re-queued for processing');
    } catch (error: any) {
      toast.error('Failed to retry: ' + error.message);
    }
  };

  if (isLoading || !queueJob) return null;

  const getStatusBadge = () => {
    switch (queueJob.status) {
      case 'queued':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Queued
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-yellow-600 gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            {queueJob.job_type === 'EXTRACT' ? 'Extracting' : 'Analyzing'}
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-600 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const getEstimatedTime = () => {
    if (!queueJob.started_at) return null;
    
    const avgTime = queueJob.job_type === 'EXTRACT' ? 30000 : 60000; // 30s or 60s
    const elapsed = Date.now() - new Date(queueJob.started_at).getTime();
    const remaining = Math.max(0, avgTime - elapsed);
    
    if (remaining === 0 || queueJob.status !== 'processing') return null;
    
    return `~${Math.ceil(remaining / 1000)}s remaining`;
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {getStatusBadge()}
      
      {queueJob.status === 'processing' && getEstimatedTime() && (
        <span className="text-muted-foreground">{getEstimatedTime()}</span>
      )}
      
      {queueJob.status === 'failed' && queueJob.retry_count < 3 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRetry}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
      
      {queueJob.status === 'failed' && queueJob.last_error && (
        <span className="text-xs text-destructive max-w-xs truncate" title={JSON.stringify(queueJob.last_error)}>
          {typeof queueJob.last_error === 'string' ? queueJob.last_error : 'Processing failed'}
        </span>
      )}
      
      {queueJob.ai_provider_used && queueJob.status === 'completed' && (
        <span className="text-xs text-muted-foreground">
          via {queueJob.ai_provider_used}
        </span>
      )}
    </div>
  );
}
