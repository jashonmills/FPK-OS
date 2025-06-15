
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useStudySessions } from '@/hooks/useStudySessions';

const StudyPerformanceCard: React.FC = () => {
  const { studySessions, loading } = useStudySessions();

  // Process study sessions to show performance over time
  const performanceData = React.useMemo(() => {
    if (!studySessions || studySessions.length === 0) return [];

    // Group sessions by week and calculate average accuracy
    const weeklyData = studySessions.reduce((acc: any[], session) => {
      const date = new Date(session.created_at);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      const existingWeek = acc.find(w => w.week === weekKey);
      if (existingWeek) {
        existingWeek.totalSessions += 1;
        existingWeek.totalAccuracy += (session.accuracy || 0);
        existingWeek.accuracy = existingWeek.totalAccuracy / existingWeek.totalSessions;
      } else {
        acc.push({
          week: weekKey,
          date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          accuracy: session.accuracy || 0,
          totalSessions: 1,
          totalAccuracy: session.accuracy || 0
        });
      }
      
      return acc;
    }, []);

    return weeklyData.slice(-6); // Last 6 weeks
  }, [studySessions]);

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
      loading={loading}
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
