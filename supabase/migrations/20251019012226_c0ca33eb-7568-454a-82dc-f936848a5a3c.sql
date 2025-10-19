-- Add display_section column to partner_resources table
ALTER TABLE partner_resources 
ADD COLUMN display_section text DEFAULT 'recommended_organizations';

-- Add check constraint to ensure only valid values
ALTER TABLE partner_resources 
ADD CONSTRAINT partner_resources_display_section_check 
CHECK (display_section IN ('trusted_partners', 'recommended_organizations'));

-- Update existing partners based on their category
-- Snugz and David Scullion should be trusted_partners
UPDATE partner_resources 
SET display_section = 'trusted_partners' 
WHERE name IN ('Snugz', 'David Scullion');

-- All others should be recommended_organizations
UPDATE partner_resources 
SET display_section = 'recommended_organizations' 
WHERE name NOT IN ('Snugz', 'David Scullion');