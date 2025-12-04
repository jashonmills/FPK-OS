-- Fix the update_updated_at_column function to be safer
-- It should check if the updated_at column exists before trying to set it
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the table has an updated_at column before trying to set it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'updated_at'
  ) THEN
    -- Use dynamic SQL to set updated_at only if the column exists
    EXECUTE format('UPDATE %I.%I SET updated_at = now() WHERE id = $1', TG_TABLE_SCHEMA, TG_TABLE_NAME) USING NEW.id;
    RETURN NEW;
  ELSE
    -- If no updated_at column, just return NEW without modification
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Also create a second version that works with BEFORE triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column_before()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the NEW record has an updated_at field before trying to set it
  IF to_jsonb(NEW) ? 'updated_at' THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;