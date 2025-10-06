import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Organization, OrgSubscriptionTier } from '@/types/organization';

export function useOrganizations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's organizations (both owned and member of)
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['user-organizations', user?.id],
    queryFn: async (): Promise<Organization[]> => {
      if (!user) return [];

      // Fetch organizations where user is owner OR member
      const { data: memberOrgs, error: memberError } = await supabase
        .from('org_members')
        .select(`
          org_id,
          role,
          status,
          organizations (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (memberError) {
        console.error('Error fetching member organizations:', memberError);
        throw memberError;
      }

      // Extract and transform organization data
      const orgs = memberOrgs
        .filter(m => m.organizations)
        .map((m: any) => {
          const org = m.organizations;
          return {
            id: org.id,
            name: org.name,
            description: org.description || undefined,
            owner_id: org.owner_id,
            plan: org.plan,
            seat_cap: org.seat_cap,
            seats_used: org.seats_used || 0,
            instructors_used: org.instructors_used || 0,
            instructor_limit: org.instructor_limit || 5,
            brand_primary: org.brand_primary,
            brand_accent: org.brand_accent,
            logo_url: org.logo_url,
            slug: org.slug,
            is_suspended: org.is_suspended,
            suspended_at: org.suspended_at,
            suspended_by: org.suspended_by,
            suspended_reason: org.suspended_reason,
            status: org.status || 'active',
            created_by: org.created_by,
            created_at: org.created_at,
            updated_at: org.updated_at,
            user_role: m.role, // Add the user's role in this org
          };
        });

      return orgs;
    },
    enabled: !!user,
  });

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (orgData: {
      name: string;
      description?: string;
      subscription_tier: OrgSubscriptionTier;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const seat_limit = orgData.subscription_tier === 'beta' ? 50 :
                        orgData.subscription_tier === 'premium' ? 25 :
                        orgData.subscription_tier === 'standard' ? 10 : 3;

      const organization = {
        name: orgData.name,
        description: orgData.description,
        owner_id: user.id,
        plan: orgData.subscription_tier,
        seat_cap: seat_limit,
        slug: orgData.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'active',
        created_by: user.id,
        is_suspended: false,
      };

      const { data, error } = await supabase
        .from('organizations')
        .insert(organization)
        .select()
        .single();

      if (error) {
        console.error('Error creating organization:', error);
        throw error;
      }

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
    onSuccess: (data) => {
      // Invalidate both organization query caches
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      toast({
        title: "Organization Created!",
        description: `${data.name} has been created successfully with ${data.plan} access.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive"
      });
    },
  });

  // Update organization mutation
  const updateOrganizationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Organization> }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('organizations')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('owner_id', user.id) // Ensure user owns the organization
        .select()
        .single();

      if (error) {
        console.error('Error updating organization:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate both organization query caches
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      toast({
        title: "Organization Updated",
        description: "Organization has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update organization",
        variant: "destructive"
      });
    },
  });

  // Delete organization mutation
  const deleteOrganizationMutation = useMutation({
    mutationFn: async (organizationId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Delete the organization (cascade deletes will handle members, invites, etc.)
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', organizationId)
        .eq('owner_id', user.id); // Ensure user owns the organization

      if (error) {
        console.error('Error deleting organization:', error);
        throw error;
      }

      return organizationId;
    },
    onSuccess: (orgId) => {
      // Invalidate both organization query caches
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      
      toast({
        title: "Organization Deleted",
        description: "The organization and all its data have been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete organization",
        variant: "destructive"
      });
    },
  });

  return {
    organizations: organizations || [],
    isLoading,
    error,
    createOrganization: createOrganizationMutation.mutate,
    updateOrganization: updateOrganizationMutation.mutate,
    deleteOrganization: deleteOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    isUpdating: updateOrganizationMutation.isPending,
    isDeleting: deleteOrganizationMutation.isPending,
  };
}

// Hook for checking if user has organization access
export function useOrganizationAccess(organizationId?: string) {
  const { user } = useAuth();

  const { data: hasAccess, isLoading } = useQuery({
    queryKey: ['organizationAccess', organizationId, user?.id],
    queryFn: async () => {
      if (!user || !organizationId) return false;

      // Check if user is owner
      const { data: orgData } = await supabase
        .from('organizations')
        .select('owner_id')
        .eq('id', organizationId)
        .single();

      if (orgData?.owner_id === user.id) return true;

      // Check if user is a member
      const { data: memberData } = await supabase
        .from('org_members')
        .select('status')
        .eq('org_id', organizationId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      return !!memberData;
    },
    enabled: !!user && !!organizationId,
  });

  return { hasAccess: hasAccess || false, isLoading };
}