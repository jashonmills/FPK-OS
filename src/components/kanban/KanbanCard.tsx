import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee_id: string | null;
  due_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
  projectColor?: string;
  onClick?: () => void;
}

const priorityColors = {
  low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  urgent: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

export const KanbanCard = ({ task, isDragging = false, projectColor, onClick }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow relative overflow-hidden',
        (isDragging || isSortableDragging) && 'opacity-50'
      )}
    >
      {projectColor && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1" 
          style={{ backgroundColor: projectColor }}
        />
      )}
      <CardHeader className="p-3 pb-2 pl-4">
        <div className="flex items-start gap-2">
          <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 cursor-pointer" onClick={onClick}>
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 pl-4 cursor-pointer" onClick={onClick}>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={cn('text-xs', priorityColors[task.priority as keyof typeof priorityColors])}>
            {task.priority}
          </Badge>
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.due_date), 'MMM d')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
