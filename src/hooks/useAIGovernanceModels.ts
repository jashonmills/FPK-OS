import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface ModelConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  quality?: string;
  size?: string;
}

export interface AIGovernanceModelConfig {
  id: string;
  org_id: string | null;
  model_id: string;
  model_name: string;
  provider: string;
  model_type: 'text' | 'image' | 'code' | 'audio';
  is_active: boolean;
  config: ModelConfig;
  created_at: string;
  updated_at: string;
}

export function useAIGovernanceModels(orgId?: string | null) {
  const queryClient = useQueryClient();

  const modelsQuery = useQuery({
    queryKey: ['ai-governance-models', orgId],
    queryFn: async () => {
      let query = supabase
        .from('ai_governance_model_configs')
        .select('*')
        .order('created_at', { ascending: true });

      if (orgId) {
        query = query.or(`org_id.eq.${orgId},org_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data?.map(model => ({
        ...model,
        model_type: model.model_type as 'text' | 'image' | 'code' | 'audio',
        config: model.config as unknown as ModelConfig,
      })) as AIGovernanceModelConfig[];
    },
  });

  const updateModelConfig = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { config?: ModelConfig; is_active?: boolean } }) => {
      const dbUpdates: { config?: Json; is_active?: boolean } = {};
      if (updates.config !== undefined) {
        dbUpdates.config = updates.config as unknown as Json;
      }
      if (updates.is_active !== undefined) {
        dbUpdates.is_active = updates.is_active;
      }
      
      const { data, error } = await supabase
        .from('ai_governance_model_configs')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-models'] });
      toast.success('Model configuration updated');
    },
    onError: (error) => {
      toast.error('Failed to update model: ' + error.message);
    },
  });

  const toggleModelActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('ai_governance_model_configs')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-models'] });
    },
    onError: (error) => {
      toast.error('Failed to toggle model: ' + error.message);
    },
  });

  return {
    models: modelsQuery.data ?? [],
    isLoading: modelsQuery.isLoading,
    error: modelsQuery.error,
    updateModelConfig,
    toggleModelActive,
  };
}
