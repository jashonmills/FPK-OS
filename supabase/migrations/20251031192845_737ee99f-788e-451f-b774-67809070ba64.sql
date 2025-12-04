-- Create team_discussion_notifications table
CREATE TABLE team_discussion_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who receives this notification
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Who triggered it
  actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- What discussion triggered it
  discussion_id UUID NOT NULL REFERENCES team_discussions(id) ON DELETE CASCADE,
  
  -- Notification metadata
  notification_type TEXT NOT NULL CHECK (notification_type IN ('mention', 'reply', 'comment')),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Read status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate notifications
  UNIQUE(recipient_user_id, discussion_id)
);

-- Indexes for performance
CREATE INDEX idx_notifications_recipient ON team_discussion_notifications(recipient_user_id, is_read);
CREATE INDEX idx_notifications_created ON team_discussion_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE team_discussion_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON team_discussion_notifications FOR SELECT
  USING (recipient_user_id = auth.uid());

-- System can create notifications (via trigger)
CREATE POLICY "System can create notifications"
  ON team_discussion_notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON team_discussion_notifications FOR UPDATE
  USING (recipient_user_id = auth.uid())
  WITH CHECK (recipient_user_id = auth.uid());

-- Function to create notifications when discussions are created
CREATE OR REPLACE FUNCTION create_discussion_notifications()
RETURNS TRIGGER AS $$
DECLARE
  mentioned_user UUID;
  parent_author UUID;
  family_member_record RECORD;
BEGIN
  -- 1. Create mention notifications
  IF NEW.mentioned_user_ids IS NOT NULL AND array_length(NEW.mentioned_user_ids, 1) > 0 THEN
    FOREACH mentioned_user IN ARRAY NEW.mentioned_user_ids
    LOOP
      -- Don't notify yourself
      IF mentioned_user != NEW.user_id THEN
        INSERT INTO team_discussion_notifications (
          recipient_user_id,
          actor_user_id,
          discussion_id,
          notification_type,
          entity_type,
          entity_id
        ) VALUES (
          mentioned_user,
          NEW.user_id,
          NEW.id,
          'mention',
          NEW.entity_type,
          NEW.entity_id
        )
        ON CONFLICT (recipient_user_id, discussion_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- 2. Create reply notifications
  IF NEW.parent_id IS NOT NULL THEN
    -- Get the author of the parent comment
    SELECT user_id INTO parent_author
    FROM team_discussions
    WHERE id = NEW.parent_id;
    
    -- Notify parent author (unless they're the one replying)
    IF parent_author IS NOT NULL AND parent_author != NEW.user_id THEN
      INSERT INTO team_discussion_notifications (
        recipient_user_id,
        actor_user_id,
        discussion_id,
        notification_type,
        entity_type,
        entity_id
      ) VALUES (
        parent_author,
        NEW.user_id,
        NEW.id,
        'reply',
        NEW.entity_type,
        NEW.entity_id
      )
      ON CONFLICT (recipient_user_id, discussion_id) DO NOTHING;
    END IF;
  END IF;

  -- 3. Create comment notifications for all family members (except mentions and replies already handled)
  FOR family_member_record IN
    SELECT user_id 
    FROM family_members 
    WHERE family_id = NEW.family_id 
      AND user_id != NEW.user_id
      AND user_id != ALL(COALESCE(NEW.mentioned_user_ids, ARRAY[]::UUID[]))
  LOOP
    INSERT INTO team_discussion_notifications (
      recipient_user_id,
      actor_user_id,
      discussion_id,
      notification_type,
      entity_type,
      entity_id
    ) VALUES (
      family_member_record.user_id,
      NEW.user_id,
      NEW.id,
      'comment',
      NEW.entity_type,
      NEW.entity_id
    )
    ON CONFLICT (recipient_user_id, discussion_id) DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger to team_discussions table
CREATE TRIGGER on_discussion_created
  AFTER INSERT ON team_discussions
  FOR EACH ROW
  EXECUTE FUNCTION create_discussion_notifications();

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_discussion_notifications;