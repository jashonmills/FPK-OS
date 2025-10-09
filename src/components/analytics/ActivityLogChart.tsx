import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLogChartProps {
  familyId: string;
  studentId: string;
  days: number;
}

export const ActivityLogChart = ({ familyId, studentId, days }: ActivityLogChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["daily-log-counts", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_daily_log_counts", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No activity data available. Start logging to see trends!
      </div>
    );
  }

  const chartData = data.map((item: any) => ({
    date: format(new Date(item.log_date), "MMM dd"),
    Incidents: Number(item.incident_count),
    Parent: Number(item.parent_count),
    Educator: Number(item.educator_count),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs"
          tick={{ fill: "hsl(var(--foreground))" }}
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
        <Bar dataKey="Parent" stackId="a" fill="hsl(var(--chart-1))" />
        <Bar dataKey="Educator" stackId="a" fill="hsl(var(--chart-2))" />
        <Bar dataKey="Incidents" stackId="a" fill="hsl(var(--chart-3))" />
      </BarChart>
    </ResponsiveContainer>
  );
};
