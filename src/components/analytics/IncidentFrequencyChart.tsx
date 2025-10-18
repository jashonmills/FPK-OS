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
      // Try incident_logs first (manual daily logging)
      const { data: logs, error: logsError } = await supabase
        .from("incident_logs")
        .select("incident_date, behavior_description, reporter_role")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .gte("incident_date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order("incident_date", { ascending: true });

      if (logsError) throw logsError;
      
      if (logs && logs.length > 0) {
        console.log(`[IncidentFrequency] Found ${logs.length} incidents from incident_logs`);
        const hasManualLogs = logs.some(log => log.reporter_role !== 'automated');
        return { 
          source: hasManualLogs ? 'logs' : 'documents', 
          data: logs.map(l => ({ incident_date: l.incident_date, behavior_description: l.behavior_description }))
        };
      } else {
        console.log(`[IncidentFrequency] No incidents found in incident_logs, checking document_metrics...`);
      }
      
      // Fallback to document_metrics (historical documents)
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data: metrics, error: metricsError } = await supabase
        .from("document_metrics")
        .select("measurement_date, metric_name")
        .eq("family_id", familyId)
        .eq("student_id", studentId)
        .eq("metric_type", "behavioral_incident")
        .not("measurement_date", "is", null)
        .gte("measurement_date", cutoffDate)
        .order("measurement_date", { ascending: true });
      
      if (metricsError) throw metricsError;
      
      // Log data quality
      if (metrics && metrics.length > 0) {
        const nullDates = metrics.filter(m => !m.measurement_date).length;
        if (nullDates > 0) {
          console.warn(`⚠️ [IncidentFrequency] ${nullDates} metrics missing measurement_date`);
        }
      }
      
      return { 
        source: 'documents', 
        data: metrics ? metrics.map(m => ({ incident_date: m.measurement_date, behavior_description: m.metric_name })) : []
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
