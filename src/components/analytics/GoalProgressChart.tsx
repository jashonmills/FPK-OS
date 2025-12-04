import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface GoalProgressChartProps {
  clientId: string;
}

// Define the structure of our metrics from the database
interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  measurement_date: string;
  target_value?: number;
  // Add any other relevant fields from your bedrock_metrics table
}

export const GoalProgressChart = ({ clientId }: GoalProgressChartProps) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined);

  // This part for manual goals can be kept or removed if not needed
  const { data: manualGoals, isLoading: manualGoalsLoading } = useQuery({
    queryKey: ['client-goals', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_client_goals', { p_client_id: clientId });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId,
  });

  // === MODIFICATION START ===
  // Fetch AI-extracted goals (bedrock_metrics)
  const { data: aiGoals, isLoading: aiGoalsLoading } = useQuery<Metric[]>({
    queryKey: ['ai-extracted-goals', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from('bedrock_metrics')
        .select('*')
        .eq('client_id', clientId)
        .order('measurement_date', { ascending: true });

      if (error) {
        console.error('Error fetching AI goals:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!clientId,
  });
  // === MODIFICATION END ===


  // Combine manual and AI goals for the dropdown
  const allGoals = useMemo(() => {
    const goalsMap = new Map<string, { id: string; name: string }>();
    
    // Add AI goals first
    if (aiGoals) {
      aiGoals.forEach(goal => {
        if (!goalsMap.has(goal.metric_name)) {
          goalsMap.set(goal.metric_name, { id: goal.metric_name, name: goal.metric_name });
        }
      });
    }

    // You can add manual goals here if you need to merge them
    // if (manualGoals) { ... }

    return Array.from(goalsMap.values());
  }, [aiGoals, manualGoals]);


  // Filter data for the selected goal
  const chartData = useMemo(() => {
    if (!selectedGoalId || !aiGoals) return [];
    
    return aiGoals
      .filter(d => d.metric_name === selectedGoalId)
      .map(d => ({
        date: format(new Date(d.measurement_date), 'MMM d'),
        value: d.metric_value,
        target: d.target_value,
      }));
  }, [selectedGoalId, aiGoals]);

  const isLoading = manualGoalsLoading || aiGoalsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Progress Over Time</CardTitle>
        <CardDescription>Track progress toward your goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedGoalId} value={selectedGoalId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a goal to view progress" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Loading goals...</SelectItem>
            ) : (
              allGoals.map(goal => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div className="h-[300px] w-full">
          {isLoading && <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>}
          {!isLoading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} name="Progress" />
                {chartData.some(d => d.target != null) && (
                  <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" name="Target" />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
          {!isLoading && chartData.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {selectedGoalId ? 'No data available for this goal.' : 'Select a goal to see its progress.'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
