import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const UpcomingDeadlines = () => {
  const navigate = useNavigate();
  
  const { data: upcomingTasks } = useQuery({
    queryKey: ['upcoming-deadlines'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, due_date, status, project:projects(name, color)')
        .gte('due_date', now)
        .lte('due_date', thirtyDaysLater)
        .neq('status', 'done')
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const handleTaskClick = (taskId: string) => {
    navigate(`/kanban?task=${taskId}`);
  };

  const getPriorityColor = (dueDate: string) => {
    const daysUntil = Math.floor((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 3) return 'destructive';
    if (daysUntil <= 7) return 'default';
    return 'secondary';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Upcoming Deadlines</CardTitle>
        </div>
        <CardDescription>Tasks due in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {!upcomingTasks || upcomingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming deadlines
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTaskClick(task.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.project && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: task.project.color }}
                      >
                        {task.project.name}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.due_date && formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <Badge variant={getPriorityColor(task.due_date || '')}>
                  {task.due_date && new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
