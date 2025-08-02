/**
 * Analytics Hook for React Components
 * Provides easy-to-use analytics tracking for course interactions
 */

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { analytics } from '@/utils/analytics';

interface UseAnalyticsProps {
  courseId?: string;
  moduleId?: string;
}

export const useAnalytics = ({ courseId, moduleId }: UseAnalyticsProps = {}) => {
  const { user } = useAuth();

  // Identify user when available
  useEffect(() => {
    if (user?.id) {
      analytics.identifyUser(user.id, {
        email: user.email,
        created_at: user.created_at
      });
    }
  }, [user]);

  // Track page views
  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    analytics.trackPageView(pageName, {
      course_id: courseId,
      module_id: moduleId,
      ...properties
    });
  }, [courseId, moduleId]);

  // Course-specific tracking methods
  const trackModuleViewed = useCallback(() => {
    if (moduleId && courseId) {
      analytics.trackModuleViewed(moduleId, courseId, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  const trackAudioPlayed = useCallback((duration: number) => {
    if (moduleId && courseId) {
      analytics.trackAudioPlayed(moduleId, courseId, duration, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  const trackVideoPlayed = useCallback((duration: number) => {
    if (moduleId && courseId) {
      analytics.trackVideoPlayed(moduleId, courseId, duration, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  const trackPDFDownloaded = useCallback((fileName: string) => {
    if (moduleId && courseId) {
      analytics.trackPDFDownloaded(moduleId, courseId, fileName, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  const trackModuleCompleted = useCallback((timeSpent: number) => {
    if (moduleId && courseId) {
      analytics.trackModuleCompleted(moduleId, courseId, timeSpent, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  const trackCourseProgress = useCallback((percentage: number) => {
    if (courseId) {
      analytics.trackCourseProgress(courseId, percentage, user?.id);
    }
  }, [courseId, user?.id]);

  const trackMediaInteraction = useCallback((
    action: 'play' | 'pause' | 'seek' | 'speed_change',
    mediaType: 'audio' | 'video',
    currentTime: number
  ) => {
    if (moduleId && courseId) {
      analytics.trackMediaInteraction(action, mediaType, moduleId, courseId, currentTime, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  // Auto-track module view on mount
  useEffect(() => {
    if (moduleId && courseId) {
      trackModuleViewed();
    }
  }, [moduleId, courseId, trackModuleViewed]);

  return {
    trackPageView,
    trackModuleViewed,
    trackAudioPlayed,
    trackVideoPlayed,
    trackPDFDownloaded,
    trackModuleCompleted,
    trackCourseProgress,
    trackMediaInteraction,
    analytics
  };
};