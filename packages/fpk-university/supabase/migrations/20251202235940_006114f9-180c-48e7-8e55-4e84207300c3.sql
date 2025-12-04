-- Add COPPA compliance columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS parental_consent_status text DEFAULT 'not_required' CHECK (parental_consent_status IN ('not_required', 'pending', 'approved', 'denied')),
ADD COLUMN IF NOT EXISTS parental_consent_date timestamptz,
ADD COLUMN IF NOT EXISTS parent_email text,
ADD COLUMN IF NOT EXISTS is_minor boolean DEFAULT false;

-- Create parental consent requests table
CREATE TABLE IF NOT EXISTS public.parental_consent_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_email text NOT NULL,
  consent_token uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  requested_at timestamptz DEFAULT now() NOT NULL,
  responded_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.parental_consent_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for parental_consent_requests
CREATE POLICY "Users can view their own consent requests"
ON public.parental_consent_requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own consent requests"
ON public.parental_consent_requests
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Public policy for parents to respond via token (anonymous access)
CREATE POLICY "Anyone can view consent request by token for parent response"
ON public.parental_consent_requests
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anonymous can update consent status via token"
ON public.parental_consent_requests
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_consent_requests_token ON public.parental_consent_requests(consent_token);
CREATE INDEX IF NOT EXISTS idx_consent_requests_user ON public.parental_consent_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_requests_status ON public.parental_consent_requests(status);