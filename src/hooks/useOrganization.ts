import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Organization, OrgMember, OrgInvitation, OrgGoal, OrgNote, OrgSubscriptionTier } from '@/types/organization';

export function useOrganizations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Organizations data:', data);
      
      return data as Organization[];
    },
    enabled: !!user,
  });
}

export function useOrganization(orgId: string) {
  return useQuery({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (error) throw error;
      
      console.log('Organization data:', data);
      
      return data as Organization;
    },
    enabled: !!orgId,
  });
}

export function useOrgMembers(orgId: string) {
  return useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            display_name
          )
        `)
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrgMember[];
    },
    enabled: !!orgId,
  });
}

export function useOrgInvitations(orgId: string) {
  return useQuery({
    queryKey: ['org-invitations', orgId],
    queryFn: async () => {
        const { data, error } = await supabase
          .from('org_invites')
          .select('*')
          .eq('org_id', orgId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map((inv: any) => ({
          id: inv.id,
          org_id: inv.org_id,
          created_by: inv.created_by,
          email: inv.email,
          code: inv.code,
          token: inv.token,
          status: inv.status,
          expires_at: inv.expires_at,
          max_uses: inv.max_uses || 1,
          uses_count: inv.uses_count || 0,
          role: inv.role,
          metadata: inv.metadata || {},
          created_at: inv.created_at,
        })) || [];
    },
    enabled: !!orgId,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orgInput: {
      name: string;
      description?: string;
      subscription_tier: OrgSubscriptionTier;
      seat_limit: number;
      settings?: Record<string, any>;
    }) => {
      // Ensure user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to create an organization.');
      }

      // Explicitly set owner_id to current user
      const organizationData = {
        name: orgInput.name,
        description: orgInput.description,
        owner_id: user.id, // REQUIRED for RLS policy
        subscription_tier: orgInput.subscription_tier,
        seat_limit: orgInput.seat_limit,
        settings: orgInput.settings || {},
        is_beta_access: orgInput.subscription_tier === 'beta',
        beta_expiration_date: orgInput.subscription_tier === 'beta' 
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      };

      console.log('Creating organization with data:', organizationData);

      const { data, error } = await supabase
        .from('organizations')
        .insert(organizationData)
        .select()
        .single();

      if (error) {
        console.error('Organization creation error:', error);
        throw error;
      }

      console.log('Organization created successfully:', data);

      // Create owner membership record
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: data.id,
          user_id: user.id,
          role: 'owner',
          status: 'active',
          joined_at: new Date().toISOString(),
        });

      if (memberError) {
        console.error('Error creating owner membership:', memberError);
        // Clean up the organization if member creation fails
        await supabase.from('organizations').delete().eq('id', data.id);
        throw memberError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: 'Organization created',
        description: 'Your organization has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Organization creation failed:', error);
      let errorMessage = 'Failed to create organization';
      
      if (error.message.includes('row-level security')) {
        errorMessage = 'Authentication required. Please sign in and try again.';
      } else if (error.message.includes('You must be signed in')) {
        errorMessage = 'Please sign in to create an organization.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error creating organization',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}

export function useInviteToOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitation: {
      organization_id: string;
      email?: string;
      generate_code?: boolean;
    }) => {
      const inviteData: any = {
        org_id: invitation.organization_id,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      };

      if (invitation.email) {
        inviteData.email = invitation.email;
      }

      if (invitation.generate_code) {
        // Generate unique code
        const { data: codeData } = await supabase.rpc('generate_invitation_code');
        inviteData.code = codeData;
      }

      const { data, error } = await supabase
        .from('org_invites')
        .insert(inviteData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['org-invitations', variables.organization_id] });
      toast({
        title: 'Invitation created',
        description: variables.email 
          ? `Invitation sent to ${variables.email}` 
          : `Invitation code generated: ${data.code}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ memberId, orgId }: { memberId: string; orgId: string }) => {
      const { error } = await supabase
        .from('org_members')
        .update({ 
          status: 'removed',
          removed_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['org-members', variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ['organization', variables.orgId] });
      toast({
        title: 'Member removed',
        description: 'The member has been removed from the organization.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error removing member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}