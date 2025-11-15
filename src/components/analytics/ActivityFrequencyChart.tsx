import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface ActivityFrequencyChartProps {
  clientId: string;
}

export const ActivityFrequencyChart = ({ clientId }: ActivityFrequencyChartProps) => {
  // Fetch manual activity logs
  const { data: manualData, isLoading: manualLoading, error: manualError } = useQuery({
    queryKey: ['activity-frequency', clientId],
    queryFn: async () => {
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

  // Fetch AI-extracted activity data
  const { data: aiData, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-activity-frequency', clientId],
    queryFn: async () => {
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');

      const { data, error } = await supabase.rpc('get_ai_activity_frequency', {
        p_client_id: clientId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) {
        console.error('AI activity fetch error:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!clientId,
  });

  // Merge manual and AI data
  const data = [...(manualData || []), ...(aiData || [])];
  const isLoading = manualLoading || aiLoading;
  const error = manualError;

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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Frequency</CardTitle>
          <CardDescription>Log activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-sm text-destructive">Failed to load data</p>
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="log_type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--primary))" name="Log Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
