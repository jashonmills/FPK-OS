-- Phase 1: Database Schema Updates for Branded Student Portal (Fixed)

-- 1.1 Extend org_students table with PIN authentication fields
ALTER TABLE public.org_students 
ADD COLUMN IF NOT EXISTS pin_hash TEXT,
ADD COLUMN IF NOT EXISTS activation_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS activation_status TEXT DEFAULT 'pending' CHECK (activation_status IN ('pending', 'activated')),
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_org_students_activation_token ON public.org_students(activation_token) WHERE activation_token IS NOT NULL;

-- 1.2 Create database function to validate student PIN
CREATE OR REPLACE FUNCTION public.validate_student_pin(
  p_org_id UUID,
  p_full_name TEXT,
  p_pin_hash TEXT
)
RETURNS TABLE (
  student_id UUID,
  linked_user_id UUID,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    os.id,
    os.linked_user_id,
    (os.pin_hash = p_pin_hash AND os.activation_status = 'activated') as is_valid
  FROM public.org_students os
  WHERE os.org_id = p_org_id
    AND LOWER(TRIM(os.full_name)) = LOWER(TRIM(p_full_name))
    AND os.status = 'active';
END;
$$;

-- 1.3 Create function to generate secure activation tokens
CREATE OR REPLACE FUNCTION public.generate_activation_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a secure random token (12 characters, URL-safe)
  token := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 12));
  RETURN token;
END;
$$;

-- 1.4 Create function to activate student account
CREATE OR REPLACE FUNCTION public.activate_student_account(
  p_token TEXT,
  p_full_name TEXT,
  p_pin_hash TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  student_id UUID,
  linked_user_id UUID,
  org_id UUID,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student RECORD;
BEGIN
  -- Find student by activation token
  SELECT * INTO v_student
  FROM public.org_students
  WHERE activation_token = p_token
    AND token_expires_at > NOW()
    AND activation_status = 'pending';
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 'Invalid or expired activation token'::TEXT;
    RETURN;
  END IF;
  
  -- Verify name matches
  IF LOWER(TRIM(v_student.full_name)) != LOWER(TRIM(p_full_name)) THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 'Name does not match'::TEXT;
    RETURN;
  END IF;
  
  -- Update student record with PIN and activate
  UPDATE public.org_students
  SET 
    pin_hash = p_pin_hash,
    activation_token = NULL,
    token_expires_at = NULL,
    activation_status = 'activated',
    updated_at = NOW()
  WHERE id = v_student.id;
  
  -- Return success
  RETURN QUERY SELECT TRUE, v_student.id, v_student.linked_user_id, v_student.org_id, 'Account activated successfully'::TEXT;
END;
$$;

-- 1.5 Add RLS policies for student portal authentication

-- Allow students to view their own records
CREATE POLICY "Students can view their own record"
ON public.org_students
FOR SELECT
TO authenticated
USING (linked_user_id = auth.uid());

-- Allow unauthenticated validation of activation tokens (for activation page)
CREATE POLICY "Activation tokens can be validated publicly"
ON public.org_students
FOR SELECT
TO anon
USING (activation_token IS NOT NULL AND token_expires_at > NOW());

-- Allow system to update student records during activation
CREATE POLICY "System can update during activation"
ON public.org_students
FOR UPDATE
TO anon, authenticated
USING (activation_token IS NOT NULL OR linked_user_id = auth.uid())
WITH CHECK (activation_status = 'activated' OR linked_user_id = auth.uid());