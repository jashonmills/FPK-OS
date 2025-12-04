import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfDay, differenceInDays } from "date-fns";

interface EngagementChartProps {
  postsData: Array<{ created_at: string }>;
  supportsData: Array<{ created_at: string }>;
  commentsData: Array<{ created_at: string }>;
}

export default function EngagementChart({ postsData, supportsData, commentsData }: EngagementChartProps) {
  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string; posts: number; supports: number; comments: number }>();

    // Initialize all dates in range
    const today = new Date();
    const earliestDate = postsData.length > 0 
      ? new Date(Math.min(...postsData.map(p => new Date(p.created_at).getTime())))
      : today;
    
    const daysDiff = Math.min(differenceInDays(today, earliestDate), 90); // Max 90 days

    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = format(startOfDay(date), "MMM dd");
      dataMap.set(dateKey, { date: dateKey, posts: 0, supports: 0, comments: 0 });
    }

    // Count posts
    postsData.forEach(post => {
      const dateKey = format(startOfDay(new Date(post.created_at)), "MMM dd");
      const entry = dataMap.get(dateKey);
      if (entry) entry.posts++;
    });

    // Count supports
    supportsData.forEach(support => {
      const dateKey = format(startOfDay(new Date(support.created_at)), "MMM dd");
      const entry = dataMap.get(dateKey);
      if (entry) entry.supports++;
    });

    // Count comments
    commentsData.forEach(comment => {
      const dateKey = format(startOfDay(new Date(comment.created_at)), "MMM dd");
      const entry = dataMap.get(dateKey);
      if (entry) entry.comments++;
    });

    return Array.from(dataMap.values()).reverse();
  }, [postsData, supportsData, commentsData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
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
        <Line 
          type="monotone" 
          dataKey="posts" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))' }}
        />
        <Line 
          type="monotone" 
          dataKey="supports" 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-2))' }}
        />
        <Line 
          type="monotone" 
          dataKey="comments" 
          stroke="hsl(var(--chart-3))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-3))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
