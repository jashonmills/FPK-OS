-- Phase 2: Create permissions table (atomic permissions)
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 3: Create role_permissions table (default permissions per role)
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- Phase 4: Create user_permissions table (user-specific overrides)
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted BOOLEAN DEFAULT TRUE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  UNIQUE(user_id, permission_id)
);

-- Phase 5: Create project_members table (scoped access for managers)
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Phase 6: Create security definer function for permission checking
CREATE OR REPLACE FUNCTION public.user_has_permission(
  _user_id UUID,
  _permission_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  has_perm BOOLEAN;
  override_exists BOOLEAN;
  override_value BOOLEAN;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT 
    EXISTS(SELECT 1 FROM user_permissions WHERE user_id = _user_id AND permission_id = p.id),
    COALESCE(up.granted, FALSE)
  INTO override_exists, override_value
  FROM permissions p
  LEFT JOIN user_permissions up ON up.permission_id = p.id AND up.user_id = _user_id
  WHERE p.name = _permission_name;

  IF override_exists THEN
    RETURN override_value;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM role_permissions rp
    JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.role = user_role
    AND p.name = _permission_name
  ) INTO has_perm;

  RETURN COALESCE(has_perm, FALSE);
END;
$$;

-- Phase 7: Add RLS policies for new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view permissions"
ON public.permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view role permissions"
ON public.role_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage user permission overrides"
ON public.user_permissions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own permission overrides"
ON public.user_permissions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Managers can manage their project members"
ON public.project_members FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = project_members.project_id
    AND pm.user_id = auth.uid()
    AND pm.role = 'manager'
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view project members"
ON public.project_members FOR SELECT
TO authenticated
USING (true);

-- Phase 8: Seed permissions (15 atomic permissions)
INSERT INTO public.permissions (name, description, category) VALUES
  ('admin_panel_full', 'Full access to admin dashboard including user/role management', 'admin'),
  ('admin_panel_limited', 'Limited access to system settings and integrations only', 'admin'),
  ('payroll_view', 'View payroll runs and all time entries', 'payroll'),
  ('payroll_edit', 'Edit time entries for payroll corrections', 'payroll'),
  ('payroll_approve', 'Approve payroll runs and generate payments', 'payroll'),
  ('budget_view_all', 'View budgets for all projects', 'budget'),
  ('budget_view_assigned', 'View budgets only for assigned projects', 'budget'),
  ('budget_edit', 'Edit project budgets and log expenses', 'budget'),
  ('projects_view_all', 'View all projects and tasks across the system', 'projects'),
  ('projects_view_assigned', 'View only assigned projects and tasks', 'projects'),
  ('projects_edit_assigned', 'Edit assigned projects and tasks', 'projects'),
  ('projects_readonly', 'Read-only view of specific projects', 'projects'),
  ('time_edit_own', 'Edit only own time entries', 'time'),
  ('time_view_team', 'View time entries for team members in assigned projects', 'time'),
  ('time_edit_all', 'Edit any user''s time entries (for payroll corrections)', 'time');

-- Phase 9: Map permissions to roles
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::app_role, id FROM public.permissions;

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'manager'::app_role, id FROM public.permissions
WHERE name IN (
  'budget_view_assigned',
  'budget_edit',
  'projects_view_assigned',
  'projects_edit_assigned',
  'time_edit_own',
  'time_view_team'
);

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'hr'::app_role, id FROM public.permissions
WHERE name IN (
  'payroll_view',
  'payroll_edit',
  'payroll_approve',
  'time_edit_all'
);

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'member'::app_role, id FROM public.permissions
WHERE name IN (
  'projects_view_assigned',
  'projects_edit_assigned',
  'time_edit_own'
);

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'it'::app_role, id FROM public.permissions
WHERE name IN (
  'admin_panel_limited'
);

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'viewer'::app_role, id FROM public.permissions
WHERE name IN (
  'projects_readonly'
);

-- Phase 10: Seed initial project members
INSERT INTO public.project_members (project_id, user_id, role)
SELECT p.id, ur.user_id, 
  CASE 
    WHEN ur.role = 'admin' THEN 'manager'
    ELSE 'member'
  END
FROM projects p
CROSS JOIN user_roles ur
ON CONFLICT (project_id, user_id) DO NOTHING;