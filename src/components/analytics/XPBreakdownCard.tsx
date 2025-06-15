
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { Award } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useUserProfile } from '@/hooks/useUserProfile';

const XPBreakdownCard: React.FC = () => {
  const { profile, loading } = useUserProfile();

  // Mock XP breakdown data - in real implementation, this would come from analytics
  const xpBreakdownData = [
    { name: 'Reading Sessions', value: Math.floor((profile?.total_xp || 0) * 0.4), color: '#8B5CF6' },
    { name: 'Course Completion', value: Math.floor((profile?.total_xp || 0) * 0.3), color: '#F59E0B' },
    { name: 'Study Sessions', value: Math.floor((profile?.total_xp || 0) * 0.2), color: '#3B82F6' },
    { name: 'Daily Streaks', value: Math.floor((profile?.total_xp || 0) * 0.1), color: '#10B981' }
  ].filter(item => item.value > 0);

  const chartConfig = {
    readingSessions: {
      label: 'Reading Sessions',
      color: '#8B5CF6',
    },
    courseCompletion: {
      label: 'Course Completion',
      color: '#F59E0B',
    },
    studySessions: {
      label: 'Study Sessions', 
      color: '#3B82F6',
    },
    dailyStreaks: {
      label: 'Daily Streaks',
      color: '#10B981',
    },
  };

  return (
    <AnalyticsCard
      id="xp-breakdown"
      title="XP Sources Breakdown"
      description="Where your experience points come from"
      icon={Award}
      iconColor="text-amber-600"
      loading={loading}
      featureFlag="xp_breakdown_card"
    >
      {xpBreakdownData.length > 0 ? (
        <>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={xpBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  nameKey="name"
                >
                  {xpBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2 text-sm">
            <div className="text-center text-gray-600">
              Total XP: <span className="font-semibold text-purple-600">{profile?.total_xp || 0}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No XP earned yet</p>
            <p className="text-sm">Start learning to see your XP breakdown</p>
          </div>
        </div>
      )}
    </AnalyticsCard>
  );
};

export default XPBreakdownCard;
