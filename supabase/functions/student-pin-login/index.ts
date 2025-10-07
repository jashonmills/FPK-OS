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

interface LoginRequest {
  org_id: string;
  full_name: string;
  pin: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { org_id, full_name, pin }: LoginRequest = await req.json();

    console.log('[student-pin-login] Login attempt:', { org_id, full_name });

    // Validate inputs
    if (!org_id || !full_name || !pin) {
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

    // Fetch student record to get stored PIN hash
    const { data: students, error: fetchError } = await supabaseAdmin
      .from('org_students')
      .select('id, pin_hash, linked_user_id, activation_status')
      .eq('org_id', org_id)
      .ilike('full_name', full_name)
      .single();

    if (fetchError || !students) {
      console.error('[student-pin-login] Student not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Invalid name or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is activated
    if (students.activation_status !== 'activated' || !students.pin_hash) {
      console.log('[student-pin-login] Account not activated');
      return new Response(
        JSON.stringify({ error: 'Account not activated. Please complete activation first.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify PIN using crypto hash comparison
    const pinHash = await hashPin(pin);
    const isValidPin = pinHash === students.pin_hash;

    if (!isValidPin) {
      console.log('[student-pin-login] Invalid PIN');
      
      // Log failed login attempt
      await supabaseAdmin
        .from('activity_log')
        .insert({
          event: 'student_pin_login_failed',
          org_id,
          metadata: { full_name, student_id: students.id }
        });

      return new Response(
        JSON.stringify({ error: 'Invalid name or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const student_id = students.id;
    const linked_user_id = students.linked_user_id;

    console.log('[student-pin-login] Valid credentials, student_id:', student_id);

    // Get organization slug for redirect
    const { data: orgData } = await supabaseAdmin
      .from('organizations')
      .select('slug')
      .eq('id', org_id)
      .single();

    const orgSlug = orgData?.slug || org_id;

    // If student has a linked user account, create a session
    if (linked_user_id) {
      // Generate a session token for the user
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: `student-${student_id}@portal.fpkuniversity.com`
      });

      if (sessionError || !sessionData?.properties?.hashed_token) {
        console.error('[student-pin-login] Session creation error:', sessionError);
        return new Response(
          JSON.stringify({ error: 'Failed to create session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log successful login
      await supabaseAdmin
        .from('activity_log')
        .insert({
          event: 'student_pin_login',
          user_id: linked_user_id,
          org_id,
          metadata: { student_id, method: 'pin' }
        });

      // Return the magic link properties so client can verify the hash
      return new Response(
        JSON.stringify({
          success: true,
          auth_link: sessionData.properties.action_link,
          student_id,
          org_id,
          redirect_url: `/org/${orgSlug}/student-portal`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no linked user, create a temporary auth user
    const tempEmail = `student-${student_id}@portal.fpkuniversity.com`;
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: tempEmail,
      email_confirm: true,
      user_metadata: {
        student_id,
        org_id,
        is_student_portal: true
      }
    });

    if (createError) {
      console.error('[student-pin-login] User creation error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Link the new user to the student record
    await supabaseAdmin
      .from('org_students')
      .update({ linked_user_id: newUser.user.id })
      .eq('id', student_id);

    // Generate session link for new user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: tempEmail
    });

    if (sessionError || !sessionData?.properties?.hashed_token) {
      console.error('[student-pin-login] Session generation error:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log successful login
    await supabaseAdmin
      .from('activity_log')
      .insert({
        event: 'student_pin_login',
        user_id: newUser.user.id,
        org_id,
        metadata: { student_id, method: 'pin', first_login: true }
      });

    console.log('[student-pin-login] Login successful');

    return new Response(
      JSON.stringify({
        success: true,
        auth_link: sessionData.properties.action_link,
        student_id,
        org_id,
        redirect_url: `/org/${orgSlug}/student-portal`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[student-pin-login] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});