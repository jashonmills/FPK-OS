import { useState, useCallback } from 'react';
import { fetchWeatherData, type WeatherData } from '@/utils/weatherService';

/**
 * Hook for getting weather data when creating logs.
 * Automatically gets location and fetches weather.
 */
export const useWeatherForLog = () => {
  const [isGettingWeather, setIsGettingWeather] = useState(false);

  const getWeatherForLog = useCallback(async (): Promise<WeatherData> => {
    setIsGettingWeather(true);
    
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false, // Faster for logging
          timeout: 5000,
          maximumAge: 600000, // Cache for 10 minutes
        });
      });

      // Fetch weather for this location
      const weatherData = await fetchWeatherData(
        position.coords.latitude,
        position.coords.longitude
      );
      
      return weatherData;
    } catch (error) {
      console.warn('Could not get weather data for log:', error);
      // Return empty weather data if location/weather fails
      // This allows logs to be created even if weather data is unavailable
      return {};
    } finally {
      setIsGettingWeather(false);
    }
  }, []);

  return { getWeatherForLog, isGettingWeather };
};
