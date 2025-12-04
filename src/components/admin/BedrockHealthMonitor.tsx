import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { toast } from "sonner";

export function BedrockHealthMonitor() {
  const { data: healthData, isLoading, refetch } = useQuery({
    queryKey: ["bedrock-health"],
    queryFn: async () => {
      // Get stats from last 24 hours
      const { data: docs, error } = await supabase
        .from("bedrock_documents")
        .select("id, status, created_at, analyzed_at")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const total = docs?.length || 0;
      const completed = docs?.filter(d => d.status === 'completed').length || 0;
      const failed = docs?.filter(d => d.status === 'failed').length || 0;
      const pending = docs?.filter(d => d.status === 'pending').length || 0;
      const analyzing = docs?.filter(d => d.status === 'analyzing' || d.status === 'extracting').length || 0;
      const processing = docs?.filter(d => d.status === 'processing').length || 0 + analyzing;

      // Calculate success rate
      const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Calculate average processing time (in seconds)
      const completedDocs = docs?.filter(d => d.status === 'completed' && d.analyzed_at) || [];
      const avgProcessingTime = completedDocs.length > 0
        ? Math.round(
            completedDocs.reduce((sum, doc) => {
              const start = new Date(doc.created_at).getTime();
              const end = new Date(doc.analyzed_at!).getTime();
              return sum + (end - start) / 1000;
            }, 0) / completedDocs.length
          )
        : 0;

      // Get recent failures (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recentFailures = docs?.filter(
        d => d.status === 'failed' && d.created_at >= oneHourAgo
      ).length || 0;

      // Determine health status
      let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
      const issues: Array<{ severity: 'critical' | 'warning'; title: string; description: string }> = [];

      if (successRate < 70 || recentFailures > 5) {
        overallStatus = 'critical';
        if (successRate < 70) {
          issues.push({
            severity: 'critical',
            title: 'Low Success Rate',
            description: `Success rate is ${successRate}%, which is below the 70% threshold.`
          });
        }
        if (recentFailures > 5) {
          issues.push({
            severity: 'critical',
            title: 'High Failure Rate',
            description: `${recentFailures} documents failed in the last hour.`
          });
        }
      } else if (successRate < 90 || (recentFailures >= 1 && recentFailures <= 5)) {
        overallStatus = 'degraded';
        if (successRate < 90) {
          issues.push({
            severity: 'warning',
            title: 'Moderate Success Rate',
            description: `Success rate is ${successRate}%, below the 90% optimal threshold.`
          });
        }
        if (recentFailures > 0) {
          issues.push({
            severity: 'warning',
            title: 'Recent Failures',
            description: `${recentFailures} document(s) failed in the last hour.`
          });
        }
      }

      if (pending > 100) {
        overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus;
        issues.push({
          severity: 'warning',
          title: 'High Queue Depth',
          description: `${pending} documents are waiting to be processed.`
        });
      }

      if (avgProcessingTime > 60) {
        overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus;
        issues.push({
          severity: 'warning',
          title: 'Slow Processing',
          description: `Average processing time is ${avgProcessingTime}s, above the 60s threshold.`
        });
      }

      return {
        overall_status: overallStatus,
        metrics: {
          success_rate: successRate,
          avg_processing_time: avgProcessingTime,
          queue_depth: pending,
          recent_failures: recentFailures,
          processing: processing,
          success_rate_trend: successRate >= 90 ? 'up' : 'down'
        },
        issues,
        tests: {
          queue: {
            passed: pending < 100,
            name: 'Queue Depth',
            message: pending < 100 ? `${pending} items queued` : `High queue: ${pending} items`
          },
          processing: {
            passed: avgProcessingTime <= 60,
            name: 'Processing Time',
            message: avgProcessingTime <= 60 ? `Avg: ${avgProcessingTime}s` : `Slow: ${avgProcessingTime}s`
          },
          failures: {
            passed: recentFailures === 0,
            name: 'Recent Failures',
            message: recentFailures === 0 ? 'No failures' : `${recentFailures} failures in last hour`
          }
        }
      };
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  const handleRunHealthCheck = async () => {
    toast.loading('Running health check...', { id: 'health-check' });
    await refetch();
    toast.success('Health check completed', { id: 'health-check' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallHealth = healthData?.overall_status || 'unknown';
  const issues = healthData?.issues || [];
  const metrics = healthData?.metrics || {
    success_rate: 0,
    avg_processing_time: 0,
    queue_depth: 0,
    recent_failures: 0,
    processing: 0,
    success_rate_trend: 'down' as 'up' | 'down'
  };

  const getHealthBadge = () => {
    switch (overallHealth) {
      case 'healthy':
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-600"><AlertTriangle className="h-3 w-3 mr-1" /> Degraded</Badge>;
      case 'critical':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Critical</Badge>;
      default:
        return <Badge variant="outline"><Activity className="h-3 w-3 mr-1" /> Unknown</Badge>;
    }
  };

  const currentlyAnalyzing = metrics.processing || 0;

  return (
    <Card className={
      overallHealth === 'critical' ? 'border-red-600' :
      overallHealth === 'degraded' ? 'border-yellow-600' :
      'border-green-600'
    }>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Bedrock System Health
              {getHealthBadge()}
              {currentlyAnalyzing > 0 && (
                <Badge variant="secondary" className="ml-2 animate-pulse">
                  {currentlyAnalyzing} Processing Now
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of document processing pipeline
            </p>
          </div>
          <Button onClick={handleRunHealthCheck} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Success Rate (24h)</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{metrics.success_rate || 0}%</p>
              {metrics.success_rate_trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg Processing Time</p>
            <p className="text-2xl font-bold">{metrics.avg_processing_time || 0}s</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Queue Depth</p>
            <p className="text-2xl font-bold">{metrics.queue_depth || 0}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Failed (Last Hour)</p>
            <p className="text-2xl font-bold text-red-600">{metrics.recent_failures || 0}</p>
          </div>
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <div className="space-y-2">
            {issues.map((issue: any, index: number) => (
              <Alert key={index} variant={issue.severity === 'critical' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{issue.title}</AlertTitle>
                <AlertDescription>{issue.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Component Status */}
        {healthData?.tests && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Component Status:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.entries(healthData.tests).map(([key, result]: [string, any]) => (
                <div key={key} className="flex items-center gap-2 p-2 border rounded-lg">
                  {result.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
