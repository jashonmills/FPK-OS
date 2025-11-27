-- Drop existing function first
DROP FUNCTION IF EXISTS public.activate_student_account(TEXT, TEXT, TEXT);

-- Recreate with updated return type
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
  message TEXT,
  already_activated BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student RECORD;
  v_already_activated BOOLEAN := FALSE;
BEGIN
  -- First, check if student exists with this token (regardless of status)
  SELECT * INTO v_student
  FROM public.org_students
  WHERE activation_token = p_token
    AND token_expires_at > NOW();
  
  IF NOT FOUND THEN
    -- Check if token was already consumed (student activated but token not cleared)
    SELECT * INTO v_student
    FROM public.org_students
    WHERE activation_status = 'activated'
      AND LOWER(TRIM(full_name)) = LOWER(TRIM(p_full_name));
    
    IF FOUND THEN
      -- Student was already activated, return success with their info
      RETURN QUERY SELECT TRUE, v_student.id, v_student.linked_user_id, v_student.org_id, 
        'Account already activated'::TEXT, TRUE;
      RETURN;
    END IF;
    
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 
      'Invalid or expired activation token'::TEXT, FALSE;
    RETURN;
  END IF;
  
  -- Check if student is already activated
  IF v_student.activation_status = 'activated' THEN
    v_already_activated := TRUE;
    -- Verify name still matches
    IF LOWER(TRIM(v_student.full_name)) = LOWER(TRIM(p_full_name)) THEN
      RETURN QUERY SELECT TRUE, v_student.id, v_student.linked_user_id, v_student.org_id, 
        'Account already activated'::TEXT, TRUE;
      RETURN;
    ELSE
      RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 
        'Name does not match'::TEXT, FALSE;
      RETURN;
    END IF;
  END IF;
  
  -- Verify name matches for new activation
  IF LOWER(TRIM(v_student.full_name)) != LOWER(TRIM(p_full_name)) THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 
      'Name does not match'::TEXT, FALSE;
    RETURN;
  END IF;
  
  -- Update student record with PIN and activate
  -- Clear token immediately to prevent reuse
  UPDATE public.org_students
  SET 
    pin_hash = p_pin_hash,
    activation_token = NULL,
    token_expires_at = NULL,
    activation_status = 'activated',
    updated_at = NOW()
  WHERE id = v_student.id;
  
  -- Return success with newly activated flag
  RETURN QUERY SELECT TRUE, v_student.id, v_student.linked_user_id, v_student.org_id, 
    'Account activated successfully'::TEXT, FALSE;
END;
$$;