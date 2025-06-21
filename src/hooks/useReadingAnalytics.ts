
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
        console.log('📚 No user found for reading analytics');
        return null;
      }

      try {
        console.log('📚 Fetching reading analytics for user:', user.id);
        
        // Check if reading_sessions table exists and fetch data
        const { data: sessions, error: sessionsError } = await supabase
          .from('reading_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100); // Limit to prevent large queries

        if (sessionsError) {
          console.warn('📚 Reading sessions query failed:', sessionsError);
          // Return empty analytics instead of throwing
          return {
            totalReadingTime: 0,
            sessionsThisWeek: 0,
            averageSessionLength: 0,
            longestSession: 0,
            favoriteBooks: [],
            weeklyTrend: [],
            recentSessions: []
          };
        }

        const readingSessions = (sessions || []) as ReadingSession[];
        console.log('📚 Found reading sessions:', readingSessions.length);
        
        // Calculate basic analytics
        const totalReadingTime = readingSessions.reduce((sum, session) => 
          sum + (session.duration_seconds || 0), 0
        );

        const now = new Date();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sessionsThisWeek = readingSessions.filter(session => 
          new Date(session.created_at) >= weekStart
        ).length;

        const validSessions = readingSessions.filter(s => s.duration_seconds > 0);
        const averageSessionLength = validSessions.length > 0 
          ? validSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / validSessions.length
          : 0;

        const longestSession = Math.max(0, ...readingSessions.map(s => s.duration_seconds || 0));

        // Simple favorite books calculation
        const bookStats = new Map<string, { total_time: number; session_count: number }>();
        readingSessions.forEach(session => {
          const current = bookStats.get(session.book_id) || { total_time: 0, session_count: 0 };
          bookStats.set(session.book_id, {
            total_time: current.total_time + (session.duration_seconds || 0),
            session_count: current.session_count + 1
          });
        });

        const favoriteBooks: FavoriteBook[] = Array.from(bookStats.entries())
          .map(([book_id, stats]) => ({
            book_id,
            book_title: book_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            book_author: 'Unknown Author',
            ...stats
          }))
          .sort((a, b) => b.total_time - a.total_time)
          .slice(0, 5);

        const analytics: ReadingAnalytics = {
          totalReadingTime,
          sessionsThisWeek,
          averageSessionLength,
          longestSession,
          favoriteBooks,
          weeklyTrend: [], // Simplified for now
          recentSessions: readingSessions.slice(0, 10)
        };

        console.log('📚 Reading analytics calculated successfully:', analytics);
        return analytics;

      } catch (error) {
        console.error('📚 Error calculating reading analytics:', error);
        // Return empty analytics instead of throwing
        return {
          totalReadingTime: 0,
          sessionsThisWeek: 0,
          averageSessionLength: 0,
          longestSession: 0,
          favoriteBooks: [],
          weeklyTrend: [],
          recentSessions: []
        };
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on failure
  });

  return {
    analytics,
    isLoading,
    error
  };
};
