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

// Hook for sending email invitations (Updated to use new token-based system)
export function useEmailInvitation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, email, role = 'student' }: {
      orgId: string;
      email: string;
      role?: 'owner' | 'instructor' | 'student' | 'instructor_aide' | 'viewer';
    }) => {
      // Call new token-based edge function
      const { data, error } = await supabase.functions.invoke('generate-org-invite', {
        body: {
          orgId,
          email,
          role
        }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send invitation');
      }
      
      return { 
        success: true, 
        invite_code: data.inviteToken,
        invite_url: data.inviteUrl,
        expires_at: data.expiresAt
      } as InvitationResult;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Invitation Sent",
          description: "The invitation email has been sent successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ['org-invites'] });
        queryClient.invalidateQueries({ queryKey: ['user-invites'] });
        queryClient.invalidateQueries({ queryKey: ['pending-invitations'] });
      } else {
        throw new Error(data.error || 'Failed to send invitation');
      }
    },
    onError: (error: any) => {
      console.error('Error sending invitation:', error);
      
      // Try to extract detailed error message from edge function response
      let errorMessage = "There was an error sending the invitation email.";
      
      if (error.context?.body) {
        try {
          const errorBody = typeof error.context.body === 'string' 
            ? JSON.parse(error.context.body) 
            : error.context.body;
          
          if (errorBody.error) {
            errorMessage = errorBody.error;
            if (errorBody.details) {
              errorMessage += ` (${errorBody.details})`;
            }
          }
        } catch (e) {
          // If parsing fails, use the error message directly
          errorMessage = error.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Failed to Send Invitation",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

// Hook for accepting invitations (Updated to use new token-based system)
export function useAcceptInvitation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteToken: string) => {
      // Call new token-based edge function
      const { data, error } = await supabase.functions.invoke('accept-org-invite', {
        body: { token: inviteToken }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to accept invitation');
      }
      
      return data as AcceptInviteResult;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Welcome!",
          description: `You have successfully joined ${data.organization_name || 'the organization'}.`,
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