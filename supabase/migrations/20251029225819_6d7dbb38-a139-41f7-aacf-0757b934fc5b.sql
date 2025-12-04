-- First, drop the old constraint
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- Update existing messages to use persona IDs instead of user IDs
UPDATE messages m
SET sender_id = p.id
FROM personas p
WHERE m.sender_id = p.user_id;

-- Now add the new foreign key constraint
ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES personas(id) ON DELETE CASCADE;