import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useCourseEnrollment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) {
        throw new Error('User must be authenticated to enroll in courses');
      }

      // Check if already enrolled
      const { data: existingEnrollment, error: checkError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingEnrollment) {
        throw new Error('Already enrolled in this course');
      }

      // Create new enrollment
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: {
            completed: false,
            current_module: null,
            completion_percentage: 0,
            completed_modules: []
          }
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data, courseId) => {
      toast.success('Successfully enrolled in course!');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress'] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
    onError: (error: any) => {
      if (error.message === 'Already enrolled in this course') {
        toast.info('You are already enrolled in this course');
      } else {
        toast.error(`Failed to enroll: ${error.message}`);
      }
    }
  });

  const unenrollFromCourse = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) {
        throw new Error('User must be authenticated');
      }

      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Successfully unenrolled from course');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress'] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to unenroll: ${error.message}`);
    }
  });

  return {
    enrollInCourse,
    unenrollFromCourse,
    isEnrolling: enrollInCourse.isPending,
    isUnenrolling: unenrollFromCourse.isPending
  };
}