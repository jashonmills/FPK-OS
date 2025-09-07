-- Fix RLS recursion issue by creating a security definer function
-- and updating problematic policies

-- Create a security definer function to check if user is org member without recursion
CREATE OR REPLACE FUNCTION public.user_is_org_member_safe(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE org_members.org_id = user_is_org_member_safe.org_id
      AND org_members.user_id = check_user_id
      AND org_members.status = 'active'
  );
$$;