-- Drop the 2-parameter version of get_top_priority_goals_data to fix function overloading
-- Keep only the 3-parameter version with optional p_days parameter
DROP FUNCTION IF EXISTS public.get_top_priority_goals_data(uuid, uuid);