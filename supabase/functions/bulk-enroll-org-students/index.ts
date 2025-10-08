import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the requesting user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { orgId } = await req.json();

    if (!orgId) {
      throw new Error('Organization ID is required');
    }

    // Verify user has permission (owner or instructor)
    const { data: membership, error: membershipError } = await supabaseClient
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership || !['owner', 'instructor'].includes(membership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Get platform students from org_members
    const { data: platformStudents, error: platformError } = await supabaseClient
      .from('org_members')
      .select('user_id')
      .eq('org_id', orgId)
      .eq('role', 'student')
      .eq('status', 'active');

    if (platformError) {
      console.error('Error fetching platform students:', platformError);
      throw new Error('Failed to fetch platform students');
    }

    // Get manually created students from org_students
    const { data: manualStudents, error: manualError } = await supabaseClient
      .from('org_students')
      .select('id, linked_user_id, full_name')
      .eq('org_id', orgId)
      .eq('status', 'active')
      .not('linked_user_id', 'is', null);

    if (manualError) {
      console.error('Error fetching manual students:', manualError);
      throw new Error('Failed to fetch manual students');
    }

    // Combine both sources into unified roster
    const platformUserIds = platformStudents?.map(s => s.user_id) || [];
    const manualUserIds = manualStudents?.map(s => s.linked_user_id).filter(Boolean) || [];
    const allStudentUserIds = [...new Set([...platformUserIds, ...manualUserIds])];

    console.log(`Found ${platformUserIds.length} platform students, ${manualUserIds.length} manual students`);
    console.log(`Total unique students to enroll: ${allStudentUserIds.length}`);

    // Required courses for St. Joseph's
    const requiredCourses = [
      { course_id: 'el-handwriting', course_type: 'platform' },
      { course_id: 'empowering-learning-numeracy', course_type: 'platform' },
      { course_id: 'empowering-learning-reading', course_type: 'platform' },
      { course_id: 'empowering-learning-state', course_type: 'platform' },
      { course_id: '06efda03-9f0b-4c00-a064-eb65ada9fbae', course_type: 'native' }
    ];

    let totalEnrolled = 0;
    let alreadyEnrolled = 0;
    const enrollmentResults = [];

    for (const userId of allStudentUserIds) {
      // Check existing enrollments for this student
      const { data: existingEnrollments } = await supabaseClient
        .from('enrollments')
        .select('course_id')
        .eq('user_id', userId);

      const enrolledCourseIds = existingEnrollments?.map(e => e.course_id) || [];

      // Find courses this student is missing
      const missingCourses = requiredCourses.filter(c => !enrolledCourseIds.includes(c.course_id));

      if (missingCourses.length > 0) {
        // Enroll student in missing courses
        const { error: enrollError } = await supabaseClient
          .from('enrollments')
          .insert(
            missingCourses.map(course => ({
              user_id: userId,
              course_id: course.course_id,
              org_id: orgId,
              enrolled_at: new Date().toISOString()
            }))
          );

        if (enrollError) {
          console.error(`Error enrolling student ${userId}:`, enrollError);
          enrollmentResults.push({
            userId: userId,
            success: false,
            error: enrollError.message
          });
        } else {
          console.log(`Enrolled student ${userId} in ${missingCourses.length} courses`);
          totalEnrolled += missingCourses.length;
          enrollmentResults.push({
            userId: userId,
            success: true,
            coursesEnrolled: missingCourses.length
          });
        }
      } else {
        alreadyEnrolled++;
        enrollmentResults.push({
          userId: userId,
          success: true,
          coursesEnrolled: 0,
          alreadyComplete: true
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        totalStudentsProcessed: allStudentUserIds.length,
        newEnrollments: totalEnrolled,
        alreadyEnrolled: alreadyEnrolled,
        results: enrollmentResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in bulk-enroll-org-students function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
