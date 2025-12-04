import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface GenerateOutlineParams {
  topic: string;
  keyword: string;
  category_id: string;
  source_urls: string[];
}

interface GenerateDraftParams {
  topic: string;
  keyword: string;
  outline_json: any;
  source_urls: string[];
  generation_history_id: string;
}

export function useAIGeneration() {
  const navigate = useNavigate();

  const generateOutline = useMutation({
    mutationFn: async (params: GenerateOutlineParams) => {
      const { data, error } = await supabase.functions.invoke('generate-ai-blog-post', {
        body: { mode: 'outline', ...params }
      });

      if (error) throw error;
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: 'Outline Generation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const generateDraft = useMutation({
    mutationFn: async (params: GenerateDraftParams) => {
      const { data, error } = await supabase.functions.invoke('generate-ai-blog-post', {
        body: { mode: 'draft', ...params }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Draft Created Successfully',
        description: 'Redirecting to editor...'
      });
      navigate(`/dashboard/admin/blog/edit/${data.slug}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Draft Generation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { 
    generateOutline, 
    generateDraft,
    isGenerating: generateOutline.isPending || generateDraft.isPending
  };
}
