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

  // ...existing code...

  return {
    updateOrganization,
    deleteOrganization: null,
    suspendOrganization: null,
    reactivateOrganization: null,
    sendNotification: null,
    exportData: null,
    changeSubscriptionTier: null,
    isLoading: updateOrganization.isPending
  };
}
