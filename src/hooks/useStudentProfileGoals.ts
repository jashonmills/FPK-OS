import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrgGoal {
  id: string;
  organization_id: string;
  created_by: string;
  student_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  target_date?: string;
  created_at: string;
  updated_at: string;
}

interface GoalTarget {
  goal_id: string;
  user_id: string;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface StudentGoalWithProgress extends OrgGoal {
  progress: number;
  target_status: string;
}

/**
 * Hook to fetch and manage goals for a specific student profile
 * Used by instructors viewing a student's profile
 */
export function useStudentProfileGoals(studentProfileId?: string, studentLinkedUserId?: string) {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['student-profile-goals', studentProfileId, studentLinkedUserId],
    queryFn: async () => {
      if (!studentProfileId) return [];

      // Query goals by the student's profile ID
      const { data: goalsData, error: goalsError } = await supabase
        .from('org_goals')
        .select('*')
        .eq('student_id', studentProfileId)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // If student has a linked user account, fetch their progress
      let targetsData: GoalTarget[] = [];
      if (studentLinkedUserId && goalsData && goalsData.length > 0) {
        const goalIds = goalsData.map(g => g.id);
        
        const { data: targets, error: targetsError } = await supabase
          .from('org_goal_targets')
          .select('*')
          .eq('user_id', studentLinkedUserId)
          .in('goal_id', goalIds);

        if (targetsError) {
          console.error('Error fetching goal targets:', targetsError);
        } else {
          targetsData = targets || [];
        }
      }

      // Combine goals with progress
      const goalsWithProgress: StudentGoalWithProgress[] = (goalsData || []).map(goal => {
        const target = targetsData.find(t => t.goal_id === goal.id);
        return {
          ...goal,
          progress: target?.progress || 0,
          target_status: target?.status || 'active',
        };
      });

      return goalsWithProgress;
    },
    enabled: !!studentProfileId,
    staleTime: 1000 * 60, // 1 minute
  });

  const updateProgress = useMutation({
    mutationFn: async ({ goalId, userId, progress }: { goalId: string; userId: string; progress: number }) => {
      const { error } = await supabase
        .from('org_goal_targets')
        .upsert({
          goal_id: goalId,
          user_id: userId,
          progress: Math.min(100, Math.max(0, progress)),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile-goals'] });
      toast.success('Progress updated');
    },
    onError: (error) => {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    },
  });

  return {
    goals,
    isLoading,
    error,
    refetch,
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending,
  };
}
