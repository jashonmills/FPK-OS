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

  // Fetch user's organizations
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async (): Promise<Organization[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching organizations:', error);
        throw error;
      }

      // Transform data to match our interface, handling missing fields gracefully
      return data.map((org: any) => ({
        id: org.id,
        name: org.name,
        description: org.description || undefined,
        owner_id: org.owner_id,
        subscription_tier: org.subscription_tier,
        seat_limit: org.seat_limit,
        seats_used: org.seats_used,
        settings: org.settings || {},
        beta_expiration_date: org.beta_expiration_date || undefined,
        is_beta_access: org.is_beta_access || undefined,
        created_at: org.created_at,
        updated_at: org.updated_at,
      }));
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
        subscription_tier: orgData.subscription_tier,
        seat_limit,
        seats_used: 0,
        is_beta_access: orgData.subscription_tier === 'beta',
        beta_expiration_date: orgData.subscription_tier === 'beta' 
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
          : null,
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
          organization_id: data.id,
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
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Organization Created!",
        description: `${data.name} has been created successfully with ${data.subscription_tier} access.`,
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
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
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

  return {
    organizations: organizations || [],
    isLoading,
    error,
    createOrganization: createOrganizationMutation.mutate,
    updateOrganization: updateOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    isUpdating: updateOrganizationMutation.isPending,
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
        .eq('organization_id', organizationId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      return !!memberData;
    },
    enabled: !!user && !!organizationId,
  });

  return { hasAccess: hasAccess || false, isLoading };
}