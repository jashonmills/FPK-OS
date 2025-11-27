import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';

export function useStudentAnalytics(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['student-analytics', targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        return {
          totalCourses: 0,
          completedCourses: 0,
          averageProgress: 0,
          totalLearningHours: 0,
          lessonsCompleted: 0,
          currentStreak: 0,
          totalXP: 0
        };
      }

      try {
        const { data, error } = await supabase.rpc('get_student_analytics', {
          p_user_id: targetUserId
        });

        if (error) {
          logger.error('Error fetching student analytics', 'ANALYTICS', error);
          throw error;
        }

        return {
          totalCourses: parseInt((data as any)?.totalCourses) || 0,
          completedCourses: parseInt((data as any)?.completedCourses) || 0,
          averageProgress: parseFloat((data as any)?.averageProgress) || 0,
          totalLearningHours: parseFloat((data as any)?.totalLearningHours) || 0,
          lessonsCompleted: parseInt((data as any)?.lessonsCompleted) || 0,
          currentStreak: parseInt((data as any)?.currentStreak) || 0,
          totalXP: parseInt((data as any)?.totalXP) || 0
        };
      } catch (error) {
        logger.error('Failed to fetch student analytics', 'ANALYTICS', error);
        // Return fallback data structure
        return {
          totalCourses: 0,
          completedCourses: 0,
          averageProgress: 0,
          totalLearningHours: 0,
          lessonsCompleted: 0,
          currentStreak: 0,
          totalXP: 0
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!targetUserId, // Only run query if we have a user ID
  });

  return {
    analytics: analytics || {
      totalCourses: 0,
      completedCourses: 0,
      averageProgress: 0,
      totalLearningHours: 0,
      lessonsCompleted: 0,
      currentStreak: 0,
      totalXP: 0
    },
    isLoading,
    error,
  };
}