
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

      // Group sessions by date
      const sessionsByDate = new Map<string, number>();
      sessions.forEach(session => {
        const date = new Date(session.created_at).toDateString();
        sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
      });

      const uniqueDates = Array.from(sessionsByDate.keys()).sort();
      
      // Calculate current streak (from today backwards)
      let currentStreak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if user studied today or yesterday
      if (sessionsByDate.has(today)) {
        currentStreak = 1;
        let checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (sessionsByDate.has(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else if (sessionsByDate.has(yesterday.toDateString())) {
        currentStreak = 1;
        let checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 2);
        
        while (sessionsByDate.has(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;

      uniqueDates.forEach(dateStr => {
        const currentDate = new Date(dateStr);
        
        if (lastDate) {
          const dayDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        
        lastDate = currentDate;
      });
      
      longestStreak = Math.max(longestStreak, tempStreak);

      return { currentStreak, longestStreak };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    currentStreak: streakData?.currentStreak || 0,
    longestStreak: streakData?.longestStreak || 0,
    isLoading
  };
}
