import { Card } from "@/components/ui/card";
import { useFeatureUsageStats } from "@/hooks/usePhoenixPerformanceAnalytics";
import { Flag, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function FeatureFlagTelemetry() {
  const { data: featureStats, isLoading } = useFeatureUsageStats(7);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Feature Flag Telemetry</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading feature usage data...</p>
      </Card>
    );
  }

  if (!featureStats || Object.keys(featureStats).length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Feature Flag Telemetry</h3>
        </div>
        <p className="text-sm text-muted-foreground">No feature usage data yet</p>
      </Card>
    );
  }

  const sortedFeatures = Object.entries(featureStats)
    .sort(([, a], [, b]) => b.totalTriggers - a.totalTriggers);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Flag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Feature Flag Telemetry</h3>
        <span className="text-xs text-muted-foreground ml-auto">Last 7 days</span>
      </div>

      <div className="space-y-4">
        {sortedFeatures.map(([featureName, stats]) => (
          <div key={featureName} className="p-4 rounded-lg border">
            {/* Feature Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold">
                  {featureName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {stats.totalTriggers} triggers • {stats.totalExecutions} executions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className={`text-lg font-bold ${stats.successRate >= 95 ? 'text-success' : stats.successRate >= 80 ? 'text-warning' : 'text-destructive'}`}>
                    {stats.successRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                  <p className="text-lg font-bold">{stats.avgExecutionTime}ms</p>
                </div>
              </div>
            </div>

            {/* Success Rate Progress Bar */}
            <div className="mb-3">
              <Progress 
                value={stats.successRate} 
                className="h-2"
              />
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">
                  {Math.round(stats.totalExecutions * stats.successRate / 100)} successes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">
                  {Math.round(stats.totalExecutions * stats.errorRate / 100)} failures
                </span>
              </div>
              {stats.avgExecutionTime > 1000 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-warning text-xs">Slow execution</span>
                </div>
              )}
            </div>

            {/* Recent Errors */}
            {stats.recentErrors && stats.recentErrors.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <p className="text-xs font-medium">Recent Errors</p>
                </div>
                <div className="space-y-1">
                  {stats.recentErrors.slice(0, 3).map((err, idx) => (
                    <div key={idx} className="text-xs bg-destructive/10 p-2 rounded">
                      <p className="text-destructive font-mono line-clamp-1">{err.error}</p>
                      <p className="text-muted-foreground text-[10px] mt-1">
                        {new Date(err.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}