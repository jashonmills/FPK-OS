-- Add 'beta' to the organization subscription tier enum if it exists
DO $$ 
BEGIN
    -- Check if the enum type exists and add 'beta' if not present
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'org_subscription_tier') THEN
        -- Add 'beta' to existing enum if not already present
        BEGIN
            ALTER TYPE org_subscription_tier ADD VALUE 'beta';
        EXCEPTION WHEN duplicate_object THEN
            -- 'beta' value already exists, continue
            NULL;
        END;
    END IF;
END $$;

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
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_subscription_tier_check;

ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_subscription_tier_check 
CHECK (subscription_tier IN ('basic', 'standard', 'premium', 'beta'));

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY IF NOT EXISTS "Organization owners can manage their orgs" 
ON public.organizations 
FOR ALL 
USING (owner_id = auth.uid()) 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Organization members can view their orgs" 
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

-- Add constraint for member roles
ALTER TABLE public.org_members 
DROP CONSTRAINT IF EXISTS org_members_role_check;

ALTER TABLE public.org_members 
ADD CONSTRAINT org_members_role_check 
CHECK (role IN ('owner', 'instructor', 'student'));

-- Add constraint for member status
ALTER TABLE public.org_members 
DROP CONSTRAINT IF EXISTS org_members_status_check;

ALTER TABLE public.org_members 
ADD CONSTRAINT org_members_status_check 
CHECK (status IN ('active', 'paused', 'blocked', 'removed'));

-- Enable RLS on org_members
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Create policies for org_members
CREATE POLICY IF NOT EXISTS "Organization owners can manage members" 
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

CREATE POLICY IF NOT EXISTS "Organization members can view themselves" 
ON public.org_members 
FOR SELECT 
USING (user_id = auth.uid());

-- Create trigger to update seat usage
CREATE OR REPLACE FUNCTION public.update_org_seat_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update seat usage for the organization
    UPDATE public.organizations 
    SET seats_used = (
        SELECT COUNT(*) 
        FROM public.org_members 
        WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id) 
        AND status = 'active'
        AND role = 'student'
    )
    WHERE id = COALESCE(NEW.organization_id, OLD.organization_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_seat_usage_trigger ON public.org_members;
CREATE TRIGGER update_seat_usage_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.org_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_org_seat_usage();