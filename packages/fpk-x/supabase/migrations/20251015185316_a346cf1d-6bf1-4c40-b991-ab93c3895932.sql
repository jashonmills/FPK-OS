-- Add global tour disable setting to user_tour_progress table
ALTER TABLE user_tour_progress 
ADD COLUMN IF NOT EXISTS tours_disabled BOOLEAN DEFAULT false;

-- Add a column to allow resetting all tours at once
ALTER TABLE user_tour_progress
ADD COLUMN IF NOT EXISTS reset_all_tours BOOLEAN DEFAULT false;