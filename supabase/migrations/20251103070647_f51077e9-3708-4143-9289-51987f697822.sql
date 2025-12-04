-- Add unique constraint to prevent duplicate category names per budget
ALTER TABLE budget_categories 
ADD CONSTRAINT unique_category_per_budget 
UNIQUE (budget_id, name);