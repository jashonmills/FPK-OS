import { Brain, Clock, BookOpen, Flame } from 'lucide-react';
import { useCoachAnalytics } from '@/hooks/useCoachAnalytics';
import { cn } from '@/lib/utils';

export function MobileAnalyticsCarousel() {
  const { analytics, loading } = useCoachAnalytics();

  if (loading || !analytics) {
    return (
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-3 py-2 bg-muted/50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 h-16 w-32 bg-background rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const learningHours = Math.floor(analytics.learningTimeMinutes / 60);
  const learningMinutes = analytics.learningTimeMinutes % 60;

  const metrics = [
    {
      icon: Brain,
      label: 'Mastery',
      value: `${analytics.masteryScore}/3.0`,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Clock,
      label: 'Active',
      value: `${learningHours}h ${learningMinutes}m`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: BookOpen,
      label: 'Topics',
      value: analytics.topicsExplored.length.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${analytics.sessionStreak} days`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-3 py-2 bg-muted/30 border-b border-border snap-x snap-mandatory">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={cn(
            "flex-shrink-0 snap-center rounded-lg p-3 min-w-[140px] border border-border",
            "bg-background shadow-sm"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("p-1.5 rounded-md", metric.bgColor)}>
              <metric.icon className={cn("h-4 w-4", metric.color)} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{metric.label}</span>
          </div>
          <div className="text-lg font-bold">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}
