import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PRELOADED_COURSES = ['el-spelling-reading'];
const ST_JOSEPH_ORG_ID = '446d78ee-420e-4e9a-8d9d-00f06e897e7f';
const ST_JOSEPH_PRELOADED_COURSES = {
  platform: [
    'el-handwriting',
    'empowering-learning-numeracy',
    'empowering-learning-reading',
    'empowering-learning-state'
  ],
  native: ['06efda03-9f0b-4c00-a064-eb65ada9fbae'] // Spelling course UUID
};

async function ensurePreloadedCourseEnrollments(userId: string) {
  console.log('Checking preloaded course enrollments for user:', userId);
  
  try {
    // Check if user is a member of St. Joseph organization
    const { data: orgMembership, error: membershipError } = await supabase
      .from('org_members')
      .select('org_id, role')
      .eq('user_id', userId)
      .eq('org_id', ST_JOSEPH_ORG_ID)
      .eq('status', 'active')
      .eq('role', 'student')
      .maybeSingle();

    if (membershipError && membershipError.code !== 'PGRST116') {
      console.error('Error checking org membership:', membershipError);
    }

    // If user is a St. Joseph student, enroll in all 5 courses
    if (orgMembership) {
      console.log('User is St. Joseph org student, enrolling in preloaded courses');
      
      // Enroll in 4 platform courses
      for (const courseId of ST_JOSEPH_PRELOADED_COURSES.platform) {
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert({ 
            user_id: userId, 
            course_id: courseId,
            progress: { completed: false, current_module: null, completion_percentage: 0 }
          })
          .select();
        
        if (enrollError && enrollError.code !== '23505') {
          console.error(`Failed to enroll in ${courseId}:`, enrollError);
        } else if (!enrollError) {
          console.log(`✅ Auto-enrolled in ${courseId}`);
        }
      }

      // Enroll in native spelling course
      for (const nativeCourseId of ST_JOSEPH_PRELOADED_COURSES.native) {
        const { error: nativeEnrollError } = await supabase
          .from('native_enrollments')
          .insert({
            user_id: userId,
            course_id: nativeCourseId,
            status: 'active',
            progress_pct: 0,
            last_visit_at: new Date().toISOString(),
            enrolled_at: new Date().toISOString()
          })
          .select();
        
        if (nativeEnrollError && nativeEnrollError.code !== '23505') {
          console.error(`Failed to enroll in native course ${nativeCourseId}:`, nativeEnrollError);
        } else if (!nativeEnrollError) {
          console.log(`✅ Auto-enrolled in native course ${nativeCourseId}`);
        }
      }
    }

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
