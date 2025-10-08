import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';
import { getPrimaryDomain } from '@/utils/siteUrl';

export interface OrgInvite {
  id: string;
  org_id: string;
  code: string;
  role: 'student' | 'instructor';
  max_uses: number;
  uses_count: number;
  expires_at?: string;
  created_by: string;
  created_at: string;
}

export function useOrgInvites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  const { data: invites = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-invites', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_invites')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org invites:', error);
        throw error;
      }

      return data as OrgInvite[];
    },
    staleTime: 1000 * 60 * 2,
  });

  const createInviteMutation = useMutation({
    mutationFn: async (inviteData: { role: 'student' | 'instructor'; max_uses?: number; expires_days?: number }) => {
      // Use new code-based edge function (no email required)
      const { data, error } = await supabase.functions.invoke('generate-org-invite-code', {
        body: {
          orgId: orgId,
          role: inviteData.role,
          maxUses: inviteData.max_uses || 100,
          expiresDays: inviteData.expires_days || 30
        }
      });

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to create invitation');
      }
      
      return data.inviteToken as string; // Returns the invite code
    },
    onSuccess: (inviteCode) => {
      queryClient.invalidateQueries({ queryKey: ['org-invites'] });
      toast({
        title: "Success",
        description: "Invitation created successfully.",
      });
      return inviteCode;
    },
    onError: (error) => {
      console.error('Error creating invite:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation.",
        variant: "destructive",
      });
    },
  });

  const deleteInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('org_invites')
        .delete()
        .eq('id', inviteId)
        .eq('org_id', orgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-invites'] });
      toast({
        title: "Success",
        description: "Invitation deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting invite:', error);
      toast({
        title: "Error",
        description: "Failed to delete invitation.",
        variant: "destructive",
      });
    },
  });

  const generateInviteUrl = (code: string) => {
    return `${getPrimaryDomain()}/org/join?code=${code}`;
  };

  return {
    invites,
    isLoading,
    error,
    refetch,
    createInvite: createInviteMutation.mutateAsync,
    deleteInvite: deleteInviteMutation.mutate,
    generateInviteUrl,
    isCreating: createInviteMutation.isPending,
    isDeleting: deleteInviteMutation.isPending,
  };
}