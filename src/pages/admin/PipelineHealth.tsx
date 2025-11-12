import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock,
  RefreshCw,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { PipelineHealthCheck } from "@/components/admin/PipelineHealthCheck";

export default function PipelineHealth() {
  // Provider health
  const { data: providerHealth, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['provider-health'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_provider_health')
        .select('*')
        .order('provider_name');
      return data || [];
    },
    refetchInterval: 10000,
  });

  // Queue stats
  const { data: queueStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('document_processing_queue')
        .select('status, job_type, processing_time_ms, created_at, started_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (!data) return null;
      
      const total = data.length;
      const queued = data.filter(j => j.status === 'queued').length;
      const processing = data.filter(j => j.status === 'processing').length;
      const completed = data.filter(j => j.status === 'completed').length;
      const failed = data.filter(j => j.status === 'failed').length;
      
      const completedJobs = data.filter(j => j.status === 'completed' && j.processing_time_ms);
      const avgTime = completedJobs.length > 0
        ? completedJobs.reduce((sum, j) => sum + (j.processing_time_ms || 0), 0) / completedJobs.length
        : 0;
      
      return {
        total,
        queued,
        processing,
        completed,
        failed,
        avgTimeMs: avgTime,
        successRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    },
    refetchInterval: 5000,
  });

  // Live jobs
  const { data: liveJobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['live-jobs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('document_processing_queue')
        .select(`
          *,
          documents (
            file_name
          )
        `)
        .in('status', ['queued', 'processing', 'failed'])
        .order('created_at', { ascending: false })
        .limit(50);
      
      return data || [];
    },
    refetchInterval: 3000,
  });

  const handleRefreshAll = () => {
    refetchHealth();
    refetchStats();
    refetchJobs();
    toast.success('Refreshed all metrics');
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('document_processing_queue')
        .update({ status: 'queued', error_message: null })
        .eq('id', jobId);
      
      if (error) throw error;
      toast.success('Job re-queued');
      refetchJobs();
    } catch (error: any) {
      toast.error('Failed to retry: ' + error.message);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('document_processing_queue')
        .update({ status: 'completed' })
        .eq('id', jobId);
      
      if (error) throw error;
      toast.success('Job cancelled');
      refetchJobs();
    } catch (error: any) {
      toast.error('Failed to cancel: ' + error.message);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pipeline Health Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor document processing pipeline, AI providers, and system throughput
          </p>
        </div>
        <Button onClick={handleRefreshAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Health Check Component */}
      <PipelineHealthCheck />

      {/* Queue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : queueStats?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Queued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statsLoading ? '...' : queueStats?.queued || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statsLoading ? '...' : queueStats?.processing || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsLoading ? '...' : queueStats?.successRate || 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : `${((queueStats?.avgTimeMs || 0) / 1000).toFixed(1)}s`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Provider Health */}
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Health</CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {providerHealth?.map(provider => (
                <div key={provider.provider_name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {provider.consecutive_failures === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : provider.consecutive_failures >= 3 ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium">{provider.provider_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {provider.consecutive_failures} consecutive failures
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {provider.last_success_at && (
                      <p className="text-green-600">
                        Success: {formatDistanceToNow(new Date(provider.last_success_at), { addSuffix: true })}
                      </p>
                    )}
                    {provider.last_failure_at && (
                      <p className="text-red-600">
                        Failure: {formatDistanceToNow(new Date(provider.last_failure_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Job Monitor */}
      <Card>
        <CardHeader>
          <CardTitle>Live Job Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : liveJobs && liveJobs.length > 0 ? (
            <div className="space-y-2">
              {liveJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {(job.documents as any)?.file_name || 'Unknown Document'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {job.job_type}
                      </Badge>
                      {job.status === 'queued' && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          Queued
                        </Badge>
                      )}
                      {job.status === 'processing' && (
                        <Badge className="bg-yellow-600 text-xs gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {job.status === 'failed' && (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <XCircle className="h-3 w-3" />
                          Failed (Retry {job.retry_count}/3)
                        </Badge>
                      )}
                      {job.ai_provider_used && (
                        <span className="text-xs text-muted-foreground">
                          via {job.ai_provider_used}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {job.status === 'failed' && job.retry_count < 3 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetryJob(job.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                    {job.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancelJob(job.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No active jobs</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
