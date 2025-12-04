
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useWeeklyActivity } from '@/hooks/useWeeklyActivity';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import EmptyState from '@/components/analytics/EmptyState';

const EngagementAnalytics = () => {
  const { weeklyActivity, isLoading: weeklyLoading } = useWeeklyActivity();
  const { 
    dailyActivityHeatmap, 
    liveHubInteractions, 
    loading: advancedLoading 
  } = useAdvancedAnalytics('engagement');

  const chartConfig = {
    studySessions: {
      label: 'Study Sessions',
      color: '#8B5CF6',
    },
    studyTime: {
      label: 'Study Time (min)',
      color: '#F59E0B',
    },
  };

  if (weeklyLoading || advancedLoading) {
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
      {/* Weekly Learning Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Weekly Learning Activity
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Study sessions and time spent per day
          </p>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0">
          {weeklyActivity.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="studySessions" fill="var(--color-studySessions)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="studyTime" fill="var(--color-studyTime)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={Activity}
              title="No activity data yet"
              description="Complete study sessions to see your weekly activity patterns"
            />
          )}
        </CardContent>
      </Card>

      {/* Daily Activity Heatmap */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Daily Activity Heatmap
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Study activity patterns by hour and day
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <EmptyState 
            icon={Calendar}
            title="Heatmap Coming Soon"
            description="Advanced activity heatmap visualization will show your study patterns by time of day and day of week"
          />
        </CardContent>
      </Card>

      {/* Live-Hub Content Views */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Live-Hub Content Views
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Engagement with Live Hub content
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <EmptyState 
            icon={TrendingUp}
            title="Live Hub Analytics Coming Soon"
            description="Track your engagement with APOD, weather science, and other Live Hub content"
          />
        </CardContent>
      </Card>

      {/* Peak Activity Hours */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
            Peak Activity Hours
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your most productive study times
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium">Analysis in Progress</p>
            <p className="text-xs text-gray-500 mt-1">
              We're analyzing your study patterns to identify your peak productivity hours
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementAnalytics;
