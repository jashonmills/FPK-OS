import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useQueryClient } from '@tanstack/react-query';

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
export function useOrganizationInvitation() {
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const { switchOrganization } = useOrgContext();
  const queryClient = useQueryClient();

  const joinWithCode = async (inviteCode: string): Promise<JoinOrganizationResult> => {
    if (!inviteCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid invitation code.",
        variant: "destructive",
      });
      return { success: false, error: "Invalid code" };
    }

    setIsJoining(true);
    
    try {
      const { data, error } = await supabase.rpc('accept_invite', {
        p_code: inviteCode.trim()
      });

      if (error) {
        console.error('Database error joining organization:', error);
        throw error;
      }

      const result = data as unknown as JoinOrganizationResult;
      
      if (result?.success && result.org_id) {
        // Invalidate user organizations query to refetch updated data
        await queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
        
        toast({
          title: "Successfully Joined!",
          description: "You have been added to the organization.",
        });
        
        // Switch to the organization context properly
        switchOrganization(result.org_id);
        
        return result;
      } else {
        const errorMessage = result?.error || 'Failed to join organization';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error joining organization:', error);
      const errorMessage = error.message || "Please check your invitation code and try again.";
      
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
    isJoining
  };
}