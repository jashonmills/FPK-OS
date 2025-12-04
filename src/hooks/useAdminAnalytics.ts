import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export function useAdminAnalytics() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_admin_analytics');

        if (error) {
          logger.error('Error fetching admin analytics', 'ANALYTICS', error);
          throw error;
        }

        return {
          totalOrganizations: parseInt((data as any)?.totalOrganizations) || 0,
          totalUsers: parseInt((data as any)?.totalUsers) || 0,
          totalStudents: parseInt((data as any)?.totalStudents) || 0,
          totalCourses: parseInt((data as any)?.totalCourses) || 0,
          totalEnrollments: parseInt((data as any)?.totalEnrollments) || 0,
          averageProgress: parseFloat((data as any)?.averageProgress) || 0,
          totalLearningHours: parseFloat((data as any)?.totalLearningHours) || 0,
          activeOrganizations: parseInt((data as any)?.activeOrganizations) || 0
        };
      } catch (error) {
        logger.error('Failed to fetch admin analytics', 'ANALYTICS', error);
        // Return fallback data structure for admins
        return {
          totalOrganizations: 0,
          totalUsers: 0,
          totalStudents: 0,
          totalCourses: 0,
          totalEnrollments: 0,
          averageProgress: 0,
          totalLearningHours: 0,
          activeOrganizations: 0
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    analytics: analytics || {
      totalOrganizations: 0,
      totalUsers: 0,
      totalStudents: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      averageProgress: 0,
      totalLearningHours: 0,
      activeOrganizations: 0
    },
    isLoading,
    error,
  };
}