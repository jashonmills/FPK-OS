
import { useState, useEffect } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { logger } from '@/utils/logger';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Fallback locations for major cities
  const fallbackLocations: Record<string, LocationData> = {
    'new_york': { latitude: 40.7128, longitude: -74.0060, city: 'New York' },
    'london': { latitude: 51.5074, longitude: -0.1278, city: 'London' },
    'tokyo': { latitude: 35.6762, longitude: 139.6503, city: 'Tokyo' },
    'paris': { latitude: 48.8566, longitude: 2.3522, city: 'Paris' },
    'sydney': { latitude: -33.8688, longitude: 151.2093, city: 'Sydney' },
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocation(fallbackLocations.new_york);
      setIsLoading(false);
      return;
    }

    setPermissionRequested(true);
    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(locationData);
      logger.debug('Successfully obtained user location', 'GEO', locationData);
    } catch (err) {
      logger.warn('Could not get user location', 'GEO', err);
      setError('Could not access your location');
      // Use fallback location
      setLocation(fallbackLocations.new_york);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have cached location
    try {
      const cachedLocation = safeLocalStorage.getItem<string>('user_location', { fallbackValue: null });
      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation) as LocationData;
        setLocation(parsed);
        setIsLoading(false);
        logger.debug('Using cached location', 'GEO', parsed);
        return;
      }
    } catch (error) {
      logger.warn('Could not read cached location', 'GEO', error);
    }

    // Auto-request location on first load
    requestLocation();
  }, []);

  // Cache location when it changes
  useEffect(() => {
    if (location) {
      try {
        safeLocalStorage.setItem('user_location', JSON.stringify(location));
      } catch (error) {
        logger.warn('Could not cache location', 'GEO', error);
      }
    }
  }, [location]);

  return {
    location,
    isLoading,
    error,
    permissionRequested,
    requestLocation,
    setLocation: (newLocation: LocationData) => {
      setLocation(newLocation);
      try {
        safeLocalStorage.setItem('user_location', JSON.stringify(newLocation));
      } catch (error) {
        logger.warn('Could not cache location', 'GEO', error);
      }
    }
  };
};
