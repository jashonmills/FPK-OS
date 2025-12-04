import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LearningStyleChartProps {
  socraticMinutes: number;
  freeChatMinutes: number;
}

export function LearningStyleChart({ socraticMinutes, freeChatMinutes }: LearningStyleChartProps) {
  const data = [
    { name: 'Socratic Mode', value: socraticMinutes, color: 'hsl(var(--primary))' },
    { name: 'Free Chat Mode', value: freeChatMinutes, color: 'hsl(220, 70%, 50%)' },
  ];

  const total = (socraticMinutes || 0) + (freeChatMinutes || 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Learning Mode Distribution</h3>
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return `${hours}h ${minutes}m`;
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available yet. Start learning to see your mode distribution!
        </div>
      )}
    </div>
  );
}
