
import { useState, useEffect } from 'react';

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
      console.log('📍 Location: Successfully obtained user location');
    } catch (err) {
      console.warn('📍 Location: Could not get user location:', err);
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
      const cachedLocation = localStorage.getItem('user_location');
      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation) as LocationData;
        setLocation(parsed);
        setIsLoading(false);
        console.log('📍 Location: Using cached location');
        return;
      }
    } catch (error) {
      console.warn('📍 Location: Could not read cached location:', error);
    }

    // Auto-request location on first load
    requestLocation();
  }, []);

  // Cache location when it changes
  useEffect(() => {
    if (location) {
      try {
        localStorage.setItem('user_location', JSON.stringify(location));
      } catch (error) {
        console.warn('📍 Location: Could not cache location:', error);
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
        localStorage.setItem('user_location', JSON.stringify(newLocation));
      } catch (error) {
        console.warn('📍 Location: Could not cache location:', error);
      }
    }
  };
};
