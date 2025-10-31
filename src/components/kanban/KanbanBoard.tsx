import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { TaskDetailsSheet } from './TaskDetailsSheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface KanbanBoardProps {
  projectId: string;
  tasks?: Task[];
  onTaskUpdate?: () => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoard = ({ projectId, tasks: externalTasks, onTaskUpdate: externalOnTaskUpdate }: KanbanBoardProps) => {
  const [internalTasks, setInternalTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [projectColor, setProjectColor] = useState<string>('');
  const [isFullWidth, setIsFullWidth] = useState(() => {
    const saved = localStorage.getItem('kanban-full-width');
    return saved ? JSON.parse(saved) : false;
  });
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('kanban-collapsed-columns');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [activeColumn, setActiveColumn] = useState<string>('backlog');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const tasks = externalTasks || internalTasks;
  const isAllProjects = projectId === 'all';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!externalTasks) {
      fetchTasks();
      fetchProjectColor();
      
      const channel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `project_id=eq.${projectId}`,
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      fetchProjectColor();
    }
  }, [projectId, externalTasks]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } else {
      setInternalTasks(data || []);
    }
  };

  const fetchProjectColor = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('color')
      .eq('id', projectId)
      .single();

    if (!error && data) {
      setProjectColor(data.color);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailsSheetOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const toggleFullWidth = () => {
    const newValue = !isFullWidth;
    setIsFullWidth(newValue);
    localStorage.setItem('kanban-full-width', JSON.stringify(newValue));
  };

  const toggleColumnCollapse = (columnId: string) => {
    setCollapsedColumns(prev => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      localStorage.setItem('kanban-collapsed-columns', JSON.stringify([...next]));
      return next;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskData = tasks.find(t => t.id === String(active.id));
    if (!activeTaskData) return;

    const overColumn = COLUMNS.find(c => c.id === String(over.id));
    const overTask = tasks.find(t => t.id === String(over.id));

    let newStatus = activeTaskData.status;
    let newTasks = [...tasks];

    if (overColumn) {
      newStatus = overColumn.id;
    } else if (overTask) {
      newStatus = overTask.status;
    }

    const oldIndex = tasks.findIndex(t => t.id === String(active.id));
    const newIndex = overTask ? tasks.findIndex(t => t.id === String(over.id)) : tasks.filter(t => t.status === newStatus).length;

    newTasks = arrayMove(newTasks, oldIndex, newIndex);
    newTasks = newTasks.map((task, index) => ({
      ...task,
      position: index,
      status: task.id === String(active.id) ? newStatus : task.status,
    }));

    if (!externalTasks) {
      setInternalTasks(newTasks);
    }

    const updatedTask = newTasks.find(t => t.id === String(active.id));
    if (updatedTask) {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus as any, position: updatedTask.position })
        .eq('id', String(active.id));

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update task',
          variant: 'destructive',
        });
        if (externalOnTaskUpdate) {
          externalOnTaskUpdate();
        } else {
          fetchTasks();
        }
      } else if (externalOnTaskUpdate) {
        externalOnTaskUpdate();
      }
    }
  };

  return (
    <div className={cn(
      "h-full flex flex-col transition-all duration-300",
      isFullWidth ? "w-full" : "max-w-7xl mx-auto"
    )}>
      {!isAllProjects && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Project Board</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullWidth}
              title={isFullWidth ? "Center view" : "Full width view"}
            >
              {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {isMobile ? (
          <Tabs value={activeColumn} onValueChange={setActiveColumn} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto mb-4">
              {COLUMNS.map(column => {
                const columnTasks = tasks.filter(t => t.status === column.id);
                return (
                  <TabsTrigger 
                    key={column.id} 
                    value={column.id}
                    className="flex-shrink-0"
                  >
                    {column.title}
                    <span className="ml-2 text-xs opacity-70">({columnTasks.length})</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {COLUMNS.map(column => {
              const columnTasks = tasks.filter(t => t.status === column.id);
              return (
                <TabsContent key={column.id} value={column.id} className="mt-0">
                  <KanbanColumn 
                    column={column} 
                    tasks={columnTasks} 
                    projectColor={projectColor}
                    onTaskClick={handleTaskClick}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {COLUMNS.map(column => {
              const columnTasks = tasks.filter(t => t.status === column.id);
              return (
                <KanbanColumn 
                  key={column.id} 
                  column={column} 
                  tasks={columnTasks} 
                  projectColor={projectColor}
                  onTaskClick={handleTaskClick}
                  isCollapsed={collapsedColumns.has(column.id)}
                  onToggleCollapse={() => toggleColumnCollapse(column.id)}
                />
              );
            })}
          </div>
        )}

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isDragging projectColor={projectColor} /> : null}
        </DragOverlay>
      </DndContext>

      {!isAllProjects && (
        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          projectId={projectId}
        />
      )}

      <TaskDetailsSheet
        task={selectedTask}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        onTaskUpdate={externalOnTaskUpdate || fetchTasks}
      />
    </div>
  );
};
