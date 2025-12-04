-- Remove any potential email hook configuration that might interfere
-- This ensures SMTP-only email delivery via Resend

-- Check current auth configuration
SELECT 
  raw_app_meta_data,
  raw_user_meta_data,
  email_confirmed_at,
  confirmation_sent_at
FROM auth.users 
WHERE email = 'jashonmills.eth@yahoo.com'
LIMIT 1;