
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CloudSun, MapPin, RotateCcw, Clock } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useViewportAnalytics } from '@/hooks/useViewportAnalytics';
import { format } from 'date-fns';
import WeatherChart from './WeatherChart';
import WeatherMiniLesson from './WeatherMiniLesson';

const WeatherScienceLabCard: React.FC = () => {
  const { location, isLoading: locationLoading, error: locationError, requestLocation } = useUserLocation();
  const { data: weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeatherData();
  const { elementRef, trackClick } = useViewportAnalytics('weather');

  const isLoading = locationLoading || weatherLoading;
  const hasError = locationError || weatherError;

  const handleChartInteract = () => {
    trackClick('chart');
  };

  const handleLessonGenerate = () => {
    trackClick('lesson_generate');
  };

  const handleRetry = () => {
    if (locationError) {
      requestLocation();
    } else {
      refetch();
    }
  };

  const handleRefresh = () => {
    // Clear weather cache and refetch
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('weather_cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
    refetch();
    trackClick('refresh');
  };

  if (hasError) {
    return (
      <Card ref={elementRef} className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Weather & You</CardTitle>
          <CloudSun className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CloudSun className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-blue-900 mb-2">
              Unable to Load Weather
            </div>
            <p className="text-xs text-blue-700 mb-4">
              {locationError ? 'Location access needed' : 'Weather data unavailable'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {locationError ? 'Enable Location' : 'Retry'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={elementRef} className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-800">Weather & You</CardTitle>
        <CloudSun className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        ) : weatherData ? (
          <div className="space-y-4">
            {/* Current Weather Summary */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin className="h-3 w-3" />
                <span>{location?.city || 'Your Location'}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-3 w-3" />
                <span>Updated: {format(new Date(weatherData.lastUpdated), 'HH:mm')}</span>
              </div>
            </div>

            {/* Current Conditions */}
            <div className="bg-white/35 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-2xl font-bold text-blue-900 drop-shadow-sm">
                {Math.round(weatherData.current.temp)}°C
              </div>
              <div className="text-sm text-blue-700 capitalize font-medium drop-shadow-sm">
                {weatherData.current.weather[0]?.description || 'Clear sky'}
              </div>
              <div className="text-xs text-blue-600 mt-1 font-medium drop-shadow-sm">
                Humidity: {weatherData.current.humidity}%
              </div>
            </div>

            {/* Weather Chart */}
            <div className="bg-white/35 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">12-Hour Forecast</h4>
              <WeatherChart data={weatherData} onInteract={handleChartInteract} />
            </div>

            {/* Mini-Lesson Section */}
            <WeatherMiniLesson 
              weatherData={weatherData} 
              onGenerate={handleLessonGenerate}
            />

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-600">
                Weather science • Updates every 5 min
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-blue-600 hover:bg-blue-100 h-6 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CloudSun className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <div className="text-lg font-semibold text-blue-900 mb-2">
              No Weather Data
            </div>
            <p className="text-xs text-blue-700">Unable to load weather information</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherScienceLabCard;
