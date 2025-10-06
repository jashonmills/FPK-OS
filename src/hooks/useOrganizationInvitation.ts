import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Import for use within safe wrapper
import { useOrgContext } from '@/components/organizations/OrgContext';

interface JoinOrganizationResult {
  success: boolean;
  org_id?: string;
  role?: string;
  error?: string;
}

/**
 * Unified organization invitation service
 * Handles joining organizations and properly updating context
 */
// Safe org context hook that works with or without OrgProvider
const useSafeOrgContext = () => {
  try {
    return useOrgContext();
  } catch (error) {
    // Fallback when not in org context (personal dashboard)
    return {
      switchOrganization: (orgId: string) => {
        // Navigate to org route with proper context
        window.location.href = `/org/${orgId}`;
      }
    };
  }
};

export function useOrganizationInvitation() {
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const { switchOrganization } = useSafeOrgContext();
  const queryClient = useQueryClient();

  const joinWithToken = async (token: string): Promise<JoinOrganizationResult> => {
    setIsJoining(true);
    
    try {
      // Validate the token first
      const { data: validateData, error: validateError } = await supabase.functions.invoke(
        'validate-org-invite',
        { body: { token } }
      );

      if (validateError || !validateData?.valid) {
        toast({
          title: "Invalid Invitation",
          description: validateData?.error || "This invitation link is invalid or has expired.",
          variant: "destructive",
        });
        return { success: false, error: validateData?.error || "Invalid invitation" };
      }

      // Accept the invitation
      const { data: acceptData, error: acceptError } = await supabase.functions.invoke(
        'accept-org-invite',
        { body: { token } }
      );

      if (acceptError || !acceptData?.success) {
        toast({
          title: "Failed to Join",
          description: acceptData?.error || "Unable to accept invitation. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: acceptData?.error || "Failed to accept invitation" };
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      await queryClient.invalidateQueries({ queryKey: ['org-members'] });
      await queryClient.invalidateQueries({ queryKey: ['user-invites'] });
      
      toast({
        title: "Welcome!",
        description: `You've successfully joined ${validateData.organizationName}`,
      });

      // Switch to the new organization
      if (switchOrganization && acceptData.org_id) {
        switchOrganization(acceptData.org_id);
      }
      
      return {
        success: true,
        org_id: acceptData.org_id,
        role: acceptData.role
      };
    } catch (error) {
      console.error('Error joining with token:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Unexpected error" };
    } finally {
      setIsJoining(false);
    }
  };

  const joinWithCode = async (inviteToken: string): Promise<JoinOrganizationResult> => {
    if (!inviteToken.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid invitation code.",
        variant: "destructive",
      });
      return { success: false, error: "Invalid code" };
    }

    setIsJoining(true);
    
    try {
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to join an organization.",
          variant: "destructive",
        });
        return { success: false, error: "User not authenticated" };
      }

      console.log('Attempting to join organization with token:', inviteToken.trim());
      console.log('User ID:', user.id);

      // Call the new token-based edge function
      const { data, error } = await supabase.functions.invoke('accept-org-invite', {
        body: { token: inviteToken.trim() }
      });

      console.log('Accept invite response:', { data, error });

      if (error) {
        console.error('Error accepting invite:', error);
        throw new Error(error.message || 'Failed to join organization');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to join organization');
      }

      const result: JoinOrganizationResult = {
        success: true,
        org_id: data.org_id,
        role: data.role
      };
      
      // Invalidate user organizations query to refetch updated data
      await queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      await queryClient.invalidateQueries({ queryKey: ['org-members'] });
      await queryClient.invalidateQueries({ queryKey: ['user-invites'] });
      
      toast({
        title: "Successfully Joined!",
        description: `You have been added to ${data.organization_name || 'the organization'}.`,
      });
      
      // Switch to the organization context properly
      switchOrganization(result.org_id!);
      
      return result;
    } catch (error: any) {
      console.error('Error joining organization:', error);
      let errorMessage = error.message || "Please check your invitation code and try again.";
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid or expired')) {
        errorMessage = "This invitation code is invalid or has expired.";
      } else if (error.message?.includes('already a member')) {
        errorMessage = "You are already a member of this organization.";
      } else if (error.message?.includes('Authentication')) {
        errorMessage = "Authentication error. Please refresh the page and try again.";
      }
      
      toast({
        title: "Failed to Join",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsJoining(false);
    }
  };

  return {
    joinWithCode,
    joinWithToken,
    isJoining
  };
}