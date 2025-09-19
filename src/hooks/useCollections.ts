import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  org_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  course_id: string;
  added_by: string;
  added_at: string;
}

export function useCollections(orgId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const collectionsQuery = useQuery({
    queryKey: ['collections', orgId],
    queryFn: async () => {
      let query = supabase.from('course_collections').select('*');
      
      if (orgId) {
        query = query.or(`org_id.eq.${orgId},is_public.eq.true`);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Collection[];
    },
  });

  const createCollection = useMutation({
    mutationFn: async (collection: { name: string; description?: string; is_public?: boolean }) => {
      const { data, error } = await supabase
        .from('course_collections')
        .insert({
          ...collection,
          org_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Collection Created",
        description: "New collection has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCollection = useMutation({
    mutationFn: async ({ collectionId, courseId }: { collectionId: string; courseId: string }) => {
      const { data, error } = await supabase
        .from('course_collection_items')
        .insert({
          collection_id: collectionId,
          course_id: courseId,
          added_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-items'] });
      toast({
        title: "Course Added",
        description: "Course has been added to the collection successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add course to collection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeFromCollection = useMutation({
    mutationFn: async ({ collectionId, courseId }: { collectionId: string; courseId: string }) => {
      const { error } = await supabase
        .from('course_collection_items')
        .delete()
        .match({ collection_id: collectionId, course_id: courseId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-items'] });
      toast({
        title: "Course Removed",
        description: "Course has been removed from the collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove course from collection. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    collections: collectionsQuery.data || [],
    isLoading: collectionsQuery.isLoading,
    error: collectionsQuery.error,
    createCollection,
    addToCollection,
    removeFromCollection,
  };
}