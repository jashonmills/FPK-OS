import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface SleepChartProps {
  familyId: string;
  studentId: string;
  days: number;
}

export const SleepChart = ({ familyId, studentId, days }: SleepChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sleep-summary", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_sleep_summary_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
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
        No sleep data yet. Complete onboarding or add sleep records to see insights!
      </div>
    );
  }

  const chartData = data.map((item: any) => ({
    date: format(new Date(item.sleep_date), "MMM dd"),
    hours: Number(item.total_sleep_hours || 0),
    quality: Number(item.sleep_quality_rating || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs"
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis 
          yAxisId="left"
          label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          domain={[0, 5]}
          label={{ value: 'Quality', angle: 90, position: 'insideRight' }}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="hours" 
          stroke="hsl(var(--chart-1))" 
          name="Sleep Hours"
          strokeWidth={2}
        />
        <Bar 
          yAxisId="right"
          dataKey="quality" 
          fill="hsl(var(--chart-2))" 
          name="Quality (1-5)"
          opacity={0.6}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
