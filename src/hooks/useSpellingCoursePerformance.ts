import { useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight performance hook specifically for the spelling course
 * to prevent browser freezing issues
 */
export const useSpellingCoursePerformance = (courseId: string, lessonId?: number) => {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  const timers = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervals = useRef<Set<NodeJS.Timeout>>(new Set());

  // Safe timer creation with automatic cleanup
  const createTimer = useCallback((callback: () => void, delay: number) => {
    const id = setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.warn('Timer callback error:', error);
      } finally {
        timers.current.delete(id);
      }
    }, delay);
    
    timers.current.add(id);
    return id;
  }, []);

  // Safe interval creation with automatic cleanup
  const createInterval = useCallback((callback: () => void, delay: number) => {
    // Minimum 2 second intervals to prevent browser strain
    const safeDelay = Math.max(delay, 2000);
    
    const id = setInterval(() => {
      try {
        callback();
      } catch (error) {
        console.warn('Interval callback error:', error);
      }
    }, safeDelay);
    
    intervals.current.add(id);
    return id;
  }, []);

  // Register cleanup function
  const registerCleanup = useCallback((cleanupFn: () => void) => {
    cleanupFunctions.current.push(cleanupFn);
  }, []);

  // Force cleanup all resources
  const forceCleanup = useCallback(() => {
    console.log('🧹 Cleaning up spelling course resources');
    
    // Clear all timers
    timers.current.forEach(id => {
      try {
        clearTimeout(id);
      } catch (error) {
        console.warn('Error clearing timer:', error);
      }
    });
    timers.current.clear();

    // Clear all intervals  
    intervals.current.forEach(id => {
      try {
        clearInterval(id);
      } catch (error) {
        console.warn('Error clearing interval:', error);
      }
    });
    intervals.current.clear();

    // Run all registered cleanup functions
    cleanupFunctions.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Error in cleanup function:', error);
      }
    });
    cleanupFunctions.current = [];

    // Force garbage collection if available
    if ('gc' in window && (window as any).gc) {
      try {
        (window as any).gc();
      } catch (error) {
        console.warn('GC not available:', error);
      }
    }
  }, []);

  // Cleanup on unmount or lesson change
  useEffect(() => {
    return () => {
      forceCleanup();
    };
  }, [lessonId, forceCleanup]);

  // Emergency cleanup on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🧹 Page hidden, cleaning up spelling course resources');
        forceCleanup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      forceCleanup();
    };
  }, [forceCleanup]);

  return {
    createTimer,
    createInterval,
    registerCleanup,
    forceCleanup,
    isSpellingCourse: courseId === 'empowering-learning-spelling'
  };
};