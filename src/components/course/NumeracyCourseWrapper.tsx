import React, { useEffect, useRef } from 'react';
import { useSpellingCoursePerformance } from '@/hooks/useSpellingCoursePerformance';
import empoweringNumeracyBg from '@/assets/empowering-numeracy-bg.jpg';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';

interface NumeracyCourseWrapperProps {
  courseId: string;
  courseTitle: string;
  currentLesson: number | null;
  totalLessons: number;
  children: React.ReactNode;
  onProgressUpdate?: (completedLessons: number, totalLessons: number) => void;
}

/**
 * Wrapper for the numeracy course to provide consistent background
 */
export const NumeracyCourseWrapper: React.FC<NumeracyCourseWrapperProps> = ({
  courseId,
  courseTitle,
  currentLesson,
  totalLessons,
  children,
  onProgressUpdate
}) => {
  const { forceCleanup, registerCleanup, isSpellingCourse } = useSpellingCoursePerformance(courseId, currentLesson);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cleanup = useCleanup('NumeracyCourseWrapper');

  // Check if this is the numeracy course
  const isNumeracyCourse = courseId === 'empowering-learning-numeracy';

  // Minimal analytics - only track basic navigation
  useEffect(() => {
    if (!isNumeracyCourse) return;

    console.log(`📊 Numeracy Course: ${currentLesson ? `Lesson ${currentLesson}` : 'Overview'}`);
    
    // Register cleanup for this effect
    registerCleanup(() => {
      console.log('🧹 Cleaning up numeracy course session');
    });

    // No heavy database operations or complex analytics
    // Just basic logging for debugging
  }, [currentLesson, isNumeracyCourse, registerCleanup]);

  // Simplified progress tracking - debounced and lightweight
  useEffect(() => {
    if (!onProgressUpdate || !isNumeracyCourse) return;

    // Simple localStorage-based progress (no database calls)
    const storageKey = `numeracy-progress-${courseId}`;
    
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
  }, [currentLesson, courseId, totalLessons, onProgressUpdate, isNumeracyCourse]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isNumeracyCourse) {
        forceCleanup();
      }
    };
  }, [isNumeracyCourse, forceCleanup]);

  if (!isNumeracyCourse) {
    // Fall back to regular behavior for other courses
    return <div className="course-wrapper">{children}</div>;
  }

  return (
    <div 
      ref={wrapperRef}
      className="numeracy-course-wrapper min-h-screen relative" 
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
          backgroundImage: `url(${empoweringNumeracyBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Background overlay - reduces visual complexity */}
      <div className="background-image-overlay fixed inset-0" style={{ zIndex: 1 }} />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};