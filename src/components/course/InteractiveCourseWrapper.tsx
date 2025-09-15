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

  // Auto-enroll on mount - optimized
  useEffect(() => {
    if (!courseId || !courseTitle) return;

    // Use requestIdleCallback for better performance
    const enrollWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => enrollInCourse(), { timeout: 2000 });
      } else {
        setTimeout(enrollInCourse, 1000);
      }
    };

    enrollWhenIdle();
  }, [courseId, courseTitle, enrollInCourse]);

  // Start session when component mounts or lesson changes
  useEffect(() => {
    const sessionType = currentLesson === null ? 'overview' : 'lesson';
    startCourseSession(sessionType, currentLesson || undefined);

    return () => {
      endCourseSession();
    };
  }, [currentLesson, startCourseSession, endCourseSession]);

  // Track scroll depth - lightweight and optimized
  useEffect(() => {
    // Skip scroll tracking entirely for better performance
    // This was causing major performance issues during navigation
    return;
  }, []);

  // Track click interactions - disabled for performance
  useEffect(() => {
    // Skip click tracking entirely for better performance
    // This was causing performance issues during navigation
    return;
  }, []);

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
      setTimeout(() => {
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