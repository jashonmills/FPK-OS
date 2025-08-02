/**
 * Hook for tracking media playback analytics events
 * Tracks play, pause, seek, speed changes, and completion
 */

import { useCallback } from 'react';

interface MediaAnalyticsEvent {
  event: 'play' | 'pause' | 'seek' | 'speed_change' | 'completion' | 'buffer' | 'error';
  mediaId: string;
  currentTime: number;
  duration: number;
  playbackRate?: number;
  seekFrom?: number;
  seekTo?: number;
  errorMessage?: string;
  timestamp: number;
}

interface UseMediaAnalyticsProps {
  mediaId: string;
  courseId?: string;
  moduleId?: string;
}

export const useMediaAnalytics = ({ mediaId, courseId, moduleId }: UseMediaAnalyticsProps) => {
  
  const trackEvent = useCallback((eventData: Omit<MediaAnalyticsEvent, 'mediaId' | 'timestamp'>) => {
    const analyticsEvent: MediaAnalyticsEvent = {
      ...eventData,
      mediaId,
      timestamp: Date.now()
    };

    // Log for debugging
    console.log(`📊 [Analytics] ${eventData.event}:`, {
      mediaId,
      courseId,
      moduleId,
      ...eventData
    });

    // Send to analytics service (could be GA4, Mixpanel, etc.)
    try {
      // If window.gtag exists (Google Analytics)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', `media_${eventData.event}`, {
          media_id: mediaId,
          course_id: courseId,
          module_id: moduleId,
          current_time: eventData.currentTime,
          duration: eventData.duration,
          playback_rate: eventData.playbackRate,
          custom_map: { dimension1: mediaId }
        });
      }

      // If custom analytics function exists
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track(`Media ${eventData.event}`, analyticsEvent);
      }

      // Store in localStorage for offline analytics queue
      const queue = JSON.parse(localStorage.getItem('media-analytics-queue') || '[]');
      queue.push(analyticsEvent);
      
      // Keep only last 100 events
      if (queue.length > 100) {
        queue.splice(0, queue.length - 100);
      }
      
      localStorage.setItem('media-analytics-queue', JSON.stringify(queue));
      
    } catch (error) {
      console.warn('Error tracking analytics event:', error);
    }
  }, [mediaId, courseId, moduleId]);

  const trackPlay = useCallback((currentTime: number, duration: number) => {
    trackEvent({ event: 'play', currentTime, duration });
  }, [trackEvent]);

  const trackPause = useCallback((currentTime: number, duration: number) => {
    trackEvent({ event: 'pause', currentTime, duration });
  }, [trackEvent]);

  const trackSeek = useCallback((seekFrom: number, seekTo: number, duration: number) => {
    trackEvent({ 
      event: 'seek', 
      currentTime: seekTo, 
      duration, 
      seekFrom, 
      seekTo 
    });
  }, [trackEvent]);

  const trackSpeedChange = useCallback((currentTime: number, duration: number, playbackRate: number) => {
    trackEvent({ 
      event: 'speed_change', 
      currentTime, 
      duration, 
      playbackRate 
    });
  }, [trackEvent]);

  const trackCompletion = useCallback((duration: number) => {
    trackEvent({ 
      event: 'completion', 
      currentTime: duration, 
      duration 
    });
  }, [trackEvent]);

  const trackError = useCallback((currentTime: number, duration: number, errorMessage: string) => {
    trackEvent({ 
      event: 'error', 
      currentTime, 
      duration, 
      errorMessage 
    });
  }, [trackEvent]);

  return {
    trackPlay,
    trackPause,
    trackSeek,
    trackSpeedChange,
    trackCompletion,
    trackError
  };
};
