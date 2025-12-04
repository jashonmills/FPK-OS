import { TrendingUp, Clock, Flame, Target } from 'lucide-react';

interface KPICardsProps {
  data: {
    total_study_time: number;
    total_sessions: number;
    current_streak: number;
    average_mastery: number;
  };
}

export function KPICards({ data }: KPICardsProps) {
  const kpis = [
    {
      icon: Clock,
      label: 'Total Study Time',
      value: `${Math.floor(data.total_study_time / 60)}h ${data.total_study_time % 60}m`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Total Sessions',
      value: data.total_sessions.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${data.current_streak} days`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Target,
      label: 'Avg. Mastery',
      value: `${data.average_mastery}/3.0`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
