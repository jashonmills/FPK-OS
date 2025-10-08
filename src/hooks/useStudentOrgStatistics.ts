import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ActivityLogEntry {
  event: string;
  created_at: string;
  metadata: any;
}

interface StudentOrgStatistics {
  myEnrollments: number;
  myProgress: number;
  myGoals: number;
  studyTime: number;
  completedCourses: number;
  recentActivity: ActivityLogEntry[];
}

export function useStudentOrgStatistics(organizationId?: string) {
  const { user } = useAuth();
  
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['student-org-statistics', organizationId, user?.id],
    queryFn: async () => {
      if (!organizationId || !user?.id) {
        return {
          myEnrollments: 0,
          myProgress: 0,
          myGoals: 0,
          studyTime: 0,
          completedCourses: 0,
          recentActivity: []
        };
      }

      try {
        // Get student's course enrollments in the organization
        // Check both enrollments and interactive_course_enrollments tables
        const { data: regularEnrollments } = await supabase
          .from('enrollments')
          .select('course_id, enrolled_at')
          .eq('user_id', user.id);

        const { data: interactiveEnrollments } = await supabase
          .from('interactive_course_enrollments')
          .select('course_id, course_title, completion_percentage, total_time_spent_minutes, last_accessed_at, completed_at')
          .eq('user_id', user.id)
          .eq('org_id', organizationId);

        // Combine enrollments from both tables
        const allEnrollments = [
          ...(regularEnrollments || []).map(e => ({
            course_id: e.course_id,
            completion_percentage: 0 // Regular enrollments don't have completion tracking yet
          })),
          ...(interactiveEnrollments || []).map(e => ({
            course_id: e.course_id,
            completion_percentage: e.completion_percentage || 0
          }))
        ];

        // Get student's recent activity
        const { data: activity } = await supabase
          .from('activity_log')
          .select('event, created_at, metadata')
          .eq('user_id', user.id)
          .eq('org_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(5);

        const myEnrollments = allEnrollments.length;
        const myProgress = allEnrollments.length > 0 
          ? Math.round(allEnrollments.reduce((sum, e) => sum + e.completion_percentage, 0) / allEnrollments.length)
          : 0;
        const completedCourses = allEnrollments.filter(e => e.completion_percentage >= 100).length;

        // Get student's org_students record to find their student_id
        const { data: studentRecord } = await supabase
          .from('org_students')
          .select('id')
          .eq('linked_user_id', user.id)
          .eq('org_id', organizationId)
          .maybeSingle();

        // Get goals assigned to this student
        let myGoals = 0;
        if (studentRecord) {
          const { count } = await supabase
            .from('org_goals')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', studentRecord.id)
            .eq('status', 'active');
          
          myGoals = count || 0;
        }

        return {
          myEnrollments,
          myProgress,
          myGoals,
          studyTime: 0, // TODO: Add study time tracking
          completedCourses,
          recentActivity: activity || []
        };
      } catch (error) {
        console.error('Failed to fetch student organization statistics:', error);
        return {
          myEnrollments: 0,
          myProgress: 0,
          myGoals: 0,
          studyTime: 0,
          completedCourses: 0,
          recentActivity: []
        };
      }
    },
    enabled: !!organizationId && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: statistics || {
      myEnrollments: 0,
      myProgress: 0,
      myGoals: 0,
      studyTime: 0,
      completedCourses: 0,
      recentActivity: []
    },
    isLoading,
    error,
  };
}