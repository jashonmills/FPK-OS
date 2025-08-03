import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Target
} from 'lucide-react';
import { useAICoachPerformanceAnalytics } from '@/hooks/useAICoachPerformanceAnalytics';
import { cn } from '@/lib/utils';

const AICoachPerformanceCard: React.FC = () => {
  const { 
    metrics, 
    isLoading, 
    getPerformanceInsights 
  } = useAICoachPerformanceAnalytics();
  
  const [showDetails, setShowDetails] = useState(false);
  const insights = getPerformanceInsights();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
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

  if (!metrics) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No performance data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start chatting to see metrics</p>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceStatus = (responseTime: number) => {
    if (responseTime < 2) return { status: 'Excellent', color: 'bg-green-500', icon: <CheckCircle className="h-3 w-3" /> };
    if (responseTime < 3) return { status: 'Good', color: 'bg-blue-500', icon: <Target className="h-3 w-3" /> };
    if (responseTime < 5) return { status: 'Fair', color: 'bg-yellow-500', icon: <Clock className="h-3 w-3" /> };
    return { status: 'Slow', color: 'bg-red-500', icon: <AlertCircle className="h-3 w-3" /> };
  };

  const performanceStatus = getPerformanceStatus(metrics.averageResponseTime);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Performance
          </div>
          <Badge variant="secondary" className={cn("text-white", performanceStatus.color)}>
            {performanceStatus.icon}
            {performanceStatus.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Performance Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Response Time
            </div>
            <div className="text-lg font-bold text-foreground">{metrics.averageResponseTime}s</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Zap className="h-3 w-3" />
              RAG Success
            </div>
            <div className="text-lg font-bold text-foreground">{metrics.ragSuccessRate}%</div>
          </div>
        </div>

        {/* Performance Progress Bars */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Response Speed</span>
              <span className="font-medium">{Math.max(0, 100 - (metrics.averageResponseTime * 20))}%</span>
            </div>
            <Progress value={Math.max(0, 100 - (metrics.averageResponseTime * 20))} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reliability</span>
              <span className="font-medium">{100 - metrics.errorRate}%</span>
            </div>
            <Progress value={100 - metrics.errorRate} className="h-2" />
          </div>
        </div>

        {/* Mode Usage Distribution */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Mode Usage</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">My Data</span>
              <span className="font-medium">{Math.round(metrics.modeUsageDistribution.personal)}%</span>
            </div>
            <Progress value={metrics.modeUsageDistribution.personal} className="h-1.5" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">General & Platform</span>
              <span className="font-medium">{Math.round(metrics.modeUsageDistribution.general)}%</span>
            </div>
            <Progress value={metrics.modeUsageDistribution.general} className="h-1.5" />
          </div>
        </div>

        {/* Expandable Details */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between h-8"
        >
          <span className="text-sm">Performance Insights</span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showDetails && (
          <div className="space-y-3 pt-2 border-t">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={insight.type === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                      {insight.type === 'warning' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {insight.type === 'info' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {insight.type === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {insight.type === 'tip' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {insight.title}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                  <p className="text-xs text-primary font-medium">{insight.action}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All systems performing well!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachPerformanceCard;