
import { useQuery } from '@tanstack/react-query';
import { weatherService, WeatherData } from '@/services/WeatherService';
import { useUserLocation } from './useUserLocation';

export const useWeatherData = () => {
  const { location } = useUserLocation();

  return useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: () => {
      if (!location) {
        throw new Error('Location not available');
      }
      return weatherService.getWeatherData(location.latitude, location.longitude);
    },
    enabled: !!location,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
