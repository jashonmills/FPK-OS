
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfWeek, format, addDays } from 'date-fns';

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

export interface ReadingAnalytics {
  totalReadingTime: number;
  sessionsThisWeek: number;
  averageSessionLength: number;
  longestSession: number;
  favoriteBooks: Array<{
    book_id: string;
    total_time: number;
    session_count: number;
  }>;
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
    queryFn: async (): Promise<ReadingAnalytics> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Fetch all reading sessions for the user
      const { data: sessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      const readingSessions = sessions as ReadingSession[];
      
      // Calculate analytics
      const totalReadingTime = readingSessions.reduce((sum, session) => 
        sum + (session.duration_seconds || 0), 0
      );

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
      const sessionsThisWeek = readingSessions.filter(session => 
        new Date(session.created_at) >= weekStart
      ).length;

      const validSessions = readingSessions.filter(s => s.duration_seconds > 0);
      const averageSessionLength = validSessions.length > 0 
        ? validSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / validSessions.length
        : 0;

      const longestSession = Math.max(0, ...readingSessions.map(s => s.duration_seconds || 0));

      // Calculate favorite books
      const bookStats = new Map<string, { total_time: number; session_count: number }>();
      readingSessions.forEach(session => {
        const current = bookStats.get(session.book_id) || { total_time: 0, session_count: 0 };
        bookStats.set(session.book_id, {
          total_time: current.total_time + (session.duration_seconds || 0),
          session_count: current.session_count + 1
        });
      });

      const favoriteBooks = Array.from(bookStats.entries())
        .map(([book_id, stats]) => ({ book_id, ...stats }))
        .sort((a, b) => b.total_time - a.total_time)
        .slice(0, 5);

      // Calculate weekly trend
      const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(weekStart, i);
        const dayName = format(day, 'EEE');
        const daySessions = readingSessions.filter(session => {
          const sessionDate = new Date(session.created_at);
          return sessionDate.toDateString() === day.toDateString();
        });

        return {
          day: dayName,
          reading_time: Math.round(daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60), // minutes
          sessions: daySessions.length
        };
      });

      return {
        totalReadingTime,
        sessionsThisWeek,
        averageSessionLength,
        longestSession,
        favoriteBooks,
        weeklyTrend,
        recentSessions: readingSessions.slice(0, 10)
      };
    },
    enabled: !!user?.id,
  });

  return {
    analytics,
    isLoading,
    error
  };
};
