
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Goal, GoalInsert, GoalUpdate } from '@/types/goals';

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async (retryCount = 0) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🎯 Fetching goals for user:', user.id, retryCount > 0 ? `(retry ${retryCount})` : '');
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching goals:', error);
        
        // Retry logic for network failures
        if (retryCount < 2 && (error.message.includes('Failed to fetch') || error.message.includes('network'))) {
          console.log(`🔄 Retrying goals fetch in ${(retryCount + 1) * 1000}ms...`);
          setTimeout(() => fetchGoals(retryCount + 1), (retryCount + 1) * 1000);
          return;
        }
        
        setError(error.message);
        return;
      }

      console.log('🎯 Fetched goals:', data?.length || 0, data);
      // Type assertion to handle the database string types
      const validatedGoals = (data || []).map(goal => ({
        ...goal,
        status: goal.status || 'active',
        progress: goal.progress || 0,
        category: goal.category || 'general'
      })) as Goal[];
      
      setGoals(validatedGoals);
    } catch (err) {
      console.error('❌ Error in fetchGoals:', err);
      
      // Retry for network errors
      if (retryCount < 2) {
        console.log(`🔄 Retrying goals fetch due to network error in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => fetchGoals(retryCount + 1), (retryCount + 1) * 1000);
        return;
      }
      
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createGoal = async (goalData: Omit<GoalInsert, 'user_id'>): Promise<Goal | null> => {
    if (!user?.id) return null;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating goal:', error);
        return null;
      }

      const newGoal = data as Goal;
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      console.error('❌ Error in createGoal:', err);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateGoal = async (id: string, updates: GoalUpdate): Promise<void> => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating goal:', error);
        return;
      }

      const updatedGoal = data as Goal;
      setGoals(prev => prev.map(goal => goal.id === id ? updatedGoal : goal));
    } catch (err) {
      console.error('❌ Error in updateGoal:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteGoal = async (id: string): Promise<void> => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting goal:', error);
        return;
      }

      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err) {
      console.error('❌ Error in deleteGoal:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchGoals();

    // Set up real-time subscription for goals
    if (user?.id) {
      const channelId = `goals-changes-${user.id}-${Date.now()}`;
      const channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'goals',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('🔄 Real-time goal update:', payload);
            // Refetch goals on any change
            fetchGoals();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id, fetchGoals]);

  const refetchGoals = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    saving,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetchGoals
  };
};
