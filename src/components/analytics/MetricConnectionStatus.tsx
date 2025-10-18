import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface MetricConnectionStatusProps {
  familyId: string;
  studentId: string;
}

export const MetricConnectionStatus = ({ familyId, studentId }: MetricConnectionStatusProps) => {
  const { data: metricStats } = useQuery({
    queryKey: ['metric-connection-status', familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_metrics')
        .select('metric_type')
        .eq('family_id', familyId)
        .eq('student_id', studentId);
      
      if (error) throw error;
      
      // Count metrics by type
      const typeCounts = data.reduce((acc: any, m: any) => {
        acc[m.metric_type] = (acc[m.metric_type] || 0) + 1;
        return acc;
      }, {});
      
      return {
        total: data.length,
        byType: typeCounts,
        uniqueTypes: Object.keys(typeCounts).length
      };
    }
  });

  const expectedMetricTypes = [
    { type: 'academic_fluency', chart: 'Academic Fluency Trends', required: 3 },
    { type: 'behavioral_incident', chart: 'Behavior Function Analysis', required: 5 },
    { type: 'sensory_profile', chart: 'Sensory Profile Heatmap', required: 5 },
    { type: 'social_skill', chart: 'Social Interaction Funnel', required: 3 },
    { type: 'goal_progress', chart: 'IEP Goal Tracker', required: 1 },
  ];

  const getStatus = (type: string, required: number) => {
    const count = metricStats?.byType[type] || 0;
    if (count >= required) return 'connected';
    if (count > 0) return 'partial';
    return 'missing';
  };

  if (!metricStats) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Analytics Data Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Total Metrics Extracted:</span>
            <Badge variant="secondary">{metricStats.total}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Unique Metric Types:</span>
            <Badge variant="secondary">{metricStats.uniqueTypes}</Badge>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Chart Data Status:</p>
            {expectedMetricTypes.map(({ type, chart, required }) => {
              const status = getStatus(type, required);
              const count = metricStats.byType[type] || 0;
              
              return (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="flex-1">{chart}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{count}/{required}</span>
                    {status === 'connected' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    {status === 'partial' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                    {status === 'missing' && <XCircle className="h-3 w-3 text-red-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
