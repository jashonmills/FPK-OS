import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin or org owner
    const { data: membership } = await supabaseAdmin
      .from('org_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!membership || !['owner', 'instructor'].includes(membership.role)) {
      throw new Error('Insufficient permissions');
    }

    const ST_JOSEPH_ORG_ID = '446d78ee-420e-4e9a-8d9d-00f06e897e7f';
    const requiredCourses = [
      { course_id: 'el-handwriting', course_type: 'platform' },
      { course_id: 'empowering-learning-numeracy', course_type: 'platform' },
      { course_id: 'empowering-learning-reading', course_type: 'platform' },
      { course_id: 'empowering-learning-state', course_type: 'platform' },
      { course_id: '06efda03-9f0b-4c00-a064-eb65ada9fbae', course_type: 'native' }
    ];

    // Get all students from St. Joseph's with linked user accounts
    const { data: students, error: studentsError } = await supabaseAdmin
      .from('org_students')
      .select('id, linked_user_id')
      .eq('org_id', ST_JOSEPH_ORG_ID)
      .not('linked_user_id', 'is', null);

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      throw new Error('Failed to fetch students');
    }

    console.log(`Found ${students?.length || 0} students to process`);

    let enrolledCount = 0;
    let alreadyEnrolledCount = 0;

    for (const student of students || []) {
      for (const course of requiredCourses) {
        // Check if already enrolled
        const { data: existingEnrollment } = await supabaseAdmin
          .from('enrollments')
          .select('id')
          .eq('user_id', student.linked_user_id)
          .eq('course_id', course.course_id)
          .single();

        if (!existingEnrollment) {
          // Enroll the student
          const { error: enrollError } = await supabaseAdmin
            .from('enrollments')
            .insert({
              user_id: student.linked_user_id,
              course_id: course.course_id,
              course_type: course.course_type,
              org_id: ST_JOSEPH_ORG_ID,
              enrolled_at: new Date().toISOString()
            });

          if (!enrollError) {
            enrolledCount++;
            console.log(`Enrolled student ${student.id} in ${course.course_id}`);
          } else {
            console.error(`Failed to enroll student ${student.id}:`, enrollError);
          }
        } else {
          alreadyEnrolledCount++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Enrollment complete`,
        stats: {
          studentsProcessed: students?.length || 0,
          newEnrollments: enrolledCount,
          alreadyEnrolled: alreadyEnrolledCount
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in enroll-existing-students:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
