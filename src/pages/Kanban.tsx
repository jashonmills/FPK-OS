import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanBoardAllProjects } from '@/components/kanban/KanbanBoardAllProjects';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { ViewSwitcher, ViewType } from '@/components/project-views/ViewSwitcher';
import { MobileFilterDropdown } from '@/components/kanban/MobileFilterDropdown';
import { MobileViewDropdown } from '@/components/kanban/MobileViewDropdown';
import { ListView } from '@/components/project-views/ListView';
import { CalendarView } from '@/components/project-views/CalendarView';
import { CalendarSyncDialog } from '@/components/project-views/CalendarSyncDialog';
import { CreateTaskDialog } from '@/components/kanban/CreateTaskDialog';
import { ProjectSelectionDialog } from '@/components/kanban/ProjectSelectionDialog';
import { CreateCalendarEventDialog } from '@/components/calendar/CreateCalendarEventDialog';
import { TimelineView } from '@/components/project-views/TimelineView';
import { TaskDetailsSheet } from '@/components/kanban/TaskDetailsSheet';
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton';
import { AssigneeFilter } from '@/components/assignee/AssigneeFilter';
import { MyTasksButton } from '@/components/assignee/MyTasksButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { Plus, CalendarDays } from 'lucide-react';
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
  start_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

const Kanban = () => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [activeView, setActiveView] = useState<ViewType>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectColor, setProjectColor] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [projectSelectionDialogOpen, setProjectSelectionDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [calendarEventDialogOpen, setCalendarEventDialogOpen] = useState(false);
  const [prefilledDates, setPrefilledDates] = useState<{ start: Date; end: Date } | null>(null);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isFeatureEnabled } = useFeatureFlags();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handle task query parameter from notifications and upcoming deadlines
  useEffect(() => {
    const taskId = searchParams.get('task');
    if (taskId) {
      const fetchTaskAndOpen = async () => {
        const { data: task, error } = await supabase
          .from('tasks')
          .select(`
            *,
            project:projects(*),
            assignee:assignee_id(id, full_name, email, avatar_url)
          `)
          .eq('id', taskId)
          .maybeSingle();

        if (error || !task) {
          toast({
            title: 'Task not found',
            description: 'The task may have been deleted or you may not have access to it.',
            variant: 'destructive',
          });
          setSearchParams({});
          return;
        }

        // Set the project first so tasks load correctly
        if (task.project_id !== selectedProject) {
          setSelectedProject(task.project_id);
        }

        // Open the task details
        setSelectedTask(task);
        setDetailsSheetOpen(true);
        
        // Clear the query parameter
        setSearchParams({});
      };

      fetchTaskAndOpen();
    }
  }, [searchParams, setSearchParams, toast, selectedProject]);

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
      query = query.or(`assignee_id.eq.${user.id},created_by.eq.${user.id}`);
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

  const handleSlotSelect = (start: Date, end: Date) => {
    setPrefilledDates({ start, end });
    
    if (selectedProject === 'all') {
      setProjectSelectionDialogOpen(true);
    } else {
      // Use calendar event dialog when in calendar view
      if (isCalendarView) {
        setCalendarEventDialogOpen(true);
      } else {
        setCreateTaskDialogOpen(true);
      }
    }
  };

  const handleProjectSelected = (projectId: string) => {
    setSelectedProject(projectId);
    setProjectSelectionDialogOpen(false);
    
    // Use appropriate dialog based on current view
    if (isCalendarView) {
      setCalendarEventDialogOpen(true);
    } else {
      setCreateTaskDialogOpen(true);
    }
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

  const handleMobileFilterChange = (myTasks: boolean) => {
    setShowMyTasks(myTasks);
    setAssigneeFilter(null);
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
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">Project Board</h1>
          
          {isMobile ? (
            // Mobile-optimized layout
            <div className="flex flex-col gap-3 w-full">
              <ProjectSelector value={selectedProject} onChange={setSelectedProject} />
              <div className="flex items-center justify-center gap-2 w-full">
                <MobileFilterDropdown 
                  showMyTasks={showMyTasks} 
                  onFilterChange={handleMobileFilterChange}
                />
                <MobileViewDropdown 
                  activeView={activeView} 
                  onViewChange={handleViewChange}
                />
              </div>
            </div>
          ) : (
            // Desktop layout
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                <MyTasksButton active={showMyTasks} onClick={handleMyTasksClick} />
                <AssigneeFilter value={assigneeFilter} onChange={handleAssigneeFilterChange} />
              </div>
              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto md:ml-auto">
                <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} />
                {isFeatureEnabled('FEATURE_CALENDAR_SYNC') && activeView === 'calendar' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSyncDialogOpen(true)}
                    className="gap-2"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Sync to Calendar
                  </Button>
                )}
                <ProjectSelector value={selectedProject} onChange={setSelectedProject} />
                {selectedProject && selectedProject !== 'all' && activeView !== 'kanban' && (
                  <CreateTaskButton projectId={selectedProject} variant="button" />
                )}
              </div>
            </div>
          )}
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
                <KanbanBoard 
                  projectId={selectedProject}
                  tasks={tasks}
                  onTaskUpdate={fetchTasks}
                />
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
              projectId={selectedProject}
              onTaskClick={handleTaskClick}
              onTaskUpdate={fetchTasks}
              onSlotSelect={(start, end) => {
                setIsCalendarView(true);
                handleSlotSelect(start, end);
              }}
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
        <div data-create-task-btn onClick={() => {
          const btn = document.createElement('button');
          btn.style.display = 'none';
          document.body.appendChild(btn);
        }}>
          <CreateTaskButton 
            projectId={selectedProject} 
            variant="fab" 
            projectColor={projectColor}
          />
        </div>
      )}

      <TaskDetailsSheet
        task={selectedTask}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        onTaskUpdate={fetchTasks}
      />

      <CalendarSyncDialog
        open={syncDialogOpen}
        onOpenChange={setSyncDialogOpen}
        projectId={selectedProject !== 'all' ? selectedProject : undefined}
        myTasksOnly={showMyTasks}
      />

      <ProjectSelectionDialog
        open={projectSelectionDialogOpen}
        onOpenChange={setProjectSelectionDialogOpen}
        onProjectSelected={handleProjectSelected}
      />
      
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={(open) => {
          setCreateTaskDialogOpen(open);
          if (!open) setIsCalendarView(false);
        }}
        projectId={selectedProject !== 'all' ? selectedProject : undefined}
        prefilledDates={prefilledDates}
        onTaskCreated={fetchTasks}
      />

      <CreateCalendarEventDialog
        open={calendarEventDialogOpen}
        onOpenChange={(open) => {
          setCalendarEventDialogOpen(open);
          if (!open) setIsCalendarView(false);
        }}
        projectId={selectedProject !== 'all' ? selectedProject : undefined}
        prefilledDates={prefilledDates}
        onEventCreated={fetchTasks}
      />
    </AppLayout>
  );
};

export default Kanban;
