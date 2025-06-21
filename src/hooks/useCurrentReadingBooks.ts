
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ReadingBook {
  book_id: string;
  completion_percentage: number;
  chapter_index: number;
  last_read_at: string;
  reading_time_seconds: number;
}

export const useCurrentReadingBooks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['current-reading-books', user?.id],
    queryFn: async (): Promise<ReadingBook[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('reading_progress')
        .select('book_id, completion_percentage, chapter_index, last_read_at, reading_time_seconds')
        .eq('user_id', user.id)
        .gt('completion_percentage', 0)
        .lt('completion_percentage', 100)
        .gt('chapter_index', 0) // Only books where user has read at least one chapter
        .order('last_read_at', { ascending: false });

      if (error) throw error;

      return data || [];
    },
    enabled: !!user?.id
  });
};
