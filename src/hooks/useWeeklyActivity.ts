
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
      
      // Get current date in user's local timezone
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Find the start of this week (Sunday)
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - currentDay);
      
      console.log('Date calculations:', {
        now: now.toString(),
        today: today.toDateString(),
        currentDay: currentDay,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay],
        weekStart: weekStart.toDateString()
      });

      // Fetch study sessions for the current week up to today
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly activity:', error);
        throw error;
      }

      console.log('Fetched sessions for week:', sessions);

      // Create array for each day from Sunday up to today ONLY
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekData: WeeklyActivityData[] = [];

      // IMPORTANT: Only include days from Sunday (0) up to currentDay (today)
      for (let dayOffset = 0; dayOffset <= currentDay; dayOffset++) {
        const targetDate = new Date(weekStart);
        targetDate.setDate(weekStart.getDate() + dayOffset);
        
        const dayLabel = dayLabels[dayOffset];
        
        console.log(`Processing day ${dayOffset}: ${dayLabel} (${targetDate.toDateString()})`);
        
        // Filter sessions for this specific day
        const daySessions = sessions.filter(session => {
          const sessionDate = new Date(session.created_at);
          const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
          const matches = sessionDateOnly.getTime() === targetDate.getTime();
          
          if (matches) {
            console.log(`Session found for ${dayLabel}:`, session);
          }
          
          return matches;
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

        console.log(`Day ${dayLabel} final data:`, {
          sessions: daySessions.length,
          minutes: Math.round(studyTime)
        });
      }

      // Extra safety check: ensure no future days are included
      const finalData = weekData.filter((_, index) => index <= currentDay);
      
      console.log('Final weekly data (no future days):', finalData);
      console.log(`Should have ${currentDay + 1} days (Sunday=0 to today=${currentDay})`);

      return finalData;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    weeklyActivity,
    isLoading
  };
}
