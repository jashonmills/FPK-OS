import { useQuery } from '@tanstack/react-query';

export function useOrgAnalytics(organizationId?: string) {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['org-analytics', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        return {
          totalStudents: 0,
          activeStudents: 0,
          coursesCompleted: 0,
          averageProgress: 0,
          totalLearningHours: 0,
          goalsCompleted: 0,
          recentActivity: [],
          topPerformers: []
        };
      }

      // This would fetch real analytics data from Supabase
      // For now, return mock data structure with zero values to show proper wiring
      return {
        totalStudents: 0,
        activeStudents: 0,
        coursesCompleted: 0,
        averageProgress: 0,
        totalLearningHours: 0,
        goalsCompleted: 0,
        recentActivity: [],
        topPerformers: []
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    analytics: analytics || {
      totalStudents: 0,
      activeStudents: 0,
      coursesCompleted: 0,
      averageProgress: 0,
      totalLearningHours: 0,
      goalsCompleted: 0,
      recentActivity: [],
      topPerformers: []
    },
    isLoading,
    error,
  };
}