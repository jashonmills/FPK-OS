
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useStreakCalculation() {
  const { user } = useAuth();

  const { data: streakData, isLoading } = useQuery({
    queryKey: ['streak-calculation', user?.id],
    queryFn: async () => {
      if (!user) return { currentStreak: 0, longestStreak: 0 };
      
      // Get all study sessions ordered by date
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('created_at, completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching sessions for streak:', error);
        throw error;
      }

      if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

      // Group sessions by date (use completed_at since that's when the session actually finished)
      const sessionsByDate = new Map<string, number>();
      sessions.forEach(session => {
        const date = new Date(session.completed_at).toISOString().split('T')[0]; // Use ISO date format YYYY-MM-DD
        sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
      });

      const uniqueDates = Array.from(sessionsByDate.keys()).sort();
      
      // Calculate current streak (from today backwards)
      let currentStreak = 0;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Check if user studied today
      if (sessionsByDate.has(today)) {
        currentStreak = 1;
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 1);
        
        // Count consecutive days backwards from today
        while (checkDate >= new Date(uniqueDates[0])) {
          const checkDateStr = checkDate.toISOString().split('T')[0];
          if (sessionsByDate.has(checkDateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      } else if (sessionsByDate.has(yesterdayStr)) {
        // If didn't study today but studied yesterday, start streak from yesterday
        currentStreak = 1;
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 2);
        
        // Count consecutive days backwards from yesterday
        while (checkDate >= new Date(uniqueDates[0])) {
          const checkDateStr = checkDate.toISOString().split('T')[0];
          if (sessionsByDate.has(checkDateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 1;
      
      if (uniqueDates.length > 0) {
        longestStreak = 1; // At least 1 if there's any session
        
        for (let i = 1; i < uniqueDates.length; i++) {
          const prevDate = new Date(uniqueDates[i - 1]);
          const currentDate = new Date(uniqueDates[i]);
          
          // Calculate difference in days
          const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            // Consecutive days
            tempStreak++;
          } else {
            // Gap in streak, update longest and reset temp
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        
        // Don't forget to check the final streak
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      console.log('Streak calculation:', {
        sessionsCount: sessions.length,
        uniqueDatesCount: uniqueDates.length,
        currentStreak,
        longestStreak,
        today,
        hasToday: sessionsByDate.has(today),
        hasYesterday: sessionsByDate.has(yesterdayStr)
      });

      return { currentStreak, longestStreak };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes - shorter cache for more accurate streak tracking
  });

  return {
    currentStreak: streakData?.currentStreak || 0,
    longestStreak: streakData?.longestStreak || 0,
    isLoading
  };
}
