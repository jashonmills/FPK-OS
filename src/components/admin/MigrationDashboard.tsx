import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  Database, 
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export function MigrationDashboard() {
  // Fetch Bedrock system status
  const { data: bedrockStatus, isLoading } = useQuery({
    queryKey: ["bedrock-system-status"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_bedrock_system_status");
      if (error) throw error;
      return data[0];
    },
    refetchInterval: 30000,
  });

  // Fetch unified queue stats
  const { data: unifiedStats } = useQuery({
    queryKey: ["unified-queue-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_unified_queue_stats");
      if (error) throw error;
      return data[0];
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Migration Progress</CardTitle>
          <CardDescription>Loading migration status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const migrationProgress = bedrockStatus?.migration_progress_pct || 0;

  return (
    <div className="space-y-6">
      {/* Migration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Legacy → Bedrock Migration Progress
          </CardTitle>
          <CardDescription>
            Tracking the transition from legacy document processing to Bedrock system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Migration Progress</span>
              <span className="text-sm text-muted-foreground">{migrationProgress.toFixed(1)}%</span>
            </div>
            <Progress value={migrationProgress} className="h-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Families</div>
              <div className="text-2xl font-bold">{bedrockStatus?.total_families || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Bedrock Enabled</div>
              <div className="text-2xl font-bold text-green-600">
                {bedrockStatus?.bedrock_enabled_families || 0}
              </div>
            </div>
          </div>

          {migrationProgress < 100 && (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Migration in progress. {bedrockStatus?.total_families - bedrockStatus?.bedrock_enabled_families || 0} families remaining to migrate.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* System Comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Legacy System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Legacy System</span>
              <Badge variant="secondary">Legacy</Badge>
            </CardTitle>
            <CardDescription>analysis_queue processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Total Processed (24h)</span>
                <span className="font-medium">{unifiedStats?.legacy_total || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Currently Processing</span>
                <span className="font-medium">{unifiedStats?.legacy_processing || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bedrock System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bedrock System</span>
              <Badge variant="default">Active</Badge>
            </CardTitle>
            <CardDescription>bedrock_documents processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Total Processed (24h)</span>
                <span className="font-medium">{unifiedStats?.bedrock_total || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Currently Processing</span>
                <span className="font-medium">{unifiedStats?.bedrock_processing || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Bedrock Document Statistics</CardTitle>
          <CardDescription>Total documents processed through Bedrock system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Documents</div>
              <div className="text-2xl font-bold">{bedrockStatus?.total_bedrock_docs || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Last 24 Hours</div>
              <div className="text-2xl font-bold text-blue-600">
                {bedrockStatus?.docs_last_24h || 0}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Currently Processing</div>
              <div className="text-2xl font-bold text-orange-600">
                {bedrockStatus?.current_processing || 0}
              </div>
            </div>
          </div>

          {(bedrockStatus?.current_failed || 0) > 0 && (
            <Alert className="mt-4" variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {bedrockStatus?.current_failed} document(s) failed processing and need attention
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      {unifiedStats && (
        <Card>
          <CardHeader>
            <CardTitle>Unified Performance Metrics</CardTitle>
            <CardDescription>Combined statistics from both systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Avg Processing Time
                </div>
                <div className="text-2xl font-bold">
                  {unifiedStats.avg_processing_time_sec?.toFixed(1) || 0}s
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Success Rate
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {unifiedStats.success_rate?.toFixed(1) || 0}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Queue</div>
                <div className="text-2xl font-bold">{unifiedStats.queued_items || 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Failed Jobs</div>
                <div className="text-2xl font-bold text-red-600">
                  {unifiedStats.failed_items || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
