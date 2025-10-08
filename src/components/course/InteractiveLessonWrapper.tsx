import React, { useEffect, useRef, useState } from 'react';
import { useInteractiveCourseAnalytics } from '@/hooks/useInteractiveCourseAnalytics';
import { useLessonEngagement } from '@/hooks/useLessonEngagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { useCleanup } from '@/utils/cleanupManager';

interface InteractiveLessonWrapperProps {
  courseId: string;
  lessonId: number;
  lessonTitle: string;
  children: React.ReactNode;
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  totalLessons?: number;
  suppressWrapperCompletion?: boolean; // Hide wrapper completion UI for micro-lessons
}

export const InteractiveLessonWrapper: React.FC<InteractiveLessonWrapperProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  children,
  onComplete,
  onNext,
  hasNext,
  totalLessons = 8,
  suppressWrapperCompletion = false
}) => {
  const cleanup = useCleanup('interactive-lesson-wrapper');
  const {
    startLessonAnalytics,
    completeLessonAnalytics,
    trackInteraction,
    currentLessonAnalytics
  } = useInteractiveCourseAnalytics(courseId, lessonTitle);

  const {
    metrics,
    trackInteraction: trackEngagement,
    saveAnalytics
  } = useLessonEngagement(courseId, lessonId, lessonTitle);

  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const lessonContentRef = useRef<HTMLDivElement>(null);

  // Start lesson analytics on mount
  useEffect(() => {
    startLessonAnalytics(lessonId, lessonTitle);
    startTimeRef.current = new Date();

    // Start timer for time tracking using cleanupManager
    cleanup.setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        setTimeSpent(elapsed);
      }
    }, 1000);
  }, [lessonId, lessonTitle]);

  // Handle lesson completion
  const handleComplete = async () => {
    if (isCompleted) return;

    setIsCompleted(true);
    
    // Track completion
    await completeLessonAnalytics('manual');
    await saveAnalytics('completed');
    
    // Track interaction
    trackInteraction('lesson_complete', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      time_spent_seconds: timeSpent,
      completion_method: 'manual',
      engagement_score: metrics.engagementScore
    });

    // Call parent completion handler
    onComplete?.();
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Enhanced children with analytics context
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        onComplete: handleComplete,
        onNext,
        hasNext,
        isCompleted,
        trackInteraction: (type: string, details?: any) => {
          trackInteraction(type, details);
          trackEngagement(type, details);
        },
        lessonId,
        lessonTitle
      });
    }
    return child;
  });

  return (
    <div className="interactive-lesson-wrapper" data-lesson-id={lessonId}>
      {/* Lesson Progress Header */}
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
                <div className="flex items-center space-x-4 text-sm text-white font-medium">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(timeSpent)}
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Engagement: {metrics.engagementScore}%
                    {metrics.interactionCount > 0 && ` • ${metrics.interactionCount} interactions`}
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

      {/* TTS Controls */}
      <div className="mb-6">
        <LessonTTSControls
          lessonTitle={lessonTitle}
          lessonNumber={lessonId}
          totalLessons={totalLessons}
          contentRef={lessonContentRef}
        />
      </div>

      {/* Lesson Content */}
      <div ref={lessonContentRef} className="interactive-lesson-content">
        {enhancedChildren}
      </div>

      {/* Lesson Completion Footer - Only show for non-micro-lessons */}
      {!suppressWrapperCompletion && !isCompleted && (
        <Card className="mt-8 border-2 border-dashed border-primary/30">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ready to Continue?</h3>
              <p className="text-white font-medium">
                Complete this lesson to track your progress and unlock the next lesson.
              </p>
              <Button 
                onClick={handleComplete} 
                size="lg"
                className="interactive"
              >
                Complete Lesson {lessonId}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Lesson Button - Only show for non-micro-lessons */}
      {!suppressWrapperCompletion && isCompleted && hasNext && onNext && (
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold text-green-700">
                Lesson Completed! 🎉
              </h3>
              <p className="text-white font-medium">
                Great job! You've mastered the concepts in this lesson.
              </p>
              <Button 
                onClick={onNext} 
                size="lg"
                className="interactive"
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