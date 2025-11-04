import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Play, Square } from 'lucide-react';
import { format } from 'date-fns';
import { useSidebar } from '@/components/ui/sidebar';

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
  
  // Store user ID in a ref to avoid effect dependency issues
  const userIdRef = useRef(user?.id);

  // Update ref when user ID changes
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  // Effect 1: Initialize projects and restore session (once on mount)
  useEffect(() => {
    fetchProjects();
    
    // Restore session from localStorage
    const storedSession = localStorage.getItem('fpk_pulse_active_time_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setActiveSession({
          ...session,
          startTime: new Date(session.startTime)
        });
        
        // Verify/restore database record
        if (userIdRef.current) {
          restoreDatabaseSession(userIdRef.current, session);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('fpk_pulse_active_time_session');
      }
    }
  }, []); // Empty dependency - run once on mount

  // Effect 2: Setup beforeunload handler (once on mount)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userIdRef.current) {
        // Delete session from database when page is closing
        supabase
          .from('active_time_sessions')
          .delete()
          .eq('user_id', userIdRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency - run once on mount

  useEffect(() => {
    // Save to localStorage whenever activeSession changes
    if (activeSession) {
      localStorage.setItem('fpk_pulse_active_time_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('fpk_pulse_active_time_session');
    }
  }, [activeSession]);

  // Effect 3: Heartbeat and elapsed time updates
  useEffect(() => {
    if (!activeSession) return;

    // Update elapsed time every second
    const timerInterval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    // Send heartbeat every 60 seconds
    const heartbeatInterval = setInterval(() => {
      if (userIdRef.current) {
        supabase
          .from('active_time_sessions')
          .update({ last_heartbeat: new Date().toISOString() })
          .eq('user_id', userIdRef.current)
          .then(({ error }) => {
            if (error) {
              console.error('Heartbeat failed:', error);
            }
          });
      }
    }, 60000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(heartbeatInterval);
    };
  }, [activeSession]);

  // Helper: Restore database session if missing
  const restoreDatabaseSession = async (userId: string, session: ActiveSession) => {
    // Check if session exists in database
    const { data: existing } = await supabase
      .from('active_time_sessions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existing) {
      // Re-insert the session
      await supabase
        .from('active_time_sessions')
        .insert({
          user_id: userId,
          project_id: session.projectId,
          task_id: session.taskId || null,
          start_time: new Date(session.startTime).toISOString(),
        });
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
    const { error } = await supabase
      .from('active_time_sessions')
      .insert({
        user_id: user.id,
        project_id: selectedProjectId,
        start_time: session.startTime.toISOString(),
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to start session',
        variant: 'destructive',
      });
      return;
    }

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
    }
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active Session</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 dark:text-green-400">Live</span>
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
            <Button
              onClick={handleClockOut}
              className="w-full h-9 gap-2"
              variant="destructive"
            >
              <Square className="h-4 w-4" />
              Clock Out
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
