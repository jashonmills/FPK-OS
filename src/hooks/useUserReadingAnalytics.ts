import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserReadingAnalytics {
  totalSessions: number;
  totalDurationMinutes: number;
  averageSessionLength: number;
  booksRead: number;
  recentSessions: Array<{
    id: string;
    bookTitle: string;
    duration: number;
    date: string;
  }>;
}

export const useUserReadingAnalytics = (userId?: string) => {
  return useQuery({
    queryKey: ['user-reading-analytics', userId],
    queryFn: async (): Promise<UserReadingAnalytics> => {
      if (!userId) throw new Error('User ID is required');

      // Get reading sessions
      const { data: readingSessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select(`
          id,
          duration_seconds,
          session_start,
          session_end,
          book_title,
          created_at
        `)
        .eq('user_id', userId)
        .order('session_start', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Calculate metrics
      const totalSessions = readingSessions?.length || 0;
      const totalDurationMinutes = Math.round(
        (readingSessions?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0) / 60
      );
      const averageSessionLength = totalSessions > 0 
        ? Math.round(totalDurationMinutes / totalSessions) 
        : 0;

      // Count unique books
      const uniqueBooks = new Set(
        readingSessions?.map(session => session.book_title).filter(Boolean) || []
      ).size;

      // Format recent sessions
      const recentSessions = (readingSessions?.slice(0, 5) || []).map(session => ({
        id: session.id,
        bookTitle: session.book_title || 'Unknown Book',
        duration: Math.round((session.duration_seconds || 0) / 60),
        date: new Date(session.session_start).toLocaleDateString()
      }));

      return {
        totalSessions,
        totalDurationMinutes,
        averageSessionLength,
        booksRead: uniqueBooks,
        recentSessions
      };
    },
    enabled: !!userId
  });
};