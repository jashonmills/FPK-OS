import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { OrgInvitation } from '@/types/organization';

export function useOrgInvitations(organizationId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invitations
  const {
    data: invitations,
    isLoading,
    error,
  } = useQuery<OrgInvitation[]>({
    queryKey: ['orgInvitations', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from('org_invites')
        .select(`
          *,
          organizations (
            id,
            name,
            slug
          )
        `)
        .eq('org_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((invite: any) => ({
        id: invite.id,
        org_id: invite.org_id,
        created_by: invite.created_by,
        email: invite.email,
        code: invite.code,
        token: invite.token,
        status: invite.status,
        expires_at: invite.expires_at,
        max_uses: invite.max_uses || 1,
        uses_count: invite.uses_count || 0,
        role: invite.role,
        metadata: invite.metadata || {},
        created_at: invite.created_at,
        organizations: invite.organizations
      }));
    },
    enabled: !!organizationId && !!user,
  });

  // Create invitation
  const createInvitation = useMutation({
    mutationFn: async ({ 
      email, 
      maxUses, 
      expiresInDays, 
      role 
    }: { 
      email?: string; 
      maxUses: number; 
      expiresInDays: number;
      role: string;
    }) => {
      if (!organizationId) throw new Error('Organization ID is required');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Generate invitation code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data, error } = await supabase
        .from('org_invites')
        .insert([
          {
            org_id: organizationId,
            email: email || null,
            code,
            role,
            max_uses: maxUses,
            uses_count: 0,
            status: 'pending',
            expires_at: expiresAt.toISOString(),
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgInvitations', organizationId] });
      toast({
        title: 'Success',
        description: 'Invitation created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Deactivate invitation
  const deactivateInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('org_invites')
        .update({ status: 'expired' })
        .eq('id', invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgInvitations', organizationId] });
      toast({
        title: 'Success',
        description: 'Invitation deactivated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deactivating invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Process invitation (for users accepting invites)
  const processInvitation = useMutation({
    mutationFn: async ({ code, token }: { code?: string; token?: string }) => {
      if (!code && !token) throw new Error('Code or token is required');

      let invitation;

      if (code) {
        const { data, error } = await supabase
          .from('org_invites')
          .select(`
            *,
            organizations (
              id,
              name,
              slug
            )
          `)
          .eq('code', code)
          .gt('expires_at', new Date().toISOString())
          .eq('status', 'pending')
          .single();

        if (error || !data) {
          throw new Error('Invalid invitation code or expired invitation.');
        }

        invitation = data;
      }

      if (!invitation) throw new Error('Invitation not found');

      // Check if invitation has reached max uses
      if (invitation.uses_count >= invitation.max_uses) {
        throw new Error('This invitation code has already been used the maximum number of times.');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('org_members')
        .select('id')
        .eq('org_id', invitation.org_id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (existingMember) {
        throw new Error('You are already a member of this organization.');
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: invitation.org_id,
          user_id: user?.id,
          role: invitation.role,
          status: 'active'
        });

      if (memberError) throw memberError;

      // Update invitation usage
      await supabase
        .from('org_invites')
        .update({
          uses_count: (invitation.uses_count || 0) + 1,
          status: (invitation.uses_count + 1) >= invitation.max_uses ? 'accepted' : 'pending'
        })
        .eq('id', invitation.id);

      return {
        orgName: invitation.organizations?.name,
        orgSlug: invitation.organizations?.slug,
        role: invitation.role
      };
    },
    onSuccess: (data) => {
      toast({
        title: 'Welcome!',
        description: `You have successfully joined ${data.orgName}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error joining organization',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    invitations: invitations || [],
    isLoading,
    error,
    createInvitation: createInvitation.mutate,
    deactivateInvitation: deactivateInvitation.mutate,
    processInvitation: processInvitation.mutate,
    isCreating: createInvitation.isPending,
    isDeactivating: deactivateInvitation.isPending,
    isProcessing: processInvitation.isPending,
  };
}