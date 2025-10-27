-- Operation Spearhead: AI-Powered Moderation System
-- Phase 1: Foundation - Database Tables & Feature Flag

-- Create feature flag for Operation Spearhead
INSERT INTO feature_flags (flag_name, is_enabled, description, created_at)
VALUES (
  'operation_spearhead_enabled',
  false,
  'AI-powered moderation for private messages and group chats. Guards against hate speech and de-escalates conflicts.',
  now()
)
ON CONFLICT (flag_name) DO NOTHING;

-- Table 1: user_bans - Track all user bans (AI and manual)
CREATE TABLE IF NOT EXISTS user_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_by_user_id uuid REFERENCES auth.users(id),
  is_ai_ban boolean NOT NULL DEFAULT true,
  reason text NOT NULL,
  offending_conversation_id uuid REFERENCES conversations(id),
  offending_message_content text NOT NULL,
  severity_score integer CHECK (severity_score >= 0 AND severity_score <= 10),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'appealed', 'overturned', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_bans_user_id ON user_bans(user_id);
CREATE INDEX idx_user_bans_status ON user_bans(status);
CREATE INDEX idx_user_bans_expires_at ON user_bans(expires_at);
CREATE INDEX idx_user_bans_user_status ON user_bans(user_id, status);

-- Table 2: ban_appeals - User appeals for AI-issued bans
CREATE TABLE IF NOT EXISTS ban_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ban_id uuid NOT NULL REFERENCES user_bans(id) ON DELETE CASCADE,
  user_justification text NOT NULL,
  status text NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'denied')),
  reviewed_by_admin_id uuid REFERENCES auth.users(id),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX idx_ban_appeals_status ON ban_appeals(status);
CREATE INDEX idx_ban_appeals_ban_id ON ban_appeals(ban_id);

-- Table 3: ai_moderation_log - Audit log for all AI analysis
CREATE TABLE IF NOT EXISTS ai_moderation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  message_content text NOT NULL,
  severity_score integer NOT NULL CHECK (severity_score >= 0 AND severity_score <= 10),
  violation_category text,
  action_taken text NOT NULL CHECK (action_taken IN ('ALLOWED', 'DE_ESCALATED', 'BLOCKED_AND_BANNED')),
  de_escalation_message text,
  raw_ai_response jsonb NOT NULL,
  processing_time_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_moderation_log_conversation ON ai_moderation_log(conversation_id);
CREATE INDEX idx_ai_moderation_log_sender ON ai_moderation_log(sender_id);
CREATE INDEX idx_ai_moderation_log_action ON ai_moderation_log(action_taken);
CREATE INDEX idx_ai_moderation_log_severity ON ai_moderation_log(severity_score);
CREATE INDEX idx_ai_moderation_log_created_at ON ai_moderation_log(created_at DESC);

-- RLS Policies for user_bans
ALTER TABLE user_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own active bans"
  ON user_bans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND status = 'active');

CREATE POLICY "Admins can view all bans"
  ON user_bans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Only service role can insert bans"
  ON user_bans FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Admins can update bans"
  ON user_bans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policies for ban_appeals
ALTER TABLE ban_appeals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appeals"
  ON ban_appeals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_bans
      WHERE user_bans.id = ban_appeals.ban_id
      AND user_bans.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all appeals"
  ON ban_appeals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Users can create appeals for their own bans"
  ON ban_appeals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_bans
      WHERE user_bans.id = ban_appeals.ban_id
      AND user_bans.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update appeals"
  ON ban_appeals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policies for ai_moderation_log
ALTER TABLE ai_moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view moderation logs"
  ON ai_moderation_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Only service role can insert moderation logs"
  ON ai_moderation_log FOR INSERT
  WITH CHECK (false);

-- Add is_system_message flag to messages table for de-escalation messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_system_message boolean DEFAULT false;

-- Create function to auto-expire old bans
CREATE OR REPLACE FUNCTION expire_old_bans()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_bans
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at < now();
END;
$$;