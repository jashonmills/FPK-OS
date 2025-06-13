
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WeeklyActivityData {
  day: string;
  studySessions: number;
  studyTime: number;
  modulesCompleted: number;
}

export function useWeeklyActivity() {
  const { user } = useAuth();

  const { data: weeklyActivity = [], isLoading } = useQuery({
    queryKey: ['weekly-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get last 7 days of data
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly activity:', error);
        throw error;
      }

      // Get enrollment progress for module completion data
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('progress')
        .eq('user_id', user.id);

      if (enrollmentError) {
        console.error('Error fetching enrollments:', error);
        throw enrollmentError;
      }

      const totalCompletedModules = enrollments.reduce((acc, enrollment) => {
        const progress = enrollment.progress as any;
        return acc + (progress?.completed_modules?.length || 0);
      }, 0);

      // Create daily aggregation
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date().getDay();
      const weekData: WeeklyActivityData[] = [];

      for (let i = 0; i < 7; i++) {
        const dayIndex = (today - 6 + i + 7) % 7;
        const dayName = days[dayIndex];
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (6 - i));
        
        const daySessions = sessions.filter(session => {
          const sessionDate = new Date(session.created_at);
          return sessionDate.toDateString() === targetDate.toDateString();
        });

        const studyTime = daySessions.reduce((acc, session) => 
          acc + (session.session_duration_seconds || 0), 0) / 60; // Convert to minutes

        weekData.push({
          day: dayName,
          studySessions: daySessions.length,
          studyTime: Math.round(studyTime),
          modulesCompleted: i === 3 ? totalCompletedModules : 0 // Show modules on Thursday for now
        });
      }

      return weekData;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    weeklyActivity,
    isLoading
  };
}
