import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Organization, OrgMember, OrgInvitation, OrgGoal, OrgNote } from '@/types/organization';

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
        .eq('organization_id', orgId)
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
        .from('org_invitations')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrgInvitation[];
    },
    enabled: !!orgId,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (org: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'seats_used'>) => {
      const { data, error } = await supabase
        .from('organizations')
        .insert(org)
        .select()
        .single();

      if (error) throw error;
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
      toast({
        title: 'Error creating organization',
        description: error.message,
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
        organization_id: invitation.organization_id,
        invited_by: (await supabase.auth.getUser()).data.user?.id,
      };

      if (invitation.email) {
        inviteData.email = invitation.email;
      }

      if (invitation.generate_code) {
        // Generate unique code
        const { data: codeData } = await supabase.rpc('generate_invitation_code');
        inviteData.invitation_code = codeData;
      }

      const { data, error } = await supabase
        .from('org_invitations')
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
          : `Invitation code generated: ${data.invitation_code}`,
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