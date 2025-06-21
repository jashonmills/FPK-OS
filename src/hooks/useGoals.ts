
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    console.log('🔗 Setting up goals real-time subscription for user:', user.id);
    
    // Load goals initially
    loadGoals();
    
    // Clean up any existing channel
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing goals channel');
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.log('Error removing existing channel:', error);
      }
      channelRef.current = null;
    }

    // Create a unique channel name with timestamp to avoid conflicts
    const channelName = `goals-${user.id}-${Date.now()}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        if (!mountedRef.current) return;
        console.log('Real-time goal update:', payload);
        loadGoals(); // Refresh goals when changes occur
      }
    );

    channel.subscribe((status) => {
      console.log('Goals channel subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Goals channel successfully subscribed');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('❌ Goals channel closed or error');
      }
    });

    // Store the channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('🧹 Cleaning up goals channel on unmount');
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.log('Error removing channel on cleanup:', error);
        }
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  const loadGoals = async () => {
    if (!mountedRef.current) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading goals:', error);
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to load goals.",
            variant: "destructive",
          });
        }
        return;
      }

      if (mountedRef.current) {
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error in loadGoals:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to load goals.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const createGoal = async (goal: Omit<GoalInsert, 'user_id'>) => {
    if (!user || !mountedRef.current) return null;

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
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to create goal.",
            variant: "destructive",
          });
        }
        return null;
      }

      if (mountedRef.current) {
        setGoals(prev => [data, ...prev]);
        toast({
          title: "Goal Created! 🎯",
          description: "Your new goal has been added successfully.",
        });
      }
      return data;
    } catch (error) {
      console.error('Error in createGoal:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to create goal.",
          variant: "destructive",
        });
      }
      return null;
    } finally {
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  const updateGoal = async (id: string, updates: GoalUpdate) => {
    if (!mountedRef.current) return;

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
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to update goal.",
            variant: "destructive",
          });
        }
        return;
      }

      if (mountedRef.current) {
        setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
        toast({
          title: "Goal Updated! ✨",
          description: "Your goal has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error in updateGoal:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to update goal.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  const completeGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal || !mountedRef.current) return;

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
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to complete goal.",
            variant: "destructive",
          });
        }
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

      if (mountedRef.current) {
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
      }
    } catch (error) {
      console.error('Error in completeGoal:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to complete goal.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  const deleteGoal = async (id: string) => {
    if (!mountedRef.current) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting goal:', error);
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to delete goal.",
            variant: "destructive",
          });
        }
        return;
      }

      if (mountedRef.current) {
        setGoals(prev => prev.filter(goal => goal.id !== id));
        toast({
          title: "Goal Deleted",
          description: "Your goal has been removed.",
        });
      }
    } catch (error) {
      console.error('Error in deleteGoal:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to delete goal.",
          variant: "destructive",
        });
      }
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
