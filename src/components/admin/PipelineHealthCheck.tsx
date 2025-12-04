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

export function PipelineHealthCheck() {
  // Run health check
  const { data: healthCheck, isLoading, refetch } = useQuery({
    queryKey: ["pipeline-health"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('pipeline-health-check');
      if (error) throw error;
      return data;
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

  const overallHealth = healthCheck?.overall_status || 'unknown';
  const issues = healthCheck?.issues || [];
  const metrics = healthCheck?.metrics || {};

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
              Pipeline Health Check
              {getHealthBadge()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Automated monitoring of upload → extraction → analysis pipeline
            </p>
          </div>
          <Button onClick={handleRunHealthCheck} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Check
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

        {/* Test Results */}
        {healthCheck?.tests && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Component Status:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.entries(healthCheck.tests).map(([key, result]: [string, any]) => (
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
