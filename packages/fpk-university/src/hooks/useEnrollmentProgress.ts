
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EnrollmentProgress {
  course_id: string;
  progress: {
    completed: boolean;
    current_module: string | null;
    completion_percentage: number;
    completed_modules: string[];
    completed_at?: string;
  };
  enrolled_at: string;
}

export function useEnrollmentProgress() {
  const { user } = useAuth();

  const { data: enrollments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['enrollment-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id, progress, enrolled_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching enrollment progress:', error);
        throw error;
      }

      return data as EnrollmentProgress[];
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Get progress for a specific course
  const getCourseProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return enrollment?.progress || {
      completed: false,
      current_module: null,
      completion_percentage: 0,
      completed_modules: []
    };
  };

  // Calculate overall stats
  const overallStats = {
    totalCourses: enrollments.length,
    completedCourses: enrollments.filter(e => e.progress?.completed).length,
    totalModulesCompleted: enrollments.reduce((acc, e) => 
      acc + (e.progress?.completed_modules?.length || 0), 0
    ),
    averageProgress: enrollments.length > 0 
      ? Math.round(enrollments.reduce((acc, e) => 
          acc + (e.progress?.completion_percentage || 0), 0
        ) / enrollments.length)
      : 0
  };

  return {
    enrollments,
    isLoading,
    error,
    refetch,
    getCourseProgress,
    overallStats
  };
}
