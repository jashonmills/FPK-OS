import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Helper function to hash PIN using Deno's built-in crypto
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface ActivateRequest {
  token: string;
  full_name: string;
  pin: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, full_name, pin }: ActivateRequest = await req.json();

    console.log('[activate-student-account] Activation attempt with token:', token);

    // Validate inputs
    if (!token || !full_name || !pin) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^\d{6}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'PIN must be exactly 6 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hash the PIN using built-in crypto
    const pinHash = await hashPin(pin);
    
    console.log('[activate-student-account] PIN hashed successfully');

    // Normalize the full name (trim and collapse whitespace)
    const normalizedName = full_name.trim().replace(/\s+/g, ' ');
    console.log('[activate-student-account] Normalized name:', normalizedName);

    // Use database function to activate student account
    const { data: activationData, error: activationError } = await supabaseAdmin
      .rpc('activate_student_account', {
        p_token: token,
        p_full_name: normalizedName,
        p_pin_hash: pinHash
      });

    if (activationError) {
      console.error('[activate-student-account] Activation error:', activationError);
      return new Response(
        JSON.stringify({ error: 'Activation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!activationData || activationData.length === 0 || !activationData[0].success) {
      const errorMessage = activationData?.[0]?.message || 'Activation failed';
      console.log('[activate-student-account] Activation failed:', errorMessage);
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { student_id, linked_user_id, org_id, already_activated } = activationData[0];

    console.log('[activate-student-account] Activation result:', { 
      student_id, 
      already_activated,
      linked_user_id 
    });

    // Get organization slug for proper redirect
    const { data: orgData } = await supabaseAdmin
      .from('organizations')
      .select('slug')
      .eq('id', org_id)
      .single();

    const orgSlug = orgData?.slug || org_id;
    const origin = req.headers.get('origin') || 'https://fpkuniversity.com';
    const finalDestination = `${origin}/${orgSlug}/student-portal`;
    
    console.log('[activate-student-account] Environment check:', {
      origin,
      orgSlug,
      finalDestination,
      userAgent: req.headers.get('user-agent')
    });
    // If student has a linked user, update their metadata
    if (linked_user_id) {
      // Update user metadata to include org slug
      await supabaseAdmin.auth.admin.updateUserById(linked_user_id, {
        user_metadata: {
          student_id,
          org_id,
          student_org_slug: orgSlug,
          is_student_portal: true
        }
      });

      // Log activation
      await supabaseAdmin
        .from('activity_log')
        .insert({
          event: 'student_activated',
          user_id: linked_user_id,
          org_id,
          metadata: { student_id, method: 'link' }
        });

      console.log('[activate-student-account] Already activated user updated successfully');

      return new Response(
        JSON.stringify({
          success: true,
          already_activated: true,
          student_id,
          org_id,
          org_slug: orgSlug
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no linked user, create auth user
    const tempEmail = `student-${student_id}@portal.fpkuniversity.com`;
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: tempEmail,
      email_confirm: true,
      user_metadata: {
        student_id,
        org_id,
        student_org_slug: orgSlug,
        is_student_portal: true
      }
    });

    if (createError) {
      console.error('[activate-student-account] User creation error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Link user to student
    await supabaseAdmin
      .from('org_students')
      .update({ linked_user_id: newUser.user.id })
      .eq('id', student_id);

    // Create org membership for the student
    const { error: membershipError } = await supabaseAdmin
      .from('org_members')
      .insert({
        org_id: org_id,
        user_id: newUser.user.id,
        role: 'student',
        status: 'active'
      });

    if (membershipError) {
      console.error('[activate-student-account] Membership creation error:', membershipError);
      // Don't fail the whole flow, but log the error
    }

    // Log activation
    await supabaseAdmin
      .from('activity_log')
      .insert({
        event: 'student_activated',
        user_id: newUser.user.id,
        org_id,
        metadata: { student_id, method: 'link', first_activation: true }
      });

    // Auto-enroll St. Joseph students in required courses
    const ST_JOSEPH_ORG_ID = '446d78ee-420e-4e9a-8d9d-00f06e897e7f';
    if (org_id === ST_JOSEPH_ORG_ID) {
      console.log('[activate-student-account] Auto-enrolling St. Joseph student in required courses');
      
      const requiredEnrollments = [
        { course_id: 'el-handwriting', course_type: 'platform' },
        { course_id: 'empowering-learning-numeracy', course_type: 'platform' },
        { course_id: 'empowering-learning-reading', course_type: 'platform' },
        { course_id: 'empowering-learning-state', course_type: 'platform' },
        { course_id: '06efda03-9f0b-4c00-a064-eb65ada9fbae', course_type: 'native' }
      ];

      for (const enrollment of requiredEnrollments) {
        await supabaseAdmin
          .from('enrollments')
          .insert({
            user_id: newUser.user.id,
            course_id: enrollment.course_id,
            course_type: enrollment.course_type,
            org_id: org_id,
            enrolled_at: new Date().toISOString()
          })
          .select()
          .single();
      }
      
      console.log('[activate-student-account] Successfully enrolled student in 5 required courses');
    }

    console.log('[activate-student-account] Activation and user creation successful');

    // Return simple success response - frontend will redirect to PIN login
    return new Response(
      JSON.stringify({
        success: true,
        student_id,
        org_id,
        org_slug: orgSlug
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[activate-student-account] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});