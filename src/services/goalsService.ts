
import { supabase } from '@/integrations/supabase/client';
import type { Goal, GoalInsert, GoalUpdate } from '@/types/goals';

export class GoalsService {
  static async loadGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
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
      console.error('Error creating goal:', error);
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
      console.error('Error updating goal:', error);
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
      console.error('Error deleting goal:', error);
      throw error;
    }
  }
}
