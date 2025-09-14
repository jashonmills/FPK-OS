import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CourseEnrollment {
  id: string;
  course_id: string;
  course_title: string;
  enrolled_at: string;
  last_accessed_at: string;
  completion_percentage: number;
  completed_at?: string;
  total_time_spent_minutes: number;
}

interface LessonProgress {
  lesson_id: number;
  lesson_title: string;
  completed_at?: string;
  time_spent_seconds: number;
  engagement_score: number;
}

interface CourseProgressData {
  enrollment: CourseEnrollment | null;
  lessonProgress: LessonProgress[];
  completedLessons: Set<number>;
  totalTimeSpent: number;
  averageEngagement: number;
  learningVelocity: number;
}

export const useInteractiveCourseProgress = (courseId: string) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<CourseProgressData>({
    enrollment: null,
    lessonProgress: [],
    completedLessons: new Set(),
    totalTimeSpent: 0,
    averageEngagement: 0,
    learningVelocity: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load course progress data - fixed dependencies to prevent infinite loop
  const loadProgressData = useCallback(async () => {
    if (!user?.id || !courseId) return;

    console.log('🔄 Loading course progress data for:', courseId);
    setIsLoading(true);
    setError(null);

    try {
      // Load enrollment data
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('interactive_course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;

      // Load lesson progress data
      const { data: lessonData, error: lessonError } = await supabase
        .from('interactive_lesson_analytics')
        .select('lesson_id, lesson_title, completed_at, time_spent_seconds, engagement_score')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .order('lesson_id');

      if (lessonError) throw lessonError;

      // Process lesson progress
      const completedLessons = new Set<number>();
      let totalTimeSpent = 0;
      let totalEngagement = 0;
      let completedCount = 0;

      (lessonData || []).forEach(lesson => {
        if (lesson.completed_at) {
          completedLessons.add(lesson.lesson_id);
          completedCount++;
        }
        totalTimeSpent += lesson.time_spent_seconds || 0;
        totalEngagement += lesson.engagement_score || 0;
      });

      const averageEngagement = lessonData?.length ? totalEngagement / lessonData.length : 0;
      const totalTimeHours = totalTimeSpent / 3600;
      const learningVelocity = totalTimeHours > 0 ? completedCount / totalTimeHours : 0;

      console.log('✅ Course progress loaded:', { completedLessons: completedLessons.size, totalTimeSpent });

      setProgressData({
        enrollment: enrollment as CourseEnrollment,
        lessonProgress: (lessonData || []) as LessonProgress[],
        completedLessons,
        totalTimeSpent: Math.floor(totalTimeSpent / 60), // Convert to minutes
        averageEngagement: Math.round(averageEngagement),
        learningVelocity: Math.round(learningVelocity * 100) / 100 // Round to 2 decimals
      });
    } catch (err) {
      setError('Failed to load course progress');
      console.error('❌ Error loading course progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, courseId]); // Fixed: removed user object, only use user.id

  // Save lesson completion - debounced to prevent rapid calls
  const saveLessonCompletion = useCallback(async (lessonId: number, lessonTitle: string) => {
    if (!user?.id) return;

    console.log('💾 Saving lesson completion:', lessonId, lessonTitle);

    try {
      // Update or insert lesson completion
      const { error } = await supabase
        .from('interactive_lesson_analytics')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          completed_at: new Date().toISOString(),
          started_at: new Date().toISOString() // Will be overridden if record exists
        }, {
          onConflict: 'user_id,course_id,lesson_id,started_at',
          ignoreDuplicates: false
        });

      if (error) throw error;

      // Debounced reload to prevent rapid successive calls
      setTimeout(() => {
        loadProgressData();
      }, 500);
    } catch (err) {
      console.error('❌ Error saving lesson completion:', err);
    }
  }, [user?.id, courseId, loadProgressData]);

  // Get lesson completion status
  const isLessonCompleted = useCallback((lessonId: number) => {
    return progressData.completedLessons.has(lessonId);
  }, [progressData.completedLessons]);

  // Get lesson progress data
  const getLessonProgress = useCallback((lessonId: number) => {
    return progressData.lessonProgress.find(p => p.lesson_id === lessonId);
  }, [progressData.lessonProgress]);

  // Calculate overall progress percentage
  const calculateProgress = useCallback((totalLessons: number) => {
    return totalLessons > 0 ? Math.floor((progressData.completedLessons.size / totalLessons) * 100) : 0;
  }, [progressData.completedLessons]);

  // Get next recommended lesson
  const getNextLesson = useCallback((totalLessons: number) => {
    for (let i = 1; i <= totalLessons; i++) {
      if (!progressData.completedLessons.has(i)) {
        return i;
      }
    }
    return null; // All lessons completed
  }, [progressData.completedLessons]);

  // Get learning statistics
  const getLearningStats = useCallback(() => {
    const completedCount = progressData.completedLessons.size;
    const averageTimePerLesson = completedCount > 0 ? 
      Math.round(progressData.totalTimeSpent / completedCount) : 0;

    return {
      completedLessons: completedCount,
      totalTimeSpent: progressData.totalTimeSpent,
      averageTimePerLesson,
      averageEngagement: progressData.averageEngagement,
      learningVelocity: progressData.learningVelocity,
      isEnrolled: !!progressData.enrollment,
      enrolledAt: progressData.enrollment?.enrolled_at,
      lastAccessed: progressData.enrollment?.last_accessed_at
    };
  }, [progressData]);

  // Initialize data on mount - fixed infinite loop
  useEffect(() => {
    if (user?.id && courseId) {
      console.log('🚀 Initializing course progress for:', courseId);
      loadProgressData();
    }
  }, [user?.id, courseId]); // Fixed: removed loadProgressData dependency

  // Persist progress to localStorage for backup - debounced
  useEffect(() => {
    if (progressData.completedLessons.size > 0 && user?.id) {
      const storageKey = `course-progress-${courseId}-${user.id}`;
      // Debounce localStorage writes to prevent performance issues
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            completedLessons: Array.from(progressData.completedLessons),
            lastUpdated: new Date().toISOString()
          }));
        } catch (err) {
          console.warn('Failed to save to localStorage:', err);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [progressData.completedLessons, courseId, user?.id]);

  // Load from localStorage if database fails
  useEffect(() => {
    if (error && user) {
      const storageKey = `course-progress-${courseId}-${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const { completedLessons } = JSON.parse(stored);
          setProgressData(prev => ({
            ...prev,
            completedLessons: new Set(completedLessons)
          }));
          setError(null);
        } catch (err) {
          console.error('Error loading from localStorage:', err);
        }
      }
    }
  }, [error, user, courseId]);

  return {
    // Data
    progressData,
    isLoading,
    error,

    // Methods
    loadProgressData,
    saveLessonCompletion,
    isLessonCompleted,
    getLessonProgress,
    calculateProgress,
    getNextLesson,
    getLearningStats,

    // Computed values
    completedLessons: progressData.completedLessons,
    totalTimeSpent: progressData.totalTimeSpent,
    averageEngagement: progressData.averageEngagement,
    isEnrolled: !!progressData.enrollment
  };
};