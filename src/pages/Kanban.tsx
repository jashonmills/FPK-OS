import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanBoardAllProjects } from '@/components/kanban/KanbanBoardAllProjects';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { ViewSwitcher, ViewType } from '@/components/project-views/ViewSwitcher';
import { ListView } from '@/components/project-views/ListView';
import { CalendarView } from '@/components/project-views/CalendarView';
import { TimelineView } from '@/components/project-views/TimelineView';
import { TaskDetailsSheet } from '@/components/kanban/TaskDetailsSheet';
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton';
import { AssigneeFilter } from '@/components/assignee/AssigneeFilter';
import { MyTasksButton } from '@/components/assignee/MyTasksButton';
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
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [showMyTasks, setShowMyTasks] = useState(false);
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
  }, [selectedProject, assigneeFilter, showMyTasks]);

  const fetchTasks = async () => {
    if (!selectedProject) return;
    
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:assignee_id(id, full_name, email, avatar_url)
      `);
    
    if (selectedProject !== 'all') {
      query = query.eq('project_id', selectedProject);
    }

    // Apply assignee filter
    if (showMyTasks && user) {
      query = query.eq('assignee_id', user.id);
    } else if (assigneeFilter === 'unassigned') {
      query = query.is('assignee_id', null);
    } else if (assigneeFilter && assigneeFilter !== 'all') {
      query = query.eq('assignee_id', assigneeFilter);
    }
    
    const { data, error } = await query.order('position');

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
    if (!selectedProject || selectedProject === 'all') {
      setProjectColor('');
      return;
    }
    
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

  const handleMyTasksClick = () => {
    if (showMyTasks) {
      setShowMyTasks(false);
      setAssigneeFilter(null);
    } else {
      setShowMyTasks(true);
      setAssigneeFilter(null);
    }
  };

  const handleAssigneeFilterChange = (filter: string | null) => {
    setAssigneeFilter(filter);
    setShowMyTasks(false);
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
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">Project Board</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <MyTasksButton active={showMyTasks} onClick={handleMyTasksClick} />
              <AssigneeFilter value={assigneeFilter} onChange={handleAssigneeFilterChange} />
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto md:ml-auto">
              <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} />
              <ProjectSelector value={selectedProject} onChange={setSelectedProject} />
              {selectedProject && selectedProject !== 'all' && activeView !== 'kanban' && (
                <CreateTaskButton projectId={selectedProject} variant="button" />
              )}
            </div>
          </div>
        </div>

        {selectedProject && (
          <>
            {activeView === 'kanban' && (
              selectedProject === 'all' ? (
                <KanbanBoardAllProjects 
                  tasks={tasks}
                  onTaskUpdate={fetchTasks}
                  onTaskClick={handleTaskClick}
                />
              ) : (
                <KanbanBoard projectId={selectedProject} />
              )
            )}
            {activeView === 'list' && (
              <ListView 
                tasks={tasks} 
                projectColor={projectColor}
                onTaskClick={handleTaskClick}
                isAllProjects={selectedProject === 'all'}
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
                isAllProjects={selectedProject === 'all'}
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

      {selectedProject && selectedProject !== 'all' && activeView === 'kanban' && (
        <CreateTaskButton 
          projectId={selectedProject} 
          variant="fab" 
          projectColor={projectColor}
        />
      )}

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
