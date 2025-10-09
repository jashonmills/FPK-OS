import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface IncidentFrequencyChartProps {
  familyId: string;
  studentId: string;
  days: number;
}

export const IncidentFrequencyChart = ({ familyId, studentId, days }: IncidentFrequencyChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["incident-frequency", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_logs")
        .select("incident_date, behavior_description")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .gte("incident_date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order("incident_date", { ascending: true });

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
        No incidents recorded. This is great progress!
      </div>
    );
  }

  // Group by date and count incidents
  const incidentsByDate = data.reduce((acc: any, incident: any) => {
    const date = incident.incident_date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {});

  const chartData = Object.keys(incidentsByDate).map(date => ({
    date: format(new Date(date), "MMM dd"),
    count: incidentsByDate[date],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
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
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="hsl(var(--destructive))" 
          strokeWidth={2}
          dot={{ fill: "hsl(var(--destructive))", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
