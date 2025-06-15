
import { useQuery } from '@tanstack/react-query';
import { museumService, MuseumItem } from '@/services/MuseumService';

export const useVisualOfTheWeek = () => {
  return useQuery({
    queryKey: ['museum', 'visual-of-the-week'],
    queryFn: async () => {
      console.log('🏛️ useVisualOfTheWeek: Starting fetch');
      const items = await museumService.getVisualOfTheWeek();
      console.log('🏛️ useVisualOfTheWeek: Fetched items:', items.length);
      return items;
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
    retry: 1, // Reduced retries since we have reliable fallback data
    retryDelay: 1000,
  });
};
