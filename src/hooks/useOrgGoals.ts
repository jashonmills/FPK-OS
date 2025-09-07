import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export interface OrgGoal {
  id: string;
  organization_id: string;
  created_by: string;
  student_id: string;
  title: string;
  description: string;
  category: string;
  folder_path: string;
  target_date: string;
  status: string;
  priority: string;
  progress_percentage: number;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface GoalTarget {
  goal_id: string;
  user_id: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export function useOrgGoals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  const { data: goals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-goals', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_goals')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org goals:', error);
        throw error;
      }

      return data as OrgGoal[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: { title: string; description: string; category: string; student_id: string; priority: string }) => {
      // Create goal using existing table structure
      const { data: goalResult, error: goalError } = await supabase
        .from('org_goals')
        .insert({
          ...goalData,
          organization_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          folder_path: '/',
          target_date: new Date().toISOString().split('T')[0],
          status: 'active',
          progress_percentage: 0,
          metadata: {},
        })
        .select()
        .single();

      if (goalError) throw goalError;
      return goalResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-goals'] });
      toast({
        title: "Success",
        description: "Goal created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal.",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (goalData: Partial<OrgGoal> & { id: string }) => {
      const { id, ...updateData } = goalData;
      const { data, error } = await supabase
        .from('org_goals')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-goals'] });
      toast({
        title: "Success",
        description: "Goal updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      });
    },
  });

  return {
    goals,
    isLoading,
    error,
    refetch,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
  };
}

export function useGoalTargets(goalId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: targets = [], isLoading } = useQuery({
    queryKey: ['goal-targets', goalId],
    queryFn: async () => {
      if (!goalId) return [];
      
      const { data, error } = await supabase
        .from('org_goal_targets')
        .select(`
          *,
          profiles:user_id (
            display_name,
            full_name
          )
        `)
        .eq('goal_id', goalId);

      if (error) {
        console.error('Error fetching goal targets:', error);
        throw error;
      }

      return data as (GoalTarget & { profiles: any })[];
    },
    enabled: !!goalId,
  });

  const updateTargetMutation = useMutation({
    mutationFn: async (targetData: Partial<GoalTarget> & { goal_id: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('org_goal_targets')
        .update(targetData)
        .eq('goal_id', targetData.goal_id)
        .eq('user_id', targetData.user_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal-targets'] });
      toast({
        title: "Success",
        description: "Goal progress updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating goal target:', error);
      toast({
        title: "Error",
        description: "Failed to update goal progress.",
        variant: "destructive",
      });
    },
  });

  return {
    targets,
    isLoading,
    updateTarget: updateTargetMutation.mutate,
    isUpdating: updateTargetMutation.isPending,
  };
}