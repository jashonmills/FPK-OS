
import { supabase } from '@/integrations/supabase/client';
import type { Goal, GoalInsert, GoalUpdate } from '@/types/goals';
import { logger } from '@/utils/logger';

export class GoalsService {
  static async loadGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error loading goals', 'GOALS', error);
      throw error;
    }

    return data || [];
  }

  static async createGoal(goal: GoalInsert): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();

    if (error) {
      logger.error('Error creating goal', 'GOALS', error);
      throw error;
    }

    return data;
  }

  static async updateGoal(id: string, updates: GoalUpdate): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating goal', 'GOALS', error);
      throw error;
    }

    return data;
  }

  static async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting goal', 'GOALS', error);
      throw error;
    }
  }
}
