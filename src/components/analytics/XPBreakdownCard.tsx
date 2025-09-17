
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { Award } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfileForAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface XPBreakdownItem {
  name: string;
  value: number;
  color: string;
}

interface XPBreakdownCardProps {
  userId?: string;
}

const XPBreakdownCard: React.FC<XPBreakdownCardProps> = ({ userId }) => {
  const { profile, loading } = useUserProfile(userId);
  const { user } = useAuth();
  const [xpBreakdown, setXpBreakdown] = React.useState<XPBreakdownItem[]>([]);
  const [breakdownLoading, setBreakdownLoading] = React.useState(true);
  
  // Use provided userId or fall back to current user
  const targetUserId = userId || user?.id;

  React.useEffect(() => {
    if (!targetUserId) return;

    const fetchXPBreakdown = async () => {
      try {
        setBreakdownLoading(true);
        
        const { data: xpEvents, error } = await supabase
          .from('xp_events')
          .select('event_type, event_value')
          .eq('user_id', targetUserId);

        if (error) throw error;

        // Group by event type and sum XP
        const breakdown = xpEvents?.reduce((acc, event) => {
          const type = event.event_type;
          acc[type] = (acc[type] || 0) + event.event_value;
          return acc;
        }, {} as Record<string, number>) || {};

        // Convert to chart format with colors
        const breakdownData = [
          { name: 'Reading Sessions', value: breakdown['reading_session'] || 0, color: '#8B5CF6' },
          { name: 'Course Completion', value: breakdown['course_completion'] || 0, color: '#F59E0B' },
          { name: 'Study Sessions', value: breakdown['study_session'] || 0, color: '#3B82F6' },
          { name: 'Daily Streaks', value: breakdown['streak_bonus'] || 0, color: '#10B981' },
          { name: 'Goal Achievement', value: breakdown['goal_completion'] || 0, color: '#EF4444' },
          { name: 'Note Creation', value: breakdown['note_creation'] || 0, color: '#8B5A2B' }
        ].filter(item => item.value > 0);

        setXpBreakdown(breakdownData);
      } catch (error) {
        console.error('Error fetching XP breakdown:', error);
      } finally {
        setBreakdownLoading(false);
      }
    };

    fetchXPBreakdown();
  }, [targetUserId]);

  return (
    <AnalyticsCard
      id="xp-breakdown"
      title="XP Sources Breakdown"
      description="Where your experience points come from"
      icon={Award}
      iconColor="text-amber-600"
      loading={loading || breakdownLoading}
      featureFlag="xp_breakdown_card"
    >
      {xpBreakdown.length > 0 ? (
        <>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={xpBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  nameKey="name"
                >
                  {xpBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
