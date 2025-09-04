import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useOrgMemberManagement(organizationId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Update member status to removed and set removal timestamp
      const { error } = await supabase
        .from('org_members')
        .update({
          status: 'removed',
          removed_at: new Date().toISOString(),
          access_revoked_at: new Date().toISOString(),
          access_revoked_reason: 'Removed by instructor'
        })
        .eq('id', memberId);

      if (error) {
        console.error('Error removing member:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgMembers', organizationId] });
      toast({
        title: "Student Removed",
        description: "The student has been successfully removed from the organization.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove student",
        variant: "destructive"
      });
    },
  });

  // Pause member access mutation
  const pauseMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('org_members')
        .update({
          status: 'paused',
          access_revoked_at: new Date().toISOString(),
          access_revoked_reason: 'Temporarily paused by instructor'
        })
        .eq('id', memberId);

      if (error) {
        console.error('Error pausing member:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgMembers', organizationId] });
      toast({
        title: "Access Paused",
        description: "The student's access has been temporarily paused.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to pause student access",
        variant: "destructive"
      });
    },
  });

  // Restore member access mutation
  const restoreMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('org_members')
        .update({
          status: 'active',
          access_revoked_at: null,
          access_revoked_reason: null
        })
        .eq('id', memberId);

      if (error) {
        console.error('Error restoring member:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgMembers', organizationId] });
      toast({
        title: "Access Restored",
        description: "The student's access has been restored.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to restore student access",
        variant: "destructive"
      });
    },
  });

  return {
    removeMember: removeMemberMutation.mutate,
    pauseMember: pauseMemberMutation.mutate,
    restoreMember: restoreMemberMutation.mutate,
    isRemoving: removeMemberMutation.isPending,
    isPausing: pauseMemberMutation.isPending,
    isRestoring: restoreMemberMutation.isPending,
  };
}