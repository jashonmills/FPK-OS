
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { useQueryClient } from '@tanstack/react-query';
import { useGoalsSubscription } from '@/hooks/useGoalsSubscription';
import { GoalsService } from '@/services/goalsService';
import type { Goal, GoalInsert, GoalUpdate, UseGoalsReturn } from '@/types/goals';

export const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardGoalCompletionXP } = useXPIntegration();
  const queryClient = useQueryClient();
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadGoals = useCallback(async () => {
    if (!user?.id || !mountedRef.current || loadingRef.current) {
      console.log('🔄 Skipping goals load - conditions not met', { 
        hasUser: !!user?.id, 
        mounted: mountedRef.current, 
        loading: loadingRef.current 
      });
      return;
    }
    
    loadingRef.current = true;
    console.log('🔄 Loading goals for user:', user.id);
    
    try {
      const data = await GoalsService.loadGoals();
      if (mountedRef.current) {
        console.log('✅ Goals loaded successfully:', data.length);
        setGoals(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error loading goals:', error);
      if (mountedRef.current) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load goals. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    } finally {
      loadingRef.current = false;
    }
  }, [user?.id, toast]);

  const createGoal = useCallback(async (goal: Omit<GoalInsert, 'user_id'>): Promise<Goal | null> => {
    if (!user || !mountedRef.current) return null;

    setSaving(true);
    try {
      const data = await GoalsService.createGoal({
        ...goal,
        user_id: user.id,
      });

      if (mountedRef.current) {
        setGoals(prev => [data, ...prev]);
        toast({
          title: "Goal Created! 🎯",
          description: "Your new goal has been added successfully.",
        });
      }
      return data;
    } catch (error) {
      console.error('❌ Error creating goal:', error);
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
  }, [user, toast]);

  const updateGoal = useCallback(async (id: string, updates: GoalUpdate) => {
    if (!mountedRef.current) return;

    setSaving(true);
    try {
      const data = await GoalsService.updateGoal(id, updates);

      if (mountedRef.current) {
        setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
        toast({
          title: "Goal Updated! ✨",
          description: "Your goal has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('❌ Error updating goal:', error);
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
  }, [toast]);

  const completeGoal = useCallback(async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal || !mountedRef.current) return;

    setSaving(true);
    try {
      const updatedGoal = await GoalsService.updateGoal(id, { 
        status: 'completed', 
        progress: 100,
        completed_at: new Date().toISOString()
      });

      try {
        await awardGoalCompletionXP(goal.category, goal.priority);
        console.log('✅ Goal completion XP awarded');
      } catch (xpError) {
        console.error('Error awarding goal completion XP:', xpError);
      }

      if (mountedRef.current) {
        setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['achievements'] });
        queryClient.invalidateQueries({ queryKey: ['gamification-stats'] });

        toast({
          title: "🎉 Goal Completed!",
          description: `Congratulations! You've completed "${goal.title}". Check your achievements for rewards!`,
        });
      }
    } catch (error) {
      console.error('❌ Error completing goal:', error);
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
  }, [goals, awardGoalCompletionXP, queryClient, toast]);

  const deleteGoal = useCallback(async (id: string) => {
    if (!mountedRef.current) return;

    try {
      await GoalsService.deleteGoal(id);

      if (mountedRef.current) {
        setGoals(prev => prev.filter(goal => goal.id !== id));
        toast({
          title: "Goal Deleted",
          description: "Your goal has been removed.",
        });
      }
    } catch (error) {
      console.error('❌ Error deleting goal:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to delete goal.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Set up real-time subscription
  useGoalsSubscription({ 
    onGoalsChange: useCallback(() => {
      if (mountedRef.current) {
        console.log('🔄 Real-time update triggered, reloading goals...');
        loadGoals();
      }
    }, [loadGoals])
  });

  // Load goals initially
  useEffect(() => {
    if (user?.id) {
      console.log('👤 User found, loading initial goals...');
      loadGoals();
    }
  }, [user?.id, loadGoals]);

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
