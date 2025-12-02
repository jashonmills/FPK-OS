
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useReadingAnalytics } from '@/hooks/useReadingAnalytics';

const ReadingProgressWidget = () => {
  console.log('📚 ReadingProgressWidget rendering');
  
  const { readingSessions, loading } = useReadingAnalytics();
  
  // Calculate analytics from the raw data
  const analytics = React.useMemo(() => {
    if (!readingSessions?.length) {
      return {
        totalReadingTime: 0,
        sessionsThisWeek: 0,
        averageSessionLength: 0,
        longestSession: 0
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

    return {
      totalReadingTime: totalTime,
      sessionsThisWeek: thisWeekSessions.length,
      averageSessionLength: avgLength,
      longestSession: longest
    };
  }, [readingSessions]);
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  if (loading) {
    return (
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Reading Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="animate-pulse space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="text-center">
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm font-semibold">Reading Progress</span>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-blue-600 shrink-0" />
            <div>
              <span className="text-lg font-bold text-blue-600">{formatTime(analytics.totalReadingTime)}</span>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Total Time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-green-600 shrink-0" />
            <div>
              <span className="text-lg font-bold text-green-600">{analytics.sessionsThisWeek}</span>
              <p className="text-xs text-muted-foreground whitespace-nowrap">This Week</p>
            </div>
          </div>

          {analytics.totalReadingTime > 0 && (
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground border-l pl-4">
              <span className="whitespace-nowrap">Avg: {formatTime(analytics.averageSessionLength)}</span>
              <span className="whitespace-nowrap">Best: {formatTime(analytics.longestSession)}</span>
            </div>
          )}
        </div>
        
        {analytics.totalReadingTime === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Start reading to track your progress
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReadingProgressWidget;
