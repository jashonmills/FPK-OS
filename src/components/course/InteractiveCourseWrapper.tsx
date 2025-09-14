import React, { useEffect, useRef } from 'react';
import { useInteractiveCourseAnalytics } from '@/hooks/useInteractiveCourseAnalytics';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';

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
    if (courseId && courseTitle) {
      const timeoutId = setTimeout(() => {
        enrollInCourse();
      }, 2000); // Delay enrollment to prevent blocking other operations

      return () => clearTimeout(timeoutId);
    }
  }, [courseId, courseTitle]); // Fixed dependency

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
            if (Math.abs(scrollPercentage - lastScrollPercentage.current) >= 10) {
              trackScrollDepth(scrollPercentage);
              lastScrollPercentage.current = scrollPercentage;
            }
          } catch (err) {
            console.warn('Error tracking scroll depth:', err);
          }
        }, 500);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, 3000); // Delay scroll listener setup

    return () => {
      clearTimeout(setupTimeoutId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [trackScrollDepth]);

  // Track click interactions - delayed setup and improved error handling
  useEffect(() => {
    // Delay setting up click listeners to prevent blocking initial render
    const setupTimeoutId = setTimeout(() => {
      const handleClick = (event: MouseEvent) => {
        try {
          const target = event.target as HTMLElement;
          
          // Track meaningful interactions
          if (target.tagName === 'BUTTON' || 
              target.closest('button') ||
              target.classList.contains('interactive') ||
              target.closest('.interactive')) {
            
            trackInteraction('click', {
              element: target.tagName,
              className: target.className,
              textContent: target.textContent?.slice(0, 50),
              timestamp: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn('Error tracking click interaction:', err);
        }
      };

      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, 4000); // Delay click listener setup

    return () => clearTimeout(setupTimeoutId);
  }, [trackInteraction]);

  // Update progress when completed lessons change
  useEffect(() => {
    const completedCount = completedLessons.size;
    updateCourseProgress(completedCount, totalLessons);
    onProgressUpdate?.(completedCount, totalLessons);
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