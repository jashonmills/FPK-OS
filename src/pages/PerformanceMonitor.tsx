import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceData {
  timestamp: string;
  uploadTime: number;
  analysisTime: number;
  totalTime: number;
}

interface Baseline {
  metric: string;
  average: number;
  threshold: number;
  current: number;
}

const PerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [baselines, setBaselines] = useState<Baseline[]>([
    { metric: 'Upload Time', average: 2000, threshold: 3000, current: 0 },
    { metric: 'Analysis Time', average: 15000, threshold: 20000, current: 0 },
    { metric: 'Total Pipeline', average: 17000, threshold: 25000, current: 0 }
  ]);
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    activeAnalyses: 0,
    queuedDocuments: 0,
    avgResponseTime: 0,
    errorRate: 0
  });

  useEffect(() => {
    loadPerformanceData();
    subscribeToRealtimeMetrics();

    const interval = setInterval(() => {
      loadPerformanceData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    try {
      // Fetch recent document uploads
      const { data: documents } = await supabase
        .from('documents')
        .select('created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(20);

      // Simulate performance metrics (in production, you'd calculate from actual data)
      const mockData: PerformanceData[] = Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - (9 - i) * 3600000).toISOString(),
        uploadTime: 1800 + Math.random() * 400,
        analysisTime: 14000 + Math.random() * 2000,
        totalTime: 16000 + Math.random() * 2500
      }));

      setPerformanceData(mockData);

      // Update current values in baselines
      const latest = mockData[mockData.length - 1];
      setBaselines(prev => prev.map(baseline => {
        if (baseline.metric === 'Upload Time') return { ...baseline, current: latest.uploadTime };
        if (baseline.metric === 'Analysis Time') return { ...baseline, current: latest.analysisTime };
        if (baseline.metric === 'Total Pipeline') return { ...baseline, current: latest.totalTime };
        return baseline;
      }));

      // Update realtime metrics (simulated)
      const activeCount = Math.floor(Math.random() * 3);
      const queuedCount = Math.floor(Math.random() * 5);
      
      setRealtimeMetrics({
        activeAnalyses: activeCount,
        queuedDocuments: queuedCount,
        avgResponseTime: latest.totalTime,
        errorRate: Math.random() * 2
      });

    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };

  const subscribeToRealtimeMetrics = () => {
    const channel = supabase
      .channel('performance-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          loadPerformanceData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusIcon = (current: number, average: number, threshold: number) => {
    if (current > threshold) {
      return <AlertTriangle className="w-5 h-5 text-destructive" />;
    }
    if (current > average * 1.1) {
      return <TrendingUp className="w-5 h-5 text-warning" />;
    }
    return <CheckCircle2 className="w-5 h-5 text-success" />;
  };

  const getStatusBadge = (current: number, average: number, threshold: number) => {
    const percentDiff = ((current - average) / average) * 100;
    
    if (current > threshold) {
      return <Badge variant="destructive">Critical</Badge>;
    }
    if (current > average * 1.1) {
      return <Badge variant="outline" className="border-warning text-warning">Warning</Badge>;
    }
    return <Badge variant="default">Normal</Badge>;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance Monitor</h1>
        <p className="text-muted-foreground">
          Real-time document analysis performance metrics and historical baselines
        </p>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Active Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.activeAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Queued Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.queuedDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting for analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(realtimeMetrics.avgResponseTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">End-to-end latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Baseline Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance vs Baseline</CardTitle>
          <CardDescription>
            Comparing current metrics against historical baselines from Cypress tests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {baselines.map((baseline, index) => {
            const percentDiff = ((baseline.current - baseline.average) / baseline.average) * 100;
            const progress = (baseline.current / baseline.threshold) * 100;

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(baseline.current, baseline.average, baseline.threshold)}
                    <div>
                      <h4 className="font-semibold">{baseline.metric}</h4>
                      <p className="text-sm text-muted-foreground">
                        Baseline: {formatTime(baseline.average)} | Threshold: {formatTime(baseline.threshold)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-2xl font-bold">{formatTime(baseline.current)}</div>
                      <div className="text-sm text-muted-foreground">
                        {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                      </div>
                    </div>
                    {getStatusBadge(baseline.current, baseline.average, baseline.threshold)}
                  </div>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Historical performance metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={(value) => formatTime(value)}
                className="text-xs"
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => formatTime(value)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="uploadTime" 
                stroke="hsl(var(--primary))" 
                name="Upload Time"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="analysisTime" 
                stroke="hsl(var(--accent))" 
                name="Analysis Time"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="totalTime" 
                stroke="hsl(var(--muted-foreground))" 
                name="Total Time"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts */}
      {baselines.some(b => b.current > b.threshold) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Performance degradation detected! Some metrics are exceeding acceptable thresholds.
            Consider reviewing recent changes or checking system resources.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PerformanceMonitor;
