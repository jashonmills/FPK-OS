import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Loader2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { BedrockHealthMonitor } from "@/components/admin/BedrockHealthMonitor";
import { formatDistanceToNow } from "date-fns";

export default function SystemHealthPage() {
  // Fetch unified queue statistics (Bedrock only now)
  const { data: queueStats, isLoading: loadingStats, refetch: refetchStats } = useQuery({
    queryKey: ["unified-queue-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_unified_queue_stats");
      if (error) throw error;
      
      // Get Bedrock stats only
      const bedrockRow = data?.find((row: any) => row.source === 'bedrock');
      
      return bedrockRow || {
        total: 0,
        queued: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        avg_processing_time_seconds: 0
      };
    },
    refetchInterval: 10000,
  });

  const bedrockStats = queueStats;

  // Fetch live jobs from both legacy and Bedrock
  const { data: liveJobs, isLoading: loadingJobs, refetch: refetchJobs } = useQuery({
    queryKey: ["live-jobs"],
    queryFn: async () => {
      // Fetch legacy jobs
      const { data: legacyJobs, error: legacyError } = await supabase
        .from("analysis_queue")
        .select(`
          *,
          documents (
            file_name
          )
        `)
        .in("status", ["pending", "processing", "failed"])
        .order("created_at", { ascending: false })
        .limit(5);

      if (legacyError) throw legacyError;

      // Fetch Bedrock jobs
      const { data: bedrockJobs, error: bedrockError } = await supabase
        .from("bedrock_documents")
        .select("*")
        .in("status", ["pending", "processing", "failed"])
        .order("created_at", { ascending: false })
        .limit(5);

      if (bedrockError) throw bedrockError;

      // Combine and mark source
      const combined = [
        ...(legacyJobs || []).map(j => ({ ...j, source: 'legacy' as const })),
        ...(bedrockJobs || []).map(j => ({ 
          ...j, 
          source: 'bedrock' as const,
          documents: { file_name: j.file_name }
        }))
      ];

      return combined.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 10);
    },
    refetchInterval: 5000,
  });

  // AI provider health removed - legacy feature not used in Bedrock

  const handleRefreshAll = async () => {
    toast.loading("Refreshing all data...", { id: "refresh-all" });
    await Promise.all([refetchStats(), refetchJobs()]);
    toast.success("Data refreshed", { id: "refresh-all" });
  };

  const handleRetryJob = async (jobId: string) => {
    const { error } = await supabase
      .from("analysis_queue")
      .update({ status: "pending", error_message: null })
      .eq("id", jobId);

    if (error) {
      toast.error("Failed to retry job");
      return;
    }

    toast.success("Job queued for retry");
    refetchJobs();
  };

  const handleCancelJob = async (jobId: string) => {
    const { error } = await supabase
      .from("analysis_queue")
      .update({ status: "completed" })
      .eq("id", jobId);

    if (error) {
      toast.error("Failed to cancel job");
      return;
    }

    toast.success("Job cancelled");
    refetchJobs();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Monitor pipeline health, queue status, and provider performance</p>
        </div>
        <Button onClick={handleRefreshAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queue">Queue Monitor</TabsTrigger>
          <TabsTrigger value="jobs">Live Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <BedrockHealthMonitor />

          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs (24h)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.total || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queued</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.queued || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                {queueStats?.processing > 0 ? (
                  <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.processing || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : bedrockStats && Number(bedrockStats.total) > 0 ? Math.round((Number(bedrockStats.completed) / Number(bedrockStats.total)) * 100) : 0}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : bedrockStats?.avg_processing_time_seconds || 0}s</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queued Jobs</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.queued || 0}</div>
                <p className="text-xs text-muted-foreground">Waiting for processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                {queueStats?.processing > 0 ? (
                  <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.processing || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed (24h)</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.completed || 0}</div>
                <p className="text-xs text-muted-foreground">Successfully processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed (24h)</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : queueStats?.failed || 0}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active & Failed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingJobs ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : liveJobs && liveJobs.length > 0 ? (
                <div className="space-y-3">
                  {liveJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {job.documents?.file_name || (job as any).file_name || `Document ${job.id?.slice(0, 8)}`}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {job.source === 'bedrock' ? 'Bedrock' : 'Legacy'}
                          </Badge>
                          <Badge variant={
                            job.status === 'processing' ? 'default' :
                            job.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </p>
                        {job.error_message && (
                          <p className="text-sm text-red-600 mt-1">{job.error_message}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {job.status === 'failed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRetryJob(job.id)}
                          >
                            Retry
                          </Button>
                        )}
                        {(job.status === 'pending' || job.status === 'processing') && (
                          <Button 
                            size="sm" 
                            variant="destructive"
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
                <p className="text-center text-muted-foreground py-8">No active or failed jobs</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
