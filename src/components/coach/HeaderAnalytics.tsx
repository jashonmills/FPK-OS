import { Brain, Clock, BookOpen, Flame } from 'lucide-react';
import { useCoachAnalytics } from '@/hooks/useCoachAnalytics';

export function HeaderAnalytics() {
  const { analytics, loading } = useCoachAnalytics();

  if (loading || !analytics) {
    return (
      <div className="flex items-center gap-6 text-sm animate-pulse">
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-20 bg-muted rounded"></div>
        <div className="h-4 w-16 bg-muted rounded"></div>
        <div className="h-4 w-20 bg-muted rounded"></div>
      </div>
    );
  }

  const learningHours = Math.floor(analytics.learningTimeMinutes / 60);
  const learningMinutes = analytics.learningTimeMinutes % 60;

  return (
    <div className="flex items-center gap-6 text-sm">
      {/* Mastery Score */}
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Mastery:</span>
        <span className="font-semibold">{analytics.masteryScore}/3.0</span>
      </div>

      {/* Active Learning Time */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-500" />
        <span className="text-muted-foreground">Active:</span>
        <span className="font-semibold">
          {learningHours}h {learningMinutes}m
        </span>
      </div>

      {/* Topics Explored */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-green-500" />
        <span className="text-muted-foreground">Topics:</span>
        <span className="font-semibold">{analytics.topicsExplored.length}</span>
      </div>

      {/* Session Streak */}
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-muted-foreground">Streak:</span>
        <span className="font-semibold">{analytics.sessionStreak} days</span>
      </div>
    </div>
  );
}
