import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TestTube, TrendingUp, Users, MessageSquare, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, AlertTriangle, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PodcastGallery } from '@/components/phoenix/PodcastGallery';
import { usePhoenixAnalytics } from '@/hooks/usePhoenixAnalytics';
import { IntentDistributionChart } from '@/components/analytics/IntentDistributionChart';
import { PersonaUsageChart } from '@/components/analytics/PersonaUsageChart';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { GovernorActivityTable } from '@/components/analytics/GovernorActivityTable';
import { LearningVelocityCard } from '@/components/analytics/LearningVelocityCard';
import { EngagementQualityCard } from '@/components/analytics/EngagementQualityCard';
import { TopicMasteryTable } from '@/components/analytics/TopicMasteryTable';

export default function PhoenixAnalytics() {
  const navigate = useNavigate();
  
  // Fetch all Phoenix Analytics
  const { data: analytics, isLoading } = usePhoenixAnalytics();

  const stats = [
    {
      title: 'Total Sessions',
      value: analytics?.totalSessions || 0,
      icon: Users,
      description: 'Phoenix Lab sessions',
      color: 'text-blue-600',
    },
    {
      title: 'Total Interactions',
      value: analytics?.totalInteractions || 0,
      icon: MessageSquare,
      description: 'User-AI exchanges',
      color: 'text-green-600',
    },
    {
      title: 'Avg Turns/Session',
      value: analytics?.avgTurnsPerSession || '0.0',
      icon: TrendingUp,
      description: 'Conversation depth',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <TestTube className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">Project Phoenix Analytics</h1>
              <p className="text-muted-foreground">AI Coach testing and performance metrics</p>
            </div>
            <Badge variant="secondary" className="ml-2">Phase 3</Badge>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-muted rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Podcast Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Moments Podcast</CardTitle>
          <CardDescription>
            Automatically generated podcast episodes celebrating breakthrough moments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PodcastGallery />
        </CardContent>
      </Card>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intent Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-purple-600" />
              <CardTitle>User Intent Distribution</CardTitle>
            </div>
            <CardDescription>
              What are users trying to accomplish with our AI?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntentDistributionChart data={analytics?.intentDistribution || []} />
          </CardContent>
        </Card>

        {/* Persona Usage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle>AI Persona Usage</CardTitle>
            </div>
            <CardDescription>
              Which AI personas are being used most frequently?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonaUsageChart data={analytics?.personaUsage || []} />
          </CardContent>
        </Card>
      </div>

      {/* Engagement Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-green-600" />
            <CardTitle>Engagement Over Time</CardTitle>
          </div>
          <CardDescription>
            Phoenix Lab session activity over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EngagementChart data={analytics?.engagementOverTime || []} />
        </CardContent>
      </Card>

      {/* Governor Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle>Governor Activity Log</CardTitle>
          </div>
          <CardDescription>
            AI safety and quality control monitoring - flagged responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GovernorActivityTable data={analytics?.governorActivity || []} />
        </CardContent>
      </Card>

      {/* Phase 5: Advanced Metrics Section */}
      <div className="col-span-full">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Phase 5: Cognitive Enhancements</h2>
          <Badge variant="secondary">Advanced Metrics</Badge>
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningVelocityCard data={analytics?.learningVelocity} />
        <EngagementQualityCard data={analytics?.engagementQuality} />
      </div>

      {/* Topic Mastery - Full Width */}
      <TopicMasteryTable data={analytics?.topicMastery} />
    </div>
  );
}
