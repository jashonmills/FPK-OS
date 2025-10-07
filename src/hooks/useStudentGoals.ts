import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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

export function useStudentGoals(organizationId?: string) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StudentGoalWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    fetchStudentGoals();
  }, [user?.id, organizationId]);

  const fetchStudentGoals = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // First, get the current user's org_students record to find their student_id
      const { data: studentRecords, error: studentError } = await supabase
        .from('org_students')
        .select('id, org_id')
        .eq('linked_user_id', user.id);

      if (studentError) throw studentError;

      if (!studentRecords || studentRecords.length === 0) {
        console.log('No student records found for user');
        setGoals([]);
        setIsLoading(false);
        return;
      }

      // Get all student IDs and filter by org if specified
      let studentIds = studentRecords.map(s => s.id);
      if (organizationId) {
        studentIds = studentRecords
          .filter(s => s.org_id === organizationId)
          .map(s => s.id);
      }

      if (studentIds.length === 0) {
        setGoals([]);
        setIsLoading(false);
        return;
      }

      // Fetch goals assigned to this student
      let query = supabase
        .from('org_goals')
        .select('*')
        .in('student_id', studentIds)
        .order('created_at', { ascending: false });

      // Filter by organization if specified
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data: goalsData, error: goalsError } = await query;

      // Fetch progress for these goals
      const goalIds = (goalsData || []).map(g => g.id);
      let targetsData: GoalTarget[] = [];

      if (goalIds.length > 0) {
        const { data: targets, error: targetsError } = await supabase
          .from('org_goal_targets')
          .select('*')
          .eq('user_id', user.id)
          .in('goal_id', goalIds);

        if (targetsError) throw targetsError;
        targetsData = targets || [];
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

      setGoals(goalsWithProgress);
    } catch (err) {
      console.error('Error fetching student goals:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (goalId: string, progress: number) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('org_goal_targets')
        .upsert({
          goal_id: goalId,
          user_id: user.id,
          progress: Math.min(100, Math.max(0, progress)),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Progress updated');
      await fetchStudentGoals();
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
    }
  };

  const markComplete = async (goalId: string) => {
    await updateProgress(goalId, 100);
    
    try {
      const { error } = await supabase
        .from('org_goal_targets')
        .update({ status: 'completed' })
        .eq('goal_id', goalId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Goal marked as complete!');
      await fetchStudentGoals();
    } catch (err) {
      console.error('Error marking goal complete:', err);
      toast.error('Failed to mark goal as complete');
    }
  };

  const addResponse = async (goalId: string, response: string) => {
    // This will be implemented later with a responses table or notes system
    console.log('Adding response to goal:', goalId, response);
    toast.info('Response feature coming soon');
  };

  return {
    goals,
    isLoading,
    error,
    refetch: fetchStudentGoals,
    updateProgress,
    markComplete,
    addResponse,
  };
}
