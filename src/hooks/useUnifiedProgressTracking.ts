import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useCleanup } from '@/utils/cleanupManager';

interface SessionMetrics {
  sessionId: string;
  courseId: string;
  lessonId?: string;
  startTime: number;
  lastActiveTime: number;
  pageViews: number;
  interactions: number;
}

export const useUnifiedProgressTracking = (
  courseId: string, 
  courseTitle: string, 
  lessonId?: string, 
  lessonTitle?: string
) => {
  const cleanup = useCleanup('unified-progress-tracking');
  const { user } = useAuth();
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const sessionStartRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());

  // Track interaction (any user activity)
  const trackInteraction = useCallback((interactionType: string, data?: Record<string, any>) => {
    if (!sessionMetrics || !user?.id) return;

    lastActivityRef.current = Date.now();
    setSessionMetrics(prev => prev ? { ...prev, interactions: prev.interactions + 1 } : null);

    // Log interaction analytics
    supabase
      .from('analytics_metrics')
      .insert({
        user_id: user.id,
        metric_name: `course_interaction.${interactionType}`,
        value: 1,
        metadata: {
          courseId,
          lessonId,
          interactionType,
          sessionId: sessionMetrics.sessionId,
          timestamp: new Date().toISOString(),
          ...data
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking interaction:', error);
      });
  }, [sessionMetrics, user?.id, courseId, lessonId]);

  // Save session data
  const saveSessionData = useCallback(async (isEndOfSession = false) => {
    if (!sessionMetrics || !user?.id) return;

    const currentTime = Date.now();
    const sessionDuration = Math.floor((currentTime - sessionStartRef.current) / 1000);
    const activeTime = Math.floor((lastActivityRef.current - sessionStartRef.current) / 1000);

    try {
      // Save to analytics_metrics
      await supabase
        .from('analytics_metrics')
        .insert({
          user_id: user.id,
          metric_name: isEndOfSession ? 'course_session_end' : 'course_session_progress',
          value: sessionDuration,
          metadata: {
            courseId,
            lessonId,
            courseTitle,
            lessonTitle,
            sessionId: sessionMetrics.sessionId,
            duration_seconds: sessionDuration,
            active_seconds: activeTime,
            page_views: sessionMetrics.pageViews,
            interactions_count: sessionMetrics.interactions,
            session_type: lessonId ? 'lesson' : 'overview',
            timestamp: new Date().toISOString()
          }
        });

      setTotalTimeSpent(prev => prev + Math.max(activeTime, 0));
      console.log(`📊 Session data saved: ${sessionDuration}s total, ${activeTime}s active`);
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }, [sessionMetrics, user?.id, courseId, lessonId, courseTitle, lessonTitle]);

  // Track lesson completion
  const trackLessonCompletion = useCallback(async (completedLessonId: string, completedLessonTitle: string) => {
    if (!user?.id) return;

    try {
      const completionTime = new Date().toISOString();
      const sessionTime = Math.floor((Date.now() - sessionStartRef.current) / 1000);

      // Track in lesson_progress table
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: completedLessonId,
          completed: true,
          completed_at: completionTime,
          time_spent_seconds: sessionTime
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      // Track analytics
      await supabase
        .from('analytics_metrics')
        .insert({
          user_id: user.id,
          metric_name: 'lesson_completion',
          value: 1,
          metadata: {
            courseId,
            lessonId: completedLessonId,
            lessonTitle: completedLessonTitle,
            completionTime,
            sessionTime,
            timestamp: new Date().toISOString()
          }
        });

      trackInteraction('lesson_completed', {
        lessonId: completedLessonId,
        lessonTitle: completedLessonTitle
      });

      console.log('✅ Lesson completion tracked:', completedLessonId);
    } catch (error) {
      console.error('Error tracking lesson completion:', error);
    }
  }, [user?.id, courseId, trackInteraction]);

  // Track course completion
  const trackCourseCompletion = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('analytics_metrics')
        .insert({
          user_id: user.id,
          metric_name: 'course_completion',
          value: 1,
          metadata: {
            courseId,
            courseTitle,
            completionTime: new Date().toISOString(),
            totalTimeSpent: totalTimeSpent,
            timestamp: new Date().toISOString()
          }
        });

      trackInteraction('course_completed', { courseTitle });
      console.log('🎓 Course completion tracked:', courseId);
    } catch (error) {
      console.error('Error tracking course completion:', error);
    }
  }, [user?.id, courseId, courseTitle, totalTimeSpent, trackInteraction]);

  // Initialize session - use ref to prevent infinite re-renders
  const sessionIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (user?.id && courseId && !sessionIdRef.current) {
      const sessionId = `${courseId}-${lessonId || 'overview'}-${Date.now()}`;
      sessionIdRef.current = sessionId;
      
      const session: SessionMetrics = {
        sessionId,
        courseId,
        lessonId,
        startTime: Date.now(),
        lastActiveTime: Date.now(),
        pageViews: 1,
        interactions: 0,
      };

      setSessionMetrics(session);
      sessionStartRef.current = Date.now();
      lastActivityRef.current = Date.now();

      console.log('🎯 Started tracking session:', sessionId);

      // Set up periodic progress saving using cleanupManager
      cleanup.setInterval(() => {
        saveSessionData(false);
      }, 30000); // Save every 30 seconds

      // Track user activity
      const handleUserActivity = () => {
        lastActivityRef.current = Date.now();
      };

      document.addEventListener('click', handleUserActivity);
      document.addEventListener('keydown', handleUserActivity);
      document.addEventListener('scroll', handleUserActivity);

      // Cleanup will be handled by cleanupManager
    }
    
    // Reset session ref when course changes  
    return () => {
      sessionIdRef.current = null;
    };
  }, [user?.id, courseId, saveSessionData, cleanup]);

  return {
    trackInteraction,
    trackLessonCompletion,
    trackCourseCompletion,
    totalTimeSpent,
    sessionActive: !!sessionMetrics,
    sessionId: sessionMetrics?.sessionId
  };
};