import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedOrgBranding {
  id: string;
  org_id: string;
  accent_hex: string;
  logo_light_url?: string;
  logo_dark_url?: string;
  banner_url?: string;
  favicon_url?: string;
  radius_scale: 'sm' | 'md' | 'lg';
  watermark_opacity: number;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateBrandingData {
  accent_hex?: string;
  logo_light_url?: string;
  logo_dark_url?: string;
  banner_url?: string;
  favicon_url?: string;
  radius_scale?: 'sm' | 'md' | 'lg';
  watermark_opacity?: number;
}

// Hook to get enhanced organization branding
export function useEnhancedOrgBranding(orgId: string | null) {
  return useQuery({
    queryKey: ['enhanced-org-branding', orgId],
    queryFn: async () => {
      if (!orgId) return null;
      
      const { data, error } = await supabase
        .from('org_branding')
        .select('*')
        .eq('org_id', orgId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as EnhancedOrgBranding | null;
    },
    enabled: !!orgId,
  });
}

// Hook to update enhanced organization branding
export function useUpdateEnhancedOrgBranding() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orgId, branding }: { orgId: string; branding: UpdateBrandingData }) => {
      const { data, error } = await supabase
        .from('org_branding')
        .upsert({ 
          org_id: orgId, 
          ...branding,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-org-branding', variables.orgId] });
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

// Hook to upload enhanced branding files to storage
export function useUploadEnhancedBrandingFile() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      orgId, 
      file, 
      type 
    }: { 
      orgId: string; 
      file: File; 
      type: 'logo-light' | 'logo-dark' | 'banner' | 'favicon'; 
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