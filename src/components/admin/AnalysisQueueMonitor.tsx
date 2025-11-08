import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface QueueStats {
  total_items: number;
  pending_items: number;
  processing_items: number;
  completed_items: number;
  failed_items: number;
  avg_processing_time_sec: number;
}

interface AnalysisJob {
  id: string;
  status: string;
  total_documents: number;
  processed_documents: number;
  failed_documents: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  metadata: any;
}

export function AnalysisQueueMonitor({ familyId }: { familyId: string }) {
  const [isRecovering, setIsRecovering] = useState(false);

  const { data: queueStats, refetch: refetchStats } = useQuery({
    queryKey: ['queue-stats', familyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_queue_stats', { p_family_id: familyId });
      
      if (error) throw error;
      return data?.[0] as QueueStats;
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { data: activeJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['active-jobs', familyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('family_id', familyId)
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as AnalysisJob[];
    },
    refetchInterval: 5000,
  });

  const handleEmergencyCleanup = async () => {
    setIsRecovering(true);
    const toastId = toast.loading("Running emergency cleanup...");
    
    try {
      const { data, error } = await supabase.functions.invoke(
        'emergency-cleanup-stuck-analysis',
        { body: { family_id: familyId } }
      );

      if (error) throw error;

      toast.success(
        `Cleanup complete: ${data.recovery.failed_count} items reset, ${data.recovery.retried_count} items queued for retry`,
        { id: toastId }
      );
      
      refetchStats();
      refetchJobs();
    } catch (error: any) {
      console.error('Emergency cleanup error:', error);
      toast.error('Cleanup failed: ' + error.message, { id: toastId });
    } finally {
      setIsRecovering(false);
    }
  };

  if (!queueStats && !activeJobs?.length) return null;

  const hasStuckItems = queueStats && queueStats.processing_items > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Analysis Queue Monitor
            </CardTitle>
            <CardDescription>
              Real-time queue health and processing status
            </CardDescription>
          </div>
          {hasStuckItems && (
            <Button
              onClick={handleEmergencyCleanup}
              disabled={isRecovering}
              variant="destructive"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
              Emergency Cleanup
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {queueStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{queueStats.pending_items}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Processing</p>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-2xl font-bold">{queueStats.processing_items}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{queueStats.completed_items}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Failed</p>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold">{queueStats.failed_items}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-2xl font-bold">
                  {Math.round(queueStats.avg_processing_time_sec)}s
                </span>
              </div>
            </div>
          </div>
        )}

        {activeJobs && activeJobs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Jobs</h4>
            {activeJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === 'processing' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                    <span className="text-sm">
                      {job.processed_documents}/{job.total_documents} documents
                    </span>
                  </div>
                  {job.error_message && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {job.error_message}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {job.metadata?.estimated_time_minutes && (
                    <span>Est. {job.metadata.estimated_time_minutes} min</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasStuckItems && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              {queueStats.processing_items} item(s) may be stuck. Use Emergency Cleanup to recover.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
