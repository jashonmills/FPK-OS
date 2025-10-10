import { useEffect, useState } from 'react';
import { Cloud, Droplets, Gauge, Wind, MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchWeatherData, type WeatherData } from '@/utils/weatherService';
import { useLocation } from '@/hooks/useLocation';
import { toast } from 'sonner';

export const LiveWeatherDisplay = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const { location, status, error, getLocation } = useLocation();

  const loadWeather = async (lat: number, lon: number) => {
    try {
      setIsLoadingWeather(true);
      const data = await fetchWeatherData(lat, lon);
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
      toast.error('Failed to load weather data');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (status === 'success' && location) {
      loadWeather(location.lat, location.lon);
      const interval = setInterval(() => loadWeather(location.lat, location.lon), 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [status, location]);

  const getAQIColor = (aqi?: number) => {
    if (!aqi) return 'text-muted-foreground';
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    if (aqi <= 200) return 'text-red-600';
    return 'text-purple-600';
  };

  const getAQILabel = (aqi?: number) => {
    if (!aqi) return 'Unknown';
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  if (status === 'pending') {
    return (
      <Card className="backdrop-blur-md bg-card/80">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 animate-pulse" />
              <span>Fetching your location...</span>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="backdrop-blur-md bg-card/80">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-destructive font-medium">Unable to get your location</div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={getLocation} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingWeather || !weather) {
    return (
      <Card className="backdrop-blur-md bg-card/80">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cloud className="h-4 w-4 animate-pulse" />
              <span>Loading weather for your location...</span>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-card/80">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Current Weather & Air Quality</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {weather?.weather_temp_f ? `${Math.round(weather.weather_temp_f)}°F` : '--°F'}
            </div>
            <div className="text-sm text-muted-foreground">
              {weather?.weather_temp_c ? `${weather.weather_temp_c}°C` : '--°C'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3" />
          <span>Your Location</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Weather Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Gauge className="h-3 w-3" />
              <span>Pressure</span>
            </div>
            <div className="text-lg font-semibold">
              {weather?.weather_pressure_mb ? `${weather.weather_pressure_mb.toFixed(1)} mb` : '--'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Droplets className="h-3 w-3" />
              <span>Humidity</span>
            </div>
            <div className="text-lg font-semibold">
              {weather?.weather_humidity ? `${weather.weather_humidity}%` : '--'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wind className="h-3 w-3" />
              <span>Wind</span>
            </div>
            <div className="text-lg font-semibold">
              {weather?.weather_wind_speed ? `${weather.weather_wind_speed.toFixed(1)} mph` : '--'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Cloud className="h-3 w-3" />
              <span>Condition</span>
            </div>
            <div className="text-lg font-semibold">
              {weather?.weather_condition || '--'}
            </div>
          </div>
        </div>

        {/* Air Quality Section */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Wind className="h-4 w-4" />
            Air Quality & Pollen
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">US AQI</div>
              <div className={`text-lg font-semibold ${getAQIColor(weather?.aqi_us)}`}>
                {weather?.aqi_us ?? '--'}
              </div>
              <div className="text-xs text-muted-foreground">
                {getAQILabel(weather?.aqi_us)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">PM2.5</div>
              <div className="text-lg font-semibold">
                {weather?.pm25 ? weather.pm25.toFixed(1) : '--'}
              </div>
              <div className="text-xs text-muted-foreground">μg/m³</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">PM10</div>
              <div className="text-lg font-semibold">
                {weather?.pm10 ? weather.pm10.toFixed(1) : '--'}
              </div>
              <div className="text-xs text-muted-foreground">μg/m³</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="text-sm">
                {weather?.weather_fetched_at 
                  ? new Date(weather.weather_fetched_at).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })
                  : '--'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
