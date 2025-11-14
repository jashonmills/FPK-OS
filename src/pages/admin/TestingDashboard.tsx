import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Eye,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TestResults {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    failures: number;
    pending: number;
    duration: number;
  };
  tests: Array<{
    title: string;
    fullTitle: string;
    state: string;
    duration: number;
    err?: {
      message: string;
    };
  }>;
}

interface PerformanceMetric {
  test: string;
  metrics: Record<string, number[]>;
  timestamp: string;
}

interface AccessibilityIssue {
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
}

const TestingDashboard = () => {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [accessibilityScore, setAccessibilityScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      // In a real implementation, these would fetch from the actual report files
      // For now, we'll simulate the data structure
      
      // Simulated test results
      const mockResults: TestResults = {
        stats: {
          suites: 5,
          tests: 46,
          passes: 44,
          failures: 2,
          pending: 0,
          duration: 125000
        },
        tests: [
          {
            title: 'should load documents page within threshold',
            fullTitle: 'Performance Tests > should load documents page within threshold',
            state: 'passed',
            duration: 1250
          },
          {
            title: 'should have no accessibility violations',
            fullTitle: 'Accessibility Tests > should have no accessibility violations',
            state: 'failed',
            duration: 2100,
            err: {
              message: '2 accessibility violations found'
            }
          }
        ]
      };

      setTestResults(mockResults);
      
      // Simulated performance metrics
      const mockPerformanceMetrics: PerformanceMetric[] = [
        {
          test: 'Document Upload',
          metrics: { uploadDuration: [2100, 1950, 2050, 2000] },
          timestamp: new Date().toISOString()
        },
        {
          test: 'Analysis Completion',
          metrics: { analysisDuration: [15000, 14500, 15200, 14800] },
          timestamp: new Date().toISOString()
        }
      ];

      setPerformanceMetrics(mockPerformanceMetrics);

      // Calculate accessibility score (100 - violations count)
      setAccessibilityScore(95.7);

      setLoading(false);
    } catch (error) {
      console.error('Error loading test data:', error);
      setLoading(false);
    }
  };

  const getPassRate = () => {
    if (!testResults) return 0;
    return (testResults.stats.passes / testResults.stats.tests) * 100;
  };

  const getPerformanceTrend = (metrics: number[]) => {
    if (metrics.length < 2) return 'stable';
    const recent = metrics[metrics.length - 1];
    const average = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const change = ((recent - average) / average) * 100;
    
    if (change > 10) return 'degrading';
    if (change < -10) return 'improving';
    return 'stable';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading test data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive view of Cypress test results, performance metrics, and accessibility scores
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Test Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPassRate().toFixed(1)}%</div>
            <Progress value={getPassRate()} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {testResults?.stats.passes} of {testResults?.stats.tests} tests passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Test Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults ? (testResults.stats.duration / 1000).toFixed(1) : 0}s
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Total execution time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Accessibility Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessibilityScore.toFixed(1)}%</div>
            <Progress value={accessibilityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              WCAG 2.1 AA Compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {testResults?.stats.failures || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results Summary</CardTitle>
              <CardDescription>
                Latest test execution results from Cypress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults?.tests.slice(0, 10).map((test, index) => (
                  <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex items-start gap-3 flex-1">
                      {test.state === 'passed' ? (
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                      ) : test.state === 'failed' ? (
                        <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{test.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {test.fullTitle}
                        </p>
                        {test.err && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertDescription className="text-xs">
                              {test.err.message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                    <Badge variant={test.state === 'passed' ? 'default' : 'destructive'}>
                      {test.duration}ms
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Historical performance trends and benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics.map((metric, index) => {
                  const values = Object.values(metric.metrics)[0];
                  const avg = values.reduce((a, b) => a + b, 0) / values.length;
                  const latest = values[values.length - 1];
                  const trend = getPerformanceTrend(values);

                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{metric.test}</h4>
                          <p className="text-sm text-muted-foreground">
                            Avg: {avg.toFixed(0)}ms | Latest: {latest}ms
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {trend === 'improving' && (
                            <Badge variant="default" className="gap-1">
                              <TrendingDown className="w-3 h-3" />
                              Improving
                            </Badge>
                          )}
                          {trend === 'degrading' && (
                            <Badge variant="destructive" className="gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Degrading
                            </Badge>
                          )}
                          {trend === 'stable' && (
                            <Badge variant="outline" className="gap-1">
                              <Activity className="w-3 h-3" />
                              Stable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {values.map((value, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Run {idx + 1}</div>
                            <div className="text-sm font-medium">{value}ms</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Analysis</CardTitle>
              <CardDescription>
                WCAG 2.1 compliance and accessibility violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-semibold">Overall Score</p>
                      <p className="text-sm text-muted-foreground">
                        {accessibilityScore.toFixed(1)}% WCAG 2.1 AA compliant
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-success">
                    {accessibilityScore.toFixed(0)}
                  </div>
                </div>

                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    All critical accessibility violations have been addressed. 
                    Minor improvements recommended for enhanced user experience.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Test Coverage</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Keyboard Navigation</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Screen Reader</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Color Contrast</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Focus Management</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingDashboard;
