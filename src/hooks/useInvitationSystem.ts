import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvitationResult {
  success: boolean;
  error?: string;
  invite_code?: string;
  message?: string;
}

export interface AcceptInviteResult {
  success: boolean;
  error?: string;
  org_id?: string;
  role?: string;
  organization_name?: string;
}

// Hook for sending email invitations
export function useEmailInvitation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, email, role = 'student' }: {
      orgId: string;
      email: string;
      role?: 'student' | 'instructor';
    }) => {
      // Call edge function directly instead of deprecated RPC
      const { data, error } = await supabase.functions.invoke('send-invitation-email', {
        body: {
          orgId,
          email,
          role
        }
      });

      if (error) throw error;
      
      // Edge function returns { success, messageId }
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send invitation');
      }
      
      return { success: true, invite_code: data.inviteCode } as InvitationResult;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Invitation Sent",
          description: "The invitation email has been sent successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ['org-invites'] });
      } else {
        throw new Error(data.error || 'Failed to send invitation');
      }
    },
    onError: (error: any) => {
      console.error('Error sending invitation:', error);
      toast({
        title: "Failed to Send Invitation",
        description: error.message || "There was an error sending the invitation email.",
        variant: "destructive",
      });
    },
  });
}

// Hook for accepting invitations
export function useAcceptInvitation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data, error } = await supabase.rpc('accept_invite', {
        p_code: inviteCode
      });

      if (error) throw error;
      return data as unknown as AcceptInviteResult;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Welcome!",
          description: `You have successfully joined ${data.organization_name}.`,
        });
      } else {
        throw new Error(data.error || 'Failed to accept invitation');
      }
    },
    onError: (error: any) => {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Failed to Join Organization",
        description: error.message || "Invalid invitation code or it may have expired.",
        variant: "destructive",
      });
    },
  });
}