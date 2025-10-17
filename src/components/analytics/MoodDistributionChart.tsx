import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface MoodDistributionChartProps {
  familyId: string;
  studentId: string;
  sampleData?: any;
}

const MOOD_COLORS: Record<string, string> = {
  "happy": "hsl(var(--chart-1))",
  "calm": "hsl(var(--chart-2))",
  "anxious": "hsl(var(--chart-3))",
  "agitated": "hsl(var(--chart-4))",
  "tired": "hsl(var(--chart-5))",
  "irritable": "hsl(var(--destructive))",
};

export const MoodDistributionChart = ({ familyId, studentId, sampleData }: MoodDistributionChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["weekly-mood", familyId, studentId],
    queryFn: async () => {
      // Try parent_logs first (manual daily logging)
      const { data: logs, error: logsError } = await supabase.rpc("get_weekly_mood_counts", {
        p_family_id: familyId,
        p_student_id: studentId,
      });

      if (!logsError && logs && logs.length > 0) {
        return { source: 'logs', data: logs };
      }
      
      // Fallback to document_metrics (historical mood data)
      const { data: metrics, error: metricsError } = await supabase
        .from("document_metrics")
        .select("measurement_date, metric_name, metric_value")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .eq("metric_type", "mood_tracking")
        .gte("measurement_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order("measurement_date", { ascending: true });
      
      if (metricsError) throw metricsError;
      
      // Transform metrics to mood count format
      const transformedData = metrics?.map(m => ({
        day_of_week: format(new Date(m.measurement_date), 'EEEE'),
        day_order: new Date(m.measurement_date).getDay() + 1,
        mood: m.metric_name.toLowerCase(),
        count: 1
      })) || [];
      
      return { source: 'documents', data: transformedData };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !sampleData,
  });

  const displayData = sampleData || data?.data;
  const dataSource = data?.source || 'unknown';

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <p className="text-muted-foreground">No mood data available yet.</p>
        <p className="text-sm text-muted-foreground">Upload documents with mood data, or start logging daily moods.</p>
      </div>
    );
  }

  // Transform data for stacked bar chart
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const moods = [...new Set(displayData.map((item: any) => item.mood))] as string[];
  
  const chartData = daysOfWeek.map((day, index) => {
    const dayData: any = { day };
    const dayOrder = index + 1;
    
    moods.forEach((mood: string) => {
      const moodEntry = displayData.find((item: any) => 
        item.day_of_week.trim() === day && item.mood === mood
      );
      dayData[mood] = moodEntry ? Number(moodEntry.count) : 0;
    });
    
    return dayData;
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${dataSource === 'logs' ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}`}>
          {dataSource === 'logs' ? '📝 Daily Logs' : '📚 Historical Documents'}
        </span>
      </div>
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
        {moods.map((mood: string) => (
          <Bar 
            key={mood} 
            dataKey={mood as string} 
            stackId="a" 
            fill={MOOD_COLORS[mood] || "hsl(var(--muted))"}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};
