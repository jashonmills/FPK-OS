import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CourseAnalyticsData {
  courseId: string;
  totalEnrolled: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  totalTimeSpent: number;
  averageEngagement: number;
  lessonBreakdown: {
    lessonId: number;
    lessonTitle: string;
    avgTimeSpent: number;
    avgEngagement: number;
    completionRate: number;
  }[];
  studentList: {
    userId: string;
    name: string;
    email: string;
    progress: number;
    timeSpent: number;
    lastActive: string;
    engagementScore: number;
  }[];
}

export function useCourseAnalytics(orgId: string, courseId: string) {
  return useQuery({
    queryKey: ['course-analytics', orgId, courseId],
    queryFn: async (): Promise<CourseAnalyticsData | null> => {
      if (!orgId || !courseId) return null;

      try {
        // First get org member user IDs
        const { data: orgMembers, error: membersError } = await supabase
          .from('org_members')
          .select('user_id')
          .eq('org_id', orgId)
          .eq('status', 'active');

        if (membersError) throw membersError;

        const memberIds = orgMembers?.map(m => m.user_id) || [];
        if (memberIds.length === 0) return null;

        // Get all enrollments for this course in the org
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('interactive_course_enrollments')
          .select(`
            user_id,
            completion_percentage,
            total_time_spent_minutes,
            last_accessed_at,
            completed_at
          `)
          .eq('course_id', courseId)
          .in('user_id', memberIds);

        if (enrollmentsError) throw enrollmentsError;

        const totalEnrolled = enrollments?.length || 0;
        const activeStudents = enrollments?.filter(e => 
          new Date(e.last_accessed_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length || 0;

        const averageProgress = totalEnrolled > 0
          ? enrollments.reduce((sum, e) => sum + (e.completion_percentage || 0), 0) / totalEnrolled
          : 0;

        const completionRate = totalEnrolled > 0
          ? (enrollments.filter(e => e.completed_at).length / totalEnrolled) * 100
          : 0;

        const totalTimeSpent = enrollments?.reduce((sum, e) => sum + (e.total_time_spent_minutes || 0), 0) || 0;

        // Get lesson analytics
        const { data: lessonData, error: lessonError } = await supabase
          .from('interactive_lesson_analytics')
          .select('*')
          .eq('course_id', courseId)
          .in('user_id', memberIds);

        if (lessonError) throw lessonError;

        // Calculate average engagement
        const averageEngagement = lessonData?.length > 0
          ? lessonData.reduce((sum, l) => sum + (l.engagement_score || 0), 0) / lessonData.length
          : 0;

        // Group by lesson
        const lessonBreakdown = Object.values(
          (lessonData || []).reduce((acc: any, lesson) => {
            if (!acc[lesson.lesson_id]) {
              acc[lesson.lesson_id] = {
                lessonId: lesson.lesson_id,
                lessonTitle: lesson.lesson_title,
                timeSpentSum: 0,
                engagementSum: 0,
                completedCount: 0,
                totalCount: 0
              };
            }
            acc[lesson.lesson_id].timeSpentSum += lesson.time_spent_seconds || 0;
            acc[lesson.lesson_id].engagementSum += lesson.engagement_score || 0;
            acc[lesson.lesson_id].totalCount++;
            if (lesson.completed_at) {
              acc[lesson.lesson_id].completedCount++;
            }
            return acc;
          }, {})
        ).map((l: any) => ({
          lessonId: l.lessonId,
          lessonTitle: l.lessonTitle,
          avgTimeSpent: Math.round(l.timeSpentSum / l.totalCount),
          avgEngagement: Math.round(l.engagementSum / l.totalCount),
          completionRate: Math.round((l.completedCount / l.totalCount) * 100)
        }));

        // Get student details
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', enrollments?.map(e => e.user_id) || []);

        if (profilesError) throw profilesError;

        const studentList = enrollments?.map(e => {
          const profile = profiles?.find(p => p.id === e.user_id);
          const studentLessons = lessonData?.filter(l => l.user_id === e.user_id) || [];
          const avgEngagement = studentLessons.length > 0
            ? studentLessons.reduce((sum, l) => sum + (l.engagement_score || 0), 0) / studentLessons.length
            : 0;

          return {
            userId: e.user_id,
            name: profile?.full_name || 'Unknown',
            email: '', // Email not available from profiles table
            progress: e.completion_percentage || 0,
            timeSpent: e.total_time_spent_minutes || 0,
            lastActive: e.last_accessed_at,
            engagementScore: Math.round(avgEngagement)
          };
        }) || [];

        return {
          courseId,
          totalEnrolled,
          activeStudents,
          averageProgress: Math.round(averageProgress),
          completionRate: Math.round(completionRate),
          totalTimeSpent,
          averageEngagement: Math.round(averageEngagement),
          lessonBreakdown,
          studentList
        };
      } catch (error) {
        console.error('Error fetching course analytics:', error);
        return null;
      }
    },
    enabled: !!orgId && !!courseId,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });
}
