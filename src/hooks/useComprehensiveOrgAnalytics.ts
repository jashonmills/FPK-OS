import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComprehensiveOrgAnalytics {
  totalStudents: number;
  activeStudents: number;
  profileOnlyStudents: number;
  courseAssignments: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  completionRate: number;
  totalLearningHours: number;
  iepCount: number;
  groupCount: number;
  notesCount: number;
  recentActivity: Array<{
    event: string;
    created_at: string;
    user_id?: string;
  }>;
}

export function useComprehensiveOrgAnalytics(organizationId?: string) {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['comprehensive-org-analytics', organizationId],
    queryFn: async (): Promise<ComprehensiveOrgAnalytics> => {
      if (!organizationId) {
        return {
          totalStudents: 0,
          activeStudents: 0,
          profileOnlyStudents: 0,
          courseAssignments: 0,
          activeGoals: 0,
          completedGoals: 0,
          averageProgress: 0,
          completionRate: 0,
          totalLearningHours: 0,
          iepCount: 0,
          groupCount: 0,
          notesCount: 0,
          recentActivity: []
        };
      }

      try {
        // Get students with active accounts from org_members
        const { data: orgMembers, error: membersError } = await supabase
          .from('org_members')
          .select('user_id, status', { count: 'exact' })
          .eq('org_id', organizationId)
          .eq('role', 'student');

        if (membersError) throw membersError;

        // Get profile-only students from org_students
        const { data: orgStudents, error: studentsError } = await supabase
          .from('org_students')
          .select('id', { count: 'exact' })
          .eq('org_id', organizationId);

        if (studentsError) throw studentsError;

        // Calculate active students (with accounts and active status)
        const activeStudents = orgMembers?.filter(m => m.status === 'active').length || 0;
        const profileOnlyStudents = orgStudents?.length || 0;
        const totalStudents = (orgMembers?.length || 0) + profileOnlyStudents;

        // Get course assignments
        const { count: courseAssignments } = await supabase
          .from('org_course_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organizationId);

        // Get goals
        const { data: goals } = await supabase
          .from('org_goals')
          .select('status')
          .eq('organization_id', organizationId);

        const activeGoals = goals?.filter(g => g.status === 'active').length || 0;
        const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;

        // Get enrollments for progress calculation
        const studentUserIds = orgMembers?.map(m => m.user_id) || [];
        
        let averageProgress = 0;
        let completionRate = 0;
        
        if (studentUserIds.length > 0) {
          const { data: enrollments } = await supabase
            .from('interactive_course_enrollments')
            .select('completion_percentage, completed_at')
            .in('user_id', studentUserIds);

          if (enrollments && enrollments.length > 0) {
            const totalProgress = enrollments.reduce((sum, e) => sum + (e.completion_percentage || 0), 0);
            averageProgress = Math.round(totalProgress / enrollments.length);
            
            const completedCount = enrollments.filter(e => e.completed_at).length;
            completionRate = Math.round((completedCount / enrollments.length) * 100);
          }
        }

        // Get learning hours from study sessions
        let totalLearningHours = 0;
        if (studentUserIds.length > 0) {
          const { data: sessions } = await supabase
            .from('study_sessions')
            .select('session_duration_seconds')
            .in('user_id', studentUserIds);

          if (sessions) {
            const totalSeconds = sessions.reduce((sum, s) => sum + (s.session_duration_seconds || 0), 0);
            totalLearningHours = Math.round((totalSeconds / 3600) * 10) / 10; // Round to 1 decimal
          }
        }

        // Get IEP count - iep_documents doesn't have org_id, skip for now
        const iepCount = 0;

        // Get groups count
        const { count: groupCount } = await supabase
          .from('org_groups')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', organizationId);

        // Get notes count
        const { count: notesCount } = await supabase
          .from('org_notes')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organizationId);

        // Get recent activity
        const { data: recentActivity } = await supabase
          .from('activity_log')
          .select('event, created_at, user_id')
          .eq('org_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(10);

        return {
          totalStudents,
          activeStudents,
          profileOnlyStudents,
          courseAssignments: courseAssignments || 0,
          activeGoals,
          completedGoals,
          averageProgress,
          completionRate,
          totalLearningHours,
          iepCount: iepCount || 0,
          groupCount: groupCount || 0,
          notesCount: notesCount || 0,
          recentActivity: recentActivity || []
        };
      } catch (error) {
        console.error('Failed to fetch comprehensive organization analytics:', error);
        return {
          totalStudents: 0,
          activeStudents: 0,
          profileOnlyStudents: 0,
          courseAssignments: 0,
          activeGoals: 0,
          completedGoals: 0,
          averageProgress: 0,
          completionRate: 0,
          totalLearningHours: 0,
          iepCount: 0,
          groupCount: 0,
          notesCount: 0,
          recentActivity: []
        };
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!organizationId
  });

  return {
    analytics: analytics || {
      totalStudents: 0,
      activeStudents: 0,
      profileOnlyStudents: 0,
      courseAssignments: 0,
      activeGoals: 0,
      completedGoals: 0,
      averageProgress: 0,
      completionRate: 0,
      totalLearningHours: 0,
      iepCount: 0,
      groupCount: 0,
      notesCount: 0,
      recentActivity: []
    },
    isLoading,
    error
  };
}
