
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WeeklyActivityData {
  day: string;
  studySessions: number;
  studyTime: number;
}

export function useWeeklyActivity() {
  const { user } = useAuth();

  const { data: weeklyActivity = [], isLoading } = useQuery({
    queryKey: ['weekly-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get current week boundaries (Sunday to today)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
      
      // Find the start of this week (Sunday)
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - currentDay);
      
      console.log('Week calculation:', {
        today: today.toDateString(),
        currentDay,
        weekStart: weekStart.toDateString()
      });

      // Fetch study sessions for the current week up to today
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()) // End of today
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly activity:', error);
        throw error;
      }

      console.log('Fetched sessions for week:', sessions);

      // Create array for each day from Sunday to today
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekData: WeeklyActivityData[] = [];

      // Only include days from Sunday up to today
      for (let dayOffset = 0; dayOffset <= currentDay; dayOffset++) {
        const targetDate = new Date(weekStart);
        targetDate.setDate(weekStart.getDate() + dayOffset);
        
        const dayLabel = dayLabels[dayOffset];
        
        // Filter sessions for this specific day
        const daySessions = sessions.filter(session => {
          const sessionDate = new Date(session.created_at);
          const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
          return sessionDateOnly.getTime() === targetDate.getTime();
        });

        // Calculate total study time for this day (convert seconds to minutes)
        const studyTime = daySessions.reduce((acc, session) => {
          return acc + (session.session_duration_seconds || 0);
        }, 0) / 60;

        weekData.push({
          day: dayLabel,
          studySessions: daySessions.length,
          studyTime: Math.round(studyTime)
        });

        console.log(`Day ${dayLabel} (${targetDate.toDateString()}):`, {
          sessions: daySessions.length,
          minutes: Math.round(studyTime)
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
