import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, addDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from '@/components/shared/InfoTooltip';

interface SleepBehaviorCorrelationProps {
  familyId: string;
  studentId: string;
  sampleData?: any;
}

export const SleepBehaviorCorrelation = ({ familyId, studentId, sampleData }: SleepBehaviorCorrelationProps) => {
  const { data: sleepData, isLoading: sleepLoading } = useQuery({
    queryKey: ["sleep-behavior-correlation-sleep", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_records")
        .select("sleep_date, total_sleep_hours, sleep_quality_rating")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .order("sleep_date", { ascending: true })
        .limit(30);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !sampleData,
  });

  const { data: incidentData, isLoading: incidentLoading } = useQuery({
    queryKey: ["sleep-behavior-correlation-incidents", familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_logs")
        .select("incident_date")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .order("incident_date", { ascending: true })
        .limit(30);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !sampleData,
  });

  const isLoading = sleepLoading || incidentLoading;
  const displayData = sampleData;

  if (isLoading && !sampleData) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!displayData && (!sleepData || sleepData.length === 0)) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No sleep and behavior data yet. Log sleep and incidents to see correlations!
      </div>
    );
  }

  // Process real data if available
  let chartData = displayData;
  if (!displayData && sleepData && incidentData) {
    // Map sleep data with next-day incidents
    chartData = sleepData.map((sleep: any) => {
      const nextDay = format(addDays(new Date(sleep.sleep_date), 1), "yyyy-MM-dd");
      const incidentsNextDay = incidentData.filter(
        (inc: any) => inc.incident_date === nextDay
      ).length;

      return {
        date: format(new Date(sleep.sleep_date), "MMM dd"),
        sleep_hours: Number(sleep.total_sleep_hours || 0),
        next_day_incidents: incidentsNextDay,
      };
    });
  }

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
          label={{ value: 'Sleep Hours', angle: -90, position: 'insideLeft' }}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          label={{ value: 'Incidents', angle: 90, position: 'insideRight' }}
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
          dataKey="sleep_hours" 
          stroke="hsl(var(--chart-1))" 
          name="Sleep Hours"
          strokeWidth={2}
        />
        <Bar 
          yAxisId="right"
          dataKey="next_day_incidents" 
          fill="hsl(var(--destructive))" 
          name="Next Day Incidents"
          opacity={0.7}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};