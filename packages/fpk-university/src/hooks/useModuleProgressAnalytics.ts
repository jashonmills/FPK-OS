/**
 * Module-Level Progress Analytics Hook
 * Tracks detailed module engagement metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ModuleProgressData {
  moduleId: string;
  courseId: string;
  timeSpent: number; // in seconds
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  viewedPercentage: number; // 0-100
  interactions: {
    playCount: number;
    pauseCount: number;
    seekCount: number;
    speedChanges: number;
    lastInteraction: string;
  };
  startedAt?: string;
  completedAt?: string;
  lastActiveAt: string;
}

interface ModuleSession {
  startTime: number;
  endTime?: number;
  interactions: number;
  maxProgress: number;
}

export const useModuleProgressAnalytics = (courseId: string) => {
  const { user } = useAuth();
  const [moduleProgress, setModuleProgress] = useState<Map<string, ModuleProgressData>>(new Map());
  const [currentSession, setCurrentSession] = useState<ModuleSession | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Load existing progress data
  useEffect(() => {
    if (!user?.id || !courseId) return;

    const loadModuleProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId);

        if (error) {
          console.error('Error loading module progress:', error);
          return;
        }

        const progressMap = new Map<string, ModuleProgressData>();
        data?.forEach(record => {
          progressMap.set(record.lesson_id, {
            moduleId: record.lesson_id,
            courseId: record.course_id,
            timeSpent: record.time_spent_seconds || 0,
            completionStatus: record.status as any,
            viewedPercentage: record.completion_percentage || 0,
            interactions: {
              playCount: 0,
              pauseCount: 0,
              seekCount: 0,
              speedChanges: 0,
              lastInteraction: record.updated_at
            },
            startedAt: record.created_at,
            completedAt: record.completed_at,
            lastActiveAt: record.updated_at
          });
        });

        setModuleProgress(progressMap);
      } catch (error) {
        console.error('Error in loadModuleProgress:', error);
      }
    };

    loadModuleProgress();
  }, [user?.id, courseId]);

  // Start tracking a module session
  const startModuleSession = useCallback((moduleId: string) => {
    if (!user?.id) return;

    console.log(`📊 Starting session for module: ${moduleId}`);
    setActiveModuleId(moduleId);
    setCurrentSession({
      startTime: Date.now(),
      interactions: 0,
      maxProgress: 0
    });

    // Update module as started if not already
    const existing = moduleProgress.get(moduleId);
    if (!existing || existing.completionStatus === 'not_started') {
      updateModuleProgress(moduleId, {
        completionStatus: 'in_progress',
        startedAt: new Date().toISOString()
      });
    }
  }, [user?.id, moduleProgress]);

  // End tracking a module session
  const endModuleSession = useCallback(() => {
    if (!currentSession || !activeModuleId || !user?.id) return;

    const sessionDuration = (Date.now() - currentSession.startTime) / 1000;
    console.log(`📊 Ending session for module: ${activeModuleId}, duration: ${Math.round(sessionDuration)}s`);

    // Update total time spent
    const existing = moduleProgress.get(activeModuleId);
    const newTimeSpent = (existing?.timeSpent || 0) + sessionDuration;

    updateModuleProgress(activeModuleId, {
      timeSpent: newTimeSpent,
      lastActiveAt: new Date().toISOString()
    });

    setCurrentSession(null);
    setActiveModuleId(null);
  }, [currentSession, activeModuleId, user?.id, moduleProgress]);

  // Update module progress data
  const updateModuleProgress = useCallback(async (
    moduleId: string, 
    updates: Partial<ModuleProgressData>
  ) => {
    if (!user?.id) return;

    try {
      const existing = moduleProgress.get(moduleId);
      const updatedProgress: ModuleProgressData = {
        moduleId,
        courseId,
        timeSpent: 0,
        completionStatus: 'not_started',
        viewedPercentage: 0,
        interactions: {
          playCount: 0,
          pauseCount: 0,
          seekCount: 0,
          speedChanges: 0,
          lastInteraction: new Date().toISOString()
        },
        lastActiveAt: new Date().toISOString(),
        ...existing,
        ...updates
      };

      // Update local state
      setModuleProgress(prev => new Map(prev).set(moduleId, updatedProgress));

      // Update database
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: moduleId,
          status: updatedProgress.completionStatus,
          completion_percentage: Math.round(updatedProgress.viewedPercentage),
          time_spent_seconds: Math.round(updatedProgress.timeSpent),
          completed_at: updatedProgress.completedAt || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) {
        console.error('Error updating module progress:', error);
      } else {
        console.log(`📊 Updated progress for ${moduleId}:`, updatedProgress);
      }
    } catch (error) {
      console.error('Error in updateModuleProgress:', error);
    }
  }, [user?.id, courseId, moduleProgress]);

  // Track specific interactions
  const trackInteraction = useCallback((
    type: 'play' | 'pause' | 'seek' | 'speed_change',
    progress?: number
  ) => {
    if (!activeModuleId || !currentSession) return;

    // Update session
    setCurrentSession(prev => prev ? {
      ...prev,
      interactions: prev.interactions + 1,
      maxProgress: Math.max(prev.maxProgress, progress || 0)
    } : null);

    // Update module interactions
    const existing = moduleProgress.get(activeModuleId);
    if (existing) {
      const updatedInteractions = { ...existing.interactions };
      
      switch (type) {
        case 'play':
          updatedInteractions.playCount++;
          break;
        case 'pause':
          updatedInteractions.pauseCount++;
          break;
        case 'seek':
          updatedInteractions.seekCount++;
          break;
        case 'speed_change':
          updatedInteractions.speedChanges++;
          break;
      }

      updatedInteractions.lastInteraction = new Date().toISOString();

      updateModuleProgress(activeModuleId, {
        interactions: updatedInteractions,
        viewedPercentage: Math.max(existing.viewedPercentage, progress || 0)
      });
    }
  }, [activeModuleId, currentSession, moduleProgress, updateModuleProgress]);

  // Mark module as completed
  const markModuleCompleted = useCallback((moduleId: string) => {
    updateModuleProgress(moduleId, {
      completionStatus: 'completed',
      viewedPercentage: 100,
      completedAt: new Date().toISOString()
    });
  }, [updateModuleProgress]);

  // Get analytics summary for all modules
  const getAnalyticsSummary = useCallback(() => {
    const modules = Array.from(moduleProgress.values());
    const totalTimeSpent = modules.reduce((acc, m) => acc + m.timeSpent, 0);
    const completedModules = modules.filter(m => m.completionStatus === 'completed').length;
    const averageCompletion = modules.length > 0 
      ? modules.reduce((acc, m) => acc + m.viewedPercentage, 0) / modules.length 
      : 0;

    return {
      totalTimeSpent,
      completedModules,
      totalModules: modules.length,
      averageCompletion,
      moduleBreakdown: modules
    };
  }, [moduleProgress]);

  // Auto-save session data on unmount or visibility change
  useEffect(() => {
    const handleBeforeUnload = () => {
      endModuleSession();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        endModuleSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      endModuleSession();
    };
  }, [endModuleSession]);

  return {
    moduleProgress: Array.from(moduleProgress.values()),
    startModuleSession,
    endModuleSession,
    trackInteraction,
    markModuleCompleted,
    getAnalyticsSummary,
    activeModuleId,
    currentSession
  };
};