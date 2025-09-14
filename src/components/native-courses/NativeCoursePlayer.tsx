import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { 
  useNativeCourse, 
  useCourseModules, 
  useCourseLesson,
  useNativeEnrollments,
  useNativeEnrollmentMutations 
} from '@/hooks/useNativeCourses';
import { NativeLessonRenderer } from './NativeLessonRenderer';
import { NativeCourseProgressSidebar } from './NativeCourseProgressSidebar';
import { useUnifiedProgressTracking } from '@/hooks/useUnifiedProgressTracking';
import { toast } from 'sonner';

export default function NativeCoursePlayer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { data: course } = useNativeCourse(slug!);
  const { data: modules } = useCourseModules(course?.id || '');
  const { data: lesson } = useCourseLesson(currentLessonId || '');
  const { data: enrollments } = useNativeEnrollments();
  const { updateProgress } = useNativeEnrollmentMutations();

  // Unified progress tracking
  const {
    trackInteraction,
    trackLessonCompletion,
    trackCourseCompletion,
    totalTimeSpent,
    sessionActive
  } = useUnifiedProgressTracking(
    course?.id || '',
    course?.title || '',
    currentLessonId || undefined,
    lesson?.title || undefined
  );

  // Find current enrollment
  const enrollment = enrollments?.find(e => e.course_id === course?.id);
  
  // Get all lessons in order
  const allLessons = modules?.flatMap(module => 
    module.course_lessons?.map(lesson => ({
      ...lesson,
      module_title: module.title
    })) || []
  ) || [];

  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const hasQuiz = lesson?.lesson_blocks?.some(block => block.type === 'quiz') || false;
  const canGoPrevious = currentLessonIndex > 0;
  const canGoNext = currentLessonIndex < allLessons.length - 1;
  const isLastLesson = currentLessonIndex === allLessons.length - 1;

  // Initialize with first lesson or resume from last position
  useEffect(() => {
    if (!currentLessonId && allLessons.length > 0) {
      const resumeLesson = enrollment?.last_lesson_id 
        ? allLessons.find(l => l.id === enrollment.last_lesson_id)
        : allLessons[0];
      
      if (resumeLesson) {
        setCurrentLessonId(resumeLesson.id);
        trackInteraction('course_resumed', {
          resumedLessonId: resumeLesson.id,
          resumedLessonTitle: resumeLesson.title
        });
      }
    }
  }, [allLessons, enrollment, currentLessonId, trackInteraction]);

  const handleExit = () => {
    navigate('/dashboard/learner/courses');
  };

  const handlePreviousLesson = () => {
    if (canGoPrevious) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setCurrentLessonId(prevLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (canGoNext) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      trackInteraction('lesson_navigation', {
        action: 'next',
        fromLessonId: currentLessonId,
        toLessonId: nextLesson.id
      });
    }
  };

  const handleCompleteLesson = async () => {
    if (!enrollment || !currentLessonId || !lesson) return;
    
    try {
      // Track lesson completion with unified system
      await trackLessonCompletion(currentLessonId, lesson.title);
      
      // Update native enrollment progress
      const newProgress = Math.round(((currentLessonIndex + 1) / allLessons.length) * 100);
      
      await updateProgress.mutateAsync({
        enrollmentId: enrollment.id,
        progressPct: newProgress,
        lastLessonId: currentLessonId
      });
      
      // Check if course is complete
      if (isLastLesson) {
        await trackCourseCompletion();
      }
      
      // Auto-advance to next lesson if not the last
      if (!isLastLesson) {
        setTimeout(() => {
          handleNextLesson();
        }, 1000);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    trackInteraction('lesson_selected', {
      lessonId,
      lessonTitle: allLessons.find(l => l.id === lessonId)?.title
    });
  };

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = enrollment?.progress_pct || 0;

  const isLessonCompleted = (currentLessonIndex + 1) <= Math.floor((enrollment?.progress_pct || 0) * allLessons.length / 100);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <NativeCourseProgressSidebar
          modules={modules || []}
          currentLessonId={currentLessonId}
          enrollment={enrollment}
          onLessonSelect={handleLessonSelect}
          className="h-screen"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleExit}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Exit Course
                </Button>
                <div>
                  <h1 className="font-semibold text-lg">{course.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Lesson {currentLessonIndex + 1} of {allLessons.length}: {lesson.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Lesson Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div onClick={() => trackInteraction('lesson_content_interaction')}>
            <NativeLessonRenderer lesson={lesson as any} />
          </div>
        </main>

        {/* Navigation Footer */}
        <footer className="border-t bg-card p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousLesson}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              {!isLessonCompleted && (
                <Button onClick={handleCompleteLesson} className="fpk-gradient">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Lesson
                </Button>
              )}
              
              {isLessonCompleted && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            <Button 
              onClick={handleNextLesson}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}