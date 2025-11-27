import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export type MemberRole = 'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'viewer' | 'student';

export function useOrgMemberActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('org_members')
        .delete()
        .eq('org_id', orgId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members'] });
      queryClient.invalidateQueries({ queryKey: ['comprehensive-org-analytics'] });
      toast({
        title: "Success",
        description: "Member removed from organization successfully.",
      });
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member from organization.",
        variant: "destructive",
      });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: MemberRole }) => {
      const { error } = await supabase
        .from('org_members')
        .update({ role: newRole })
        .eq('org_id', orgId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members'] });
      toast({
        title: "Success",
        description: "Member role updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error changing member role:', error);
      toast({
        title: "Error",
        description: "Failed to change member role.",
        variant: "destructive",
      });
    },
  });

  return {
    removeMember: removeMemberMutation.mutate,
    changeRole: changeRoleMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
    isChangingRole: changeRoleMutation.isPending,
  };
}
