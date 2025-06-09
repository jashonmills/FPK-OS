
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

async function ensureLearningStateEnrollment(userId: string) {
  console.log('Checking enrollment for user:', userId);
  
  // 1) See if the user is already enrolled
  const { data: existing, error: selectError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', 'learning-state-beta')
    .maybeSingle();

  if (selectError) {
    console.error('Error checking enrollment:', selectError);
    return;
  }

  // 2) If not found, insert one
  if (!existing) {
    console.log('Auto-enrolling user in Learning State beta course');
    const { error: insertError } = await supabase
      .from('enrollments')
      .insert({ 
        user_id: userId, 
        course_id: 'learning-state-beta'
      });
    
    if (insertError) {
      console.error('Failed to auto-enroll:', insertError);
    } else {
      console.log('Successfully auto-enrolled user');
    }
  } else {
    console.log('User already enrolled in Learning State beta course');
  }
}

export function useAutoEnrollLearningState() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      ensureLearningStateEnrollment(user.id);
    }
  }, [user?.id]);
}
