import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AICapability = 
  | 'image_generation'
  | 'code_generation'
  | 'document_creation'
  | 'research_web_search'
  | 'content_summarization'
  | 'math_calculations'
  | 'creative_writing'
  | 'data_analysis'
  | 'general_chat';

export interface AIGovernanceRule {
  id: string;
  org_id: string | null;
  name: string;
  category: 'Academic' | 'Technical' | 'Creative' | 'Communication';
  capability: AICapability;
  description: string | null;
  allowed: boolean;
  applicable_roles: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateRuleInput = Omit<AIGovernanceRule, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRuleInput = Partial<Omit<AIGovernanceRule, 'id' | 'created_at' | 'updated_at'>>;

export const CAPABILITY_LABELS: Record<AICapability, string> = {
  image_generation: 'Image Generation',
  code_generation: 'Code Generation',
  document_creation: 'Document Creation',
  research_web_search: 'Research & Web Search',
  content_summarization: 'Content Summarization',
  math_calculations: 'Math & Calculations',
  creative_writing: 'Creative Writing',
  data_analysis: 'Data Analysis',
  general_chat: 'General Chat',
};

export const CAPABILITY_DESCRIPTIONS: Record<AICapability, string> = {
  image_generation: 'AI-generated images, graphics, and visual content',
  code_generation: 'Code writing, debugging, and programming assistance',
  document_creation: 'Lesson plans, worksheets, reports, and documents',
  research_web_search: 'Web searches and research assistance',
  content_summarization: 'Summarizing text, articles, and documents',
  math_calculations: 'Math problem solving and calculations',
  creative_writing: 'Essays, stories, poems, and creative content',
  data_analysis: 'Analyzing data, charts, and statistics',
  general_chat: 'General conversation and Q&A',
};

export function useAIGovernanceRules(orgId?: string | null) {
  const queryClient = useQueryClient();

  const rulesQuery = useQuery({
    queryKey: ['ai-governance-rules', orgId],
    queryFn: async () => {
      let query = supabase
        .from('ai_governance_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (orgId) {
        query = query.or(`org_id.eq.${orgId},org_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AIGovernanceRule[];
    },
  });

  const createRule = useMutation({
    mutationFn: async (rule: CreateRuleInput) => {
      const { data, error } = await supabase
        .from('ai_governance_rules')
        .insert(rule)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-rules'] });
      toast.success('Rule created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create rule: ' + error.message);
    },
  });

  const updateRule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateRuleInput }) => {
      const { data, error } = await supabase
        .from('ai_governance_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-rules'] });
      toast.success('Rule updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update rule: ' + error.message);
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_governance_rules')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-rules'] });
      toast.success('Rule deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete rule: ' + error.message);
    },
  });

  const toggleRule = useMutation({
    mutationFn: async ({ id, allowed }: { id: string; allowed: boolean }) => {
      const { data, error } = await supabase
        .from('ai_governance_rules')
        .update({ allowed })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-rules'] });
    },
    onError: (error) => {
      toast.error('Failed to toggle rule: ' + error.message);
    },
  });

  return {
    rules: rulesQuery.data ?? [],
    isLoading: rulesQuery.isLoading,
    error: rulesQuery.error,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  };
}
