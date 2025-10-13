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
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide text-sm min-w-0">
      {/* Mastery Score */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground whitespace-nowrap">Mastery:</span>
        <span className="font-semibold whitespace-nowrap">{analytics.masteryScore}/3.0</span>
      </div>

      {/* Active Learning Time */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Clock className="h-4 w-4 text-blue-500" />
        <span className="text-muted-foreground whitespace-nowrap">Active:</span>
        <span className="font-semibold whitespace-nowrap">
          {learningHours}h {learningMinutes}m
        </span>
      </div>

      {/* Topics Explored */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <BookOpen className="h-4 w-4 text-green-500" />
        <span className="text-muted-foreground whitespace-nowrap">Topics:</span>
        <span className="font-semibold whitespace-nowrap">{analytics.topicsExplored.length}</span>
      </div>

      {/* Session Streak */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-muted-foreground whitespace-nowrap">Streak:</span>
        <span className="font-semibold whitespace-nowrap">{analytics.sessionStreak} days</span>
      </div>
    </div>
  );
}
