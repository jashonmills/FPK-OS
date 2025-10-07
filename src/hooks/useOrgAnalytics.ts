import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

      try {
        const { data, error } = await supabase.rpc('get_organization_analytics', {
          p_org_id: organizationId
        });

        if (error) {
          console.error('Error fetching organization analytics:', error);
          throw error;
        }

        return {
          totalStudents: parseInt((data as any)?.totalStudents) || 0,
          activeStudents: parseInt((data as any)?.activeStudents) || 0,
          coursesCompleted: parseInt((data as any)?.coursesCompleted) || 0,
          averageProgress: parseFloat((data as any)?.averageProgress) || 0,
          totalLearningHours: parseFloat((data as any)?.totalLearningHours) || 0,
          goalsCompleted: parseInt((data as any)?.goalsCompleted) || 0,
          groupCount: parseInt((data as any)?.groupCount) || 0,
          notesCount: parseInt((data as any)?.notesCount) || 0,
          recentActivity: (data as any)?.recentActivity || [],
          topPerformers: (data as any)?.topPerformers || [],
          iepSummary: (data as any)?.iepSummary || {}
        };
      } catch (error) {
        console.error('Failed to fetch organization analytics:', error);
        // Return fallback data structure
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