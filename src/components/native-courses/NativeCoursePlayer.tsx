import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  Home,
  BookOpen,
  CheckCircle,
  Circle,
  PlayCircle
} from 'lucide-react';
import { 
  useNativeCourse, 
  useCourseModules, 
  useCourseLesson,
  useNativeEnrollments,
  useNativeEnrollmentMutations 
} from '@/hooks/useNativeCourses';
import { NativeLessonRenderer } from './NativeLessonRenderer';
import { toast } from 'sonner';

export default function NativeCoursePlayer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  
  const { data: course } = useNativeCourse(slug!);
  const { data: modules } = useCourseModules(course?.id || '');
  const { data: lesson } = useCourseLesson(currentLessonId || '');
  const { data: enrollments } = useNativeEnrollments();
  const { updateProgress } = useNativeEnrollmentMutations();

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

  // Initialize with first lesson or resume from last position
  useEffect(() => {
    if (!currentLessonId && allLessons.length > 0) {
      const resumeLesson = enrollment?.last_lesson_id 
        ? allLessons.find(l => l.id === enrollment.last_lesson_id)
        : allLessons[0];
      
      if (resumeLesson) {
        setCurrentLessonId(resumeLesson.id);
      }
    }
  }, [allLessons, enrollment, currentLessonId]);

  const handleExit = () => {
    navigate('/dashboard/learner/courses');
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <NativeLessonRenderer lesson={lesson as any} />
        </main>
      </div>
    </div>
  );
}