
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ActivityHeatmapData {
  activity_date: string;
  hour_of_day: number;
  activity_count: number;
  total_duration_minutes: number;
}

export const useActivityHeatmap = (daysBack: number = 30) => {
  const { user } = useAuth();
  const [data, setData] = useState<ActivityHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchActivityHeatmap = async () => {
      try {
        setLoading(true);
        
        const { data: heatmapData, error } = await supabase.rpc(
          'get_activity_heatmap',
          { user_uuid: user.id, days_back: daysBack }
        );

        if (error) throw error;

        setData(heatmapData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching activity heatmap:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activity heatmap');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityHeatmap();
  }, [user?.id, daysBack]);

  return { data, loading, error };
};
