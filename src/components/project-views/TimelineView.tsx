import { useMemo } from 'react';
import { Gantt, Task as GanttTask, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee_id: string | null;
  due_date: string | null;
  start_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

interface TimelineViewProps {
  tasks: Task[];
  projectColor: string;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: () => void;
}

const statusColors: Record<string, string> = {
  backlog: '#94a3b8',
  todo: '#60a5fa',
  in_progress: '#f59e0b',
  review: '#a78bfa',
  done: '#10b981',
};

export const TimelineView = ({ tasks, projectColor, onTaskClick, onTaskUpdate }: TimelineViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const { toast } = useToast();

  const ganttTasks: GanttTask[] = useMemo(() => {
    return tasks
      .filter(task => task.start_date && task.due_date)
      .map(task => {
        const start = new Date(task.start_date!);
        const end = new Date(task.due_date!);
        
        // Ensure end is after start
        if (end <= start) {
          end.setDate(start.getDate() + 1);
        }

        return {
          id: task.id,
          name: task.title,
          start,
          end,
          progress: task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : 0,
          type: 'task' as const,
          styles: {
            backgroundColor: statusColors[task.status] || projectColor,
            backgroundSelectedColor: statusColors[task.status] || projectColor,
          },
        };
      });
  }, [tasks, projectColor]);

  const handleTaskChange = async (task: GanttTask) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        start_date: task.start.toISOString(),
        due_date: task.end.toISOString(),
      })
      .eq('id', task.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Task timeline updated',
      });
      onTaskUpdate();
    }
  };

  const handleTaskClick = (task: GanttTask) => {
    const originalTask = tasks.find(t => t.id === task.id);
    if (originalTask) {
      onTaskClick(originalTask);
    }
  };

  if (ganttTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-250px)] border rounded-lg">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No tasks with timeline data</p>
          <p className="text-sm">Tasks need both a start date and due date to appear on the timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={viewMode === ViewMode.Day ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode(ViewMode.Day)}
        >
          Day
        </Button>
        <Button
          variant={viewMode === ViewMode.Week ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode(ViewMode.Week)}
        >
          Week
        </Button>
        <Button
          variant={viewMode === ViewMode.Month ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode(ViewMode.Month)}
        >
          Month
        </Button>
        <Button
          variant={viewMode === ViewMode.Year ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode(ViewMode.Year)}
        >
          Year
        </Button>
      </div>
      <div className="border rounded-lg overflow-auto bg-background p-4">
        <Gantt
          tasks={ganttTasks}
          viewMode={viewMode}
          onDateChange={handleTaskChange}
          onClick={handleTaskClick}
          listCellWidth=""
          columnWidth={viewMode === ViewMode.Month ? 300 : viewMode === ViewMode.Week ? 250 : 60}
        />
      </div>
    </div>
  );
};
