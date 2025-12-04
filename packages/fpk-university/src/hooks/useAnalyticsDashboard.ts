import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AnalyticsKPIs {
  totalUsers: number;
  weeklyActiveUsers: number;
  totalEnrollments: number;
  avgCourseProgress: number;
  totalTimeWeek: number;
  totalOrganizations: number;
}

interface DailyActiveUser {
  activity_date: string;
  active_users: number;
}

interface TimeSpentData {
  day_name: string;
  total_hours: number;
}

interface CourseEnrollmentStat {
  course_id: string;
  course_title: string;
  enrollment_count: number;
  completion_rate: number;
}

interface CompletionBreakdown {
  status: string;
  count: number;
  percentage: number;
}

interface OrganizationLeaderboard {
  org_id: string;
  org_name: string;
  member_count: number;
  total_enrollments: number;
  avg_progress: number;
}

export function useAnalyticsDashboard() {
  // Fetch KPIs
  const { data: kpis, isLoading: kpisLoading } = useQuery<AnalyticsKPIs>({
    queryKey: ['analytics-kpis'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_analytics_kpis');
        
        if (error) {
          logger.error('Error fetching analytics KPIs', 'ANALYTICS', error);
          throw error;
        }
        
        return data as unknown as AnalyticsKPIs;
      } catch (error) {
        logger.error('Failed to fetch analytics KPIs', 'ANALYTICS', error);
        return {
          totalUsers: 0,
          weeklyActiveUsers: 0,
          totalEnrollments: 0,
          avgCourseProgress: 0,
          totalTimeWeek: 0,
          totalOrganizations: 0
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch daily active users
  const { data: dailyActiveUsers, isLoading: dailyActiveUsersLoading } = useQuery<DailyActiveUser[]>({
    queryKey: ['daily-active-users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_daily_active_users', { days_limit: 30 });
        
        if (error) {
          logger.error('Error fetching daily active users', 'ANALYTICS', error);
          throw error;
        }
        
        return data as DailyActiveUser[];
      } catch (error) {
        logger.error('Failed to fetch daily active users', 'ANALYTICS', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch time spent by day
  const { data: timeSpentByDay, isLoading: timeSpentLoading } = useQuery<TimeSpentData[]>({
    queryKey: ['time-spent-by-day'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_time_spent_by_day');
        
        if (error) {
          logger.error('Error fetching time spent by day', 'ANALYTICS', error);
          throw error;
        }
        
        return data as TimeSpentData[];
      } catch (error) {
        logger.error('Failed to fetch time spent by day', 'ANALYTICS', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch course enrollment stats
  const { data: courseEnrollments, isLoading: courseEnrollmentsLoading } = useQuery<CourseEnrollmentStat[]>({
    queryKey: ['course-enrollment-stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_course_enrollment_stats');
        
        if (error) {
          logger.error('Error fetching course enrollment stats', 'ANALYTICS', error);
          throw error;
        }
        
        return data as CourseEnrollmentStat[];
      } catch (error) {
        logger.error('Failed to fetch course enrollment stats', 'ANALYTICS', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch completion breakdown
  const { data: completionBreakdown, isLoading: completionLoading } = useQuery<CompletionBreakdown[]>({
    queryKey: ['completion-breakdown'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_completion_breakdown');
        
        if (error) {
          logger.error('Error fetching completion breakdown', 'ANALYTICS', error);
          throw error;
        }
        
        return data as CompletionBreakdown[];
      } catch (error) {
        logger.error('Failed to fetch completion breakdown', 'ANALYTICS', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch organization leaderboard
  const { data: orgLeaderboard, isLoading: orgLeaderboardLoading } = useQuery<OrganizationLeaderboard[]>({
    queryKey: ['organization-leaderboard'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_organization_leaderboard');
        
        if (error) {
          logger.error('Error fetching organization leaderboard', 'ANALYTICS', error);
          throw error;
        }
        
        return data as OrganizationLeaderboard[];
      } catch (error) {
        logger.error('Failed to fetch organization leaderboard', 'ANALYTICS', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = 
    kpisLoading || 
    dailyActiveUsersLoading || 
    timeSpentLoading || 
    courseEnrollmentsLoading || 
    completionLoading || 
    orgLeaderboardLoading;

  return {
    kpis: kpis || {
      totalUsers: 0,
      weeklyActiveUsers: 0,
      totalEnrollments: 0,
      avgCourseProgress: 0,
      totalTimeWeek: 0,
      totalOrganizations: 0
    },
    dailyActiveUsers: dailyActiveUsers || [],
    timeSpentByDay: timeSpentByDay || [],
    courseEnrollments: courseEnrollments || [],
    completionBreakdown: completionBreakdown || [],
    orgLeaderboard: orgLeaderboard || [],
    isLoading
  };
}