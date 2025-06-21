
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, TrendingUp, Target } from 'lucide-react';
import { useReadingAnalytics } from '@/hooks/useReadingAnalytics';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ReadingAnalyticsCard = () => {
  const { 
    readingSessions, 
    readingProgress, 
    readingTrends,
    loading 
  } = useReadingAnalytics();

  // Calculate analytics from the raw data
  const analytics = React.useMemo(() => {
    if (!readingSessions?.length) {
      return {
        totalReadingTime: 0,
        sessionsThisWeek: 0,
        averageSessionLength: 0,
        longestSession: 0,
        weeklyTrend: [],
        favoriteBooks: []
      };
    }

    const totalTime = readingSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const thisWeekSessions = readingSessions.filter(session => 
      new Date(session.session_start) >= weekStart
    );
    
    const avgLength = totalTime / readingSessions.length;
    const longest = Math.max(...readingSessions.map(s => s.duration_seconds || 0));

    // Weekly trend data
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayReading = readingSessions.filter(session => {
        const sessionDate = new Date(session.session_start);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      }).reduce((sum, session) => sum + (session.duration_seconds || 0), 0);

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        reading_time: Math.round(dayReading / 60) // Convert to minutes
      };
    });

    // Favorite books (most read)
    const bookStats = readingSessions.reduce((acc, session) => {
      if (!acc[session.book_id]) {
        acc[session.book_id] = {
          book_id: session.book_id,
          book_title: `Book ${session.book_id}`,
          book_author: 'Unknown Author',
          total_time: 0,
          session_count: 0
        };
      }
      acc[session.book_id].total_time += session.duration_seconds || 0;
      acc[session.book_id].session_count += 1;
      return acc;
    }, {} as Record<string, any>);

    const favoriteBooks = Object.values(bookStats)
      .sort((a: any, b: any) => b.total_time - a.total_time)
      .slice(0, 5);

    return {
      totalReadingTime: totalTime,
      sessionsThisWeek: thisWeekSessions.length,
      averageSessionLength: avgLength,
      longestSession: longest,
      weeklyTrend,
      favoriteBooks
    };
  }, [readingSessions]);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!readingSessions?.length) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Reading Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reading data available yet</p>
            <p className="text-sm text-gray-400 mt-1">Start reading to see your analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  const chartConfig = {
    reading_time: {
      label: 'Reading Time (min)',
      color: '#3B82F6',
    },
    sessions: {
      label: 'Sessions',
      color: '#F59E0B',
    },
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Reading Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-4 w-4 text-blue-600 mr-1" />
            </div>
            <div className="text-xl font-bold text-blue-600">
              {formatTime(analytics.totalReadingTime)}
            </div>
            <p className="text-xs text-gray-500">Total Time</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-4 w-4 text-green-600 mr-1" />
            </div>
            <div className="text-xl font-bold text-green-600">
              {analytics.sessionsThisWeek}
            </div>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-4 w-4 text-amber-600 mr-1" />
            </div>
            <div className="text-xl font-bold text-amber-600">
              {formatTime(analytics.averageSessionLength)}
            </div>
            <p className="text-xs text-gray-500">Avg Session</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-4 w-4 text-purple-600 mr-1" />
            </div>
            <div className="text-xl font-bold text-purple-600">
              {formatTime(analytics.longestSession)}
            </div>
            <p className="text-xs text-gray-500">Longest</p>
          </div>
        </div>

        {/* Weekly Reading Trend */}
        {analytics.weeklyTrend.some(day => day.reading_time > 0) && (
          <div>
            <h4 className="font-semibold mb-3">Weekly Reading Activity</h4>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyTrend} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="reading_time" fill="var(--color-reading_time)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}

        {/* Favorite Books */}
        {analytics.favoriteBooks.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Most Read Books</h4>
            <div className="space-y-3">
              {analytics.favoriteBooks.slice(0, 3).map((book, index) => (
                <div key={book.book_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-gray-700 truncate block">
                        {book.book_title}
                      </span>
                      <span className="text-xs text-gray-500 truncate block">
                        by {book.book_author}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-sm font-medium">{formatTime(book.total_time)}</div>
                    <div className="text-xs text-gray-500">{book.session_count} sessions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reading Progress Indicator */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Weekly Reading Goal</span>
            <span>{Math.min(100, Math.round((analytics.sessionsThisWeek / 7) * 100))}%</span>
          </div>
          <Progress value={Math.min(100, (analytics.sessionsThisWeek / 7) * 100)} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {analytics.sessionsThisWeek >= 7 
              ? "🎉 Weekly goal achieved!" 
              : `${7 - analytics.sessionsThisWeek} more sessions to reach your weekly goal`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingAnalyticsCard;
