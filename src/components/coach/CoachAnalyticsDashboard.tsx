import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, BookOpen, Flame, Target } from 'lucide-react';
import { useCoachAnalytics } from '@/hooks/useCoachAnalytics';
import { Progress } from '@/components/ui/progress';

export function CoachAnalyticsDashboard() {
  const { analytics, loading } = useCoachAnalytics();

  if (loading) {
    return (
      <div className="bg-muted/30 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const learningHours = Math.floor(analytics.learningTimeMinutes / 60);
  const learningMinutes = analytics.learningTimeMinutes % 60;

  return (
    <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-lg p-6 mb-6 border border-border/50">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        Learning Snapshot
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Mastery Score */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Mastery Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{analytics.masteryScore}</span>
            <span className="text-lg text-muted-foreground">/3.0</span>
          </div>
          <Progress 
            value={(analytics.masteryScore / 3) * 100} 
            className="mt-3 h-2"
          />
        </Card>

        {/* Learning Time */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Active Learning</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{learningHours}</span>
            <span className="text-lg text-muted-foreground">h</span>
            {learningMinutes > 0 && (
              <>
                <span className="text-2xl font-bold ml-1">{learningMinutes}</span>
                <span className="text-lg text-muted-foreground">m</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Total study time</p>
        </Card>

        {/* Topics Explored */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Topics</span>
          </div>
          <div className="text-3xl font-bold mb-2">{analytics.topicsExplored.length}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {analytics.topicsExplored.slice(0, 2).map((topic, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs truncate max-w-full">
                {topic}
              </Badge>
            ))}
            {analytics.topicsExplored.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{analytics.topicsExplored.length - 2}
              </Badge>
            )}
          </div>
        </Card>

        {/* Session Streak */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-orange-500">{analytics.sessionStreak}</span>
            <span className="text-lg text-muted-foreground">days</span>
          </div>
          {analytics.sessionStreak > 0 && (
            <p className="text-xs text-muted-foreground mt-3">Keep it going! 🔥</p>
          )}
          {analytics.sessionStreak === 0 && (
            <p className="text-xs text-muted-foreground mt-3">Start learning today!</p>
          )}
        </Card>

        {/* Mode Ratio */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-muted-foreground">Learning Style</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-purple-500">
              {analytics.modeRatio.socraticPercent}
            </span>
            <span className="text-lg text-muted-foreground">%</span>
          </div>
          <div className="space-y-1">
            <Progress 
              value={analytics.modeRatio.socraticPercent} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {analytics.modeRatio.socratic} Structured / {analytics.modeRatio.freeChat} Free
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}