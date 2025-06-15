
import { useQuery } from '@tanstack/react-query';
import { nasaService, APODData } from '@/services/NASAService';
import { featureFlagService } from '@/services/FeatureFlagService';

export const useNASAAPOD = () => {
  const isEnabled = featureFlagService.isEnabled('enableNASAImageExplorer');

  return useQuery({
    queryKey: ['nasa', 'apod', 'today'],
    queryFn: () => nasaService.getTodaysAPOD(),
    enabled: isEnabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (was cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useNASARecentAPODs = (count: number = 7) => {
  const isEnabled = featureFlagService.isEnabled('enableNASAImageExplorer');

  return useQuery({
    queryKey: ['nasa', 'apod', 'recent', count],
    queryFn: () => nasaService.getRecentAPODs(count),
    enabled: isEnabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (was cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
