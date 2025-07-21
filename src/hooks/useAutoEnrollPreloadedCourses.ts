
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PRELOADED_COURSES = ['learning-state-beta', 'el-spelling-reading'];

async function ensurePreloadedCourseEnrollments(userId: string) {
  console.log('Checking preloaded course enrollments for user:', userId);
  
  try {
    // Check which courses the user is already enrolled in
    const { data: existingEnrollments, error: selectError } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId)
      .in('course_id', PRELOADED_COURSES);

    if (selectError) {
      console.error('Error checking enrollments:', selectError);
      return;
    }

    const enrolledCourseIds = existingEnrollments?.map(e => e.course_id) || [];
    const coursesToEnroll = PRELOADED_COURSES.filter(courseId => !enrolledCourseIds.includes(courseId));

    console.log('Existing enrollments:', enrolledCourseIds);
    console.log('Courses to auto-enroll:', coursesToEnroll);

    // Auto-enroll in missing courses
    for (const courseId of coursesToEnroll) {
      console.log(`Auto-enrolling user in ${courseId} course`);
      const { data: insertData, error: insertError } = await supabase
        .from('enrollments')
        .insert({ 
          user_id: userId, 
          course_id: courseId
        })
        .select();
      
      if (insertError) {
        console.error(`Failed to auto-enroll in ${courseId}:`, insertError);
        // If the error is due to duplicate enrollment, that's actually fine
        if (insertError.code !== '23505') { // 23505 is unique violation
          console.error(`Unexpected enrollment error for ${courseId}:`, insertError);
        } else {
          console.log(`User already enrolled in ${courseId} (duplicate key), this is expected`);
        }
      } else {
        console.log(`Successfully auto-enrolled user in ${courseId}:`, insertData);
      }
    }

    if (coursesToEnroll.length === 0) {
      console.log('User already enrolled in all preloaded courses');
    }
  } catch (err) {
    console.error('Unexpected error in ensurePreloadedCourseEnrollments:', err);
  }
}

export function useAutoEnrollPreloadedCourses() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      console.log('Auto-enrollment hook triggered for user:', user.id);
      ensurePreloadedCourseEnrollments(user.id);
    } else {
      console.log('No user available for auto-enrollment');
    }
  }, [user?.id]);
}
