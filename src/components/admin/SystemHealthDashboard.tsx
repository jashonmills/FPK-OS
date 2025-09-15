import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network, 
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { systemDiagnostics } from '@/utils/systemDiagnostics';
import { memoryManager } from '@/utils/memoryManager';
import { useMonitoring } from '@/hooks/useMonitoring';

interface SystemHealthData {
  overallScore: number;
  issues: Array<{
    category: string;
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'detected' | 'fixed' | 'monitoring';
    details: string;
    recommendation?: string;
  }>;
  memoryUsage: number;
  performanceScore: number;
  networkHealth: number;
  recommendations: string[];
}

const SystemHealthDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { dashboardData } = useMonitoring();

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const results = await systemDiagnostics.runFullDiagnostics();
      setHealthData(results);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();

    // Auto-refresh every 2 minutes if enabled
    if (autoRefresh) {
      const interval = setInterval(runDiagnostics, 120000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Listen for system health alerts
  useEffect(() => {
    const handleHealthAlert = (event: CustomEvent) => {
      setHealthData(event.detail);
      setLastUpdate(new Date());
    };

    window.addEventListener('system-health-alert', handleHealthAlert as EventListener);
    return () => window.removeEventListener('system-health-alert', handleHealthAlert as EventListener);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[severity as keyof typeof colors] || colors.medium}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'monitoring': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const forceMemoryCleanup = () => {
    memoryManager.forceGC();
    // Trigger a re-diagnostic after cleanup
    setTimeout(runDiagnostics, 1000);
  };

  if (!healthData && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runDiagnostics} className="w-full">
            Run System Diagnostics
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={runDiagnostics}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={forceMemoryCleanup}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Clean Memory
              </Button>
            </div>
          </div>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Running comprehensive system diagnostics...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {healthData && (
        <>
          {/* Overall health score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Health</p>
                    <p className={`text-2xl font-bold ${getScoreColor(healthData.overallScore)}`}>
                      {healthData.overallScore}%
                    </p>
                  </div>
                  {getScoreIcon(healthData.overallScore)}
                </div>
                <Progress value={healthData.overallScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Memory Usage</p>
                    <p className={`text-2xl font-bold ${getScoreColor(100 - healthData.memoryUsage)}`}>
                      {healthData.memoryUsage.toFixed(1)}%
                    </p>
                  </div>
                  <HardDrive className="h-5 w-5" />
                </div>
                <Progress value={healthData.memoryUsage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Performance</p>
                    <p className={`text-2xl font-bold ${getScoreColor(healthData.performanceScore)}`}>
                      {healthData.performanceScore.toFixed(0)}
                    </p>
                  </div>
                  <Zap className="h-5 w-5" />
                </div>
                <Progress value={healthData.performanceScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Network Health</p>
                    <p className={`text-2xl font-bold ${getScoreColor(healthData.networkHealth)}`}>
                      {healthData.networkHealth}%
                    </p>
                  </div>
                  <Network className="h-5 w-5" />
                </div>
                <Progress value={healthData.networkHealth} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="issues" className="space-y-4">
            <TabsList>
              <TabsTrigger value="issues">Issues ({healthData.issues.length})</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-4">
              {healthData.issues.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-green-600">No Issues Detected!</p>
                    <p className="text-muted-foreground">Your system is running optimally.</p>
                  </CardContent>
                </Card>
              ) : (
                healthData.issues.map((issue, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(issue.status)}
                            <h3 className="font-semibold">{issue.issue}</h3>
                            {getSeverityBadge(issue.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Category: <span className="font-medium">{issue.category}</span>
                          </p>
                          <p className="text-sm mb-3">{issue.details}</p>
                          {issue.recommendation && (
                            <Alert>
                              <AlertDescription>{issue.recommendation}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {healthData.recommendations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold">No Recommendations</p>
                    <p className="text-muted-foreground">Your system is well-optimized.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>System Optimization Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {healthData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <TrendingUp className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">SLO Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(dashboardData.sloStatus || {}).map(([metric, status]: [string, any]) => (
                        <div key={metric} className="flex items-center justify-between py-2">
                          <span className="capitalize">{metric.replace(/_/g, ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {status.value?.toFixed(1) || '0.0'}
                            </span>
                            <Badge variant={status.status === 'passing' ? 'default' : 'destructive'}>
                              {status.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.alerts?.length > 0 ? (
                        dashboardData.alerts.slice(0, 5).map((alert, index) => (
                          <div key={index} className="flex items-center gap-3 py-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.metric}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge variant="outline">{alert.severity}</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No recent alerts</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SystemHealthDashboard;