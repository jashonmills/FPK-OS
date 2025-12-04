import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PersonaData {
  persona: string;
  count: number;
}

interface PersonaUsageChartProps {
  data: PersonaData[];
}

const PERSONA_COLORS = {
  'BETTY': '#8b5cf6',
  'AL': '#3b82f6',
  'NITE_OWL': '#f59e0b'
};

const PERSONA_NAMES = {
  'BETTY': 'Betty (Socratic)',
  'AL': 'Al (Expert)',
  'NITE_OWL': 'Nite Owl (Fun Facts)'
};

export const PersonaUsageChart = ({ data }: PersonaUsageChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No persona data available yet
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: PERSONA_NAMES[item.persona as keyof typeof PERSONA_NAMES] || item.persona,
    messages: item.count,
    fill: PERSONA_COLORS[item.persona as keyof typeof PERSONA_COLORS] || '#9ca3af'
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="messages" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
