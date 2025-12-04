import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Organization } from '@/types/organization';

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  seat_limit?: number;
  settings?: Record<string, any>;
}

export interface SuspendOrganizationData {
  reason: string;
  duration?: string; // e.g., '30 days', 'indefinite'
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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization.",
        variant: "destructive",
      });
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: async (organizationId: string) => {
      // Soft delete by updating status
      const { error } = await supabase
        .from('organizations')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Success",
        description: "Organization deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete organization.",
        variant: "destructive",
      });
    },
  });

  const suspendOrganization = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SuspendOrganizationData }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('organizations')
        .update({
          status: 'suspended',
          suspended_at: new Date().toISOString(),
          suspended_reason: data.reason,
          suspended_by: user.user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Success",
        description: "Organization suspended successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend organization.",
        variant: "destructive",
      });
    },
  });

  const reactivateOrganization = useMutation({
    mutationFn: async (organizationId: string) => {
      const { error } = await supabase
        .from('organizations')
        .update({
          status: 'active',
          suspended_at: null,
          suspended_reason: null,
          suspended_by: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Success",
        description: "Organization reactivated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reactivate organization.",
        variant: "destructive",
      });
    },
  });

  const sendNotification = useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: string; data: NotificationData }) => {
      const { data: result, error } = await supabase.functions.invoke('send-organization-notification', {
        body: {
          organizationId,
          ...data
        }
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification.",
        variant: "destructive",
      });
    },
  });

  const exportData = useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: string; data: ExportRequest }) => {
      const { data: result, error } = await supabase.functions.invoke('export-organization-data', {
        body: {
          organizationId,
          ...data
        }
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Export request submitted. You'll receive a download link shortly.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to export data.",
        variant: "destructive",
      });
    },
  });

  const changeSubscriptionTier = useMutation({
    mutationFn: async ({ organizationId, tier }: { organizationId: string; tier: string }) => {
      const { data: result, error } = await supabase.functions.invoke('change-subscription-tier', {
        body: {
          organizationId,
          newTier: tier
        }
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: "Success",
        description: "Subscription tier updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change subscription tier.",
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