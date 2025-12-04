import { useMemo } from 'react';

interface HeatmapDataPoint {
  date: string;
  study_time: number;
}

interface ActivityHeatmapChartProps {
  data: HeatmapDataPoint[];
}

export function ActivityHeatmapChart({ data }: ActivityHeatmapChartProps) {
  const heatmapData = useMemo(() => {
    const dataMap = new Map(data.map(item => [item.date, item.study_time]));
    
    // Get date range
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 90); // Show last 90 days
    
    // Generate all dates
    const dates: { date: Date; value: number }[] = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dates.push({
        date: new Date(d),
        value: dataMap.get(dateStr) || 0,
      });
    }
    
    return dates;
  }, [data]);

  const maxValue = Math.max(...heatmapData.map(d => d.value), 1);
  
  const getColor = (value: number) => {
    if (value === 0) return 'bg-muted';
    const intensity = Math.min(value / maxValue, 1);
    if (intensity < 0.25) return 'bg-primary/20';
    if (intensity < 0.5) return 'bg-primary/40';
    if (intensity < 0.75) return 'bg-primary/60';
    return 'bg-primary';
  };

  const weeks: { date: Date; value: number }[][] = [];
  let currentWeek: { date: Date; value: number }[] = [];
  
  heatmapData.forEach((item, index) => {
    currentWeek.push(item);
    if (item.date.getDay() === 6 || index === heatmapData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Activity Heatmap (Last 90 Days)</h3>
      <div className="flex gap-1 overflow-x-auto pb-4">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-3 h-3 rounded-sm ${getColor(day.value)} transition-colors hover:ring-2 hover:ring-primary cursor-pointer`}
                title={`${day.date.toLocaleDateString()}: ${Math.floor(day.value / 60)}h ${day.value % 60}m`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-primary/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
