import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assertOrg } from '@/lib/org/context';

export interface OrgAnalytics {
  totalStudents: number;
  activeThisWeek: number;
  avgCompletion: number;
  totalTimeOnTask: number;
  assignmentStats: {
    not_started: number;
    in_progress: number;
    submitted: number;
    graded: number;
  };
}

export function useOrgAnalytics() {
  const orgId = assertOrg();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['org-analytics', orgId],
    queryFn: async (): Promise<OrgAnalytics> => {
      // Get total students
      const { count: totalStudents } = await supabase
        .from('org_members')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('role', 'student')
        .eq('status', 'active');

      // Get active users this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: activeUsers } = await supabase
        .from('activity_log')
        .select('user_id')
        .eq('org_id', orgId)
        .gte('created_at', oneWeekAgo.toISOString());

      const activeThisWeek = new Set(activeUsers?.map(a => a.user_id) || []).size;

      // Get average completion rate
      const { data: progressData } = await supabase
        .from('course_progress')
        .select('percent')
        .eq('org_id', orgId);

      const avgCompletion = progressData && progressData.length > 0
        ? progressData.reduce((sum, p) => sum + p.percent, 0) / progressData.length
        : 0;

      // Get total time on task (in minutes)
      const { data: sessionData } = await supabase
        .from('session_time')
        .select('minutes')
        .eq('org_id', orgId);

      const totalTimeOnTask = sessionData?.reduce((sum, s) => sum + s.minutes, 0) || 0;

      // Assignment stats - simplified for now since table structure is different
      const assignmentStats = {
        not_started: 0,
        in_progress: 0,
        submitted: 0,
        graded: 0,
      };

      return {
        totalStudents: totalStudents || 0,
        activeThisWeek,
        avgCompletion: Math.round(avgCompletion),
        totalTimeOnTask,
        assignmentStats,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    analytics,
    isLoading,
    error,
  };
}

export function useOrgActivityTrends(weeks: number = 8) {
  const orgId = assertOrg();

  const { data: trends, isLoading } = useQuery({
    queryKey: ['org-activity-trends', orgId, weeks],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weeks * 7));

      const { data, error } = await supabase
        .from('activity_log')
        .select('created_at, user_id')
        .eq('org_id', orgId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by week
      const weeklyData: { week: string; users: Set<string>; activities: number }[] = [];
      const weekMap: Record<string, { users: Set<string>; activities: number }> = {};

      data?.forEach(activity => {
        const date = new Date(activity.created_at);
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weekMap[weekKey]) {
          weekMap[weekKey] = { users: new Set(), activities: 0 };
        }

        weekMap[weekKey].users.add(activity.user_id);
        weekMap[weekKey].activities++;
      });

      // Convert to array format
      Object.entries(weekMap).forEach(([week, data]) => {
        weeklyData.push({
          week,
          users: data.users,
          activities: data.activities,
        });
      });

      return weeklyData.map(week => ({
        week: week.week,
        activeUsers: week.users.size,
        activities: week.activities,
      }));
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    trends,
    isLoading,
  };
}