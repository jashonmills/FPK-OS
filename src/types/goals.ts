
import type { Database } from '@/integrations/supabase/types';

export type Goal = Database['public']['Tables']['goals']['Row'];
export type GoalInsert = Database['public']['Tables']['goals']['Insert'];
export type GoalUpdate = Database['public']['Tables']['goals']['Update'];
export type GoalMilestoneCompletion = Database['public']['Tables']['goal_milestone_completions']['Row'];

export interface GoalMilestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  order: number;
  estimatedHours?: number;
}

export interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  saving: boolean;
  createGoal: (goal: Omit<GoalInsert, 'user_id'>) => Promise<Goal | null>;
  updateGoal: (id: string, updates: GoalUpdate) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  updateMilestone: (goalId: string, milestoneId: string, completed: boolean) => Promise<void>;
}
