import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useOrgStatistics(organizationId?: string) {
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['org-statistics', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        return {
          studentCount: 0,
          activeMembers: 0,
          completedGoals: 0,
          totalCourses: 0,
          averageProgress: 0,
          courseAssignments: 0,
          activeGoals: 0,
          completionRate: 0
        };
      }

      try {
        const { data, error } = await supabase.rpc('get_organization_statistics', {
          p_org_id: organizationId
        });

        if (error) {
          console.error('Error fetching organization statistics:', error);
          throw error;
        }

        return {
          studentCount: parseInt((data as any)?.studentCount) || 0,
          activeMembers: parseInt((data as any)?.activeMembers) || 0,
          completedGoals: parseInt((data as any)?.completedGoals) || 0,
          totalCourses: parseInt((data as any)?.totalCourses) || 0,
          averageProgress: parseFloat((data as any)?.averageProgress) || 0,
          courseAssignments: parseInt((data as any)?.courseAssignments) || 0,
          activeGoals: parseInt((data as any)?.activeGoals) || 0,
          completionRate: parseFloat((data as any)?.completionRate) || 0,
          iepCount: parseInt((data as any)?.iepCount) || 0
        };
      } catch (error) {
        console.error('Failed to fetch organization statistics:', error);
        // Return fallback data structure
        return {
          studentCount: 0,
          activeMembers: 0,
          completedGoals: 0,
          totalCourses: 0,
          averageProgress: 0,
          courseAssignments: 0,
          activeGoals: 0,
          completionRate: 0
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: statistics || {
      studentCount: 0,
      activeMembers: 0,
      completedGoals: 0,
      totalCourses: 0,
      averageProgress: 0,
      courseAssignments: 0,
      activeGoals: 0,
      completionRate: 0,
      iepCount: 0
    },
    isLoading,
    error,
  };
}