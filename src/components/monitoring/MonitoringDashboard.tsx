
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, Users, Clock, Zap } from 'lucide-react';
import { sloMonitoringService } from '@/services/monitoring/SLOMonitoringService';
import { useCleanup } from '@/utils/cleanupManager';

const MonitoringDashboard: React.FC = () => {
  const cleanup = useCleanup('MonitoringDashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const loadDashboardData = () => {
      const data = sloMonitoringService.getDashboardData();
      setDashboardData(data);
    };

    loadDashboardData();

    // Auto-refresh every 30 seconds
    let intervalId: string | null = null;
    if (autoRefresh) {
      intervalId = cleanup.setInterval(loadDashboardData, 30000);
    }

    // Listen for real-time alerts
    const handleAlert = (event: CustomEvent) => {
      loadDashboardData(); // Refresh dashboard when alert received
    };

    cleanup.addEventListener(window, 'slo-alert', handleAlert as EventListener);

    return () => {
      if (intervalId) cleanup.cleanup(intervalId);
    };
  }, [autoRefresh]);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { sloStatus, alerts, webVitals, conversionMetrics, funnelData } = dashboardData;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'passing' ? 'secondary' : 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Performance Monitoring</h2>
          <p className="text-muted-foreground">Real-time analytics and SLO monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => sloMonitoringService.requestNotificationPermission()}
            size="sm"
          >
            Enable Alerts
          </Button>
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {alerts.filter((a: any) => !a.acknowledged).length} unacknowledged alerts. 
            Latest: {alerts[0]?.metric} exceeded threshold.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SLO Status Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SLO Compliance</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(sloStatus).map(([metric, data]: [string, any]) => (
                    <div key={metric} className="flex items-center justify-between">
                      <span className="text-sm">{metric.replace('_', ' ')}</span>
                      <Badge variant={getStatusColor(data.status)}>
                        {data.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {webVitals.slice(0, 3).map((metric: any) => (
                    <div key={metric.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span>{metric.value.toFixed(0)}{metric.name === 'CLS' ? '' : 'ms'}</span>
                      </div>
                      <Progress 
                        value={metric.rating === 'good' ? 100 : metric.rating === 'needs-improvement' ? 60 : 30} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Funnel</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Search to Read</span>
                    <span>{conversionMetrics.conversionRates.searchToRead.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Searches</span>
                    <span>{conversionMetrics.totalSearches}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completed Reads</span>
                    <span>{conversionMetrics.readToComplete}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="web-vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webVitals.map((metric: any) => (
              <Card key={metric.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {metric.name}
                    <Badge variant={metric.rating === 'good' ? 'secondary' : metric.rating === 'needs-improvement' ? 'secondary' : 'destructive'}>
                      {metric.rating}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Current: {metric.value.toFixed(2)}{metric.name === 'CLS' ? '' : 'ms'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={metric.rating === 'good' ? 100 : metric.rating === 'needs-improvement' ? 60 : 30}
                    className="h-4"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from search to reading completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((step: any, index: number) => (
                    <div key={step.step} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{step.step}</span>
                        <span className="text-sm text-muted-foreground">
                          {step.count} users ({step.conversionRate.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={step.conversionRate} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
                <CardDescription>Key conversion rate indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Search to Read</span>
                    <span className="font-bold">{conversionMetrics.conversionRates.searchToRead.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Search to Complete</span>
                    <span className="font-bold">{conversionMetrics.conversionRates.searchToComplete.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>View to Read</span>
                    <span className="font-bold">{conversionMetrics.conversionRates.viewToRead.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Performance and conversion alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-muted-foreground">No recent alerts</p>
                ) : (
                  alerts.map((alert: any) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">{alert.metric}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Value: {alert.value.toFixed(2)} (Target: {alert.target})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sloMonitoringService.acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
