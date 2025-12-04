-- Admin AI Co-pilot Infrastructure
-- Secure query functions for the Admin AI to safely access organization data

-- 1. Get student list with enrollment and progress data
CREATE OR REPLACE FUNCTION get_admin_copilot_students(p_org_id uuid, p_filters jsonb DEFAULT '{}')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_completion_threshold integer;
BEGIN
  v_completion_threshold := COALESCE((p_filters->>'completion_below')::integer, 100);
  
  SELECT jsonb_build_object(
    'total_students', (SELECT COUNT(*) FROM org_students WHERE org_id = p_org_id),
    'linked_students', (SELECT COUNT(*) FROM org_students WHERE org_id = p_org_id AND linked_user_id IS NOT NULL),
    'students', COALESCE((
      SELECT jsonb_agg(student_data ORDER BY (student_data->>'full_name'))
      FROM (
        SELECT jsonb_build_object(
          'id', os.id,
          'full_name', os.full_name,
          'email', os.email,
          'linked', os.linked_user_id IS NOT NULL,
          'created_at', os.created_at,
          'enrollments', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
              'course_id', ice.course_id,
              'course_title', ice.course_title,
              'completion', ice.completion_percentage,
              'last_accessed', ice.last_accessed_at
            ))
            FROM interactive_course_enrollments ice
            WHERE ice.user_id = os.linked_user_id
          ), '[]'::jsonb),
          'avg_completion', COALESCE((
            SELECT ROUND(AVG(ice.completion_percentage)::numeric, 1)
            FROM interactive_course_enrollments ice
            WHERE ice.user_id = os.linked_user_id
          ), 0)
        ) as student_data
        FROM org_students os
        WHERE os.org_id = p_org_id
        AND (
          v_completion_threshold = 100 
          OR COALESCE((
            SELECT AVG(ice.completion_percentage)
            FROM interactive_course_enrollments ice
            WHERE ice.user_id = os.linked_user_id
          ), 0) < v_completion_threshold
        )
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 2. Get course statistics
CREATE OR REPLACE FUNCTION get_admin_copilot_courses(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_courses', (
      SELECT COUNT(DISTINCT course_id) 
      FROM student_course_assignments 
      WHERE org_id = p_org_id
    ),
    'total_enrollments', (
      SELECT COUNT(*) 
      FROM interactive_course_enrollments ice
      JOIN org_students os ON os.linked_user_id = ice.user_id
      WHERE os.org_id = p_org_id
    ),
    'avg_completion', (
      SELECT ROUND(COALESCE(AVG(ice.completion_percentage), 0)::numeric, 1)
      FROM interactive_course_enrollments ice
      JOIN org_students os ON os.linked_user_id = ice.user_id
      WHERE os.org_id = p_org_id
    ),
    'courses', COALESCE((
      SELECT jsonb_agg(course_data)
      FROM (
        SELECT jsonb_build_object(
          'course_id', ice.course_id,
          'course_title', COALESCE(c.title, ice.course_title, ice.course_id),
          'enrollments', COUNT(*),
          'avg_completion', ROUND(AVG(ice.completion_percentage)::numeric, 1),
          'completed_count', COUNT(*) FILTER (WHERE ice.completion_percentage >= 100)
        ) as course_data
        FROM interactive_course_enrollments ice
        JOIN org_students os ON os.linked_user_id = ice.user_id
        LEFT JOIN courses c ON c.id = ice.course_id
        WHERE os.org_id = p_org_id
        GROUP BY ice.course_id, c.title, ice.course_title
        ORDER BY COUNT(*) DESC
      ) subq
    ), '[]'::jsonb),
    'recent_completions', COALESCE((
      SELECT jsonb_agg(completion_data)
      FROM (
        SELECT jsonb_build_object(
          'student_name', os.full_name,
          'course_title', COALESCE(c.title, ice.course_title),
          'completed_at', ice.completed_at
        ) as completion_data
        FROM interactive_course_enrollments ice
        JOIN org_students os ON os.linked_user_id = ice.user_id
        LEFT JOIN courses c ON c.id = ice.course_id
        WHERE os.org_id = p_org_id
        AND ice.completed_at IS NOT NULL
        ORDER BY ice.completed_at DESC
        LIMIT 10
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 3. Get AI usage statistics
CREATE OR REPLACE FUNCTION get_admin_copilot_ai_usage(p_org_id uuid, p_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions', (
      SELECT COUNT(*) 
      FROM ai_tool_sessions 
      WHERE org_id = p_org_id 
      AND started_at >= NOW() - (p_days || ' days')::interval
    ),
    'total_messages', (
      SELECT COALESCE(SUM(message_count), 0)
      FROM ai_tool_sessions 
      WHERE org_id = p_org_id 
      AND started_at >= NOW() - (p_days || ' days')::interval
    ),
    'unique_users', (
      SELECT COUNT(DISTINCT user_id)
      FROM ai_tool_sessions 
      WHERE org_id = p_org_id 
      AND started_at >= NOW() - (p_days || ' days')::interval
    ),
    'by_tool', COALESCE((
      SELECT jsonb_agg(tool_data)
      FROM (
        SELECT jsonb_build_object(
          'tool_id', ats.tool_id,
          'tool_name', COALESCE(at.display_name, ats.tool_id),
          'sessions', COUNT(*),
          'messages', COALESCE(SUM(ats.message_count), 0)
        ) as tool_data
        FROM ai_tool_sessions ats
        LEFT JOIN ai_tools at ON at.id = ats.tool_id
        WHERE ats.org_id = p_org_id 
        AND ats.started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY ats.tool_id, at.display_name
        ORDER BY COUNT(*) DESC
      ) subq
    ), '[]'::jsonb),
    'top_users', COALESCE((
      SELECT jsonb_agg(user_data)
      FROM (
        SELECT jsonb_build_object(
          'user_name', COALESCE(p.full_name, p.email, ats.user_id::text),
          'sessions', COUNT(*),
          'messages', COALESCE(SUM(ats.message_count), 0)
        ) as user_data
        FROM ai_tool_sessions ats
        LEFT JOIN profiles p ON p.id = ats.user_id
        WHERE ats.org_id = p_org_id 
        AND ats.started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY ats.user_id, p.full_name, p.email
        ORDER BY COUNT(*) DESC
        LIMIT 10
      ) subq
    ), '[]'::jsonb),
    'daily_trend', COALESCE((
      SELECT jsonb_agg(daily_data ORDER BY (daily_data->>'date'))
      FROM (
        SELECT jsonb_build_object(
          'date', DATE(started_at),
          'sessions', COUNT(*)
        ) as daily_data
        FROM ai_tool_sessions
        WHERE org_id = p_org_id 
        AND started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY DATE(started_at)
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 4. Get governance statistics
CREATE OR REPLACE FUNCTION get_admin_copilot_governance_stats(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_rules', (
      SELECT COUNT(*) FROM ai_governance_rules WHERE org_id = p_org_id
    ),
    'active_rules', (
      SELECT COUNT(*) FROM ai_governance_rules WHERE org_id = p_org_id AND allowed = false
    ),
    'pending_approvals', (
      SELECT COUNT(*) FROM ai_governance_approvals WHERE org_id = p_org_id AND status = 'pending'
    ),
    'rules_by_category', COALESCE((
      SELECT jsonb_agg(cat_data)
      FROM (
        SELECT jsonb_build_object(
          'category', category,
          'count', COUNT(*),
          'blocked', COUNT(*) FILTER (WHERE allowed = false)
        ) as cat_data
        FROM ai_governance_rules
        WHERE org_id = p_org_id
        GROUP BY category
      ) subq
    ), '[]'::jsonb),
    'recent_approvals', COALESCE((
      SELECT jsonb_agg(approval_data)
      FROM (
        SELECT jsonb_build_object(
          'task', task,
          'category', category,
          'status', status,
          'requested_at', requested_at
        ) as approval_data
        FROM ai_governance_approvals
        WHERE org_id = p_org_id
        ORDER BY requested_at DESC
        LIMIT 10
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 5. Get goals summary
CREATE OR REPLACE FUNCTION get_admin_copilot_goals(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_goals', (SELECT COUNT(*) FROM org_goals WHERE org_id = p_org_id),
    'completed_goals', (SELECT COUNT(*) FROM org_goals WHERE org_id = p_org_id AND status = 'completed'),
    'in_progress_goals', (SELECT COUNT(*) FROM org_goals WHERE org_id = p_org_id AND status = 'in_progress'),
    'goals_by_category', COALESCE((
      SELECT jsonb_agg(cat_data)
      FROM (
        SELECT jsonb_build_object(
          'category', COALESCE(category, 'uncategorized'),
          'total', COUNT(*),
          'completed', COUNT(*) FILTER (WHERE status = 'completed')
        ) as cat_data
        FROM org_goals
        WHERE org_id = p_org_id
        GROUP BY category
      ) subq
    ), '[]'::jsonb),
    'recent_goals', COALESCE((
      SELECT jsonb_agg(goal_data)
      FROM (
        SELECT jsonb_build_object(
          'title', og.title,
          'student_name', os.full_name,
          'status', og.status,
          'created_at', og.created_at
        ) as goal_data
        FROM org_goals og
        LEFT JOIN org_students os ON os.id = og.student_id
        WHERE og.org_id = p_org_id
        ORDER BY og.created_at DESC
        LIMIT 10
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 6. Get groups summary
CREATE OR REPLACE FUNCTION get_admin_copilot_groups(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_groups', (SELECT COUNT(*) FROM org_groups WHERE org_id = p_org_id),
    'messaging_enabled_count', (SELECT COUNT(*) FROM org_groups WHERE org_id = p_org_id AND messaging_enabled = true),
    'groups', COALESCE((
      SELECT jsonb_agg(group_data)
      FROM (
        SELECT jsonb_build_object(
          'id', og.id,
          'name', og.name,
          'description', og.description,
          'messaging_enabled', og.messaging_enabled,
          'member_count', (SELECT COUNT(*) FROM org_group_members WHERE group_id = og.id),
          'created_at', og.created_at
        ) as group_data
        FROM org_groups og
        WHERE og.org_id = p_org_id
        ORDER BY og.name
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 7. Get staff activity
CREATE OR REPLACE FUNCTION get_admin_copilot_staff(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_staff', (
      SELECT COUNT(*) 
      FROM org_members 
      WHERE org_id = p_org_id 
      AND role IN ('owner', 'admin', 'instructor', 'instructor_aide')
      AND status = 'active'
    ),
    'by_role', COALESCE((
      SELECT jsonb_agg(role_data)
      FROM (
        SELECT jsonb_build_object(
          'role', role,
          'count', COUNT(*)
        ) as role_data
        FROM org_members
        WHERE org_id = p_org_id 
        AND role IN ('owner', 'admin', 'instructor', 'instructor_aide')
        AND status = 'active'
        GROUP BY role
      ) subq
    ), '[]'::jsonb),
    'staff_list', COALESCE((
      SELECT jsonb_agg(staff_data)
      FROM (
        SELECT jsonb_build_object(
          'name', COALESCE(p.full_name, p.email),
          'email', p.email,
          'role', om.role,
          'joined_at', om.joined_at
        ) as staff_data
        FROM org_members om
        JOIN profiles p ON p.id = om.user_id
        WHERE om.org_id = p_org_id 
        AND om.role IN ('owner', 'admin', 'instructor', 'instructor_aide')
        AND om.status = 'active'
        ORDER BY om.role, p.full_name
      ) subq
    ), '[]'::jsonb)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 8. Platform knowledge base table for how-to answers
CREATE TABLE IF NOT EXISTS admin_copilot_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_copilot_knowledge ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (platform admins will manage this)
CREATE POLICY "Anyone can read knowledge base"
  ON admin_copilot_knowledge
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for keyword search
CREATE INDEX IF NOT EXISTS idx_admin_copilot_knowledge_keywords 
  ON admin_copilot_knowledge USING GIN(keywords);

CREATE INDEX IF NOT EXISTS idx_admin_copilot_knowledge_category 
  ON admin_copilot_knowledge(category);

-- Search knowledge base function
CREATE OR REPLACE FUNCTION search_admin_copilot_knowledge(p_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_search_terms text[];
BEGIN
  -- Split query into search terms
  v_search_terms := string_to_array(lower(p_query), ' ');
  
  SELECT COALESCE(jsonb_agg(knowledge_data), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT jsonb_build_object(
      'id', id,
      'title', title,
      'category', category,
      'content', content
    ) as knowledge_data
    FROM admin_copilot_knowledge
    WHERE 
      -- Match against title
      lower(title) LIKE '%' || lower(p_query) || '%'
      -- Or match against content
      OR lower(content) LIKE '%' || lower(p_query) || '%'
      -- Or match against keywords
      OR keywords && v_search_terms
    ORDER BY 
      -- Prioritize title matches
      CASE WHEN lower(title) LIKE '%' || lower(p_query) || '%' THEN 0 ELSE 1 END,
      title
    LIMIT 5
  ) subq;
  
  RETURN v_result;
END;
$$;

-- Seed initial knowledge base content
INSERT INTO admin_copilot_knowledge (title, category, content, keywords) VALUES
-- Navigation
('How to navigate the dashboard', 'navigation', 'The organization dashboard is your central hub. Use the sidebar on the left to navigate between sections: Dashboard (overview), Students, Groups, Courses, Goals, Notes, AI Governance, Messages, and Settings. The top bar shows your current organization and allows you to switch between organizations.', ARRAY['navigate', 'dashboard', 'sidebar', 'menu', 'sections']),

('How to switch organizations', 'navigation', 'Click on the organization name in the top navigation bar. A dropdown will appear showing all organizations you belong to. Click on any organization to switch to it. Your role may differ between organizations.', ARRAY['switch', 'organization', 'org', 'change']),

-- Students
('How to add a new student', 'feature', 'To add a new student: 1) Go to the Students section from the sidebar. 2) Click the "Add Student" button. 3) Fill in the student details: full name, email, date of birth, and parent contact info. 4) Click Save. The student will receive an invitation email if an email is provided.', ARRAY['add', 'student', 'new', 'create', 'enroll']),

('How to view student progress', 'feature', 'To view a student''s progress: 1) Go to the Students section. 2) Click on a student''s name or the "View" button. 3) You''ll see their enrolled courses, completion percentages, goals, and activity history. Use the tabs to navigate between different aspects of their progress.', ARRAY['view', 'student', 'progress', 'completion', 'courses']),

('How to link a student account', 'feature', 'Students can be "profile-only" (no login) or "linked" (with an account). To link a student: 1) Go to the Students section. 2) Click on the student. 3) Click "Send Invitation" to email them a signup link. Once they create an account, they''ll be automatically linked.', ARRAY['link', 'student', 'account', 'invite', 'login']),

-- Groups
('How to create a student group', 'feature', 'To create a group: 1) Go to Users > Groups (or the Groups section). 2) Click "Create Group". 3) Enter a name and optional description. 4) Add students by selecting them from the list. 5) Optionally enable "Student-to-Student Messaging" if you want group members to chat. 6) Click Create.', ARRAY['create', 'group', 'student', 'new']),

('How to enable messaging for a group', 'feature', 'To enable student messaging: 1) Go to the Groups section. 2) Find the group you want to modify. 3) Click the settings icon or edit button. 4) Toggle "Enable Student Messaging" to ON. 5) Save changes. Students in the group can now message each other directly.', ARRAY['messaging', 'group', 'enable', 'chat', 'student']),

-- Courses
('How to assign a course to students', 'feature', 'To assign a course: 1) Go to the Courses section. 2) Find the course you want to assign. 3) Click "Assign". 4) Select individual students or entire groups. 5) Click Confirm. Students will be notified and the course will appear in their dashboard.', ARRAY['assign', 'course', 'student', 'enroll']),

('How to track course completion', 'feature', 'Course completion is tracked automatically. View completion status: 1) Go to Dashboard for an overview. 2) Go to Courses to see completion rates per course. 3) Go to Students to see individual student progress. Completion percentage updates as students complete lessons.', ARRAY['track', 'course', 'completion', 'progress', 'monitor']),

-- Goals
('How to create a goal for a student', 'feature', 'To create a goal: 1) Go to the Goals section or a student''s profile. 2) Click "Create Goal". 3) Enter the goal title, description, and category. 4) Optionally set a target date. 5) Assign it to the student. 6) Click Save. Both you and the student can track progress.', ARRAY['create', 'goal', 'student', 'objective']),

-- AI Governance
('How to manage AI governance rules', 'feature', 'AI Governance controls what AI features are available: 1) Go to AI Governance from the sidebar. 2) Use the Rules tab to view and modify rules. 3) Toggle rules on/off to allow or block specific AI capabilities. 4) Use the Models tab to configure which AI models are available. Changes apply immediately.', ARRAY['governance', 'rules', 'ai', 'control', 'permissions']),

('How to review AI usage', 'feature', 'To review AI usage: 1) Go to AI Governance. 2) Click the Monitoring tab for real-time session data. 3) Click Audit Log for a complete history of AI interactions. 4) Use filters to narrow by date, user, or tool. You can see who used what AI tools and when.', ARRAY['ai', 'usage', 'monitoring', 'audit', 'review']),

('How to approve AI requests', 'feature', 'When governance rules require approval: 1) Go to AI Governance > Approvals tab. 2) Review pending requests showing the user, task, and reason. 3) Click Approve to allow the action or Reject to deny it. 4) Optionally add a note explaining your decision.', ARRAY['approve', 'request', 'ai', 'governance', 'pending']),

-- Messages
('How to send a message', 'feature', 'To send a message: 1) Go to Messages from the sidebar. 2) Click "New Message" or "New Conversation". 3) Select recipients (students or staff). 4) Type your message. 5) Click Send. You can also attach files and use @mentions to notify specific people.', ARRAY['message', 'send', 'chat', 'communicate']),

-- Settings
('How to update organization settings', 'feature', 'To update org settings: 1) Go to Settings from the sidebar. 2) General tab: Update name, description, branding. 3) Members tab: Manage staff roles and invitations. 4) Billing tab (Owner only): Manage subscription. 5) Click Save after making changes.', ARRAY['settings', 'organization', 'update', 'configure']),

-- IEP
('How to create an IEP', 'feature', 'To create an IEP (Individualized Education Program): 1) Go to the IEP section or student profile. 2) Click "Create IEP". 3) Fill in the student''s accommodations, goals, and support services. 4) Add team members who can view/edit. 5) Save as draft or finalize. IEPs can be shared with parents.', ARRAY['iep', 'create', 'education', 'plan', 'individual']),

-- Troubleshooting
('Student cannot see assigned courses', 'troubleshooting', 'If a student can''t see their courses: 1) Verify the student account is linked (not profile-only). 2) Check that the course was assigned after they created their account. 3) Have them refresh their browser or log out and back in. 4) Verify the assignment in the Courses section shows their name.', ARRAY['troubleshoot', 'student', 'course', 'missing', 'not showing']),

('AI tools not working', 'troubleshooting', 'If AI tools aren''t working: 1) Check AI Governance rules aren''t blocking the feature. 2) Verify the user''s role has permission to use AI tools. 3) Check the Audit Log for error messages. 4) Ensure the organization has AI credits available. 5) Try refreshing the page.', ARRAY['troubleshoot', 'ai', 'not working', 'error', 'broken'])

ON CONFLICT DO NOTHING;