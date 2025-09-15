import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';
import { useSpellingCoursePerformance } from '@/hooks/useSpellingCoursePerformance';

interface SpellingLessonWrapperProps {
  courseId: string;
  lessonId: number;
  lessonTitle: string;
  children: React.ReactNode;
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  totalLessons?: number;
}

/**
 * Lightweight lesson wrapper for spelling course to prevent freezing
 */
export const SpellingLessonWrapper: React.FC<SpellingLessonWrapperProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  children,
  onComplete,
  onNext,
  hasNext,
  totalLessons = 11
}) => {
  const { createTimer, registerCleanup, isSpellingCourse } = useSpellingCoursePerformance(courseId, lessonId);
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const lessonContentRef = useRef<HTMLDivElement>(null);

  // Simplified time tracking - update every 10 seconds instead of every second
  const updateTimeSpent = useCallback(() => {
    if (!isSpellingCourse) return;
    
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setTimeSpent(elapsed);
  }, [isSpellingCourse]);

  // Create timer for time updates (less frequent to prevent performance issues)
  React.useEffect(() => {
    if (!isSpellingCourse) return;

    // Update time every 10 seconds instead of every second
    const timerId = createTimer(() => {
      updateTimeSpent();
      
      // Schedule next update
      const nextUpdate = createTimer(updateTimeSpent, 10000);
      registerCleanup(() => clearTimeout(nextUpdate));
    }, 10000);

    registerCleanup(() => clearTimeout(timerId));
  }, [isSpellingCourse, createTimer, registerCleanup, updateTimeSpent]);

  // Handle lesson completion - simplified
  const handleComplete = useCallback(() => {
    if (isCompleted) return;

    setIsCompleted(true);
    updateTimeSpent();
    
    console.log(`✅ Spelling Lesson ${lessonId} completed`);
    
    // Simple localStorage tracking instead of heavy database operations
    try {
      const storageKey = `spelling-lesson-${courseId}-${lessonId}`;
      localStorage.setItem(storageKey, JSON.stringify({
        completed: true,
        timeSpent,
        completedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save lesson completion:', error);
    }

    // Call parent completion handler with delay to prevent blocking
    createTimer(() => {
      onComplete?.();
    }, 100);
  }, [isCompleted, lessonId, courseId, timeSpent, onComplete, createTimer, updateTimeSpent]);

  // Format time display - memoized
  const formatTime = useMemo(() => {
    const minutes = Math.floor(timeSpent / 60);
    const remainingSeconds = timeSpent % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [timeSpent]);

  // Enhanced children - simplified for performance
  const enhancedChildren = useMemo(() => {
    if (!React.isValidElement(children)) return children;
    
    // Minimal props to prevent performance issues
    return React.cloneElement(children as React.ReactElement<any>, {
      onComplete: handleComplete,
      onNext,
      hasNext,
      isCompleted,
      lessonId,
      lessonTitle
    });
  }, [children, handleComplete, onNext, hasNext, isCompleted, lessonId, lessonTitle]);

  if (!isSpellingCourse) {
    // Fall back to basic wrapper for other courses
    return <div className="lesson-wrapper">{children}</div>;
  }

  return (
    <div className="spelling-lesson-wrapper" data-lesson-id={lessonId}>
      {/* Simplified Lesson Progress Header */}
      <Card className="mb-6 bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">Lesson {lessonId}: {lessonTitle}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime}
                  </span>
                </div>
              </div>
            </div>
            {isCompleted && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <div 
        ref={lessonContentRef} 
        className="spelling-lesson-content"
        style={{ 
          // Optimize rendering performance
          contain: 'layout style',
          willChange: 'auto'
        }}
      >
        {enhancedChildren}
      </div>

      {/* Lesson Completion Footer */}
      {!isCompleted && (
        <Card className="mt-8 border-2 border-dashed border-primary/30">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ready to Continue?</h3>
              <p className="text-muted-foreground">
                Complete this lesson to track your progress and unlock the next lesson.
              </p>
              <Button 
                onClick={handleComplete} 
                size="lg"
              >
                Complete Lesson {lessonId}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Lesson Button */}
      {isCompleted && hasNext && onNext && (
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold text-green-700">
                Lesson Completed! 🎉
              </h3>
              <p className="text-muted-foreground">
                Great job! You've mastered the concepts in this lesson.
              </p>
              <Button 
                onClick={onNext} 
                size="lg"
              >
                Continue to Next Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};