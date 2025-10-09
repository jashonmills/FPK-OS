-- Phase 1 & 6: Add extended environmental data columns to all log tables

-- Add extended air quality and pollen columns to incident_logs
ALTER TABLE public.incident_logs 
ADD COLUMN IF NOT EXISTS aqi_european integer,
ADD COLUMN IF NOT EXISTS o3 numeric,
ADD COLUMN IF NOT EXISTS no2 numeric,
ADD COLUMN IF NOT EXISTS so2 numeric,
ADD COLUMN IF NOT EXISTS co numeric,
ADD COLUMN IF NOT EXISTS pollen_alder integer,
ADD COLUMN IF NOT EXISTS pollen_birch integer,
ADD COLUMN IF NOT EXISTS pollen_grass integer,
ADD COLUMN IF NOT EXISTS pollen_mugwort integer,
ADD COLUMN IF NOT EXISTS pollen_olive integer,
ADD COLUMN IF NOT EXISTS pollen_ragweed integer,
ADD COLUMN IF NOT EXISTS air_quality_fetched_at timestamp with time zone;

-- Add extended air quality and pollen columns to parent_logs
ALTER TABLE public.parent_logs 
ADD COLUMN IF NOT EXISTS aqi_european integer,
ADD COLUMN IF NOT EXISTS o3 numeric,
ADD COLUMN IF NOT EXISTS no2 numeric,
ADD COLUMN IF NOT EXISTS so2 numeric,
ADD COLUMN IF NOT EXISTS co numeric,
ADD COLUMN IF NOT EXISTS pollen_alder integer,
ADD COLUMN IF NOT EXISTS pollen_birch integer,
ADD COLUMN IF NOT EXISTS pollen_grass integer,
ADD COLUMN IF NOT EXISTS pollen_mugwort integer,
ADD COLUMN IF NOT EXISTS pollen_olive integer,
ADD COLUMN IF NOT EXISTS pollen_ragweed integer,
ADD COLUMN IF NOT EXISTS air_quality_fetched_at timestamp with time zone;

-- Add extended air quality and pollen columns to educator_logs
ALTER TABLE public.educator_logs 
ADD COLUMN IF NOT EXISTS aqi_european integer,
ADD COLUMN IF NOT EXISTS o3 numeric,
ADD COLUMN IF NOT EXISTS no2 numeric,
ADD COLUMN IF NOT EXISTS so2 numeric,
ADD COLUMN IF NOT EXISTS co numeric,
ADD COLUMN IF NOT EXISTS pollen_alder integer,
ADD COLUMN IF NOT EXISTS pollen_birch integer,
ADD COLUMN IF NOT EXISTS pollen_grass integer,
ADD COLUMN IF NOT EXISTS pollen_mugwort integer,
ADD COLUMN IF NOT EXISTS pollen_olive integer,
ADD COLUMN IF NOT EXISTS pollen_ragweed integer,
ADD COLUMN IF NOT EXISTS air_quality_fetched_at timestamp with time zone;

-- Add extended air quality and pollen columns to sleep_records
ALTER TABLE public.sleep_records 
ADD COLUMN IF NOT EXISTS aqi_european integer,
ADD COLUMN IF NOT EXISTS o3 numeric,
ADD COLUMN IF NOT EXISTS no2 numeric,
ADD COLUMN IF NOT EXISTS so2 numeric,
ADD COLUMN IF NOT EXISTS co numeric,
ADD COLUMN IF NOT EXISTS pollen_alder integer,
ADD COLUMN IF NOT EXISTS pollen_birch integer,
ADD COLUMN IF NOT EXISTS pollen_grass integer,
ADD COLUMN IF NOT EXISTS pollen_mugwort integer,
ADD COLUMN IF NOT EXISTS pollen_olive integer,
ADD COLUMN IF NOT EXISTS pollen_ragweed integer,
ADD COLUMN IF NOT EXISTS air_quality_fetched_at timestamp with time zone;

-- Phase 6: Add missing sleep tracking columns
ALTER TABLE public.sleep_records
ADD COLUMN IF NOT EXISTS fell_asleep_time text,
ADD COLUMN IF NOT EXISTS disturbances text[],
ADD COLUMN IF NOT EXISTS pre_bed_activities text[],
ADD COLUMN IF NOT EXISTS fell_asleep_in_school boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS asleep_location text,
ADD COLUMN IF NOT EXISTS daytime_medication_taken boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS daytime_medication_details text,
ADD COLUMN IF NOT EXISTS daytime_notes text,
ADD COLUMN IF NOT EXISTS nap_start_time text,
ADD COLUMN IF NOT EXISTS nap_end_time text;