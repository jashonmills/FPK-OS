
import { useQuery } from '@tanstack/react-query';
import { museumService, MuseumItem } from '@/services/MuseumService';

export const useVisualOfTheWeek = () => {
  return useQuery({
    queryKey: ['museum', 'visual-of-the-week'],
    queryFn: () => museumService.getVisualOfTheWeek(),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
