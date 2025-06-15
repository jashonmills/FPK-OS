
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfWeek, format, addDays } from 'date-fns';

export const useWeeklyActivity = () => {
  const { user } = useAuth();

  const { data: weeklyActivity = [], isLoading } = useQuery({
    queryKey: ['weekly-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
      const weekEnd = now;

      // Fetch study sessions
      const { data: studySessions, error: studyError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      if (studyError) {
        console.error('Error fetching study sessions:', studyError);
      }

      // Fetch reading sessions
      const { data: readingSessions, error: readingError } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      if (readingError) {
        console.error('Error fetching reading sessions:', readingError);
      }

      // Create data for each day of the week
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(weekStart, i);
        const dayName = format(day, 'EEE');
        
        // Filter sessions for this specific day
        const dayStudySessions = (studySessions || []).filter(session => {
          const sessionDate = new Date(session.created_at);
          return sessionDate.toDateString() === day.toDateString();
        });

        const dayReadingSessions = (readingSessions || []).filter(session => {
          const sessionDate = new Date(session.created_at);
          return sessionDate.toDateString() === day.toDateString();
        });

        // Calculate study time in minutes
        const studyTime = dayStudySessions.reduce((total, session) => {
          return total + (session.session_duration_seconds || 0);
        }, 0);

        // Calculate reading time in minutes
        const readingTime = dayReadingSessions.reduce((total, session) => {
          return total + (session.duration_seconds || 0);
        }, 0);

        const totalTime = Math.round((studyTime + readingTime) / 60); // Convert to minutes
        const totalSessions = dayStudySessions.length + dayReadingSessions.length;

        return {
          day: dayName,
          studySessions: totalSessions,
          studyTime: totalTime,
        };
      });

      // Only return days that have passed (including today)
      const today = new Date();
      return weeklyData.filter((_, index) => {
        const dayDate = addDays(weekStart, index);
        return dayDate <= today;
      });
    },
    enabled: !!user?.id,
  });

  return {
    weeklyActivity,
    isLoading,
  };
};
