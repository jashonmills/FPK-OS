import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, getDay } from "date-fns";

interface ActivityChartProps {
  postsData: Array<{ created_at: string }>;
  commentsData: Array<{ created_at: string }>;
  messagesData: Array<{ created_at: string }>;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ActivityChart({ postsData, commentsData, messagesData }: ActivityChartProps) {
  const chartData = useMemo(() => {
    const dayMap = new Map<number, { day: string; posts: number; comments: number; messages: number }>();

    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dayMap.set(i, { day: dayNames[i], posts: 0, comments: 0, messages: 0 });
    }

    // Count posts by day
    postsData.forEach(post => {
      const dayIndex = getDay(new Date(post.created_at));
      const entry = dayMap.get(dayIndex);
      if (entry) entry.posts++;
    });

    // Count comments by day
    commentsData.forEach(comment => {
      const dayIndex = getDay(new Date(comment.created_at));
      const entry = dayMap.get(dayIndex);
      if (entry) entry.comments++;
    });

    // Count messages by day
    messagesData.forEach(message => {
      const dayIndex = getDay(new Date(message.created_at));
      const entry = dayMap.get(dayIndex);
      if (entry) entry.messages++;
    });

    return Array.from(dayMap.values());
  }, [postsData, commentsData, messagesData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="day" 
          className="text-xs text-muted-foreground"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs text-muted-foreground"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="comments" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="messages" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
