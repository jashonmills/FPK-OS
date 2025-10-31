import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { TaskTypeIcon } from '@/components/tasks/TaskTypeIcon';
import { useIsMobile } from '@/hooks/use-mobile';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type?: 'story' | 'bug' | 'epic' | 'chore';
  assignee_id: string | null;
  due_date: string | null;
  start_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

interface ListViewProps {
  tasks: Task[];
  projectColor: string;
  onTaskClick: (task: Task) => void;
  isAllProjects?: boolean;
}

type SortField = 'title' | 'status' | 'priority' | 'due_date' | 'start_date';
type SortDirection = 'asc' | 'desc' | null;

const priorityColors = {
  low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  critical: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export const ListView = ({ tasks, projectColor, onTaskClick, isAllProjects }: ListViewProps) => {
  const isMobile = useIsMobile();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [projects, setProjects] = useState<Record<string, { name: string; color: string }>>({});

  useEffect(() => {
    if (isAllProjects) {
      fetchProjects();
    }
  }, [isAllProjects]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('id, name, color');

    if (data) {
      const projectMap = data.reduce((acc, project) => {
        acc[project.id] = { name: project.name, color: project.color };
        return acc;
      }, {} as Record<string, { name: string; color: string }>);
      setProjects(projectMap);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    if (!sortField || !sortDirection) return tasks;

    return [...tasks].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null values
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return sortDirection === 'asc' ? -1 : 1;

      // Convert to strings for comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  // Mobile card layout
  if (isMobile) {
    return (
      <div className="space-y-3 px-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="bg-card border border-border rounded-lg p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {/* Title */}
            <div className="flex items-start gap-3">
              <div 
                className="w-1 h-8 rounded-full flex-shrink-0" 
                style={{ backgroundColor: isAllProjects ? projects[task.project_id]?.color : projectColor }}
              />
              <h3 className="font-medium flex-1 break-words">{task.title}</h3>
            </div>

            {/* Type and Priority */}
            <div className="flex items-center gap-3 flex-wrap">
              {task.type && (
                <div className="flex items-center gap-1.5">
                  <TaskTypeIcon type={task.type} className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground capitalize">{task.type}</span>
                </div>
              )}
              <Badge 
                variant="secondary" 
                className={cn(priorityColors[task.priority as keyof typeof priorityColors])}
              >
                {task.priority}
              </Badge>
            </div>

            {/* Status */}
            <div>
              <Badge variant="outline">
                {statusLabels[task.status] || task.status}
              </Badge>
            </div>

            {/* Dates */}
            {(task.start_date || task.due_date) && (
              <div className="text-xs text-muted-foreground space-y-1">
                {task.start_date && (
                  <div>Start: {format(new Date(task.start_date), 'MMM d, yyyy')}</div>
                )}
                {task.due_date && (
                  <div>Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</div>
                )}
              </div>
            )}

            {/* Project (if all projects view) */}
            {isAllProjects && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: projects[task.project_id]?.color }}
                />
                <span className="text-sm text-muted-foreground">{projects[task.project_id]?.name || 'Unknown'}</span>
              </div>
            )}
          </div>
        ))}
        {sortedTasks.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No tasks found
          </div>
        )}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-12">Type</TableHead>
            {isAllProjects && <TableHead>Project</TableHead>}
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-2">
                Task Title
                <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                Status
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('priority')}
            >
              <div className="flex items-center gap-2">
                Priority
                <SortIcon field="priority" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('start_date')}
            >
              <div className="flex items-center gap-2">
                Start Date
                <SortIcon field="start_date" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('due_date')}
            >
              <div className="flex items-center gap-2">
                Due Date
                <SortIcon field="due_date" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick(task)}
            >
              <TableCell>
                <div 
                  className="w-1 h-8 rounded-full" 
                  style={{ backgroundColor: isAllProjects ? projects[task.project_id]?.color : projectColor }}
                />
              </TableCell>
              <TableCell>
                {task.type && <TaskTypeIcon type={task.type} className="h-4 w-4" />}
              </TableCell>
              {isAllProjects && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: projects[task.project_id]?.color }}
                    />
                    <span className="text-sm">{projects[task.project_id]?.name || 'Unknown'}</span>
                  </div>
                </TableCell>
              )}
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {statusLabels[task.status] || task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={cn(priorityColors[task.priority as keyof typeof priorityColors])}
                >
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {task.start_date ? format(new Date(task.start_date), 'MMM d, yyyy') : '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '—'}
              </TableCell>
            </TableRow>
          ))}
          {sortedTasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={isAllProjects ? 8 : 7} className="text-center text-muted-foreground py-8">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
