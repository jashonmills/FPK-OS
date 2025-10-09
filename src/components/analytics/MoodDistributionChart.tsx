import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface MoodDistributionChartProps {
  familyId: string;
  studentId: string;
}

const MOOD_COLORS: Record<string, string> = {
  "happy": "hsl(var(--chart-1))",
  "calm": "hsl(var(--chart-2))",
  "anxious": "hsl(var(--chart-3))",
  "agitated": "hsl(var(--chart-4))",
  "tired": "hsl(var(--chart-5))",
  "irritable": "hsl(var(--destructive))",
};

export const MoodDistributionChart = ({ familyId, studentId }: MoodDistributionChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["weekly-mood", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_weekly_mood_counts", {
        p_family_id: familyId,
        p_student_id: studentId,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No mood data for the past week. Log daily observations to track patterns!
      </div>
    );
  }

  // Transform data for stacked bar chart
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const moods = [...new Set(data.map((item: any) => item.mood))];
  
  const chartData = daysOfWeek.map((day, index) => {
    const dayData: any = { day };
    const dayOrder = index + 1;
    
    moods.forEach(mood => {
      const moodEntry = data.find((item: any) => 
        item.day_of_week.trim() === day && item.mood === mood
      );
      dayData[mood] = moodEntry ? Number(moodEntry.count) : 0;
    });
    
    return dayData;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="day" 
          className="text-xs"
          tick={{ fill: "hsl(var(--foreground))" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
        <Legend />
        {moods.map((mood) => (
          <Bar 
            key={mood} 
            dataKey={mood} 
            stackId="a" 
            fill={MOOD_COLORS[mood] || "hsl(var(--muted))"}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
