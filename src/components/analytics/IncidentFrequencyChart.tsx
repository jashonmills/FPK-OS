import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface IncidentFrequencyChartProps {
  familyId: string;
  studentId: string;
  days: number;
  sampleData?: any;
}

export const IncidentFrequencyChart = ({ familyId, studentId, days, sampleData }: IncidentFrequencyChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["incident-frequency", familyId, studentId, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_incident_frequency_data", {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: days,
      });

      if (error) {
        console.error(`[IncidentFrequency] RPC Error:`, error);
        throw error;
      }

      console.log(`[IncidentFrequency] Found ${data?.length || 0} date records from RPC`);
      
      // Convert RPC response to expected format
      const incidents = data?.flatMap((d: any) => 
        Array(d.incident_count).fill({ incident_date: d.log_date })
      ) || [];
      
      const hasManualData = data?.some((d: any) => d.incident_count > 0) || false;
      
      return {
        source: hasManualData ? 'logs' : 'documents',
        data: incidents
      };
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
        <p className="text-muted-foreground">No incident data available yet.</p>
        <p className="text-sm text-muted-foreground">Upload documents with behavioral data, or start logging incidents daily.</p>
      </div>
    );
  }

  // Group by date and count incidents
  const incidentsByDate = displayData.reduce((acc: any, incident: any) => {
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${dataSource === 'logs' ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}`}>
          {dataSource === 'logs' ? '📝 Daily Logs' : '📚 Historical Documents'}
        </span>
      </div>
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
    </div>
  );
};
