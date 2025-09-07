import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { OrgInvitation } from '@/types/organization';

interface CreateInvitationData {
  organizationId: string;
  email?: string;
  maxUses?: number;
  expiresIn?: number; // hours
}

export function useOrgInvitations(organizationId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invitations for an organization
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['orgInvitations', organizationId],
    queryFn: async (): Promise<OrgInvitation[]> => {
      if (!organizationId || !user) return [];

      const { data, error } = await supabase
        .from('org_invites')
        .select('*')
        .eq('org_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        invited_by: item.created_by,
        invitation_code: item.code,
        current_uses: item.uses_count,
        invitation_link: `org-invite-${item.code}`,
        is_active: item.status === 'pending',
        metadata: {}
      }));
    },
    enabled: !!organizationId && !!user,
  });

  // Create invitation mutation
  const createInvitationMutation = useMutation({
    mutationFn: async (data: CreateInvitationData) => {
      if (!user) throw new Error('User not authenticated');

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (data.expiresIn || 168)); // Default 7 days

      // Generate invitation link
      const { data: linkData, error: linkError } = await supabase
        .rpc('generate_invitation_link', { org_id: data.organizationId });

      if (linkError) {
        console.error('Error generating invitation link:', linkError);
        throw linkError;
      }

      const invitationData = {
        org_id: data.organizationId,
        created_by: user.id,
        email: data.email || null,
        code: linkData.replace('org-invite-', ''),
        status: 'pending' as const,
        expires_at: expiresAt.toISOString(),
        max_uses: data.maxUses || 1,
        uses_count: 0,
        role: 'student'
      };

      const { data: invitation, error } = await supabase
        .from('org_invites')
        .insert(invitationData)
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        throw error;
      }

      return invitation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orgInvitations', organizationId] });
      toast({
        title: "Invitation Created!",
        description: "The invitation link has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invitation",
        variant: "destructive"
      });
    },
  });

  // Deactivate invitation mutation
  const deactivateInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('org_invites')
        .update({ status: 'expired' })
        .eq('id', invitationId);

      if (error) {
        console.error('Error deactivating invitation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgInvitations', organizationId] });
      toast({
        title: "Invitation Deactivated",
        description: "The invitation has been deactivated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deactivate invitation",
        variant: "destructive"
      });
    },
  });

  // Process invitation (for students accepting invites)
  const processInvitationMutation = useMutation({
    mutationFn: async (invitationCode: string) => {
      if (!user) throw new Error('User not authenticated');

      // First, get the invitation details
      const { data: invitation, error: inviteError } = await supabase
        .from('org_invites')
        .select(`
          *,
          organizations (*)
        `)
        .eq('code', invitationCode)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      // Check if max uses exceeded
      if (invitation.uses_count >= invitation.max_uses) {
        throw new Error('This invitation link has reached its maximum usage limit');
      }

      // Add user to organization
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: invitation.org_id,
          user_id: user.id,
          role: (invitation.role || 'student') as 'owner' | 'instructor' | 'student',
          status: 'active',
          joined_at: new Date().toISOString(),
          invited_by: invitation.created_by,
        });

      if (memberError) {
        console.error('Error adding member:', memberError);
        throw memberError;
      }

      // Update invitation usage
      const { error: updateError } = await supabase
        .from('org_invites')
        .update({
          uses_count: invitation.uses_count + 1,
          status: invitation.uses_count + 1 >= invitation.max_uses ? 'expired' : 'pending'
        })
        .eq('id', invitation.id);

      if (updateError) {
        console.error('Error updating invitation:', updateError);
      }

      return {
        organization: invitation.organizations,
        role: invitation.role || 'student'
      };
    },
    onSuccess: (result: any) => {
      toast({
        title: "Welcome!",
        description: `You've successfully joined ${result.organization?.name}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process invitation",
        variant: "destructive"
      });
    },
  });

  return {
    invitations: invitations || [],
    isLoading,
    error,
    createInvitation: createInvitationMutation.mutate,
    deactivateInvitation: deactivateInvitationMutation.mutate,
    processInvitation: processInvitationMutation.mutate,
    isCreating: createInvitationMutation.isPending,
    isDeactivating: deactivateInvitationMutation.isPending,
    isProcessing: processInvitationMutation.isPending,
  };
}