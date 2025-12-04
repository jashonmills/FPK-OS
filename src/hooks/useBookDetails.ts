
import { useQuery } from '@tanstack/react-query';
import { OpenLibraryWorkResponse } from '@/types/library';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useBookDetails = (workKey: string | null) => {
  return useQuery({
    queryKey: ['bookDetails', workKey],
    queryFn: async () => {
      if (!workKey) return null;
      
      const response = await fetch(`https://openlibrary.org${workKey}.json`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }
      
      const data: OpenLibraryWorkResponse = await response.json();
      return data;
    },
    enabled: !!workKey,
    staleTime: CACHE_DURATION,
    refetchOnWindowFocus: false
  });
};
