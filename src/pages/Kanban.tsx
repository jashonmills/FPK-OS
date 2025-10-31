import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { ViewSwitcher, ViewType } from '@/components/project-views/ViewSwitcher';
import { ListView } from '@/components/project-views/ListView';
import { CalendarView } from '@/components/project-views/CalendarView';
import { TimelineView } from '@/components/project-views/TimelineView';
import { TaskDetailsSheet } from '@/components/kanban/TaskDetailsSheet';
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

const Kanban = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [activeView, setActiveView] = useState<ViewType>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectColor, setProjectColor] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (selectedProject) {
      // Load saved view preference
      const savedView = localStorage.getItem(`project-${selectedProject}-view`);
      if (savedView && ['kanban', 'list', 'calendar', 'timeline'].includes(savedView)) {
        setActiveView(savedView as ViewType);
      }
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
      fetchProjectColor();
      
      const channel = supabase
        .channel(`tasks-${selectedProject}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `project_id=eq.${selectedProject}`,
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedProject]);

  const fetchTasks = async () => {
    if (!selectedProject) return;
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', selectedProject)
      .order('position');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } else {
      setTasks(data || []);
    }
  };

  const fetchProjectColor = async () => {
    if (!selectedProject) return;
    
    const { data, error } = await supabase
      .from('projects')
      .select('color')
      .eq('id', selectedProject)
      .single();

    if (!error && data) {
      setProjectColor(data.color);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    if (selectedProject) {
      localStorage.setItem(`project-${selectedProject}-view`, view);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Project Board</h1>
          <div className="flex items-center gap-4">
            <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} />
            <ProjectSelector value={selectedProject} onChange={setSelectedProject} />
          </div>
        </div>

        {selectedProject && (
          <>
            {activeView === 'kanban' && <KanbanBoard projectId={selectedProject} />}
            {activeView === 'list' && (
              <ListView 
                tasks={tasks} 
                projectColor={projectColor}
                onTaskClick={handleTaskClick}
              />
            )}
            {activeView === 'calendar' && (
              <CalendarView
                tasks={tasks}
                projectColor={projectColor}
                onTaskClick={handleTaskClick}
                onTaskUpdate={fetchTasks}
              />
            )}
            {activeView === 'timeline' && (
              <TimelineView
                tasks={tasks}
                projectColor={projectColor}
                onTaskClick={handleTaskClick}
                onTaskUpdate={fetchTasks}
              />
            )}
          </>
        )}

        {!selectedProject && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Select a project to view tasks</p>
          </div>
        )}
      </div>

      <TaskDetailsSheet
        task={selectedTask}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        onTaskUpdate={fetchTasks}
      />
    </AppLayout>
  );
};

export default Kanban;
