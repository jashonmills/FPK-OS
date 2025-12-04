-- Grant beta access to all existing users
UPDATE profiles 
SET beta_access = true 
WHERE beta_access IS NULL OR beta_access = false;