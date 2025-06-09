
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadGoals();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user?.id) {
      console.log('useGoals - No user ID available');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
        toast({
          title: "Error",
          description: "Failed to load goals.",
          variant: "destructive",
        });
      } else {
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error in loadGoals:', error);
      setGoals([]);
      toast({
        title: "Error",
        description: "Failed to load goals.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<GoalInsert, 'user_id'>) => {
    if (!user) return null;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        toast({
          title: "Error",
          description: "Failed to create goal.",
          variant: "destructive",
        });
        return null;
      }

      setGoals(prev => [data, ...prev]);
      toast({
        title: "Goal Created! 🎯",
        description: "Your new goal has been added successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error in createGoal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal.",
        variant: "destructive",
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateGoal = async (id: string, updates: GoalUpdate) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        toast({
          title: "Error",
          description: "Failed to update goal.",
          variant: "destructive",
        });
        return;
      }

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      toast({
        title: "Goal Updated! ✨",
        description: "Your goal has been updated successfully.",
      });
    } catch (error) {
      console.error('Error in updateGoal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const completeGoal = async (id: string) => {
    await updateGoal(id, { 
      status: 'completed', 
      progress: 100,
      completed_at: new Date().toISOString()
    });
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting goal:', error);
        toast({
          title: "Error",
          description: "Failed to delete goal.",
          variant: "destructive",
        });
        return;
      }

      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast({
        title: "Goal Deleted",
        description: "Your goal has been removed.",
      });
    } catch (error) {
      console.error('Error in deleteGoal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      });
    }
  };

  return {
    goals,
    loading,
    saving,
    createGoal,
    updateGoal,
    completeGoal,
    deleteGoal,
    refetch: loadGoals,
  };
};
