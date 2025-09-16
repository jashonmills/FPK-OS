import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap, 
  Eye, 
  BookOpen,
  BarChart3,
  Activity,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSlideAnalytics } from '@/hooks/useSlideAnalytics';
import { useBehavioralAnalytics } from '@/hooks/useBehavioralAnalytics';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import { useRealtimeRecommendations } from '@/hooks/useRealtimeRecommendations';

interface AnalyticsOverviewProps {
  timeRange?: '24h' | '7d' | '30d';
  courseFilter?: string;
}

export const EnhancedAnalyticsDashboard: React.FC<AnalyticsOverviewProps> = ({ 
  timeRange = '7d',
  courseFilter 
}) => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [granularityLevel, setGranularityLevel] = useState<'slide' | 'lesson' | 'course'>('lesson');
  
  // Initialize hooks
  const { 
    learningProfile, 
    recommendations: adaptiveRecommendations, 
    updateProfileFromPerformance 
  } = useAdaptiveLearning();
  
  const { 
    activeRecommendations, 
    applyRecommendation, 
    dismissRecommendation 
  } = useRealtimeRecommendations();

  const { 
    trackAttentionPattern,
    trackLearningStyle,
    trackEnergyLevel,
    detectPatterns 
  } = useBehavioralAnalytics('dashboard-session');

  // Sample data - would be replaced with real queries
  const [analyticsData, setAnalyticsData] = useState({
    slideLevel: {
      totalSlides: 0,
      completedSlides: 0,
      averageTimePerSlide: 0,
      highEngagementSlides: [],
      challengingSlides: []
    },
    behavioral: {
      attentionSpan: 0,
      preferredLearningStyle: 'visual',
      energyPatterns: {},
      selfRegulationFrequency: 0
    },
    adaptive: {
      personalizedRecommendations: 0,
      adaptationSuccessRate: 0,
      learningVelocity: 0
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enhanced Learning Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights into your neurodiverse learning journey
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={granularityLevel === 'slide' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setGranularityLevel('slide')}
          >
            Slide Level
          </Button>
          <Button 
            variant={granularityLevel === 'lesson' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setGranularityLevel('lesson')}
          >
            Lesson Level
          </Button>
          <Button 
            variant={granularityLevel === 'course' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setGranularityLevel('course')}
          >
            Course Level
          </Button>
        </div>
      </div>

      {/* Real-time Recommendations */}
      {activeRecommendations.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI Recommendations ({activeRecommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeRecommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={rec.priority === 'urgent' ? 'destructive' : rec.priority === 'high' ? 'default' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                      <span className="font-medium">{rec.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => applyRecommendation(rec)}
                    >
                      {rec.actionText}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => dismissRecommendation(rec.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
          <TabsTrigger value="granular">Granular Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Velocity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {learningProfile?.learningVelocity?.toFixed(1) || '1.0'}x
                </div>
                <p className="text-xs text-muted-foreground">
                  {learningProfile?.learningVelocity > 1 ? '+12%' : '-5%'} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attention Span</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((learningProfile?.attentionSpan || 900) / 60)}min
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal focus duration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preferred Style</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {learningProfile?.preferredContentTypes?.[0] || 'Visual'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Primary learning preference
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adaptation Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  Successful adaptations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Learning Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Learning Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Strengths</h4>
                  <div className="space-y-2">
                    {learningProfile?.strengths?.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="mr-2">
                        {strength}
                      </Badge>
                    )) || <p className="text-muted-foreground">Analyzing your strengths...</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Growth Areas</h4>
                  <div className="space-y-2">
                    {learningProfile?.challenges?.map((challenge, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {challenge}
                      </Badge>
                    )) || <p className="text-muted-foreground">Identifying growth areas...</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Analytics Tab */}
        <TabsContent value="behavioral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Attention Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sustained Attention</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Focus Recovery</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Deep Work Capacity</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Energy Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">78%</div>
                    <p className="text-sm text-muted-foreground">Current Energy Level</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Optimal Study Time</span>
                      <span className="font-medium">Morning (9-11 AM)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Break Frequency</span>
                      <span className="font-medium">Every 25 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Recovery Method</span>
                      <span className="font-medium">Movement + Energy Bear</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Self-Regulation Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">23</div>
                  <p className="text-sm text-muted-foreground">Successful Breaks</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">89%</div>
                  <p className="text-sm text-muted-foreground">Tool Utilization</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">7.8/10</div>
                  <p className="text-sm text-muted-foreground">Self-Awareness Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptive Learning Tab */}
        <TabsContent value="adaptive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adaptiveRecommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{rec.type}</Badge>
                        <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Granular Progress Tab */}
        <TabsContent value="granular" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {granularityLevel === 'slide' ? 'Slide-Level' : 
                 granularityLevel === 'lesson' ? 'Lesson-Level' : 
                 'Course-Level'} Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Course progress visualization would go here */}
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {granularityLevel === 'slide' 
                      ? 'Detailed slide-by-slide progress tracking will be displayed here'
                      : granularityLevel === 'lesson'
                      ? 'Comprehensive lesson progress with time spent and engagement metrics'
                      : 'Course completion rates with learning pathway analysis'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Learning Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Learning Pattern Discovery
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Your performance peaks during morning sessions (9-11 AM) with visual content. 
                    Consider scheduling challenging topics during these optimal windows.
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Attention Optimization
                  </h4>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Your attention span has increased by 23% over the past week. 
                    The combination of 25-minute focus blocks with movement breaks is working well.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    Personalization Success
                  </h4>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    Interactive visual content shows 40% higher engagement than text-based materials. 
                    Your learning path has been automatically adjusted to prioritize these formats.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};