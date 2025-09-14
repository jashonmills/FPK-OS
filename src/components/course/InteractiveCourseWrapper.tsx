import React, { useEffect, useRef } from 'react';
import { useInteractiveCourseAnalytics } from '@/hooks/useInteractiveCourseAnalytics';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { memoryManager } from '@/utils/memoryManager';

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

  // Auto-enroll on mount - debounced
  useEffect(() => {
    if (!courseId || !courseTitle) return;

    const timeoutId = setTimeout(() => {
      enrollInCourse();
    }, 1000); // Reduced from 2000ms

    return () => clearTimeout(timeoutId);
  }, [courseId, courseTitle, enrollInCourse]);

  // Start session when component mounts or lesson changes
  useEffect(() => {
    const sessionType = currentLesson === null ? 'overview' : 'lesson';
    startCourseSession(sessionType, currentLesson || undefined);

    return () => {
      endCourseSession();
    };
  }, [currentLesson, startCourseSession, endCourseSession]);

  // Track scroll depth - improved cleanup and throttling
  useEffect(() => {
    let cleanupFn: (() => void) | null = null;
    
    // Delay setting up scroll listeners to prevent blocking initial render
    const setupTimeoutId = setTimeout(() => {
      const handleScroll = () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          try {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const scrollPercentage = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;

            // Only track significant scroll changes
            if (Math.abs(scrollPercentage - lastScrollPercentage.current) >= 15) { // Increased threshold
              trackScrollDepth(scrollPercentage);
              lastScrollPercentage.current = scrollPercentage;
            }
          } catch (err) {
            console.warn('Error tracking scroll depth:', err);
          }
        }, 1000); // Increased debounce time
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      cleanupFn = () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, 1500); // Reduced delay

    return () => {
      clearTimeout(setupTimeoutId);
      if (cleanupFn) cleanupFn();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [trackScrollDepth]);

  // Track click interactions - delayed setup and improved error handling
  useEffect(() => {
    let cleanupFn: (() => void) | null = null;
    
    // Delay setting up click listeners to prevent blocking initial render
    const setupTimeoutId = setTimeout(() => {
      const handleClick = (event: MouseEvent) => {
        try {
          const target = event.target as HTMLElement;
          
          // Track meaningful interactions only
          if (target.tagName === 'BUTTON' || 
              target.closest('button') ||
              target.classList.contains('interactive')) {
            
            trackInteraction('click', {
              element: target.tagName,
              className: target.className?.slice(0, 50), // Limit className length
              textContent: target.textContent?.slice(0, 30), // Reduced text content
              timestamp: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn('Error tracking click interaction:', err);
        }
      };

      document.addEventListener('click', handleClick, { passive: true });
      cleanupFn = () => {
        document.removeEventListener('click', handleClick);
      };
    }, 2000); // Reduced delay

    return () => {
      clearTimeout(setupTimeoutId);
      if (cleanupFn) cleanupFn();
    };
  }, [trackInteraction]);

  // Update progress when completed lessons change
  useEffect(() => {
    const completedCount = completedLessons.size;
    updateCourseProgress(completedCount, totalLessons);
    onProgressUpdate?.(completedCount, totalLessons);

    // Monitor memory usage in course context
    if (memoryManager.isMemoryHigh()) {
      console.warn('High memory usage detected in course wrapper');
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
    <div className="interactive-course-wrapper" data-course-id={courseId}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...analyticsContext });
        }
        return child;
      })}
    </div>
  );
};