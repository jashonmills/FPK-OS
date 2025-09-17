import React, { useEffect, useRef } from 'react';
import { useSpellingCoursePerformance } from '@/hooks/useSpellingCoursePerformance';
import empoweringReadingBg from '@/assets/empowering-reading-bg.jpg';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';

interface ReadingCourseWrapperProps {
  courseId: string;
  courseTitle: string;
  currentLesson: number | null;
  totalLessons: number;
  children: React.ReactNode;
  onProgressUpdate?: (completedLessons: number, totalLessons: number) => void;
}

/**
 * Wrapper for the reading course to provide consistent background
 */
export const ReadingCourseWrapper: React.FC<ReadingCourseWrapperProps> = ({
  courseId,
  courseTitle,
  currentLesson,
  totalLessons,
  children,
  onProgressUpdate
}) => {
  const { forceCleanup, registerCleanup, isSpellingCourse } = useSpellingCoursePerformance(courseId, currentLesson);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cleanup = useCleanup('ReadingCourseWrapper');

  // Check if this is the reading course
  const isReadingCourse = courseId === 'empowering-learning-reading';

  // Minimal analytics - only track basic navigation
  useEffect(() => {
    if (!isReadingCourse) return;

    console.log(`📚 Reading Course: ${currentLesson ? `Lesson ${currentLesson}` : 'Overview'}`);
    
    // Register cleanup for this effect
    registerCleanup(() => {
      console.log('🧹 Cleaning up reading course session');
    });

    // No heavy database operations or complex analytics
    // Just basic logging for debugging
  }, [currentLesson, isReadingCourse, registerCleanup]);

  // Simplified progress tracking - debounced and lightweight
  useEffect(() => {
    if (!onProgressUpdate || !isReadingCourse) return;

    // Simple localStorage-based progress (no database calls)
    const storageKey = `reading-progress-${courseId}`;
    
    try {
      const stored = safeLocalStorage.getItem<string>(storageKey, {
        fallbackValue: '{"completed": []}',
        logErrors: false
      });
      const progress = stored ? JSON.parse(stored) : { completed: [] };
      
      // Very lightweight progress update
      if (currentLesson && !progress.completed.includes(currentLesson)) {
        progress.completed.push(currentLesson);
        safeLocalStorage.setItem(storageKey, JSON.stringify(progress));
        
        // Delayed callback to prevent blocking using cleanup manager
        cleanup.setTimeout(() => {
          onProgressUpdate?.(progress.completed.length, totalLessons);
        }, 100);
      }
    } catch (error) {
      console.warn('Progress tracking error:', error);
    }
  }, [currentLesson, courseId, totalLessons, onProgressUpdate, isReadingCourse]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isReadingCourse) {
        forceCleanup();
      }
    };
  }, [isReadingCourse, forceCleanup]);

  if (!isReadingCourse) {
    // Fall back to regular behavior for other courses
    return <div className="course-wrapper">{children}</div>;
  }

  return (
    <div 
      ref={wrapperRef}
      className="reading-course-wrapper min-h-screen relative" 
      data-course-id={courseId}
      style={{ 
        // Optimize rendering performance
        contain: 'layout style paint',
        willChange: 'auto'
      }}
    >
      {/* Full page background image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${empoweringReadingBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};