
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

async function ensureLearningStateEnrollment(userId: string) {
  console.log('Checking enrollment for user:', userId);
  
  try {
    // 1) Check if the user is already enrolled
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

    console.log('Existing enrollment check result:', existing);

    // 2) If not found, insert one
    if (!existing) {
      console.log('Auto-enrolling user in Learning State beta course');
      const { data: insertData, error: insertError } = await supabase
        .from('enrollments')
        .insert({ 
          user_id: userId, 
          course_id: 'learning-state-beta'
        })
        .select();
      
      if (insertError) {
        console.error('Failed to auto-enroll:', insertError);
      } else {
        console.log('Successfully auto-enrolled user:', insertData);
      }
    } else {
      console.log('User already enrolled in Learning State beta course');
    }
  } catch (err) {
    console.error('Unexpected error in ensureLearningStateEnrollment:', err);
  }
}

export function useAutoEnrollLearningState() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      console.log('Auto-enrollment hook triggered for user:', user.id);
      ensureLearningStateEnrollment(user.id);
    } else {
      console.log('No user available for auto-enrollment');
    }
  }, [user?.id]);
}
