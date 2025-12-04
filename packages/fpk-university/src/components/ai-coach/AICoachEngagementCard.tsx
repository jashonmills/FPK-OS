import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, MessageSquare, Clock, TrendingUp, Zap, Target } from 'lucide-react';
import { useAICoachAnalytics } from '@/hooks/useAICoachAnalytics';
import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';
import { cn } from '@/lib/utils';

const AICoachEngagementCard: React.FC = () => {
  const { metrics, isLoading, error } = useAICoachAnalytics();
  const { publishEvent } = useAnalyticsEventBus();

  // Track card view
  React.useEffect(() => {
    publishEvent('ai_coach.engagement_card.view', {
      timestamp: new Date().toISOString(),
      hasMetrics: !!metrics
    });
  }, [publishEvent, metrics]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Coach Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive/20">
        <CardContent className="pt-6 text-center">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Unable to load analytics</p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Start chatting to see analytics</p>
        </CardContent>
      </Card>
    );
  }

  const getEngagementLevel = (totalSessions: number): { level: string, color: string, icon: React.ReactNode } => {
    if (totalSessions >= 50) return { level: 'Expert', color: 'bg-purple-500', icon: <Zap className="h-3 w-3" /> };
    if (totalSessions >= 20) return { level: 'Advanced', color: 'bg-blue-500', icon: <Target className="h-3 w-3" /> };
    if (totalSessions >= 5) return { level: 'Active', color: 'bg-green-500', icon: <TrendingUp className="h-3 w-3" /> };
    return { level: 'Getting Started', color: 'bg-orange-500', icon: <Brain className="h-3 w-3" /> };
  };

  const engagement = getEngagementLevel(metrics.totalSessions);
  const averageResponseTime = 2.3; // This would come from real-time tracking

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Coach Analytics
          </div>
          <Badge variant="secondary" className={cn("text-white", engagement.color)}>
            {engagement.icon}
            {engagement.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              Total Sessions
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.totalSessions}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Brain className="h-3 w-3" />
              Total Messages
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.totalMessages}</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              Avg Response Time
            </div>
            <span className="font-medium">{averageResponseTime}s</span>
          </div>
          <Progress value={Math.max(0, 100 - (averageResponseTime * 20))} className="h-2" />
        </div>

        {/* Session Quality */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg Session Duration</span>
            <span className="font-medium">{metrics.averageSessionDuration}min</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Messages per Session</span>
            <span className="font-medium">{metrics.averageMessagesPerSession}</span>
          </div>
        </div>

        {/* Weekly Growth */}
        {metrics.weeklySessionGrowth !== 0 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Weekly Growth</span>
            <Badge variant={metrics.weeklySessionGrowth > 0 ? "default" : "secondary"}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.weeklySessionGrowth > 0 ? '+' : ''}{metrics.weeklySessionGrowth}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachEngagementCard;