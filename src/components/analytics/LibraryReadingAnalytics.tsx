
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BookOpen, Clock, Search, TrendingUp } from 'lucide-react';
import { useReadingAnalytics } from '@/hooks/useReadingAnalytics';
import EmptyState from '@/components/analytics/EmptyState';
import ReadingAnalyticsCard from '@/components/analytics/ReadingAnalyticsCard';

const LibraryReadingAnalytics = () => {
  const { 
    readingSessions, 
    readingProgress, 
    readingTrends,
    loading 
  } = useReadingAnalytics();

  // Process reading speed data
  const readingSpeedData = React.useMemo(() => {
    if (!readingSessions?.length) return [];
    
    return readingSessions
      .filter(session => session.duration_seconds > 0 && session.pages_read > 0)
      .slice(-14) // Last 14 sessions
      .map((session, index) => ({
        session: `Session ${index + 1}`,
        speed: Math.round((session.pages_read / (session.duration_seconds / 60)) * 10) / 10, // pages per minute
        date: new Date(session.session_start).toLocaleDateString()
      }));
  }, [readingSessions]);

  // Mock search categories data (would come from search analytics)
  const searchCategoriesData = [
    { name: 'Science Fiction', value: 35, color: '#8B5CF6' },
    { name: 'History', value: 25, color: '#F59E0B' },
    { name: 'Philosophy', value: 20, color: '#EF4444' },
    { name: 'Literature', value: 15, color: '#3B82F6' },
    { name: 'Other', value: 5, color: '#10B981' }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Reading Analytics Card - Existing Component */}
      <div className="lg:col-span-2">
        <ReadingAnalyticsCard />
      </div>

      {/* Reading Speed Progression */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Reading Speed Progression
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your reading speed improvement over time
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {readingSpeedData.length > 0 ? (
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readingSpeedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={TrendingUp}
              title="Start reading to track speed"
              description="Complete reading sessions to see your reading speed progression"
            />
          )}
        </CardContent>
      </Card>

      {/* Most Searched Book Categories */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Most Searched Book Categories
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your reading interests and search patterns
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={searchCategoriesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {searchCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {searchCategoriesData.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading Session Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Reading Session Summary
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Overall reading statistics
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {readingSessions?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Total Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {readingSessions?.reduce((total, session) => total + (session.pages_read || 0), 0) || 0}
              </div>
              <p className="text-xs text-gray-500">Pages Read</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round((readingSessions?.reduce((total, session) => total + (session.duration_seconds || 0), 0) || 0) / 60)}
              </div>
              <p className="text-xs text-gray-500">Minutes Read</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {readingProgress?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Books Started</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Time Distribution */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
            Reading Time Distribution
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            When you prefer to read
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <EmptyState 
            icon={Clock}
            title="Reading Time Analysis Coming Soon"
            description="See when you're most likely to read and optimize your reading schedule"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryReadingAnalytics;
