-- Fix security issues - recreate view without auth.users exposure
DROP VIEW IF EXISTS public.admin_user_management_view;

-- Recreate the view WITHOUT exposing sensitive auth.users fields
CREATE OR REPLACE VIEW public.admin_user_management_view AS
WITH user_engagement AS (
  SELECT 
    fm.user_id,
    COUNT(DISTINCT d.id) as documents_uploaded,
    COUNT(DISTINCT pl.id) + COUNT(DISTINCT el.id) + COUNT(DISTINCT il.id) as logs_created,
    COALESCE(SUM(ABS(acl.credits_changed)), 0) as ai_credits_used,
    COUNT(DISTINCT acl.id) as ai_interactions,
    GREATEST(MAX(d.created_at), MAX(pl.created_at), MAX(el.created_at), MAX(il.created_at)) as last_activity_date
  FROM family_members fm
  LEFT JOIN documents d ON d.family_id = fm.family_id
  LEFT JOIN parent_logs pl ON pl.family_id = fm.family_id
  LEFT JOIN educator_logs el ON el.family_id = fm.family_id
  LEFT JOIN incident_logs il ON il.family_id = fm.family_id
  LEFT JOIN ai_credit_ledger acl ON acl.family_id = fm.family_id
  GROUP BY fm.user_id
),
user_families AS (
  SELECT 
    fm.user_id,
    jsonb_agg(
      jsonb_build_object(
        'familyId', f.id,
        'familyName', f.family_name,
        'roleInFamily', fm.role,
        'isPrimaryAccountHolder', (f.created_by = fm.user_id),
        'memberCount', (SELECT COUNT(*) FROM family_members WHERE family_id = f.id),
        'studentCount', (SELECT COUNT(*) FROM students WHERE family_id = f.id)
      )
    ) as families
  FROM family_members fm
  JOIN families f ON f.id = fm.family_id
  GROUP BY fm.user_id
)
SELECT 
  p.id as user_id,
  p.display_name,
  p.full_name,
  p.avatar_url as photo_url,
  p.created_at,
  COALESCE(uas.status, 'active') as account_status,
  COALESCE(
    (SELECT array_agg(role::text) FROM user_roles WHERE user_id = p.id),
    ARRAY[]::text[]
  ) as roles,
  COALESCE(uf.families, '[]'::jsonb) as families,
  jsonb_build_object(
    'documentsUploaded', COALESCE(ue.documents_uploaded, 0),
    'logsCreated', COALESCE(ue.logs_created, 0),
    'aiCreditsUsed', COALESCE(ue.ai_credits_used, 0),
    'aiInteractions', COALESCE(ue.ai_interactions, 0),
    'lastActivityDate', ue.last_activity_date,
    'hoursOnPlatform', 0
  ) as engagement_metrics,
  uas.modified_by as last_modified_by,
  uas.modified_at as last_modified_at
FROM profiles p
LEFT JOIN user_account_status uas ON uas.user_id = p.id
LEFT JOIN user_engagement ue ON ue.user_id = p.id
LEFT JOIN user_families uf ON uf.user_id = p.id;

GRANT SELECT ON public.admin_user_management_view TO authenticated;