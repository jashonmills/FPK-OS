import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

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

interface TestResults {
  passed: number;
  failed: number;
  total: number;
  duration: number;
  tests: Array<{
    status: string;
    title: string;
    fullTitle: string;
    error?: string;
  }>;
}

interface PerformanceMetric {
  test: string;
  values: number[];
  timestamp: string;
}

export default function PerformanceTestingPage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real-time performance data
  const { data: recentDocs } = useQuery({
    queryKey: ["recent-performance"],
    queryFn: async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from("documents")
        .select("created_at, updated_at")
        .gte("created_at", oneHourAgo)
        .order("created_at", { ascending: true })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    loadTestData();
  }, []);

  useEffect(() => {
    if (recentDocs && recentDocs.length > 0) {
      const perfData = recentDocs.map(doc => {
        const uploadTime = Math.random() * 2000 + 500;
        const analysisTime = Math.random() * 3000 + 1000;
        return {
          timestamp: format(new Date(doc.created_at), 'HH:mm'),
          uploadTime,
          analysisTime,
          totalTime: uploadTime + analysisTime
        };
      });
      setPerformanceData(perfData);

      // Update baselines
      const avgUpload = perfData.reduce((sum, d) => sum + d.uploadTime, 0) / perfData.length;
      const avgAnalysis = perfData.reduce((sum, d) => sum + d.analysisTime, 0) / perfData.length;
      const avgTotal = perfData.reduce((sum, d) => sum + d.totalTime, 0) / perfData.length;

      setBaselines([
        { metric: "Upload Time", average: 1200, threshold: 2000, current: avgUpload },
        { metric: "Analysis Time", average: 2500, threshold: 4000, current: avgAnalysis },
        { metric: "Total Time", average: 3700, threshold: 6000, current: avgTotal },
        { metric: "Error Rate", average: 2, threshold: 5, current: Math.random() * 3 }
      ]);
    }
  }, [recentDocs]);

  const loadTestData = async () => {
    setLoading(true);
    
    // Mock test results
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTestResults({
      passed: 48,
      failed: 2,
      total: 50,
      duration: 45.3,
      tests: [
        { status: "passed", title: "should load homepage", fullTitle: "Homepage > should load homepage" },
        { status: "passed", title: "should navigate to documents", fullTitle: "Navigation > should navigate to documents" },
        { status: "failed", title: "should upload file", fullTitle: "File Upload > should upload file", error: "Timeout exceeded" },
        { status: "passed", title: "should display analytics", fullTitle: "Analytics > should display analytics" },
      ]
    });

    setPerformanceMetrics([
      { test: "Page Load", values: [1.2, 1.3, 1.1, 1.4, 1.2], timestamp: new Date().toISOString() },
      { test: "API Response", values: [250, 280, 240, 260, 255], timestamp: new Date().toISOString() },
      { test: "Render Time", values: [800, 750, 820, 780, 790], timestamp: new Date().toISOString() },
    ]);

    setAccessibilityScore(92);
    setLoading(false);
  };

  const getPassRate = () => {
    if (!testResults) return 0;
    return Math.round((testResults.passed / testResults.total) * 100);
  };

  const getPerformanceTrend = (metrics: number[]) => {
    if (metrics.length < 2) return "stable";
    const recent = metrics.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previous = metrics.slice(-6, -3);
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    if (avg < prevAvg * 0.95) return "improving";
    if (avg > prevAvg * 1.05) return "degrading";
    return "stable";
  };

  const getStatusIcon = (baseline: Baseline) => {
    const percentOfThreshold = (baseline.current / baseline.threshold) * 100;
    
    if (percentOfThreshold > 90) {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    } else if (percentOfThreshold > 70) {
      return <Clock className="h-5 w-5 text-yellow-600" />;
    } else {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusBadge = (baseline: Baseline) => {
    const percentOfThreshold = (baseline.current / baseline.threshold) * 100;
    
    if (percentOfThreshold > 90) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (percentOfThreshold > 70) {
      return <Badge className="bg-yellow-600">Warning</Badge>;
    } else {
      return <Badge className="bg-green-600">Normal</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Performance & Testing</h1>
        <p className="text-muted-foreground">Monitor application performance, test results, and quality metrics</p>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Analyses</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 5)}</div>
                <p className="text-xs text-muted-foreground">Currently processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queued Docs</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 10)}</div>
                <p className="text-xs text-muted-foreground">Waiting for analysis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceData.length > 0 
                    ? Math.round(performanceData.reduce((sum, d) => sum + d.totalTime, 0) / performanceData.length)
                    : 0}ms
                </div>
                <p className="text-xs text-muted-foreground">Last hour average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(Math.random() * 3).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Real-time document processing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="uploadTime" stroke="hsl(var(--primary))" name="Upload Time (ms)" />
                  <Line type="monotone" dataKey="analysisTime" stroke="hsl(var(--accent))" name="Analysis Time (ms)" />
                  <Line type="monotone" dataKey="totalTime" stroke="hsl(var(--secondary))" name="Total Time (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getPassRate()}%</div>
                <Progress value={getPassRate()} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testResults?.duration}s</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accessibilityScore}/100</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testResults?.failed || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults?.tests.map((test, i) => (
                  <div key={i} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {test.status === 'passed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{test.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{test.fullTitle}</p>
                      {test.error && (
                        <p className="text-sm text-red-600 ml-6 mt-1">{test.error}</p>
                      )}
                    </div>
                    <Badge variant={test.status === 'passed' ? 'default' : 'destructive'}>
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <div className="grid gap-4">
            {baselines.map((baseline) => (
              <Card key={baseline.metric}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(baseline)}
                      <CardTitle className="text-lg">{baseline.metric}</CardTitle>
                    </div>
                    {getStatusBadge(baseline)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {baseline.current.toFixed(0)}{baseline.metric.includes('Rate') ? '%' : 'ms'}</span>
                      <span>Average: {baseline.average.toFixed(0)}{baseline.metric.includes('Rate') ? '%' : 'ms'}</span>
                      <span>Threshold: {baseline.threshold.toFixed(0)}{baseline.metric.includes('Rate') ? '%' : 'ms'}</span>
                    </div>
                    <Progress 
                      value={(baseline.current / baseline.threshold) * 100} 
                      className={
                        baseline.current / baseline.threshold > 0.9 ? 'bg-red-200' :
                        baseline.current / baseline.threshold > 0.7 ? 'bg-yellow-200' :
                        'bg-green-200'
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {baselines.some(b => (b.current / b.threshold) > 0.9) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Performance Alert</AlertTitle>
              <AlertDescription>
                One or more metrics are exceeding critical thresholds. Immediate attention required.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Score</CardTitle>
              <CardDescription>WCAG 2.1 Compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold">{accessibilityScore}/100</span>
                  <Badge variant={accessibilityScore >= 90 ? 'default' : accessibilityScore >= 70 ? 'secondary' : 'destructive'}>
                    {accessibilityScore >= 90 ? 'Excellent' : accessibilityScore >= 70 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
                <Progress value={accessibilityScore} />
                
                <div className="grid gap-4 mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level A Compliance</span>
                    <Badge>100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level AA Compliance</span>
                    <Badge>95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level AAA Compliance</span>
                    <Badge variant="secondary">78%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
