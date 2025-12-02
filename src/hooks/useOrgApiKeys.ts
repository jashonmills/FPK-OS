import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrgApiKey {
  id: string;
  org_id: string;
  provider: string;
  display_name?: string;
  is_active: boolean;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useOrgApiKeys(orgId?: string | null) {
  const queryClient = useQueryClient();

  const keysQuery = useQuery({
    queryKey: ['org-api-keys', orgId],
    queryFn: async () => {
      if (!orgId) return [];

      const { data, error } = await supabase
        .from('org_api_keys')
        .select('id, org_id, provider, display_name, is_active, last_verified_at, created_at, updated_at')
        .eq('org_id', orgId)
        .order('provider');

      if (error) throw error;
      return data as OrgApiKey[];
    },
    enabled: !!orgId,
  });

  const upsertKey = useMutation({
    mutationFn: async ({ 
      provider, 
      encryptedKey,
      orgId: targetOrgId,
      displayName,
    }: { 
      provider: string;
      encryptedKey: string;
      orgId: string;
      displayName?: string;
    }) => {
      // Simple base64 encoding for demo - in production use proper encryption
      const encoded = btoa(encryptedKey);
      
      const { data, error } = await supabase
        .from('org_api_keys')
        .upsert({
          org_id: targetOrgId,
          provider,
          display_name: displayName || provider,
          encrypted_key: encoded,
          is_active: true,
          last_verified_at: new Date().toISOString(),
        }, {
          onConflict: 'org_id,provider'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-api-keys'] });
      toast.success('API key saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save API key: ' + error.message);
    },
  });

  const deleteKey = useMutation({
    mutationFn: async ({ provider, orgId: targetOrgId }: { provider: string; orgId: string }) => {
      const { error } = await supabase
        .from('org_api_keys')
        .delete()
        .eq('org_id', targetOrgId)
        .eq('provider', provider);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-api-keys'] });
      toast.success('API key removed');
    },
    onError: (error) => {
      toast.error('Failed to remove API key: ' + error.message);
    },
  });

  const toggleKey = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('org_api_keys')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['org-api-keys'] });
      toast.success(`API key ${data.is_active ? 'activated' : 'deactivated'}`);
    },
    onError: (error) => {
      toast.error('Failed to update API key: ' + error.message);
    },
  });

  const getKeyForProvider = (provider: string): OrgApiKey | undefined => {
    return keysQuery.data?.find(k => k.provider === provider);
  };

  return {
    keys: keysQuery.data ?? [],
    isLoading: keysQuery.isLoading,
    error: keysQuery.error,
    upsertKey,
    deleteKey,
    toggleKey,
    getKeyForProvider,
  };
}
