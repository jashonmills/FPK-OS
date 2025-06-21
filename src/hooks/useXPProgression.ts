
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface XPProgressionData {
  week: string;
  xp: number;
  date: string;
}

export const useXPProgression = (weeksBack: number = 6) => {
  const { user } = useAuth();
  const [data, setData] = useState<XPProgressionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchXPProgression = async () => {
      try {
        setLoading(true);
        
        // Get XP events for the last N weeks
        const weeksAgo = new Date();
        weeksAgo.setDate(weeksAgo.getDate() - (weeksBack * 7));

        const { data: xpEvents, error } = await supabase
          .from('xp_events')
          .select('event_value, created_at')
          .eq('user_id', user.id)
          .gte('created_at', weeksAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by week and calculate cumulative XP
        const weeklyData: { [key: string]: number } = {};
        let cumulativeXP = 0;

        xpEvents?.forEach(event => {
          const date = new Date(event.created_at);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
          const weekKey = weekStart.toISOString().split('T')[0];
          
          cumulativeXP += event.event_value;
          weeklyData[weekKey] = cumulativeXP;
        });

        // Convert to array format
        const progressionArray = Object.entries(weeklyData)
          .map(([date, xp], index) => ({
            week: `Week ${index + 1}`,
            xp,
            date
          }))
          .slice(-weeksBack); // Keep only last N weeks

        setData(progressionArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching XP progression:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch XP progression');
      } finally {
        setLoading(false);
      }
    };

    fetchXPProgression();
  }, [user?.id, weeksBack]);

  return { data, loading, error };
};
