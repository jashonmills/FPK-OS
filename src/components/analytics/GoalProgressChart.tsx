import { useState } from 'react';
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

export const GoalProgressChart = ({ clientId }: GoalProgressChartProps) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['client-goals', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_client_goals', {
        p_client_id: clientId
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId,
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['goal-progress', selectedGoalId],
    queryFn: async () => {
      if (!selectedGoalId) return [];
      
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');

      const { data, error } = await supabase.rpc('get_goal_progress_timeline', {
        p_goal_id: selectedGoalId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) throw error;
      return (data || []).map((item: any) => ({
        date: format(new Date(item.recorded_date), 'MMM dd'),
        value: item.progress_value
      }));
    },
    enabled: !!selectedGoalId,
  });

  if (goalsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress Over Time</CardTitle>
          <CardDescription>Track progress toward your goals</CardDescription>
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
        <CardTitle>Goal Progress Over Time</CardTitle>
        <CardDescription>Track progress toward your goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a goal to view progress" />
          </SelectTrigger>
          <SelectContent>
            {goals?.map((goal: any) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.goal_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedGoalId && (
          <div className="h-[250px]">
            {progressLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : progressData && progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Progress"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No progress data available for this goal</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
