import { useState, useCallback } from 'react';

interface LocationCoords {
  lat: number;
  lon: number;
}

type LocationStatus = 'idle' | 'pending' | 'success' | 'error';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setStatus('success');
        setError(null);
      },
      (err) => {
        setStatus('error');
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache location for 5 minutes
      }
    );
  }, []);

  return { location, status, error, getLocation };
};
