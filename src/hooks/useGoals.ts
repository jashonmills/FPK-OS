import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';
import type { Goal, GoalInsert, GoalUpdate } from '@/types/goals';

// Singleton class to manage goals data globally
class GoalsManager {
  private static instance: GoalsManager;
  private goals: Goal[] = [];
  private loading: boolean = true;
  private loadingPromise: Promise<Goal[]> | null = null;
  private error: string | null = null;
  private subscribers: Set<(goals: Goal[], loading: boolean, error: string | null) => void> = new Set();
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): GoalsManager {
    if (!GoalsManager.instance) {
      GoalsManager.instance = new GoalsManager();
    }
    return GoalsManager.instance;
  }

  subscribe(
    userId: string | undefined,
    callback: (goals: Goal[], loading: boolean, error: string | null) => void
  ) {
    this.subscribers.add(callback);
    
    // If user changed, reset state
    if (this.userId !== userId) {
      this.userId = userId || null;
      this.goals = [];
      this.loading = true;
      this.error = null;
      this.loadingPromise = null;
    }

    // Immediately notify with current state
    callback(this.goals, this.loading, this.error);
    
    // Load goals if user is available
    if (userId) {
      this.loadGoals(userId);
    }
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => {
      callback(this.goals, this.loading, this.error);
    });
  }

  async loadGoals(userId: string, retryCount = 0): Promise<Goal[]> {
    // If already loading for this user, return existing promise
    if (this.loadingPromise && this.userId === userId) {
      return this.loadingPromise;
    }

    // If already loaded for this user, return cached data
    if (this.goals.length > 0 && !this.loading && this.userId === userId) {
      return this.goals;
    }

    this.loading = true;
    this.error = null;
    this.notify();

    this.loadingPromise = this.fetchGoals(userId, retryCount);
    const result = await this.loadingPromise;
    
    this.loading = false;
    this.loadingPromise = null;
    this.notify();
    
    return result;
  }

  private async fetchGoals(userId: string, retryCount = 0): Promise<Goal[]> {
    try {
      console.log('🎯 GoalsManager: Fetching goals for user:', userId, retryCount > 0 ? `(retry ${retryCount})` : '');
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ GoalsManager: Error fetching goals:', error);
        
        // Retry logic for network failures
        if (retryCount < 2 && (error.message.includes('Failed to fetch') || error.message.includes('network'))) {
          console.log(`🔄 GoalsManager: Retrying goals fetch in ${(retryCount + 1) * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          return this.fetchGoals(userId, retryCount + 1);
        }
        
        this.error = error.message;
        return [];
      }

      console.log('🎯 GoalsManager: Fetched goals:', data?.length || 0, data);
      
      // Type assertion to handle the database string types
      const validatedGoals = (data || []).map(goal => ({
        ...goal,
        status: goal.status || 'active',
        progress: goal.progress || 0,
        category: goal.category || 'general'
      })) as Goal[];
      
      this.goals = validatedGoals;
      this.error = null;
      return validatedGoals;
    } catch (err) {
      console.error('❌ GoalsManager: Error in fetchGoals:', err);
      
      // Retry for network errors
      if (retryCount < 2) {
        console.log(`🔄 GoalsManager: Retrying goals fetch due to network error in ${(retryCount + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return this.fetchGoals(userId, retryCount + 1);
      }
      
      this.error = 'Failed to fetch goals';
      return [];
    }
  }

  async createGoal(userId: string, goalData: Omit<GoalInsert, 'user_id'>): Promise<Goal | null> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goalData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ GoalsManager: Error creating goal:', error);
        return null;
      }

      const newGoal = data as Goal;
      this.goals = [newGoal, ...this.goals];
      this.notify();
      return newGoal;
    } catch (err) {
      console.error('❌ GoalsManager: Error in createGoal:', err);
      return null;
    }
  }

  async updateGoal(id: string, updates: GoalUpdate): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ GoalsManager: Error updating goal:', error);
        return;
      }

      const updatedGoal = data as Goal;
      this.goals = this.goals.map(goal => goal.id === id ? updatedGoal : goal);
      this.notify();
    } catch (err) {
      console.error('❌ GoalsManager: Error in updateGoal:', err);
    }
  }

  async deleteGoal(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ GoalsManager: Error deleting goal:', error);
        return;
      }

      this.goals = this.goals.filter(goal => goal.id !== id);
      this.notify();
    } catch (err) {
      console.error('❌ GoalsManager: Error in deleteGoal:', err);
    }
  }
}

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const goalsManager = GoalsManager.getInstance();
  const analytics = useAnalyticsPublisher();

  useEffect(() => {
    // Subscribe to goals changes
    const unsubscribe = goalsManager.subscribe(user?.id, (newGoals, isLoading, errorMessage) => {
      setGoals(newGoals);
      setLoading(isLoading);
      setError(errorMessage);
    });

    return unsubscribe;
  }, [user?.id]);

  const createGoal = async (goalData: Omit<GoalInsert, 'user_id'>): Promise<Goal | null> => {
    if (!user?.id) return null;

    setSaving(true);
    const result = await goalsManager.createGoal(user.id, goalData);
    
    // Track goal creation analytics
    if (result) {
      analytics.publishGoalCreated(
        result.id,
        result.category || 'general',
        result.priority || 'medium',
        {
          has_deadline: !!result.target_date,
          milestone_count: Array.isArray(result.milestones) ? result.milestones.length : 0,
          title: result.title
        }
      );
    }
    
    setSaving(false);
    return result;
  };

  const updateGoal = async (id: string, updates: GoalUpdate): Promise<void> => {
    setSaving(true);
    
    // Track goal update analytics
    const originalGoal = goals.find(g => g.id === id);
    if (originalGoal) {
      analytics.publishGoalUpdated(id, updates, {
        original_status: originalGoal.status,
        new_status: updates.status || originalGoal.status,
        progress_change: updates.progress !== undefined ? (updates.progress - originalGoal.progress) : 0
      });
    }
    
    await goalsManager.updateGoal(id, updates);
    setSaving(false);
  };

  const deleteGoal = async (id: string): Promise<void> => {
    setSaving(true);
    
    // Track goal deletion analytics
    const goalToDelete = goals.find(g => g.id === id);
    if (goalToDelete) {
      analytics.publishGoalDeleted(id, {
        category: goalToDelete.category,
        status: goalToDelete.status,
        progress: goalToDelete.progress,
        days_active: goalToDelete.created_at ? 
          Math.ceil((Date.now() - new Date(goalToDelete.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0
      });
    }
    
    await goalsManager.deleteGoal(id);
    setSaving(false);
  };

  const completeGoal = async (id: string): Promise<void> => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      // Track goal completion analytics
      analytics.publishGoalCompleted(id, {
        category: goal.category,
        time_to_complete: goal.created_at ? 
          Math.ceil((Date.now() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        final_progress: goal.progress,
        milestone_count: Array.isArray(goal.milestones) ? goal.milestones.length : 0
      });
    }
    
    await updateGoal(id, { status: 'completed', completed_at: new Date().toISOString() });
  };

  const updateMilestone = async (goalId: string, milestoneId: string, completed: boolean): Promise<void> => {
    if (!user?.id) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.milestones) return;

    const milestones = Array.isArray(goal.milestones) ? goal.milestones : [];
    const updatedMilestones = milestones.map((m: any) => 
      m.id === milestoneId 
        ? { ...m, completed, completedAt: completed ? new Date().toISOString() : undefined }
        : m
    );

    // Track milestone completion for analytics
    if (completed) {
      try {
        const { GoalMilestonesService } = await import('@/services/goalMilestonesService');
        const milestone = milestones.find((m: any) => m.id === milestoneId);
        if (milestone && typeof milestone === 'object' && 'title' in milestone) {
          await GoalMilestonesService.trackMilestoneCompletion(
            user.id,
            goalId,
            milestoneId,
            milestone.title as string
          );
          
          // Track milestone completion analytics
          analytics.publishMilestoneCompleted(goalId, milestoneId, {
            milestone_title: milestone.title,
            goal_category: goal.category,
            goal_progress: goal.progress
          });
        }
      } catch (error) {
        console.error('Error tracking milestone completion:', error);
      }
    }

    // Calculate new progress based on completed milestones
    const completedCount = updatedMilestones.filter((m: any) => m.completed).length;
    const progress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : 0;

    await updateGoal(goalId, { 
      milestones: updatedMilestones,
      progress
    });
  };

  const refetchGoals = useCallback(() => {
    if (user?.id) {
      return goalsManager.loadGoals(user.id);
    }
    return Promise.resolve([]);
  }, [user?.id]);

  return {
    goals,
    loading,
    saving,
    error,
    createGoal,
    updateGoal,
    completeGoal,
    deleteGoal,
    refetch: refetchGoals,
    updateMilestone
  };
};