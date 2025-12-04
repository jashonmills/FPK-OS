-- Add status and suspension fields to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES auth.users(id);

-- Create organization_notifications table
CREATE TABLE IF NOT EXISTS public.organization_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notification_type TEXT NOT NULL DEFAULT 'general',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create organization_exports table
CREATE TABLE IF NOT EXISTS public.organization_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  export_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  file_path TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS on new tables
ALTER TABLE public.organization_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_exports ENABLE ROW LEVEL SECURITY;

-- Create policies for organization_notifications
CREATE POLICY "Admins can manage all notifications" ON public.organization_notifications
  FOR ALL USING (public.auth_is_admin());

CREATE POLICY "Org owners can view their notifications" ON public.organization_notifications
  FOR SELECT USING (public.is_org_owner(auth.uid(), organization_id));

-- Create policies for organization_exports
CREATE POLICY "Admins can manage all exports" ON public.organization_exports
  FOR ALL USING (public.auth_is_admin());

CREATE POLICY "Requesters can view their exports" ON public.organization_exports
  FOR SELECT USING (auth.uid() = requested_by);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(status);
CREATE INDEX IF NOT EXISTS idx_org_notifications_org_id ON public.organization_notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_exports_org_id ON public.organization_exports(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_exports_status ON public.organization_exports(status);