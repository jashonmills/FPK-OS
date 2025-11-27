// Conservative typed copy
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Organization } from '@/types/organization';

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  seat_limit?: number;
  settings?: Record<string, unknown>;
}

export interface SuspendOrganizationData {
  reason: string;
  duration?: string;
}

export interface NotificationData {
  subject: string;
  message: string;
  notification_type: string;
}

export interface ExportRequest {
  export_type: 'members' | 'activity' | 'usage' | 'complete';
  format: 'csv' | 'json';
}

export function useOrganizationActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateOrganization = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationData }) => {
      const { data: result, error } = await supabase
        .from('organizations')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Success",
        description: "Organization updated successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to update organization.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      toast({
        title: "Success",
        description: "Organization deleted successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to delete organization.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const suspendOrganization = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SuspendOrganizationData }) => {
      const { error } = await supabase
        .from('organizations')
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
          suspended_reason: data.reason,
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      toast({
        title: "Success",
        description: "Organization suspended successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to suspend organization.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const reactivateOrganization = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('organizations')
        .update({
          is_suspended: false,
          suspended_at: null,
          suspended_reason: null,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      toast({
        title: "Success",
        description: "Organization reactivated successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to reactivate organization.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const sendNotification = useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: string; data: NotificationData }) => {
      // This would typically call an edge function to send notifications
      // For now, we'll just log it
      console.log('Sending notification to org:', organizationId, data);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to send notification.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const exportData = useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: string; data: ExportRequest }) => {
      // This would typically call an edge function to export data
      console.log('Exporting data for org:', organizationId, data);
      return { success: true, downloadUrl: '#' };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Data export completed successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to export data.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const changeSubscriptionTier = useMutation({
    mutationFn: async ({ organizationId, tier }: { organizationId: string; tier: string }) => {
      const { error } = await supabase
        .from('organizations')
        .update({
          plan: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      toast({
        title: "Success",
        description: "Subscription tier updated successfully.",
      });
    },
    onError: (error: unknown) => {
      const msg = (error as any)?.message || 'Failed to update subscription tier.';
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  return {
    updateOrganization,
    deleteOrganization,
    suspendOrganization,
    reactivateOrganization,
    sendNotification,
    exportData,
    changeSubscriptionTier,
    isLoading: updateOrganization.isPending || 
               deleteOrganization.isPending || 
               suspendOrganization.isPending || 
               reactivateOrganization.isPending ||
               sendNotification.isPending ||
               exportData.isPending ||
               changeSubscriptionTier.isPending
  };
}
