import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useAssignmentActions() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const startAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('org_assignment_targets')
        .update({
          status: 'started',
          started_at: new Date().toISOString(),
        })
        .eq('assignment_id', assignmentId)
        .eq('target_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
      toast({
        title: "Assignment Started",
        description: "You've started working on this assignment.",
      });
    },
    onError: (error) => {
      console.error('Error starting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to start assignment.",
        variant: "destructive",
      });
    },
  });

  const completeAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('org_assignment_targets')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('assignment_id', assignmentId)
        .eq('target_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
      toast({
        title: "Assignment Completed",
        description: "Congratulations! You've completed this assignment.",
      });
    },
    onError: (error) => {
      console.error('Error completing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to complete assignment.",
        variant: "destructive",
      });
    },
  });

  const updateAssignmentProgressMutation = useMutation({
    mutationFn: async ({ assignmentId, progress }: { assignmentId: string; progress: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Update the assignment target with progress information
      const { error } = await supabase
        .from('org_assignment_targets')
        .update({
          status: progress >= 100 ? 'completed' : 'started',
          started_at: new Date().toISOString(), // Ensure started_at is set
          completed_at: progress >= 100 ? new Date().toISOString() : null,
        })
        .eq('assignment_id', assignmentId)
        .eq('target_id', user.id);

      if (error) throw error;
    },
    onSuccess: (_, { progress }) => {
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
      if (progress >= 100) {
        toast({
          title: "Assignment Completed",
          description: "Congratulations! You've completed this assignment.",
        });
      }
    },
    onError: (error) => {
      console.error('Error updating assignment progress:', error);
    },
  });

  return {
    startAssignment: startAssignmentMutation.mutate,
    completeAssignment: completeAssignmentMutation.mutate,
    updateAssignmentProgress: updateAssignmentProgressMutation.mutate,
    isStarting: startAssignmentMutation.isPending,
    isCompleting: completeAssignmentMutation.isPending,
    isUpdatingProgress: updateAssignmentProgressMutation.isPending,
  };
}