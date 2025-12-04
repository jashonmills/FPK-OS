import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLogChartProps {
  familyId: string;
  studentId: string;
  days: number;
  sampleData?: any;
}

export const ActivityLogChart = ({ familyId, studentId, days, sampleData }: ActivityLogChartProps) => {
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
    enabled: !sampleData, // Skip query if sample data provided
  });

  // Use sample data if provided, otherwise use fetched data
  const displayData = sampleData || data;

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No activity data available. Start logging to see trends!
      </div>
    );
  }

  const chartData = displayData.map((item: any) => ({
    date: format(new Date(item.log_date), "MMM dd"),
    Incidents: Number(item.incident_count),
    Parent: Number(item.parent_count),
    Educator: Number(item.educator_count),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="parentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgb(8, 145, 178)" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="educatorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgb(124, 58, 237)" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgb(219, 39, 119)" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs"
          tick={{ fill: "hsl(var(--foreground))" }}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
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
        <Bar dataKey="Parent" stackId="a" fill="url(#parentGradient)" />
        <Bar dataKey="Educator" stackId="a" fill="url(#educatorGradient)" />
        <Bar dataKey="Incidents" stackId="a" fill="url(#incidentGradient)" />
      </BarChart>
    </ResponsiveContainer>
  );
};
