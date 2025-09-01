import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NativeCourse {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  est_minutes: number;
  cover_url?: string;
  visibility: 'draft' | 'published' | 'archived';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  est_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface LessonBlock {
  id: string;
  lesson_id: string;
  order_index: number;
  type: 'rich-text' | 'image' | 'legacy-html' | 'quiz';
  data_json: any;
  created_at: string;
  updated_at: string;
}

export interface QuizItem {
  id: string;
  block_id: string;
  kind: 'mcq' | 'multi' | 'numeric';
  prompt: string;
  options_json: any[];
  answer_key_json: any;
  points: number;
  order_index: number;
  created_at: string;
}

export interface NativeEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string; // Changed to string to match DB
  progress_pct: number;
  last_lesson_id?: string;
  last_visit_at: string;
  enrolled_at: string;
  completed_at?: string;
}

// Hook to fetch all native courses
export function useNativeCourses() {
  return useQuery({
    queryKey: ['native-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('native_courses')
        .select('*')
        .eq('visibility', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching native courses:', error);
        throw error;
      }

      return data as NativeCourse[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch a single native course
export function useNativeCourse(slug: string) {
  return useQuery({
    queryKey: ['native-course', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('native_courses')
        .select('*')
        .eq('slug', slug)
        .eq('visibility', 'published')
        .single();

      if (error) {
        console.error('Error fetching native course:', error);
        throw error;
      }

      return data as NativeCourse;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook to fetch course modules with lessons
export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons (
            *,
            lesson_blocks (
              id,
              type,
              order_index
            )
          )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching course modules:', error);
        throw error;
      }

      return data;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook to fetch a single lesson with blocks
export function useCourseLesson(lessonId: string) {
  return useQuery({
    queryKey: ['course-lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select(`
          *,
          lesson_blocks (
            *,
            quiz_items (*)
          )
        `)
        .eq('id', lessonId)
        .single();

      if (error) {
        console.error('Error fetching course lesson:', error);
        throw error;
      }

      return data;
    },
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook to fetch user's native course enrollments
export function useNativeEnrollments() {
  return useQuery({
    queryKey: ['native-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('native_enrollments')
        .select(`
          *,
          native_courses (*)
        `)
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error('Error fetching native enrollments:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to manage native course enrollments
export function useNativeEnrollmentMutations() {
  const queryClient = useQueryClient();

  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { data, error } = await supabase
        .from('native_enrollments')
        .insert([
          {
            course_id: courseId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['native-enrollments'] });
      toast.success('Successfully enrolled in course!');
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    },
  });

  const updateProgress = useMutation({
    mutationFn: async ({
      enrollmentId,
      progressPct,
      lastLessonId,
    }: {
      enrollmentId: string;
      progressPct: number;
      lastLessonId?: string;
    }) => {
      const { data, error } = await supabase
        .from('native_enrollments')
        .update({
          progress_pct: progressPct,
          last_lesson_id: lastLessonId,
          last_visit_at: new Date().toISOString(),
        })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['native-enrollments'] });
    },
    onError: (error) => {
      console.error('Progress update error:', error);
    },
  });

  return {
    enrollInCourse,
    updateProgress,
    isEnrolling: enrollInCourse.isPending,
    isUpdating: updateProgress.isPending,
  };
}