import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface NotificationSettings {
  emailAlerts: boolean;
  dailyReports: boolean;
  criticalOnly: boolean;
}

export interface SecuritySettings {
  requireApproval: boolean;
  autoBlockSuspicious: boolean;
  sessionTimeout: number;
}

export interface DataRetentionSettings {
  activityLogs: number;
  approvalHistory: number;
}

export interface AIGovernanceSettings {
  id: string;
  org_id: string | null;
  notifications: NotificationSettings;
  security: SecuritySettings;
  data_retention: DataRetentionSettings;
  created_at: string;
  updated_at: string;
}

const defaultSettings = {
  notifications: {
    emailAlerts: true,
    dailyReports: false,
    criticalOnly: false,
  },
  security: {
    requireApproval: false,
    autoBlockSuspicious: true,
    sessionTimeout: 30,
  },
  data_retention: {
    activityLogs: 90,
    approvalHistory: 365,
  },
};

export function useAIGovernanceSettings(orgId?: string | null) {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['ai-governance-settings', orgId],
    queryFn: async () => {
      if (!orgId) {
        return null;
      }

      const { data, error } = await supabase
        .from('ai_governance_settings')
        .select('*')
        .eq('org_id', orgId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;

      return {
        ...data,
        notifications: data.notifications as unknown as NotificationSettings,
        security: data.security as unknown as SecuritySettings,
        data_retention: data.data_retention as unknown as DataRetentionSettings,
      } as AIGovernanceSettings;
    },
  });

  const settings: AIGovernanceSettings = settingsQuery.data ?? {
    ...defaultSettings,
    id: '',
    org_id: orgId ?? null,
    created_at: '',
    updated_at: '',
  };

  const updateSettings = useMutation({
    mutationFn: async (updates: { notifications?: NotificationSettings; security?: SecuritySettings; data_retention?: DataRetentionSettings }) => {
      if (!orgId) {
        throw new Error('Organization ID required to save settings');
      }

      const dbUpdates: { notifications?: Json; security?: Json; data_retention?: Json } = {};
      if (updates.notifications) dbUpdates.notifications = updates.notifications as unknown as Json;
      if (updates.security) dbUpdates.security = updates.security as unknown as Json;
      if (updates.data_retention) dbUpdates.data_retention = updates.data_retention as unknown as Json;

      const { data: existing } = await supabase
        .from('ai_governance_settings')
        .select('id')
        .eq('org_id', orgId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('ai_governance_settings')
          .update(dbUpdates)
          .eq('org_id', orgId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('ai_governance_settings')
          .insert({ org_id: orgId, ...dbUpdates })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    },
  });

  return {
    settings,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateSettings,
  };
}
