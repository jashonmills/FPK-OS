import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type?: 'story' | 'bug' | 'epic' | 'chore' | 'meeting' | 'deadline' | 'focus_time' | 'personal' | 'reminder';
  assignee_id: string | null;
  due_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

interface Column {
  id: string;
  title: string;
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  projectColor?: string;
  onTaskClick?: (task: Task) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const KanbanColumn = ({ column, tasks, projectColor, onTaskClick, isCollapsed, onToggleCollapse }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        className="flex-shrink-0 w-12 bg-muted/50 rounded-lg relative group hover:bg-muted transition-colors"
      >
        <div className="h-full flex flex-col items-center justify-between py-4">
          <div className="writing-mode-vertical text-sm font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
            <span className="inline-block" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {column.title}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onToggleCollapse}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 bg-muted/50 rounded-lg p-3 transition-colors',
        isOver && 'bg-muted'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          {column.title}
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
            {tasks.length}
          </span>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggleCollapse}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1">
          {tasks.map(task => (
            <KanbanCard 
              key={task.id} 
              task={task} 
              projectColor={projectColor}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed border-muted rounded-lg">
          Drop tasks here
        </div>
      )}
    </div>
  );
};
