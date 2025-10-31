import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GoalProgressHistoryProps {
  goalId: string;
}

export function GoalProgressHistory({ goalId }: GoalProgressHistoryProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ['goal-progress-history', goalId],
    queryFn: async () => {
      const { data: goal } = await supabase
        .from('goals')
        .select('family_id, student_id, goal_title')
        .eq('id', goalId)
        .single();

      if (!goal) throw new Error('Goal not found');

      const { data, error } = await supabase
        .from('progress_metrics')
        .select('*')
        .eq('family_id', goal.family_id)
        .eq('student_id', goal.student_id)
        .eq('metric_name', goal.goal_title)
        .order('metric_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress History</CardTitle>
          <CardDescription>
            No progress updates have been recorded yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the "Add Progress Update" button to start tracking progress for this goal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress History</CardTitle>
        <CardDescription>
          Showing {history.length} update{history.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry, index) => {
            const prevEntry = history[index + 1];
            const trend = prevEntry
              ? entry.metric_value > prevEntry.metric_value
                ? 'up'
                : entry.metric_value < prevEntry.metric_value
                ? 'down'
                : 'same'
              : null;

            return (
              <div
                key={entry.id}
                className="border-l-2 border-muted pl-4 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <time className="text-sm font-medium">
                      {format(new Date(entry.metric_date), 'MMM dd, yyyy')}
                    </time>
                    {trend && (
                      <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
                        {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {trend === 'same' && <Minus className="h-3 w-3 mr-1" />}
                        {trend}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {entry.metric_value}
                      {entry.metric_unit && ` ${entry.metric_unit}`}
                    </div>
                    {entry.target_value && (
                      <div className="text-xs text-muted-foreground">
                        Target: {entry.target_value}
                      </div>
                    )}
                  </div>
                </div>
                
                {entry.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {entry.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
