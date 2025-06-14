import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { useQueryClient } from '@tanstack/react-query';
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
  const { awardGoalCompletionXP } = useXPIntegration();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);

  useEffect(() => {
    if (user && !isSubscribedRef.current) {
      loadGoals();
      
      // Clean up any existing channel before creating a new one
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.log('Error removing previous goals channel:', error);
        }
        channelRef.current = null;
        isSubscribedRef.current = false;
      }

      // Create a unique channel for goals
      const channelName = `goals-changes-${user.id}-${Date.now()}`;
      const channel = supabase.channel(channelName);

      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time goal update:', payload);
          loadGoals(); // Refresh goals when changes occur
        }
      );

      channel.subscribe((status) => {
        console.log('Goals channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isSubscribedRef.current = false;
        }
      });

      channelRef.current = channel;

      return () => {
        if (channelRef.current && isSubscribedRef.current) {
          try {
            supabase.removeChannel(channelRef.current);
          } catch (error) {
            console.log('Error removing goals channel on cleanup:', error);
          }
          channelRef.current = null;
          isSubscribedRef.current = false;
        }
      };
    }
  }, [user?.id]); // Only depend on user.id

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading goals:', error);
        toast({
          title: "Error",
          description: "Failed to load goals.",
          variant: "destructive",
        });
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Error in loadGoals:', error);
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
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    setSaving(true);
    try {
      // Update goal status first
      const { data: updatedGoal, error } = await supabase
        .from('goals')
        .update({ 
          status: 'completed', 
          progress: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error completing goal:', error);
        toast({
          title: "Error",
          description: "Failed to complete goal.",
          variant: "destructive",
        });
        return;
      }

      // Award XP and trigger achievements
      try {
        await awardGoalCompletionXP(goal.category, goal.priority);
        console.log('✅ Goal completion XP awarded');
      } catch (xpError) {
        console.error('Error awarding goal completion XP:', xpError);
        // Don't fail the goal completion if XP fails
      }

      // Update local state
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));

      // Invalidate related queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['gamification-stats'] });

      toast({
        title: "🎉 Goal Completed!",
        description: `Congratulations! You've completed "${goal.title}". Check your achievements for rewards!`,
      });

    } catch (error) {
      console.error('Error in completeGoal:', error);
      toast({
        title: "Error",
        description: "Failed to complete goal.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
