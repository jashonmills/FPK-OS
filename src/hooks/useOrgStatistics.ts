import { useQuery } from '@tanstack/react-query';

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

      // This would fetch real statistics from the database
      // For now, return zero values to show proper wiring
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
      completionRate: 0
    },
    isLoading,
    error,
  };
}