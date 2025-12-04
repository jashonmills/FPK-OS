-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'basic',
    seat_limit INTEGER NOT NULL DEFAULT 3,
    seats_used INTEGER NOT NULL DEFAULT 0,
    settings JSONB DEFAULT '{}',
    beta_expiration_date TIMESTAMPTZ,
    is_beta_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add constraint to ensure valid subscription tiers
DO $$ 
BEGIN
    ALTER TABLE public.organizations 
    ADD CONSTRAINT organizations_subscription_tier_check 
    CHECK (subscription_tier IN ('basic', 'standard', 'premium', 'beta'));
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Organization owners can manage their orgs" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view their orgs" ON public.organizations;

-- Create policies for organizations
CREATE POLICY "Organization owners can manage their orgs" 
ON public.organizations 
FOR ALL 
USING (owner_id = auth.uid()) 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Organization members can view their orgs" 
ON public.organizations 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.org_members 
        WHERE organization_id = organizations.id 
        AND user_id = auth.uid() 
        AND status = 'active'
    )
);

-- Create org_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.org_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    status TEXT NOT NULL DEFAULT 'active',
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ,
    removed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- Add constraints for member roles and status
DO $$ 
BEGIN
    ALTER TABLE public.org_members 
    ADD CONSTRAINT org_members_role_check 
    CHECK (role IN ('owner', 'instructor', 'student'));
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.org_members 
    ADD CONSTRAINT org_members_status_check 
    CHECK (status IN ('active', 'paused', 'blocked', 'removed'));
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

-- Enable RLS on org_members
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Organization owners can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Organization members can view themselves" ON public.org_members;

-- Create policies for org_members
CREATE POLICY "Organization owners can manage members" 
ON public.org_members 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.organizations 
        WHERE id = org_members.organization_id 
        AND owner_id = auth.uid()
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.organizations 
        WHERE id = org_members.organization_id 
        AND owner_id = auth.uid()
    )
);

CREATE POLICY "Organization members can view themselves" 
ON public.org_members 
FOR SELECT 
USING (user_id = auth.uid());