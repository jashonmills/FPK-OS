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
        .from('org_invitations')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        metadata: (item.metadata as Record<string, any>) || {}
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
        organization_id: data.organizationId,
        invited_by: user.id,
        email: data.email || null,
        invitation_link: linkData,
        invitation_code: linkData.replace('org-invite-', ''),
        status: 'pending' as const,
        expires_at: expiresAt.toISOString(),
        max_uses: data.maxUses || 1,
        current_uses: 0,
        is_active: true,
        metadata: {}
      };

      const { data: invitation, error } = await supabase
        .from('org_invitations')
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
        .from('org_invitations')
        .update({ is_active: false, status: 'expired' })
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
        .from('org_invitations')
        .select(`
          *,
          organizations (*)
        `)
        .eq('invitation_code', invitationCode)
        .eq('status', 'pending')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      // Check if max uses exceeded
      if (invitation.current_uses >= invitation.max_uses) {
        throw new Error('This invitation link has reached its maximum usage limit');
      }

      // Add user to organization
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          organization_id: invitation.organization_id,
          user_id: user.id,
          role: 'student',
          status: 'active',
          invited_by: invitation.invited_by,
          invitation_link: invitation.invitation_link,
          joined_at: new Date().toISOString()
        });

      if (memberError) {
        console.error('Error adding member:', memberError);
        throw memberError;
      }

      // Update invitation usage count
      const { error: updateError } = await supabase
        .from('org_invitations')
        .update({ 
          current_uses: invitation.current_uses + 1,
          status: invitation.current_uses + 1 >= invitation.max_uses ? 'accepted' : 'pending'
        })
        .eq('id', invitation.id);

      if (updateError) {
        console.error('Error updating invitation:', updateError);
      }

      return invitation;
    },
    onSuccess: (invitation) => {
      toast({
        title: "Welcome!",
        description: `You've successfully joined ${invitation.organizations?.name}`,
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