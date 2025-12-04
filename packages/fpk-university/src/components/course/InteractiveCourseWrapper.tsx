import React, { useEffect, useRef } from 'react';
import { useInteractiveCourseAnalytics } from '@/hooks/useInteractiveCourseAnalytics';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { timeoutManager } from '@/utils/performanceOptimizer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CourseAIStudyCoach } from '@/components/course/CourseAIStudyCoach';
import { useCleanup } from '@/utils/cleanupManager';

interface InteractiveCourseWrapperProps {
  courseId: string;
  courseTitle: string;
  currentLesson: number | null;
  totalLessons: number;
  children: React.ReactNode;
  onProgressUpdate?: (completedLessons: number, totalLessons: number) => void;
}

export const InteractiveCourseWrapper: React.FC<InteractiveCourseWrapperProps> = ({
  courseId,
  courseTitle,
  currentLesson,
  totalLessons,
  children,
  onProgressUpdate
}) => {
  const cleanup = useCleanup('InteractiveCourseWrapper');
  const {
    startCourseSession,
    endCourseSession,
    trackScrollDepth,
    trackInteraction,
    enrollInCourse,
    updateCourseProgress
  } = useInteractiveCourseAnalytics(courseId, courseTitle);

  const {
    completedLessons,
    saveLessonCompletion,
    loadProgressData
  } = useInteractiveCourseProgress(courseId);

  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollPercentage = useRef(0);

  // Auto-enroll on mount - optimized
  useEffect(() => {
    if (!courseId || !courseTitle) return;

    // Use requestIdleCallback for better performance
    const enrollWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          enrollInCourse();
          startCourseSession('overview'); // Start session tracking
        }, { timeout: 2000 });
      } else {
        cleanup.setTimeout(() => {
          enrollInCourse();
          startCourseSession('overview'); // Start session tracking
        }, 1000);
      }
    };

    enrollWhenIdle();
  }, [courseId, courseTitle, enrollInCourse, startCourseSession]);

  // Cleanup on unmount - enhanced with error handling
  useEffect(() => {
    return () => {
      try {
        endCourseSession();
        // Cleanup all timeouts and intervals
        timeoutManager.cleanup();
      } catch (err) {
        console.warn('Error during course cleanup:', err);
      }
    };
  }, [endCourseSession]);

  // Track scroll depth - optimized with throttling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isThrottled = false;

    const handleScroll = () => {
      if (isThrottled) return;
      
      isThrottled = true;
      cleanup.setTimeout(() => {
        isThrottled = false;
      }, 1000); // Throttle to once per second

      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (Math.abs(scrollPercentage - lastScrollPercentage.current) >= 10) {
        lastScrollPercentage.current = scrollPercentage;
        trackScrollDepth(scrollPercentage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [trackScrollDepth]);

  // Track click interactions - optimized with throttling
  useEffect(() => {
    let isThrottled = false;

    const handleClick = (e: MouseEvent) => {
      if (isThrottled) return;
      
      isThrottled = true;
      cleanup.setTimeout(() => {
        isThrottled = false;
      }, 2000); // Throttle to once per 2 seconds

      const target = e.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementClass = target.className;

      // Only track meaningful interactions
      if (['button', 'a', 'input', 'select', 'textarea'].includes(elementType) || 
          elementClass.includes('interactive')) {
        trackInteraction('click', {
          element_type: elementType,
          element_class: elementClass,
          timestamp: new Date().toISOString()
        });
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [trackInteraction]);

  // Update progress when completed lessons change - optimized
  useEffect(() => {
    const completedCount = completedLessons.size;
    
    // Use requestIdleCallback for progress updates to avoid blocking UI
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        updateCourseProgress(completedCount, totalLessons);
        onProgressUpdate?.(completedCount, totalLessons);
      }, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      cleanup.setTimeout(() => {
        updateCourseProgress(completedCount, totalLessons);
        onProgressUpdate?.(completedCount, totalLessons);
      }, 0);
    }
  }, [completedLessons, totalLessons, updateCourseProgress, onProgressUpdate]);

  // Provide analytics context to children
  const analyticsContext = {
    courseId,
    courseTitle,
    currentLesson,
    totalLessons,
    completedLessons,
    trackInteraction,
    saveLessonCompletion,
    loadProgressData
  };

  return (
    <ErrorBoundary
      onError={(error) => console.error('Course wrapper error:', error)}
      fallback={
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load course content. Please refresh the page.</p>
        </div>
      }
    >
      <div className="interactive-course-wrapper" data-course-id={courseId}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...analyticsContext });
          }
          return child;
        })}
        
        {/* Course-level AI Study Coach */}
        <CourseAIStudyCoach 
          courseId={courseId}
          courseTitle={courseTitle}
          className="z-40"
        />
      </div>
    </ErrorBoundary>
  );
};