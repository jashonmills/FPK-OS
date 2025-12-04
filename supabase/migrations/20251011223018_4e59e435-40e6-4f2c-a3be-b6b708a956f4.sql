-- Clean up trailing spaces in org_students full_name field
-- This fixes name matching issues during student activation

UPDATE public.org_students 
SET full_name = TRIM(REGEXP_REPLACE(full_name, '\s+', ' ', 'g'))
WHERE full_name != TRIM(REGEXP_REPLACE(full_name, '\s+', ' ', 'g'));

-- Also update the activate_student_account function to normalize names during comparison
CREATE OR REPLACE FUNCTION public.activate_student_account(
  p_token text, 
  p_full_name text, 
  p_pin_hash text
)
RETURNS TABLE(
  success boolean, 
  student_id uuid, 
  linked_user_id uuid, 
  org_id uuid, 
  message text, 
  already_activated boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_student RECORD;
  v_already_activated BOOLEAN := FALSE;
  v_normalized_input_name TEXT;
  v_normalized_db_name TEXT;
BEGIN
  -- Normalize input name (trim and collapse whitespace)
  v_normalized_input_name := LOWER(TRIM(REGEXP_REPLACE(p_full_name, '\s+', ' ', 'g')));
  
  -- First, check if student exists with this token (regardless of status)
  SELECT * INTO v_student
  FROM public.org_students
  WHERE activation_token = p_token
    AND token_expires_at > NOW();
  
  IF NOT FOUND THEN
    -- Check if token was already consumed (student activated but token not cleared)
    SELECT * INTO v_student
    FROM public.org_students
    WHERE activation_status = 'activated';
    
    IF FOUND THEN
      -- Normalize database name for comparison
      v_normalized_db_name := LOWER(TRIM(REGEXP_REPLACE(v_student.full_name, '\s+', ' ', 'g')));
      
      -- Verify name still matches
      IF v_normalized_db_name = v_normalized_input_name THEN
        -- Student was already activated, return success with their info
        RETURN QUERY SELECT TRUE, v_student.id, v_student.linked_user_id, v_student.org_id, 
          'Account already activated'::TEXT, TRUE;
        RETURN;
      END IF;
    END IF;
    
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 
      'Invalid or expired activation token'::TEXT, FALSE;
    RETURN;
  END IF;
  
  -- Check if student is already activated
  IF v_student.activation_status = 'activated' THEN
    v_already_activated := TRUE;
    -- Normalize database name for comparison
    v_normalized_db_name := LOWER(TRIM(REGEXP_REPLACE(v_student.full_name, '\s+', ' ', 'g')));
    
    -- Verify name still matches
    IF v_normalized_db_name = v_normalized_input_name THEN
      RETURN QUERY SELECT TRUE, v_student.id, v_student.linked_user_id, v_student.org_id, 
        'Account already activated'::TEXT, TRUE;
      RETURN;
    ELSE
      RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::UUID, 
        'Name does not match'::TEXT, FALSE;
      RETURN;
    END IF;
  END IF;
  
  -- Normalize database name for new activation
  v_normalized_db_name := LOWER(TRIM(REGEXP_REPLACE(v_student.full_name, '\s+', ' ', 'g')));
  
  -- Verify name matches for new activation
  IF v_normalized_db_name != v_normalized_input_name THEN
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
$function$;