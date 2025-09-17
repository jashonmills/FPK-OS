import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { trackDailyActivity } from '@/utils/analyticsTracking';
import type { Json } from '@/integrations/supabase/types';

interface InteractionData {
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

interface InteractiveCourseSession {
  courseId: string;
  lessonId?: number;
  sessionStart: Date;
  interactions: InteractionData[];
  pageViews: number;
  sessionType: 'overview' | 'lesson' | 'completion';
}

interface LessonAnalytics {
  lessonId: number;
  lessonTitle: string;
  startedAt: Date;
  timeSpentSeconds: number;
  engagementScore: number;
  scrollDepth: number;
  interactionsCount: number;
}

export const useInteractiveCourseAnalytics = (courseId: string, courseTitle: string) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<InteractiveCourseSession | null>(null);
  const [currentLessonAnalytics, setCurrentLessonAnalytics] = useState<LessonAnalytics | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Start course session - with loading protection
  const startCourseSession = useCallback(async (sessionType: 'overview' | 'lesson' | 'completion', lessonId?: number) => {
    if (!user?.id) return;

    console.log('🎯 Starting course session:', sessionType, lessonId);

    const sessionStart = new Date();
    setSessionStartTime(sessionStart);
    
    const session: InteractiveCourseSession = {
      courseId,
      lessonId,
      sessionStart,
      interactions: [],
      pageViews: 1,
      sessionType
    };
    
    setCurrentSession(session);

    // Record session start in database with timeout protection
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      await supabase
        .from('interactive_course_sessions')
        .insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          session_start: sessionStart.toISOString(),
          session_type: sessionType,
          page_views: 1,
          interactions: []
        });

      clearTimeout(timeoutId);

      // Track daily activity (non-blocking)
      trackDailyActivity('study', 0, user.id).catch(err => 
        console.warn('Daily activity tracking failed:', err)
      );
    } catch (error) {
      console.error('❌ Error starting course session:', error);
    }
  }, [user?.id, courseId]);

  // End course session - with timeout protection
  const endCourseSession = useCallback(async () => {
    if (!user?.id || !currentSession || !sessionStartTime) return;

    console.log('🏁 Ending course session');

    const sessionEnd = new Date();
    const durationSeconds = Math.floor((sessionEnd.getTime() - sessionStartTime.getTime()) / 1000);
    const durationMinutes = Math.floor(durationSeconds / 60);

    try {
      // Update session in database with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      await supabase
        .from('interactive_course_sessions')
        .update({
          session_end: sessionEnd.toISOString(),
          duration_seconds: durationSeconds,
          page_views: currentSession.pageViews,
          interactions: currentSession.interactions as unknown as Json
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('session_start', currentSession.sessionStart.toISOString());

      clearTimeout(timeoutId);

      // Track analytics (non-blocking)
      trackAnalyticsEvent('course_session_end', {
        course_id: courseId,
        session_type: currentSession.sessionType,
        duration_seconds: durationSeconds,
        page_views: currentSession.pageViews,
        interactions_count: currentSession.interactions.length
      }, user.id).catch(err => console.warn('Analytics tracking failed:', err));

      // Track daily activity (non-blocking)
      trackDailyActivity('study', durationMinutes, user.id).catch(err => 
        console.warn('Daily activity tracking failed:', err)
      );
    } catch (error) {
      console.error('❌ Error ending course session:', error);
    }

    setCurrentSession(null);
    setSessionStartTime(null);
  }, [user?.id, currentSession, sessionStartTime, courseId]);

  // Start lesson analytics
  const startLessonAnalytics = useCallback(async (lessonId: number, lessonTitle: string) => {
    if (!user) return;

    const startedAt = new Date();
    const lessonAnalytics: LessonAnalytics = {
      lessonId,
      lessonTitle,
      startedAt,
      timeSpentSeconds: 0,
      engagementScore: 0,
      scrollDepth: 0,
      interactionsCount: 0
    };

    setCurrentLessonAnalytics(lessonAnalytics);

    try {
      await supabase
        .from('interactive_lesson_analytics')
        .insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          started_at: startedAt.toISOString(),
          time_spent_seconds: 0,
          engagement_score: 0,
          scroll_depth_percentage: 0,
          interactions_count: 0
        });

      // Track lesson start event
      await trackAnalyticsEvent('lesson_started', {
        course_id: courseId,
        lesson_id: lessonId,
        lesson_title: lessonTitle
      }, user.id);
    } catch (error) {
      console.error('Error starting lesson analytics:', error);
    }
  }, [user, courseId]);

  // Complete lesson analytics
  const completeLessonAnalytics = useCallback(async (completionMethod: 'manual' | 'automatic' | 'skipped' = 'manual') => {
    if (!user || !currentLessonAnalytics) return;

    const completedAt = new Date();
    const timeSpentSeconds = Math.floor((completedAt.getTime() - currentLessonAnalytics.startedAt.getTime()) / 1000);
    const timeSpentMinutes = Math.floor(timeSpentSeconds / 60);

    try {
      // Update lesson analytics
      await supabase
        .from('interactive_lesson_analytics')
        .update({
          completed_at: completedAt.toISOString(),
          time_spent_seconds: timeSpentSeconds,
          completion_method: completionMethod,
          engagement_score: currentLessonAnalytics.engagementScore,
          scroll_depth_percentage: currentLessonAnalytics.scrollDepth,
          interactions_count: currentLessonAnalytics.interactionsCount
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', currentLessonAnalytics.lessonId)
        .eq('started_at', currentLessonAnalytics.startedAt.toISOString());

      // Track lesson completion event
      await trackAnalyticsEvent('lesson_completed', {
        course_id: courseId,
        lesson_id: currentLessonAnalytics.lessonId,
        lesson_title: currentLessonAnalytics.lessonTitle,
        time_spent_seconds: timeSpentSeconds,
        completion_method: completionMethod,
        engagement_score: currentLessonAnalytics.engagementScore
      }, user.id);

      // Track daily activity
      await trackDailyActivity('study', timeSpentMinutes, user.id);
    } catch (error) {
      console.error('Error completing lesson analytics:', error);
    }

    setCurrentLessonAnalytics(null);
  }, [user, currentLessonAnalytics, courseId]);

  // Track interaction
  const trackInteraction = useCallback((interactionType: string, data: Record<string, unknown>) => {
    if (!currentSession) return;

    const interaction = {
      type: interactionType,
      timestamp: new Date().toISOString(),
      data
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      interactions: [...prev.interactions, interaction]
    } : null);

    // Update lesson analytics if active
    if (currentLessonAnalytics) {
      setCurrentLessonAnalytics(prev => prev ? {
        ...prev,
        interactionsCount: prev.interactionsCount + 1,
        engagementScore: Math.min(100, prev.engagementScore + 2) // Increase engagement
      } : null);
    }
  }, [currentSession, currentLessonAnalytics]);

  // Track scroll depth
  const trackScrollDepth = useCallback((scrollPercentage: number) => {
    if (!currentLessonAnalytics) return;

    setCurrentLessonAnalytics(prev => prev ? {
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, scrollPercentage)
    } : null);
  }, [currentLessonAnalytics]);

  // Enroll in course - with timeout and deduplication
  const enrollInCourse = useCallback(async () => {
    if (!user?.id) return;

    console.log('📝 Enrolling in course:', courseId);

    try {
      // Add timeout protection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      await supabase
        .from('interactive_course_enrollments')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          course_title: courseTitle,
          enrolled_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          completion_percentage: 0,
          total_time_spent_minutes: 0
        }, {
          onConflict: 'user_id,course_id'
        });

      clearTimeout(timeoutId);

      // Track enrollment event (non-blocking)
      trackAnalyticsEvent('course_enrolled', {
        course_id: courseId,
        course_title: courseTitle
      }, user.id).catch(err => console.warn('Enrollment tracking failed:', err));
    } catch (error) {
      console.error('❌ Error enrolling in course:', error);
    }
  }, [user?.id, courseId, courseTitle]);

  // Update course progress
  const updateCourseProgress = useCallback(async (completedLessons: number, totalLessons: number) => {
    if (!user) return;

    const completionPercentage = Math.floor((completedLessons / totalLessons) * 100);
    const isCompleted = completedLessons === totalLessons;

    try {
      const updateData: Record<string, unknown> = {
        completion_percentage: completionPercentage,
        last_accessed_at: new Date().toISOString()
      };

      if (isCompleted) {
        updateData.completed_at = new Date().toISOString();
      }

      await supabase
        .from('interactive_course_enrollments')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      // Track progress update
      await trackAnalyticsEvent('course_progress_updated', {
        course_id: courseId,
        completion_percentage: completionPercentage,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        is_completed: isCompleted
      }, user.id);

      // Track course completion if finished
      if (isCompleted) {
        await trackAnalyticsEvent('course_completed', {
          course_id: courseId,
          course_title: courseTitle
        }, user.id);
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  }, [user, courseId, courseTitle]);

  // Auto-end session on component unmount - fixed cleanup
  useEffect(() => {
    return () => {
      if (currentSession) {
        endCourseSession().catch(err => console.warn('Failed to end session on unmount:', err));
      }
    };
  }, [currentSession, endCourseSession]); // Added dependencies

  // Auto-end session on page visibility change - improved cleanup
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentSession) {
        endCourseSession().catch(err => console.warn('Failed to end session on visibility change:', err));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentSession, endCourseSession]);

  return {
    // Session management
    startCourseSession,
    endCourseSession,
    currentSession,

    // Lesson analytics
    startLessonAnalytics,
    completeLessonAnalytics,
    currentLessonAnalytics,

    // Interaction tracking
    trackInteraction,
    trackScrollDepth,

    // Course management
    enrollInCourse,
    updateCourseProgress
  };
};

// Helper function to track analytics events
const trackAnalyticsEvent = async (eventType: string, metadata: Record<string, unknown>, userId?: string) => {
  if (!userId) return;

  try {
    await supabase
      .from('analytics_metrics')
      .insert({
        user_id: userId,
        metric_name: eventType,
        value: 1,
        metadata: metadata as unknown as Json,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
};