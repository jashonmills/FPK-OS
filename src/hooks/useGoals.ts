import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Goal, GoalInsert, GoalUpdate } from '@/types/goals';

// Singleton class to manage goals data globally
class GoalsManager {
  private static instance: GoalsManager;
  private goals: Goal[] = [];
  private loading: boolean = false;
  private loadingPromise: Promise<Goal[]> | null = null;
  private error: string | null = null;
  private subscribers: Set<(goals: Goal[], loading: boolean, error: string | null) => void> = new Set();
  private userId: string | null = null;
  private hasLoadedOnce: boolean = false;

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
      console.log('🎯 GoalsManager: User changed from', this.userId, 'to', userId);
      this.userId = userId || null;
      this.goals = [];
      this.loading = false;
      this.error = null;
      this.loadingPromise = null;
      this.hasLoadedOnce = false;
    }

    // Immediately notify with current state
    callback(this.goals, this.loading, this.error);
    
    // Only load goals if we need to (haven't loaded once, not currently loading, and have user)
    if (userId && this.userId === userId && !this.hasLoadedOnce && !this.loading && !this.loadingPromise) {
      console.log('🎯 GoalsManager: Initiating goals load for user:', userId);
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
    // Prevent multiple simultaneous loads for the same user
    if (this.loadingPromise && this.userId === userId) {
      return this.loadingPromise;
    }

    // If we have already loaded for this user, return cached data
    if (this.userId === userId && this.hasLoadedOnce && !this.error) {
      console.log('🎯 GoalsManager: Using cached goals:', this.goals.length);
      return this.goals;
    }

    // Only set loading if we're not already loading
    if (!this.loading) {
      this.loading = true;
      this.error = null;
      this.notify();
    }

    this.loadingPromise = this.fetchGoals(userId, retryCount);
    const result = await this.loadingPromise;
    
    this.loading = false;
    this.loadingPromise = null;
    this.hasLoadedOnce = true;
    this.notify();
    
    return result;
  }

  private async fetchGoals(userId: string, retryCount = 0): Promise<Goal[]> {
    try {
      console.log('🎯 GoalsManager: Fetching goals for user:', userId, retryCount > 0 ? `(retry ${retryCount})` : '');
      
      // Check if we have a valid session before making the request
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 GoalsManager: Current session state:', { 
        hasSession: !!session, 
        userId: session?.user?.id, 
        targetUserId: userId 
      });
      
      if (!session || !session.user) {
        console.error('❌ GoalsManager: No valid session found');
        this.error = 'Authentication required. Please log in again.';
        return [];
      }
      
      if (session.user.id !== userId) {
        console.error('❌ GoalsManager: Session user ID does not match target user ID');
        this.error = 'Authentication mismatch. Please log in again.';
        return [];
      }
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ GoalsManager: Error fetching goals:', error);
        
        // Check if it's an authentication error
        if (error.code === 'PGRST301' || error.message.includes('JWT') || error.message.includes('auth')) {
          this.error = 'Authentication expired. Please log in again.';
          return [];
        }
        
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
      // Check session before creating goal
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 GoalsManager: Creating goal with session:', { 
        hasSession: !!session, 
        userId: session?.user?.id, 
        targetUserId: userId 
      });
      
      if (!session || !session.user) {
        console.error('❌ GoalsManager: No valid session for goal creation');
        throw new Error('Authentication required. Please log in again.');
      }
      
      if (session.user.id !== userId) {
        console.error('❌ GoalsManager: Session user ID does not match target user ID');
        throw new Error('Authentication mismatch. Please log in again.');
      }
      
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
        
        // Check if it's an authentication error
        if (error.code === 'PGRST301' || error.message.includes('JWT') || error.message.includes('auth')) {
          throw new Error('Authentication expired. Please log in again.');
        }
        
        throw new Error(error.message);
      }

      const newGoal = data as Goal;
      this.goals = [newGoal, ...this.goals];
      this.notify();
      return newGoal;
    } catch (err) {
      console.error('❌ GoalsManager: Error in createGoal:', err);
      throw err; // Re-throw to allow proper error handling in components
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const goalsManager = GoalsManager.getInstance();

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
    if (!user?.id) {
      setError('Authentication required. Please log in again.');
      return null;
    }

    setSaving(true);
    setError(null);
    
    try {
      const result = await goalsManager.createGoal(user.id, goalData);
      setSaving(false);
      return result;
    } catch (err) {
      setSaving(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      throw err; // Re-throw to allow component error handling
    }
  };

  const updateGoal = async (id: string, updates: GoalUpdate): Promise<void> => {
    setSaving(true);
    await goalsManager.updateGoal(id, updates);
    setSaving(false);
  };

  const deleteGoal = async (id: string): Promise<void> => {
    setSaving(true);
    await goalsManager.deleteGoal(id);
    setSaving(false);
  };

  const completeGoal = async (id: string): Promise<void> => {
    await updateGoal(id, { status: 'completed', completed_at: new Date().toISOString() });
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
    refetch: refetchGoals
  };
};