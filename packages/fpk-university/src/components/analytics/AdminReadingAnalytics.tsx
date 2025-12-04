import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Clock, Users, TrendingUp } from 'lucide-react';

interface BookStats {
  bookId: string;
  sessions: number;
  totalTime: number;
  users: Set<string>;
  uniqueUsers?: number;
}

const AdminReadingAnalytics = () => {
  const { data: readingStats, isLoading } = useQuery({
    queryKey: ['admin-reading-analytics'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('reading_sessions')
        .select('*');

      if (error) throw error;

      const totalSessions = sessions?.length || 0;
      const totalTimeMinutes = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60 || 0;
      const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []).size;
      const averageSessionTime = totalSessions > 0 ? totalTimeMinutes / totalSessions : 0;

      // Group by book for top books
      const bookStats = sessions?.reduce((acc: Record<string, any>, session) => {
        const bookId = session.book_id || 'unknown';
        if (!acc[bookId]) {
          acc[bookId] = { bookId, sessions: 0, totalTime: 0, users: new Set() };
        }
        acc[bookId].sessions++;
        acc[bookId].totalTime += (session.duration_seconds || 0) / 60;
        acc[bookId].users.add(session.user_id);
        return acc;
      }, {}) || {};

      const topBooks = Object.values(bookStats)
        .sort((a: BookStats, b: BookStats) => b.sessions - a.sessions)
        .slice(0, 5)
        .map((book: BookStats) => ({
          ...book,
          uniqueUsers: book.users.size
        }));

      return {
        totalSessions,
        totalTimeHours: Math.round(totalTimeMinutes / 60),
        uniqueUsers,
        averageSessionMinutes: Math.round(averageSessionTime),
        topBooks
      };
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Reading Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{readingStats?.totalSessions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{readingStats?.totalTimeHours || 0}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Readers</p>
                <p className="text-2xl font-bold">{readingStats?.uniqueUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Session</p>
                <p className="text-2xl font-bold">{readingStats?.averageSessionMinutes || 0}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Books */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {readingStats?.topBooks?.map((book: BookStats, index: number) => (
              <div key={book.bookId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{book.bookId}</p>
                    <p className="text-sm text-muted-foreground">
                      {book.sessions} sessions • {book.uniqueUsers} readers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Math.round(book.totalTime)}m</p>
                  <p className="text-sm text-muted-foreground">total time</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                No reading data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReadingAnalytics;