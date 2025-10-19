import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PartnerResource {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  website_url: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch active partners (public view)
export function usePartnerResources(category?: string) {
  return useQuery({
    queryKey: ['partner-resources', category],
    queryFn: async () => {
      let query = supabase
        .from('partner_resources')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as PartnerResource[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Fetch ALL partners (admin view)
export function useAllPartnerResources() {
  return useQuery({
    queryKey: ['partner-resources-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_resources')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as PartnerResource[];
    },
  });
}

// Get unique categories
export function usePartnerCategories() {
  return useQuery({
    queryKey: ['partner-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_resources')
        .select('category')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      return uniqueCategories.sort();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Admin mutations
export function useCreatePartner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (partner: Omit<PartnerResource, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partner_resources')
        .insert(partner)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-resources'] });
      queryClient.invalidateQueries({ queryKey: ['partner-categories'] });
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PartnerResource> & { id: string }) => {
      const { data, error } = await supabase
        .from('partner_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-resources'] });
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partner_resources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-resources'] });
      queryClient.invalidateQueries({ queryKey: ['partner-categories'] });
    },
  });
}
