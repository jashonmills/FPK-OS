-- Update both EL Handwriting and EL Optimal Learning State courses to use v2 content system

UPDATE courses 
SET content_version = 'v2' 
WHERE slug IN ('el-handwriting', 'optimal-learning-state', 'learning-state-beta', 'empowering-learning-state');