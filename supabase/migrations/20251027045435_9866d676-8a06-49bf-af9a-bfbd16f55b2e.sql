-- Create invite and reward system tables

-- Create invites table to store generated invite codes
CREATE TABLE public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code text UNIQUE NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_uses integer DEFAULT NULL,
  uses_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_invites_code ON public.invites(invite_code);
CREATE INDEX idx_invites_creator ON public.invites(created_by_user_id);

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invites"
  ON public.invites FOR SELECT
  USING (auth.uid() = created_by_user_id);

CREATE POLICY "Users can create invites"
  ON public.invites FOR INSERT
  WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Anyone can validate invite codes"
  ON public.invites FOR SELECT
  USING (true);

-- Create referrals table to track inviter-invitee relationships
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviting_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  new_user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_invite_code text NOT NULL REFERENCES public.invites(invite_code) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'PENDING_REWARD' CHECK (status IN ('PENDING_REWARD', 'REWARDED')),
  rewarded_at timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_referrals_inviter ON public.referrals(inviting_user_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referrals_new_user ON public.referrals(new_user_id);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = inviting_user_id);

CREATE POLICY "System can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update referrals"
  ON public.referrals FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Create user_credits table for credit balances
CREATE TABLE public.user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_earned integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_user_credits_user ON public.user_credits(user_id);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update credits"
  ON public.user_credits FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('REFERRAL_REWARD', 'SYSTEM', 'ACHIEVEMENT', 'MESSAGE')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type text NOT NULL CHECK (badge_type IN ('COMMUNITY_AMBASSADOR', 'EARLY_SUPPORTER', 'TOP_CONTRIBUTOR', 'VERIFIED')),
  earned_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_type)
);

CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Admins can grant badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code text;
  code_exists boolean;
BEGIN
  LOOP
    code := 'KINDRED-' || upper(substr(md5(random()::text), 1, 5));
    SELECT EXISTS(SELECT 1 FROM public.invites WHERE invite_code = code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN code;
END;
$$;

-- Function to add credits to user
CREATE OR REPLACE FUNCTION public.add_user_credits(
  p_user_id uuid,
  p_amount integer,
  p_reason text DEFAULT 'manual'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance, lifetime_earned)
  VALUES (p_user_id, p_amount, p_amount)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    balance = user_credits.balance + p_amount,
    lifetime_earned = user_credits.lifetime_earned + p_amount,
    updated_at = now();
END;
$$;

-- Function to auto-create credits for new users
CREATE OR REPLACE FUNCTION public.create_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance, lifetime_earned)
  VALUES (NEW.id, 0, 0);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_credits();

-- Trigger to create referral when user signs up with invite code
CREATE OR REPLACE FUNCTION public.create_referral_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_code_used text;
  inviter_id uuid;
BEGIN
  invite_code_used := NEW.raw_user_meta_data->>'invite_code';
  
  IF invite_code_used IS NOT NULL AND invite_code_used != '' THEN
    SELECT created_by_user_id INTO inviter_id
    FROM public.invites
    WHERE invite_code = invite_code_used;
    
    IF inviter_id IS NOT NULL THEN
      INSERT INTO public.referrals (
        inviting_user_id,
        new_user_id,
        used_invite_code,
        status
      ) VALUES (
        inviter_id,
        NEW.id,
        invite_code_used,
        'PENDING_REWARD'
      );
      
      UPDATE public.invites
      SET uses_count = uses_count + 1,
          updated_at = now()
      WHERE invite_code = invite_code_used;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_referral_on_signup();

-- Add updated_at trigger to invites table
CREATE TRIGGER handle_invites_updated_at
  BEFORE UPDATE ON public.invites
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add feature flag for invite system
INSERT INTO public.feature_flags (flag_name, is_enabled, description)
VALUES (
  'user_invite_system_enabled',
  false,
  'Master flag for user invite, referral tracking, and reward system'
)
ON CONFLICT (flag_name) DO NOTHING;