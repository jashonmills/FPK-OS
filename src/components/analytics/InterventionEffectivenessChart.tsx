import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface InterventionEffectivenessChartProps {
  familyId: string;
  studentId: string;
  days: number;
  sampleData?: any;
}

export const InterventionEffectivenessChart = ({ familyId, studentId, days, sampleData }: InterventionEffectivenessChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["intervention-effectiveness", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_intervention_effectiveness_data", {
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
        No intervention data available yet. Log incidents with interventions to see effectiveness!
      </div>
    );
  }

  const chartData = displayData.map((item: any) => ({
    date: format(new Date(item.log_date), "MMM dd"),
    incidents: Number(item.incident_count),
    interventions: Number(item.intervention_count),
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
        <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
        <Legend />
        <Bar 
          dataKey="incidents" 
          fill="hsl(var(--destructive))" 
          name="Incidents"
          opacity={0.7}
        />
        <Line 
          type="monotone" 
          dataKey="interventions" 
          stroke="hsl(var(--chart-1))" 
          name="Interventions Used"
          strokeWidth={2}
          connectNulls={false}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
