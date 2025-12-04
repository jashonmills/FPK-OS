-- Add weather and air quality tracking to sleep_records table
ALTER TABLE public.sleep_records
ADD COLUMN IF NOT EXISTS weather_temp_f NUMERIC,
ADD COLUMN IF NOT EXISTS weather_temp_c NUMERIC,
ADD COLUMN IF NOT EXISTS weather_humidity NUMERIC,
ADD COLUMN IF NOT EXISTS weather_pressure_mb NUMERIC,
ADD COLUMN IF NOT EXISTS weather_wind_speed NUMERIC,
ADD COLUMN IF NOT EXISTS weather_condition TEXT,
ADD COLUMN IF NOT EXISTS weather_fetched_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS aqi_us INTEGER,
ADD COLUMN IF NOT EXISTS pm25 NUMERIC,
ADD COLUMN IF NOT EXISTS pm10 NUMERIC;

COMMENT ON COLUMN public.sleep_records.weather_temp_f IS 'Temperature in Fahrenheit at time of sleep record';
COMMENT ON COLUMN public.sleep_records.weather_temp_c IS 'Temperature in Celsius at time of sleep record';
COMMENT ON COLUMN public.sleep_records.weather_humidity IS 'Humidity percentage';
COMMENT ON COLUMN public.sleep_records.weather_pressure_mb IS 'Barometric pressure in millibars';
COMMENT ON COLUMN public.sleep_records.weather_wind_speed IS 'Wind speed in MPH';
COMMENT ON COLUMN public.sleep_records.weather_condition IS 'Weather condition description';
COMMENT ON COLUMN public.sleep_records.weather_fetched_at IS 'When weather data was captured';
COMMENT ON COLUMN public.sleep_records.aqi_us IS 'US Air Quality Index (0-500)';
COMMENT ON COLUMN public.sleep_records.pm25 IS 'PM2.5 particulate matter';
COMMENT ON COLUMN public.sleep_records.pm10 IS 'PM10 particulate matter';