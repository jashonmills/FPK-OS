import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScormPackage {
  id: string;
  org_id?: string;
  title: string;
  description?: string;
  version: string;
  manifest_path: string;
  zip_path: string;
  extract_path: string;
  status: 'uploaded' | 'parsed' | 'ready' | 'archived';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ScormSco {
  id: string;
  package_id: string;
  identifier: string;
  title: string;
  launch_href: string;
  parameters?: string;
  mastery_score?: number;
  is_launchable: boolean;
  seq_order: number;
  prerequisites?: string[];
  created_at: string;
}

export function useScormPackages() {
  const { toast } = useToast();

  const { data: packages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['scorm-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scorm_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching SCORM packages:', error);
        throw error;
      }

      return data as ScormPackage[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    packages,
    isLoading,
    error,
    refetch
  };
}

export function useScormPackage(packageId: string) {
  const { data: packageData, isLoading, error } = useQuery({
    queryKey: ['scorm-package', packageId],
    queryFn: async () => {
      if (!packageId) return null;

      const { data, error } = await supabase
        .from('scorm_packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (error) {
        console.error('Error fetching SCORM package:', error);
        throw error;
      }

      return data as ScormPackage;
    },
    enabled: !!packageId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    package: packageData,
    isLoading,
    error
  };
}

export function useScormScos(packageId: string) {
  const { data: scos = [], isLoading, error } = useQuery({
    queryKey: ['scorm-scos', packageId],
    queryFn: async () => {
      if (!packageId) return [];

      const { data, error } = await supabase
        .from('scorm_scos')
        .select('*')
        .eq('package_id', packageId)
        .order('seq_order', { ascending: true });

      if (error) {
        console.error('Error fetching SCORM SCOs:', error);
        throw error;
      }

      return data as ScormSco[];
    },
    enabled: !!packageId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    scos,
    isLoading,
    error
  };
}

export function useScormPackageMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPackage = useMutation({
    mutationFn: async (packageData: Omit<ScormPackage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('scorm_packages')
        .insert([packageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorm-packages'] });
      toast({
        title: "Success",
        description: "SCORM package created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating package:', error);
      toast({
        title: "Error",
        description: "Failed to create SCORM package",
        variant: "destructive",
      });
    }
  });

  const updatePackage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ScormPackage> & { id: string }) => {
      const { data, error } = await supabase
        .from('scorm_packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorm-packages'] });
      toast({
        title: "Success",
        description: "SCORM package updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating package:', error);
      toast({
        title: "Error",
        description: "Failed to update SCORM package",
        variant: "destructive",
      });
    }
  });

  const deletePackage = useMutation({
    mutationFn: async (packageId: string) => {
      const { error } = await supabase
        .from('scorm_packages')
        .delete()
        .eq('id', packageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorm-packages'] });
      toast({
        title: "Success",
        description: "SCORM package deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete SCORM package",
        variant: "destructive",
      });
    }
  });

  return {
    createPackage: createPackage.mutate,
    updatePackage: updatePackage.mutate,
    deletePackage: deletePackage.mutate,
    isCreating: createPackage.isPending,
    isUpdating: updatePackage.isPending,
    isDeleting: deletePackage.isPending
  };
}