import React, { useEffect, useRef } from 'react';
import { useSpellingCoursePerformance } from '@/hooks/useSpellingCoursePerformance';
import empoweringSpellingBg from '@/assets/empowering-spelling-new-bg.jpg';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';

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
  const cleanup = useCleanup('SpellingCourseWrapper');

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
      className="spelling-course-wrapper min-h-screen relative" 
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
          backgroundImage: `url(${empoweringSpellingBg})`,
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