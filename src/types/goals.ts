
import type { Database } from '@/integrations/supabase/types';

export type Goal = Database['public']['Tables']['goals']['Row'];
export type GoalInsert = Database['public']['Tables']['goals']['Insert'];
export type GoalUpdate = Database['public']['Tables']['goals']['Update'];

export interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  saving: boolean;
  createGoal: (goal: Omit<GoalInsert, 'user_id'>) => Promise<Goal | null>;
  updateGoal: (id: string, updates: GoalUpdate) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}
