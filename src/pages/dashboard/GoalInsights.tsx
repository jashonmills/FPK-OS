import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { 
  TrendingUp, Target, Trophy, Calendar, Clock, Users, 
  BarChart3, PieChart as PieChartIcon, Activity, Download 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';
import { GoalAnalyticsService } from '@/services/goalAnalyticsService';
import type { 
  GoalInsight, GoalCompletionTrend, CategoryPerformance, 
  PriorityDistribution 
} from '@/services/goalAnalyticsService';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';

const GoalInsightsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useDualLanguage();
  const analytics = useAnalyticsPublisher();
  
  const [insights, setInsights] = useState<GoalInsight | null>(null);
  const [trends, setTrends] = useState<GoalCompletionTrend[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [priorityDistribution, setPriorityDistribution] = useState<PriorityDistribution[]>([]);
  const [productivityPatterns, setProductivityPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    if (user?.id) {
      loadInsights();
      // Track page view
      analytics.publishPageView('goal_insights', { timeRange });
    }
  }, [user?.id, timeRange]);

  const loadInsights = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [
        insightsData,
        trendsData,
        categoryData,
        priorityData,
        patternsData
      ] = await Promise.all([
        GoalAnalyticsService.getGoalInsights(user.id, timeRange),
        GoalAnalyticsService.getCompletionTrends(user.id, timeRange),
        GoalAnalyticsService.getCategoryPerformance(user.id),
        GoalAnalyticsService.getPriorityDistribution(user.id),
        GoalAnalyticsService.getProductivityPatterns(user.id)
      ]);

      setInsights(insightsData);
      setTrends(trendsData);
      setCategoryPerformance(categoryData);
      setPriorityDistribution(priorityData);
      setProductivityPatterns(patternsData);
    } catch (error) {
      console.error('Error loading goal insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="h-12 w-12 mx-auto animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading your goal insights...</p>
        </div>
      </div>
    );
  }

  return (
    <AccessibilityErrorBoundary componentName="Goal Insights Page">
      <div className="mobile-section-spacing">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mobile-heading-xl mb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <DualLanguageText translationKey="goals.insights.title" fallback="Goal Insights" />
              </h1>
              <p className="text-muted-foreground mobile-text-base">
                <DualLanguageText 
                  translationKey="goals.insights.subtitle" 
                  fallback="Analyze your goal performance and productivity patterns" 
                />
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => analytics.publishEvent('insights_export_requested', { timeRange })}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                variant={timeRange === days ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(days)}
              >
                {days} days
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        {insights && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Goals</span>
                </div>
                <p className="text-2xl font-bold">{insights.totalGoals}</p>
                <p className="text-xs text-muted-foreground">
                  {insights.activeGoals} active, {insights.completedGoals} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <p className="text-2xl font-bold">{insights.completionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">
                  {insights.completedGoals} of {insights.totalGoals} goals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">XP Earned</span>
                </div>
                <p className="text-2xl font-bold">{insights.totalXpEarned}</p>
                <p className="text-xs text-muted-foreground">
                  From goal activities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Avg. Completion</span>
                </div>
                <p className="text-2xl font-bold">{insights.averageCompletionDays}</p>
                <p className="text-xs text-muted-foreground">
                  days to complete
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Goal Completion Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Completed Goals"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="created" 
                      stackId="2"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Created Goals"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>XP Earned Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="xpEarned" 
                      stroke="#ffc658" 
                      strokeWidth={2}
                      name="XP Earned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate (%)" />
                    <Bar dataKey="totalXp" fill="#8884d8" name="Total XP" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="priority" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Goals by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={priorityDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={(entry) => `${entry.priority}: ${entry.count}`}
                      >
                        {priorityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>XP by Priority Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={priorityDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="priority" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="xpEarned" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            {productivityPatterns && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Productivity Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-muted-foreground">Best Performance Time</p>
                        <p className="font-semibold">{productivityPatterns.bestPerformanceTime}</p>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={productivityPatterns.hourlyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(hour) => `${hour}:00`}
                          formatter={(value) => [value, 'Activity Count']}
                        />
                        <Bar dataKey="activity" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity Pattern</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={productivityPatterns.weeklyPattern}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="activity" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AccessibilityErrorBoundary>
  );
};

export default GoalInsightsPage;