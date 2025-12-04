import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface IntentData {
  intent: string;
  count: number;
}

interface IntentDistributionChartProps {
  data: IntentData[];
}

const COLORS = {
  'socratic_guidance': '#8b5cf6',
  'direct_answer': '#3b82f6',
  'request_for_clarification': '#10b981',
  'platform_question': '#f59e0b',
  'query_user_data': '#ef4444',
  'socratic_exploration': '#8b5cf6',
  'quick_question': '#3b82f6',
  'story_request': '#ec4899',
  'frustrated_vent': '#ef4444',
  'video_assessment': '#10b981',
  'general_chat': '#6366f1',
  'unclear': '#9ca3af'
};

export const IntentDistributionChart = ({ data }: IntentDistributionChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No intent data available yet
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.intent.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count,
    color: COLORS[item.intent as keyof typeof COLORS] || '#9ca3af'
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => percent ? `${name} ${(Number(percent) * 100).toFixed(0)}%` : name}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
