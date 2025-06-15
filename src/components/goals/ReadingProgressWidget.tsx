
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useReadingAnalytics } from '@/hooks/useReadingAnalytics';

const ReadingProgressWidget = () => {
  const { analytics, isLoading } = useReadingAnalytics();

  if (isLoading) {
    return (
      <Card className="fpk-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Reading Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-center py-4">
            <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Start reading to track progress</p>
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

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader className="pb-2 p-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Reading Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-3 w-3 text-blue-600 mr-1" />
            </div>
            <div className="text-lg font-bold text-blue-600">
              {formatTime(analytics.totalReadingTime)}
            </div>
            <p className="text-xs text-gray-500">Total Time</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            </div>
            <div className="text-lg font-bold text-green-600">
              {analytics.sessionsThisWeek}
            </div>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
        </div>

        {analytics.favoriteBooks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Currently Reading</p>
            <div className="space-y-1">
              {analytics.favoriteBooks.slice(0, 2).map((book, index) => (
                <div key={book.book_id} className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-600 truncate block">
                      {book.book_title}
                    </span>
                    <span className="text-xs text-gray-400 truncate block">
                      by {book.book_author}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-blue-600 ml-2 flex-shrink-0">
                    {formatTime(book.total_time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            {analytics.sessionsThisWeek >= 5 
              ? "🎉 Great reading week!" 
              : "Keep reading to reach your weekly goal"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingProgressWidget;
