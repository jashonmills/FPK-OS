import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

interface ListViewProps {
  tasks: Task[];
  projectColor: string;
  onTaskClick: (task: Task) => void;
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

export const ListView = ({ tasks, projectColor, onTaskClick }: ListViewProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
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
                  style={{ backgroundColor: projectColor }}
                />
              </TableCell>
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
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
