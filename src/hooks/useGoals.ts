
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  progress: number;
  target_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  milestones?: any[];
}

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🎯 Fetching goals for user:', user.id);
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching goals:', error);
        setError(error.message);
        return;
      }

      console.log('🎯 Fetched goals:', data?.length || 0);
      setGoals(data || []);
    } catch (err) {
      console.error('❌ Error in fetchGoals:', err);
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user?.id]);

  // Simple refetch function without subscriptions
  const refetchGoals = () => {
    fetchGoals();
  };

  return {
    goals,
    loading,
    error,
    refetchGoals
  };
};
