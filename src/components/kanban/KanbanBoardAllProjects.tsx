import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Card } from '@/components/ui/card';

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

interface Project {
  id: string;
  name: string;
  color: string;
}

interface KanbanBoardAllProjectsProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskClick: (task: Task) => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoardAllProjects = ({ tasks, onTaskUpdate, onTaskClick }: KanbanBoardAllProjectsProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, color')
      .order('name');

    if (!error && data) {
      setProjects(data);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
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

    if (overColumn) {
      newStatus = overColumn.id;
    } else if (overTask) {
      newStatus = overTask.status;
    }

    if (newStatus !== activeTaskData.status) {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus as any })
        .eq('id', String(active.id));

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update task',
          variant: 'destructive',
        });
      } else {
        onTaskUpdate();
      }
    }
  };

  const getProjectColor = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.color || '#6B7280';
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.project_id === project.id);
          
          if (projectTasks.length === 0) return null;
          
          return (
            <Card key={project.id} className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <span className="text-sm text-muted-foreground">
                  ({projectTasks.length} {projectTasks.length === 1 ? 'task' : 'tasks'})
                </span>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-2">
                {COLUMNS.map(column => {
                  const columnTasks = projectTasks.filter(t => t.status === column.id);
                  return (
                    <KanbanColumn
                      key={`${project.id}-${column.id}`}
                      column={column}
                      tasks={columnTasks}
                      projectColor={project.color}
                      onTaskClick={onTaskClick}
                    />
                  );
                })}
              </div>
            </Card>
          );
        })}

        <DragOverlay>
          {activeTask ? (
            <KanbanCard 
              task={activeTask} 
              isDragging 
              projectColor={getProjectColor(activeTask.project_id)} 
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
