import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface SleepChartProps {
  familyId: string;
  studentId: string;
  days: number;
  sampleData?: any;
}

export const SleepChart = ({ familyId, studentId, days, sampleData }: SleepChartProps) => {
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
    enabled: !sampleData,
  });

  const displayData = sampleData || data;

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No sleep data yet. Complete onboarding or add sleep records to see insights!
      </div>
    );
  }

  const chartData = displayData.map((item: any) => ({
    date: format(new Date(item.sleep_date), "MMM dd"),
    hours: Number(item.total_sleep_hours || 0),
    quality: Number(item.sleep_quality_rating || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <defs>
          <linearGradient id="sleepQualityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity={0.8} />
          </linearGradient>
        </defs>
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
            backgroundColor: "rgba(10, 25, 47, 0.8)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(0, 180, 255, 0.3)",
            borderRadius: "8px",
            boxShadow: "0 0 15px rgba(0, 180, 255, 0.2)"
          }}
          labelStyle={{ color: "#E0E0E0", fontSize: "0.8rem" }}
          itemStyle={{ color: "#FFFFFF", fontWeight: 600 }}
        />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="hours" 
          stroke="rgb(239, 68, 68)" 
          name="Sleep Hours"
          strokeWidth={2}
        />
        <Bar 
          yAxisId="right"
          dataKey="quality" 
          fill="url(#sleepQualityGradient)" 
          name="Quality (1-5)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
