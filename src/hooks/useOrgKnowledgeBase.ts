import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface KnowledgeBaseItem {
  id: string;
  org_id: string;
  title: string;
  file_name: string;
  file_type: string;
  file_url: string | null;
  content: string;
  content_chunks: string[];
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useOrgKnowledgeBase(orgId?: string | null) {
  const queryClient = useQueryClient();

  const kbQuery = useQuery({
    queryKey: ['org-knowledge-base', orgId],
    queryFn: async () => {
      if (!orgId) return [];

      const { data, error } = await supabase
        .from('org_knowledge_base')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeBaseItem[];
    },
    enabled: !!orgId,
  });

  const addDocument = useMutation({
    mutationFn: async ({ 
      title,
      fileName,
      fileType,
      content,
      orgId: targetOrgId,
      fileUrl,
    }: { 
      title: string;
      fileName: string;
      fileType: string;
      content: string;
      orgId: string;
      fileUrl?: string;
    }) => {
      // Simple chunking - split by paragraphs, ~500 chars each
      const chunks = chunkText(content, 500);
      
      const { data, error } = await supabase
        .from('org_knowledge_base')
        .insert({
          org_id: targetOrgId,
          title,
          file_name: fileName,
          file_type: fileType,
          content,
          content_chunks: chunks,
          file_url: fileUrl || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-knowledge-base'] });
      toast.success('Document added to knowledge base');
    },
    onError: (error) => {
      toast.error('Failed to add document: ' + error.message);
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('org_knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-knowledge-base'] });
      toast.success('Document removed from knowledge base');
    },
    onError: (error) => {
      toast.error('Failed to remove document: ' + error.message);
    },
  });

  const toggleDocument = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('org_knowledge_base')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['org-knowledge-base'] });
      toast.success(`Document ${data.is_active ? 'activated' : 'deactivated'}`);
    },
    onError: (error) => {
      toast.error('Failed to update document: ' + error.message);
    },
  });

  return {
    documents: kbQuery.data ?? [],
    isLoading: kbQuery.isLoading,
    error: kbQuery.error,
    addDocument,
    deleteDocument,
    toggleDocument,
  };
}

// Simple text chunking function
function chunkText(text: string, maxChunkSize: number): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += paragraph + '\n\n';
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
