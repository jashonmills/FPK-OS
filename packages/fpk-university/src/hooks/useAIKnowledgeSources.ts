import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AIKnowledgeSource {
  id: string;
  url: string;
  source_name: string;
  description: string | null;
  is_active: boolean;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useAIKnowledgeSources(categoryId?: string) {
  return useQuery({
    queryKey: ['ai_knowledge_sources', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('ai_knowledge_sources')
        .select('*')
        .eq('is_active', true)
        .order('source_name');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AIKnowledgeSource[];
    }
  });
}
