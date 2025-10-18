import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MediaAsset {
  id: string;
  storage_path: string;
  title: string | null;
  alt_text: string | null;
  description: string | null;
  asset_type: string;
  file_size: number | null;
  mime_type: string | null;
  dimensions: { width: number; height: number } | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaUsage {
  id: string;
  media_id: string;
  usage_type: string;
  reference_id: string;
  created_at: string;
}

export function useMediaAsset(storagePath: string) {
  return useQuery({
    queryKey: ['media-asset', storagePath],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_media_assets')
        .select('*')
        .eq('storage_path', storagePath)
        .maybeSingle();
      
      if (error) throw error;
      return data as MediaAsset | null;
    },
  });
}

export function useMediaUsage(mediaId: string) {
  return useQuery({
    queryKey: ['media-usage', mediaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_media_usage')
        .select('*')
        .eq('media_id', mediaId);
      
      if (error) throw error;
      return data as MediaUsage[];
    },
    enabled: !!mediaId,
  });
}

export function useCreateMediaAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: Omit<MediaAsset, 'id' | 'created_at' | 'updated_at' | 'uploaded_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('blog_media_assets')
        .insert({
          ...asset,
          uploaded_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-asset'] });
      toast.success('Media asset created');
    },
    onError: () => {
      toast.error('Failed to create media asset');
    },
  });
}

export function useUpdateMediaAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MediaAsset> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_media_assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-asset'] });
      toast.success('Media asset updated');
    },
    onError: () => {
      toast.error('Failed to update media asset');
    },
  });
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_media_assets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-asset'] });
      toast.success('Media asset deleted');
    },
    onError: () => {
      toast.error('Failed to delete media asset');
    },
  });
}

export function useUpsertMediaUsage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (usage: Omit<MediaUsage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('blog_media_usage')
        .upsert(usage, {
          onConflict: 'media_id,usage_type,reference_id',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-usage'] });
    },
  });
}
