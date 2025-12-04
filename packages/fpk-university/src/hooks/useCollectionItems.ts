import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CollectionWithCount {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  org_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  course_count: number;
}

export function useCollectionItems(orgId?: string) {
  return useQuery({
    queryKey: ['collection-items', orgId],
    queryFn: async () => {
      // First get collections
      let collectionsQuery = supabase.from('course_collections').select('*');
      
      if (orgId) {
        collectionsQuery = collectionsQuery.or(`org_id.eq.${orgId},is_public.eq.true`);
      }
      
      const { data: collections, error: collectionsError } = await collectionsQuery
        .order('updated_at', { ascending: false });
      
      if (collectionsError) throw collectionsError;
      
      // Get course counts for each collection
      const collectionsWithCounts: CollectionWithCount[] = await Promise.all(
        (collections || []).map(async (collection) => {
          const { count, error: countError } = await supabase
            .from('course_collection_items')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);
          
          if (countError) {
            console.error('Error getting count for collection:', collection.id, countError);
          }
          
          return {
            ...collection,
            course_count: count || 0
          };
        })
      );
      
      return collectionsWithCounts;
    },
  });
}