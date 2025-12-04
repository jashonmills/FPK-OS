-- Add unique constraint to profiles table for proper joins
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (id);

-- Ensure assignee_id has proper foreign key to profiles
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_assignee_id_fkey 
  FOREIGN KEY (assignee_id) REFERENCES profiles(id) ON DELETE SET NULL;