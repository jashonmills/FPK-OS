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

  /**
   * Unified function to join organization with any invitation format
   * Automatically handles both email tokens and invitation codes
   */
  const joinOrganization = async (inviteValue: string): Promise<JoinOrganizationResult> => {
    if (!inviteValue.trim()) {
      toast({
        title: "Invalid Invitation",
        description: "Please enter a valid invitation code or token.",
        variant: "destructive",
      });
      return { success: false, error: "Invalid invitation" };
    }

    setIsJoining(true);
    
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to join an organization.",
          variant: "destructive",
        });
        return { success: false, error: "User not authenticated" };
      }

      // Call unified accept function - handles both tokens and codes
      const { data, error } = await supabase.functions.invoke('accept-org-invite', {
        body: { token: inviteValue.trim() }
      });

      if (error) {
        throw new Error(error.message || 'Failed to join organization');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to join organization');
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      await queryClient.invalidateQueries({ queryKey: ['org-members'] });
      await queryClient.invalidateQueries({ queryKey: ['user-invites'] });
      
      toast({
        title: "Welcome!",
        description: `You've successfully joined ${data.organization_name || 'the organization'}`,
      });

      // Switch to the organization
      if (data.org_id && switchOrganization) {
        switchOrganization(data.org_id);
      }
      
      return {
        success: true,
        org_id: data.org_id,
        role: data.role
      };
    } catch (error: any) {
      console.error('Error joining organization:', error);
      
      let errorMessage = "Please check your invitation and try again.";
      
      if (error.message?.includes('Invalid or expired')) {
        errorMessage = "This invitation is invalid or has expired.";
      } else if (error.message?.includes('already a member')) {
        errorMessage = "You are already a member of this organization.";
      } else if (error.message?.includes('no seats available')) {
        errorMessage = "This organization has reached its member limit.";
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

  // Legacy aliases for backward compatibility
  const joinWithToken = (token: string) => joinOrganization(token);
  const joinWithCode = (code: string) => joinOrganization(code);

  return {
    joinOrganization,
    joinWithCode,
    joinWithToken,
    isJoining
  };
}