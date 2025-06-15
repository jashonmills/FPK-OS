
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, TrendingUp, Target } from 'lucide-react';
import { useReadingAnalytics } from '@/hooks/useReadingAnalytics';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ReadingAnalyticsCard = () => {
  const { analytics, isLoading } = useReadingAnalytics();

  if (isLoading) {
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

  if (!analytics) {
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
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700 truncate max-w-[120px]">
                      {book.book_id.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </div>
                  <div className="text-right">
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
