import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DayDataPoint {
  day: string;
  study_time: number;
}

interface TimeByDayChartProps {
  data: DayDataPoint[];
}

export function TimeByDayChart({ data }: TimeByDayChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    day: item.day.trim(),
    hours: (item.study_time / 60).toFixed(1),
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Study Time by Day of Week</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="day" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            formatter={(value: number) => [`${value} hours`, 'Study Time']}
          />
          <Legend />
          <Bar 
            dataKey="hours" 
            fill="hsl(var(--primary))" 
            radius={[8, 8, 0, 0]}
            name="Study Hours"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
