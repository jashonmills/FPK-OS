import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

interface EngagementQualityCardProps {
  data?: {
    avgTurnsPerSession: number;
    avgSessionDuration: number;
    completionRate: number;
  };
}

export const EngagementQualityCard = ({ data }: EngagementQualityCardProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            Engagement Quality
          </CardTitle>
          <CardDescription>How deeply you engage with learning sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No session data available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const engagementScore = Math.min(100, Math.round(
    (data.avgTurnsPerSession / 10) * 40 + 
    (data.avgSessionDuration / 20) * 30 + 
    data.completionRate * 0.3
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          Engagement Quality
        </CardTitle>
        <CardDescription>Session depth and completion metrics (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Overall Engagement Score</p>
            <p className="text-2xl font-bold text-purple-600">{engagementScore}%</p>
          </div>
          <Progress value={engagementScore} className="h-2" />
        </div>

        {/* Detailed Metrics */}
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Avg Turns per Session</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.avgTurnsPerSession.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.avgTurnsPerSession >= 8 
                  ? "Deep conversations!" 
                  : data.avgTurnsPerSession >= 5 
                  ? "Good engagement" 
                  : "Try longer sessions"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Avg Session Duration</p>
              <p className="text-2xl font-bold text-green-600">
                {data.avgSessionDuration.toFixed(1)} min
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.avgSessionDuration >= 15 
                  ? "Great focus time!" 
                  : data.avgSessionDuration >= 8 
                  ? "Decent sessions" 
                  : "Consider longer sessions"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {data.completionRate.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sessions with 5+ meaningful turns
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
