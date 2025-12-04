import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

export const TaskAnalytics = () => {
  const { data: taskStats } = useQuery({
    queryKey: ['task-analytics'],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status');

      if (error) throw error;

      const stats = {
        total: tasks.length,
        backlog: tasks.filter(t => t.status === 'backlog').length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        done: tasks.filter(t => t.status === 'done').length,
      };

      return stats;
    },
  });

  const statCards = [
    {
      title: 'Total Tasks',
      value: taskStats?.total || 0,
      icon: Circle,
      color: 'text-primary',
    },
    {
      title: 'In Progress',
      value: taskStats?.inProgress || 0,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      title: 'To Do',
      value: (taskStats?.backlog || 0) + (taskStats?.todo || 0),
      icon: AlertCircle,
      color: 'text-yellow-500',
    },
    {
      title: 'Completed',
      value: taskStats?.done || 0,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
