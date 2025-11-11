import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Play, Square, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useSidebar } from '@/components/ui/sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ActiveSession {
  projectId: string;
  projectName: string;
  taskId?: string;
  startTime: Date;
}

interface Project {
  id: string;
  name: string;
}

export const TimeClockWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isStale, setIsStale] = useState(false);

  // Initialize: Fetch projects and active session from database ONLY
  useEffect(() => {
    if (!user?.id) return;
    
    fetchProjects();
    fetchActiveSession();
  }, [user?.id]);

  // Real-time sync: Subscribe to active_time_sessions changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('active_session_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_time_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Session change detected:', payload);
          
          if (payload.eventType === 'DELETE') {
            // Session was stopped on another device
            setActiveSession(null);
            setElapsedTime(0);
            setIsStale(false);
          } else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Session was started/updated on another device
            fetchActiveSession();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Timer: Update elapsed time every second
  useEffect(() => {
    if (!activeSession) return;

    const timerInterval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
      
      // Check if session is stale (>12 hours)
      const hoursElapsed = elapsed / 3600;
      setIsStale(hoursElapsed > 12);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [activeSession]);

  // Heartbeat: Update last_heartbeat every 60 seconds
  useEffect(() => {
    if (!activeSession || !user?.id) return;

    const heartbeatInterval = setInterval(async () => {
      await supabase
        .from('active_time_sessions')
        .update({ last_heartbeat: new Date().toISOString() })
        .eq('user_id', user.id);
    }, 60000);

    return () => clearInterval(heartbeatInterval);
  }, [activeSession, user?.id]);

  const fetchActiveSession = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('active_time_sessions')
      .select('*, projects(name)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active session:', error);
      return;
    }

    if (data) {
      setActiveSession({
        projectId: data.project_id,
        projectName: data.projects?.name || 'Unknown Project',
        taskId: data.task_id || undefined,
        startTime: new Date(data.start_time)
      });
    } else {
      setActiveSession(null);
      setElapsedTime(0);
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');

    if (!error && data) {
      setProjects(data);
    }
  };

  const handleClockIn = async () => {
    if (!selectedProjectId || !user) {
      toast({
        title: 'Select Project',
        description: 'Please select a project before clocking in',
        variant: 'destructive',
      });
      return;
    }

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    const session: ActiveSession = {
      projectId: selectedProjectId,
      projectName: project.name,
      startTime: new Date(),
    };

    // Insert into active_time_sessions table
    const { data, error } = await supabase
      .from('active_time_sessions')
      .insert({
        user_id: user.id,
        project_id: selectedProjectId,
        start_time: session.startTime.toISOString(),
      })
      .select();

    console.log('Clock in result:', { data, error });

    if (error) {
      console.error('Failed to insert session:', error);
      toast({
        title: 'Error',
        description: `Failed to start session: ${error.message}`,
        variant: 'destructive',
      });
      return;
    }

    console.log('Session successfully inserted:', data);

    setActiveSession(session);
    setElapsedTime(0);
    
    toast({
      title: 'Clocked In',
      description: `Started tracking time for ${project.name}`,
    });
  };

  const handleClockOut = async () => {
    if (!activeSession || !user) return;

    const endTime = new Date();
    const hours = (endTime.getTime() - activeSession.startTime.getTime()) / 3600000;

    // Insert time entry
    const { error: timeEntryError } = await supabase
      .from('time_entries')
      .insert({
        user_id: user.id,
        project_id: activeSession.projectId,
        task_id: activeSession.taskId || null,
        hours_logged: hours,
        description: 'Time tracked via clock widget',
        entry_date: format(activeSession.startTime, 'yyyy-MM-dd'),
      });

    // Delete from active_time_sessions
    const { error: sessionError } = await supabase
      .from('active_time_sessions')
      .delete()
      .eq('user_id', user.id);

    if (timeEntryError || sessionError) {
      toast({
        title: 'Error',
        description: 'Failed to log time',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Clocked Out',
        description: `Logged ${hours.toFixed(2)} hours for ${activeSession.projectName}`,
      });
      setActiveSession(null);
      setElapsedTime(0);
      setIsStale(false);
    }
  };

  const handleForceClockOut = async () => {
    if (!user) return;

    const { data, error } = await supabase.functions.invoke('force-clock-out', {
      body: {}
    });

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to force clock out: ${error.message}`,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Force Clocked Out',
      description: `Logged ${data.hoursLogged} hours for ${data.projectName}`,
    });

    setActiveSession(null);
    setElapsedTime(0);
    setIsStale(false);
  };

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Collapsed view - just show clock icon
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center py-2" data-time-clock-widget>
        <Clock className={`h-5 w-5 ${activeSession ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
      </div>
    );
  }

  // Full expanded view
  return (
    <Card className="border-sidebar-border bg-sidebar" data-time-clock-widget>
      <CardContent className="p-3 space-y-3">
        {!activeSession ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Clock</span>
            </div>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleClockIn}
              className="w-full h-9 gap-2"
              variant="default"
            >
              <Play className="h-4 w-4" />
              Clock In
            </Button>
          </>
        ) : (
          <>
            {isStale && (
              <Alert variant="destructive" className="mb-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This session has been running for over 12 hours. Please clock out or use Force Clock Out.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active Session</span>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${isStale ? 'bg-orange-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className={`text-xs ${isStale ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    {isStale ? 'Stale' : 'Live'}
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium truncate">{activeSession.projectName}</div>
              <div className="text-2xl font-mono font-bold text-center py-2">
                {formatElapsedTime(elapsedTime)}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Started at {format(activeSession.startTime, 'h:mm a')}
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleClockOut}
                className="w-full h-9 gap-2"
                variant="destructive"
              >
                <Square className="h-4 w-4" />
                Clock Out
              </Button>
              {isStale && (
                <Button
                  onClick={handleForceClockOut}
                  className="w-full h-9 gap-2"
                  variant="outline"
                  size="sm"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Force Clock Out
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
