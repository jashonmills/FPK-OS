
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useStudySessions } from '@/hooks/useStudySessions';
import { SessionData, ChartDataPoint } from '@/types/analytics-data';

export interface ExtendedChartDataPoint extends ChartDataPoint {
  week?: string;
  totalSessions?: number;
  totalAccuracy?: number;
  accuracy?: number;
  color?: string;
}

const StudyPerformanceCard: React.FC = () => {
  const { sessions, isLoading } = useStudySessions();

  // Process study sessions to show performance over time
  const performanceData = React.useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    // Group sessions by week and calculate average accuracy
    const weeklyData = sessions.reduce((acc: ExtendedChartDataPoint[], session) => {
      const date = new Date(session.created_at);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      // Calculate accuracy percentage
      const accuracy = session.total_cards > 0 
        ? Math.round((session.correct_answers / session.total_cards) * 100)
        : 0;
      
      const existingWeek = acc.find(w => w.week === weekKey);
      if (existingWeek) {
        existingWeek.totalSessions += 1;
        existingWeek.totalAccuracy += accuracy;
        existingWeek.accuracy = Math.round(existingWeek.totalAccuracy / existingWeek.totalSessions);
      } else {
        acc.push({
          name: weekKey,
          value: accuracy,
          week: weekKey,
          date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          accuracy: accuracy,
          totalSessions: 1,
          totalAccuracy: accuracy
        });
      }
      
      return acc;
    }, []);

    return weeklyData.slice(-6); // Last 6 weeks
  }, [sessions]);

  const chartConfig = {
    accuracy: {
      label: 'Accuracy %',
      color: '#10B981',
    },
  };

  return (
    <AnalyticsCard
      id="study-performance"
      title="Study Performance"
      description="Your accuracy trends over time"
      icon={TrendingUp}
      iconColor="text-green-600"
      loading={isLoading}
      featureFlag="study_performance_card"
    >
      {performanceData.length > 0 ? (
        <>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accuracy)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 text-center text-sm text-gray-600">
            Recent average: {Math.round(performanceData[performanceData.length - 1]?.accuracy || 0)}% accuracy
          </div>
        </>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No study data yet</p>
            <p className="text-sm">Complete study sessions to track performance</p>
          </div>
        </div>
      )}
    </AnalyticsCard>
  );
};

export default StudyPerformanceCard;
