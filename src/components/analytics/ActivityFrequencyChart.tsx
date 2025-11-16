import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { useMemo } from 'react';

interface ActivityFrequencyChartProps {
  clientId: string;
}

export const ActivityFrequencyChart = ({ clientId }: ActivityFrequencyChartProps) => {
  // This query for manual logs can remain if needed, but we will focus on AI data.
  const { data: manualData, isLoading: manualLoading } = useQuery({
    queryKey: ['activity-frequency', clientId],
    queryFn: async () => {
      // This part is unchanged
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase.rpc('get_activity_frequency', {
        p_client_id: clientId,
        p_start_date: startDate,
        p_end_date: endDate
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId,
  });

  // === MODIFICATION START ===
  // Fetch RAW AI-extracted behavioral metrics
  const { data: rawAiMetrics, isLoading: aiLoading } = useQuery({
    queryKey: ['raw-ai-behavioral-metrics', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('bedrock_metrics')
        .select('metric_name, measurement_date')
        .eq('client_id', clientId)
        .eq('metric_type', 'behavioral') // Only fetch behavioral metrics
        .gte('measurement_date', startDate); // Greater than or equal to start date

      if (error) {
        console.error('Raw AI metrics fetch error:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!clientId,
  });

  // Forge the data on the client-side
  const aiData = useMemo(() => {
    if (!rawAiMetrics) return [];

    const frequencyMap = new Map<string, number>();

    rawAiMetrics.forEach(metric => {
      const currentCount = frequencyMap.get(metric.metric_name) || 0;
      frequencyMap.set(metric.metric_name, currentCount + 1);
    });

    return Array.from(frequencyMap.entries()).map(([name, count]) => ({
      log_type: name,
      count: count,
    }));
  }, [rawAiMetrics]);
  // === MODIFICATION END ===


  // Merge manual and AI data
  const data = [...(manualData || []), ...(aiData || [])];
  const isLoading = manualLoading || aiLoading;

  // The rest of the component remains largely the same
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Frequency</CardTitle>
          <CardDescription>Log activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Frequency</CardTitle>
        <CardDescription>Log activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="log_type" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Log Count" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No activity data found in the last 30 days.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
