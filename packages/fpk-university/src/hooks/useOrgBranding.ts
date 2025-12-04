import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrgBranding {
  id: string;
  logo_url?: string;
  banner_url?: string;
  theme_accent?: string;
  theme_mode?: string;
}

export interface UpdateBrandingData {
  logo_url?: string;
  banner_url?: string;
  theme_accent?: string;
  theme_mode?: string;
}

// Hook to get organization branding
export function useOrgBranding(orgId: string | null) {
  return useQuery({
    queryKey: ['org-branding', orgId],
    queryFn: async () => {
      if (!orgId) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('id, logo_url, banner_url, theme_accent, theme_mode')
        .eq('id', orgId)
        .single();

      if (error) throw error;
      return data as OrgBranding;
    },
    enabled: !!orgId,
  });
}

// Hook to update organization branding
export function useUpdateOrgBranding() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orgId, branding }: { orgId: string; branding: UpdateBrandingData }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(branding)
        .eq('id', orgId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['org-branding', variables.orgId] });
      toast({
        title: 'Branding updated',
        description: 'Organization branding has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Error updating branding:', error);
      toast({
        title: 'Error',
        description: 'Failed to update organization branding. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

// Hook to upload branding files to storage
export function useUploadBrandingFile() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      orgId, 
      file, 
      type 
    }: { 
      orgId: string; 
      file: File; 
      type: 'logo' | 'banner'; 
    }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${orgId}/${type}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('org-branding')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('org-branding')
        .getPublicUrl(fileName);

      return { path: data.path, publicUrl };
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    },
  });
}