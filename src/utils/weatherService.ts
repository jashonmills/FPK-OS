import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  weather_condition?: string;
  weather_temp_f?: number;
  weather_temp_c?: string;
  weather_humidity?: number;
  weather_pressure_mb?: number;
  weather_wind_speed?: number;
  weather_fetched_at?: string;
  aqi_us?: number;
  aqi_european?: number;
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
  pollen_alder?: number;
  pollen_birch?: number;
  pollen_grass?: number;
  pollen_mugwort?: number;
  pollen_olive?: number;
  pollen_ragweed?: number;
  air_quality_fetched_at?: string;
}

export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-weather-data', {
      body: { latitude: 42.4391, longitude: -123.3284 } // Grants Pass, OR
    });

    if (error) throw error;
    return data as WeatherData;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return {};
  }
};
