
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  session_start: string;
  session_end: string | null;
  duration_seconds: number;
  pages_read: number;
  start_cfi: string | null;
  end_cfi: string | null;
  created_at: string;
}

export interface FavoriteBook {
  book_id: string;
  book_title: string;
  book_author: string;
  total_time: number;
  session_count: number;
}

export interface ReadingAnalytics {
  totalReadingTime: number;
  sessionsThisWeek: number;
  averageSessionLength: number;
  longestSession: number;
  favoriteBooks: FavoriteBook[];
  weeklyTrend: Array<{
    day: string;
    reading_time: number;
    sessions: number;
  }>;
  recentSessions: ReadingSession[];
}

export const useReadingAnalytics = () => {
  const { user } = useAuth();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['reading-analytics', user?.id],
    queryFn: async (): Promise<ReadingAnalytics | null> => {
      if (!user?.id) {
        return null;
      }

      try {
        // Get reading sessions data
        const { data: sessions, error: sessionsError } = await supabase
          .from('reading_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('session_start', { ascending: false });

        if (sessionsError) {
          console.error('📚 Error fetching reading sessions:', sessionsError);
          return getEmptyAnalytics();
        }

        const readingSessions = sessions || [];
        
        // Calculate analytics
        const totalReadingTime = readingSessions.reduce((sum, session) => 
          sum + (session.duration_seconds || 0), 0
        );

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const sessionsThisWeek = readingSessions.filter(session => 
          new Date(session.session_start) >= oneWeekAgo
        ).length;

        const averageSessionLength = readingSessions.length > 0 
          ? Math.round(totalReadingTime / readingSessions.length)
          : 0;

        const longestSession = readingSessions.length > 0
          ? Math.max(...readingSessions.map(s => s.duration_seconds || 0))
          : 0;

        // Get weekly trend (last 7 days)
        const weeklyTrend = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));
          
          const daySessions = readingSessions.filter(session => {
            const sessionDate = new Date(session.session_start);
            return sessionDate >= dayStart && sessionDate <= dayEnd;
          });

          weeklyTrend.push({
            day: dayStart.toLocaleDateString('en', { weekday: 'short' }),
            reading_time: daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0),
            sessions: daySessions.length
          });
        }

        return {
          totalReadingTime,
          sessionsThisWeek,
          averageSessionLength,
          longestSession,
          favoriteBooks: [], // Could be enhanced later with book metadata
          weeklyTrend,
          recentSessions: readingSessions.slice(0, 5) as ReadingSession[]
        };
      } catch (error) {
        console.error('📚 Error calculating reading analytics:', error);
        return getEmptyAnalytics();
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const getEmptyAnalytics = (): ReadingAnalytics => ({
    totalReadingTime: 0,
    sessionsThisWeek: 0,
    averageSessionLength: 0,
    longestSession: 0,
    favoriteBooks: [],
    weeklyTrend: [],
    recentSessions: []
  });

  return {
    analytics: analytics || getEmptyAnalytics(),
    isLoading,
    error
  };
};
