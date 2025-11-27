/**
 * Analytics Integration Hook with GA4 Support
 * Enhanced version with Google Analytics 4 integration
 */

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { analytics } from '@/utils/analytics';
import { ga4 } from '@/utils/ga4Setup';

interface UseEnhancedAnalyticsProps {
  courseId?: string;
  moduleId?: string;
}

export const useEnhancedAnalytics = ({ courseId, moduleId }: UseEnhancedAnalyticsProps = {}) => {
  const { user } = useAuth();

  // Initialize user tracking
  useEffect(() => {
    if (user?.id) {
      // Standard analytics identification
      analytics.identifyUser(user.id, {
        email: user.email,
        created_at: user.created_at
      });

      // GA4 user properties
      ga4.setUserProperties(user.id, {
        user_type: 'learner',
        registration_date: user.created_at,
        email_domain: user.email?.split('@')[1] || 'unknown'
      });
    }
  }, [user]);

  // Enhanced page tracking
  const trackPageView = useCallback((pageName: string, properties?: Record<string, unknown>) => {
    // Standard analytics
    analytics.trackPageView(pageName, {
      course_id: courseId,
      module_id: moduleId,
      ...properties
    });

    // GA4 page view with course context
    ga4.trackPageView(
      window.location.pathname,
      pageName,
      courseId,
      moduleId
    );
  }, [courseId, moduleId]);

  // Enhanced course enrollment tracking
  const trackCourseEnrollment = useCallback((courseName: string) => {
    if (!courseId) return;

    analytics.sendEvent('course_enrollment', {
      course_id: courseId,
      course_name: courseName,
      user_id: user?.id,
      category: 'course_progress'
    });

    // GA4 enhanced tracking
    ga4.trackCourseEnrollment(courseId, courseName, user?.id);
  }, [courseId, user?.id]);

  // Enhanced module tracking
  const trackModuleViewed = useCallback(() => {
    if (moduleId && courseId) {
      analytics.trackModuleViewed(moduleId, courseId, user?.id);
      
      // Additional GA4 tracking
      ga4.trackCustomEvent('module_view_start', {
        module_id: moduleId,
        course_id: courseId,
        user_id: user?.id,
        timestamp: new Date().toISOString()
      });
    }
  }, [moduleId, courseId, user?.id]);

  // Enhanced media tracking
  const trackMediaInteraction = useCallback((
    action: 'play' | 'pause' | 'seek' | 'speed_change' | 'complete',
    mediaType: 'audio' | 'video',
    currentTime: number,
    duration?: number
  ) => {
    if (moduleId && courseId) {
      // Handle completion separately since it's not in the standard analytics interface
      if (action === 'complete') {
        // Track completion via a separate event
        analytics.sendEvent('media_completed', {
          media_type: mediaType,
          module_id: moduleId,
          course_id: courseId,
          current_time: currentTime,
          duration,
          user_id: user?.id,
          category: 'media_engagement'
        });
        
        // GA4 completion tracking
        const progress = duration ? (currentTime / duration) * 100 : 0;
        ga4.trackMediaEngagement('complete', mediaType, moduleId, courseId, progress, user?.id);
      } else {
        // Standard analytics for other actions
        analytics.trackMediaInteraction(action, mediaType, moduleId, courseId, currentTime, user?.id);
        
        // GA4 enhanced media tracking for play/pause
        if (action === 'play' || action === 'pause') {
          const progress = duration ? (currentTime / duration) * 100 : 0;
          ga4.trackMediaEngagement(action, mediaType, moduleId, courseId, progress, user?.id);
        }
      }
    }
  }, [moduleId, courseId, user?.id]);

  // Enhanced module completion tracking
  const trackModuleCompleted = useCallback((timeSpent: number) => {
    if (moduleId && courseId) {
      // Standard analytics
      analytics.trackModuleCompleted(moduleId, courseId, timeSpent, user?.id);
      
      // GA4 module completion
      ga4.trackModuleCompletion(moduleId, courseId, timeSpent, user?.id);
    }
  }, [moduleId, courseId, user?.id]);

  // Assessment result tracking
  const trackAssessmentResult = useCallback((
    assessmentId: string,
    score: number,
    maxScore: number
  ) => {
    if (!courseId) return;

    // Standard analytics
    analytics.sendEvent('assessment_completed', {
      assessment_id: assessmentId,
      course_id: courseId,
      module_id: moduleId,
      score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
      user_id: user?.id,
      category: 'assessment'
    });

    // GA4 assessment tracking
    ga4.trackAssessmentResult(assessmentId, courseId, score, maxScore, user?.id);
  }, [courseId, moduleId, user?.id]);

  // Study streak tracking
  const trackStudyStreak = useCallback((streakDays: number) => {
    // Standard analytics
    analytics.sendEvent('study_streak_achieved', {
      streak_days: streakDays,
      user_id: user?.id,
      category: 'engagement'
    });

    // GA4 streak tracking
    ga4.trackStudyStreak(streakDays, user?.id);
  }, [user?.id]);

  // Download tracking
  const trackDownload = useCallback((fileName: string, fileType: string) => {
    if (moduleId && courseId) {
      // Standard analytics
      analytics.trackPDFDownloaded(moduleId, courseId, fileName, user?.id);
      
      // GA4 download tracking
      ga4.trackCustomEvent('file_download', {
        file_name: fileName,
        file_type: fileType,
        module_id: moduleId,
        course_id: courseId,
        user_id: user?.id
      });
    }
  }, [moduleId, courseId, user?.id]);

  // Search tracking
  const trackSearch = useCallback((query: string, resultsCount: number) => {
    // Standard analytics
    analytics.sendEvent('search_performed', {
      search_query: query,
      results_count: resultsCount,
      course_id: courseId,
      user_id: user?.id,
      category: 'search'
    });

    // GA4 search tracking
    ga4.trackCustomEvent('search', {
      search_term: query,
      results_count: resultsCount,
      course_context: courseId
    });
  }, [courseId, user?.id]);

  // Auto-track module view on mount
  useEffect(() => {
    if (moduleId && courseId) {
      trackModuleViewed();
    }
  }, [moduleId, courseId, trackModuleViewed]);

  return {
    // Page tracking
    trackPageView,
    
    // Course tracking
    trackCourseEnrollment,
    trackModuleViewed,
    trackModuleCompleted,
    
    // Media tracking
    trackMediaInteraction,
    
    // Assessment tracking
    trackAssessmentResult,
    
    // Engagement tracking
    trackStudyStreak,
    trackDownload,
    trackSearch,
    
    // Access to raw analytics
    analytics,
    ga4
  };
};