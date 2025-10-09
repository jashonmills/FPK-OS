import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude = 42.4391, longitude = -123.3284 } = await req.json(); // Grants Pass, OR

    // Using Open-Meteo (free, no API key required)
    // Weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&temperature_unit=fahrenheit`;
    
    // Extended air quality data (US AQI + European AQI + individual pollutants)
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
    
    // Pollen data
    const pollenUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen`;

    const [weatherRes, airRes, pollenRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airQualityUrl),
      fetch(pollenUrl)
    ]);

    const weatherData = await weatherRes.json();
    const airData = await airRes.json();
    const pollenData = await pollenRes.json();

    // Weather code to condition mapping (simplified)
    const weatherCodeMap: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };

    const weatherCode = weatherData.current?.weather_code || 0;
    const condition = weatherCodeMap[weatherCode] || 'Unknown';

    const fetchedAt = new Date().toISOString();
    
    return new Response(JSON.stringify({
      weather_condition: condition,
      weather_temp_f: weatherData.current?.temperature_2m,
      weather_temp_c: ((weatherData.current?.temperature_2m - 32) * 5/9).toFixed(1),
      weather_humidity: weatherData.current?.relative_humidity_2m,
      weather_pressure_mb: weatherData.current?.surface_pressure,
      weather_wind_speed: weatherData.current?.wind_speed_10m,
      weather_fetched_at: fetchedAt,
      aqi_us: airData.current?.us_aqi,
      aqi_european: airData.current?.european_aqi,
      pm25: airData.current?.pm2_5,
      pm10: airData.current?.pm10,
      o3: airData.current?.ozone,
      no2: airData.current?.nitrogen_dioxide,
      so2: airData.current?.sulphur_dioxide,
      co: airData.current?.carbon_monoxide,
      pollen_alder: pollenData.current?.alder_pollen,
      pollen_birch: pollenData.current?.birch_pollen,
      pollen_grass: pollenData.current?.grass_pollen,
      pollen_mugwort: pollenData.current?.mugwort_pollen,
      pollen_olive: pollenData.current?.olive_pollen,
      pollen_ragweed: pollenData.current?.ragweed_pollen,
      air_quality_fetched_at: fetchedAt,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
