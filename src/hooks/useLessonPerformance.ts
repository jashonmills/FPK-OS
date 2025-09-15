import { useEffect, useCallback, useRef } from 'react';
import { lessonPerformanceOptimizer } from '@/utils/lessonPerformanceOptimizer';

/**
 * Hook to monitor and optimize lesson performance
 */
export const useLessonPerformance = (lessonId: string, isActive: boolean = true) => {
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  const renderCountRef = useRef(0);

  // Register lesson for monitoring
  useEffect(() => {
    if (isActive && lessonId) {
      lessonPerformanceOptimizer.registerLesson(lessonId);
      
      return () => {
        lessonPerformanceOptimizer.unregisterLesson(lessonId);
      };
    }
  }, [lessonId, isActive]);

  // Track user activity to detect freezes
  const trackActivity = useCallback(() => {
    if (isActive && lessonId) {
      lessonPerformanceOptimizer.trackActivity(lessonId);
      renderCountRef.current++;
      
      // Reset activity timeout
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      activityTimeoutRef.current = setTimeout(() => {
        // No activity for 30 seconds - might indicate a freeze
        console.warn(`No activity detected in lesson ${lessonId} for 30 seconds`);
      }, 30000);
    }
  }, [lessonId, isActive]);

  // Performance-optimized event handlers
  const createOptimizedHandler = useCallback((handler: Function) => {
    return (...args: any[]) => {
      trackActivity();
      return handler(...args);
    };
  }, [trackActivity]);

  // Listen for lesson performance events
  useEffect(() => {
    const handleFreezeDetection = (event: CustomEvent) => {
      if (event.detail.lessonId === lessonId) {
        console.warn(`Freeze detected in lesson ${lessonId}`);
        // Could trigger UI notification or recovery actions
      }
    };

    const handleMemoryPressure = (event: CustomEvent) => {
      if (event.detail.lessonId === lessonId) {
        console.warn(`Memory pressure in lesson ${lessonId}`);
        // Could reduce visual effects, pause animations, etc.
      }
    };

    const handleThrottleRequest = (event: CustomEvent) => {
      if (event.detail.lessonId === lessonId) {
        console.warn(`Render throttling requested for lesson ${lessonId}`);
        // Could implement render throttling
      }
    };

    window.addEventListener('lesson-freeze-detected', handleFreezeDetection as EventListener);
    window.addEventListener('lesson-memory-pressure', handleMemoryPressure as EventListener);
    window.addEventListener('lesson-throttle-requested', handleThrottleRequest as EventListener);

    return () => {
      window.removeEventListener('lesson-freeze-detected', handleFreezeDetection as EventListener);
      window.removeEventListener('lesson-memory-pressure', handleMemoryPressure as EventListener);
      window.removeEventListener('lesson-throttle-requested', handleThrottleRequest as EventListener);
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [lessonId]);

  return {
    trackActivity,
    createOptimizedHandler,
    renderCount: renderCountRef.current
  };
};