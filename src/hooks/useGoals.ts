
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Goal, GoalInsert, GoalUpdate } from '@/types/goals';

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      // Type assertion to handle the database string types
      setGoals((data || []) as Goal[]);
    } catch (err) {
      console.error('❌ Error in fetchGoals:', err);
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

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
  }, [user?.id]);

  const refetchGoals = () => {
    fetchGoals();
  };

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
