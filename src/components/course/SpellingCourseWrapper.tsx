import React, { useEffect, useRef } from 'react';
import { useSpellingCoursePerformance } from '@/hooks/useSpellingCoursePerformance';

interface SpellingCourseWrapperProps {
  courseId: string;
  courseTitle: string;
  currentLesson: number | null;
  totalLessons: number;
  children: React.ReactNode;
  onProgressUpdate?: (completedLessons: number, totalLessons: number) => void;
}

/**
 * Lightweight wrapper specifically for the spelling course to prevent freezing
 */
export const SpellingCourseWrapper: React.FC<SpellingCourseWrapperProps> = ({
  courseId,
  courseTitle,
  currentLesson,
  totalLessons,
  children,
  onProgressUpdate
}) => {
  const { forceCleanup, registerCleanup, isSpellingCourse } = useSpellingCoursePerformance(courseId, currentLesson);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Minimal analytics - only track basic navigation
  useEffect(() => {
    if (!isSpellingCourse) return;

    console.log(`📖 Spelling Course: ${currentLesson ? `Lesson ${currentLesson}` : 'Overview'}`);
    
    // Register cleanup for this effect
    registerCleanup(() => {
      console.log('🧹 Cleaning up spelling course session');
    });

    // No heavy database operations or complex analytics
    // Just basic logging for debugging
  }, [currentLesson, isSpellingCourse, registerCleanup]);

  // Simplified progress tracking - debounced and lightweight
  useEffect(() => {
    if (!onProgressUpdate || !isSpellingCourse) return;

    // Simple localStorage-based progress (no database calls)
    const storageKey = `spelling-progress-${courseId}`;
    
    try {
      const stored = localStorage.getItem(storageKey);
      const progress = stored ? JSON.parse(stored) : { completed: [] };
      
      // Very lightweight progress update
      if (currentLesson && !progress.completed.includes(currentLesson)) {
        progress.completed.push(currentLesson);
        localStorage.setItem(storageKey, JSON.stringify(progress));
        
        // Delayed callback to prevent blocking
        setTimeout(() => {
          onProgressUpdate?.(progress.completed.length, totalLessons);
        }, 100);
      }
    } catch (error) {
      console.warn('Progress tracking error:', error);
    }
  }, [currentLesson, courseId, totalLessons, onProgressUpdate, isSpellingCourse]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSpellingCourse) {
        forceCleanup();
      }
    };
  }, [isSpellingCourse, forceCleanup]);

  if (!isSpellingCourse) {
    // Fall back to regular behavior for other courses
    return <div className="course-wrapper">{children}</div>;
  }

  return (
    <div 
      ref={wrapperRef}
      className="spelling-course-wrapper" 
      data-course-id={courseId}
      style={{ 
        // Optimize rendering performance
        contain: 'layout style paint',
        willChange: 'auto'
      }}
    >
      {children}
    </div>
  );
};