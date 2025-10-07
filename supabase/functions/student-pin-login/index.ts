import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

    // Hash the PIN for comparison
    const pinHash = await bcrypt.hash(pin);

    // Validate student credentials using database function
    const { data: validationData, error: validationError } = await supabaseAdmin
      .rpc('validate_student_pin', {
        p_org_id: org_id,
        p_full_name: full_name,
        p_pin_hash: pinHash
      });

    if (validationError) {
      console.error('[student-pin-login] Validation error:', validationError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validationData || validationData.length === 0 || !validationData[0].is_valid) {
      console.log('[student-pin-login] Invalid credentials');
      
      // Log failed login attempt
      await supabaseAdmin
        .from('activity_log')
        .insert({
          event: 'student_pin_login_failed',
          org_id,
          metadata: { full_name }
        });

      return new Response(
        JSON.stringify({ error: 'Invalid name or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { student_id, linked_user_id } = validationData[0];

    console.log('[student-pin-login] Valid credentials, student_id:', student_id);

    // If student has a linked user account, sign them in
    if (linked_user_id) {
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: `student-${student_id}@portal.fpkuniversity.com`, // Temporary email format
        options: {
          redirectTo: `${req.headers.get('origin')}/students/dashboard?org=${org_id}`
        }
      });

      if (sessionError) {
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

      return new Response(
        JSON.stringify({
          success: true,
          session: sessionData,
          student_id,
          org_id,
          redirect_url: `/students/dashboard?org=${org_id}`
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

    // Generate session for new user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: tempEmail,
      options: {
        redirectTo: `${req.headers.get('origin')}/students/dashboard?org=${org_id}`
      }
    });

    if (sessionError) {
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
        session: sessionData,
        student_id,
        org_id,
        redirect_url: `/students/dashboard?org=${org_id}`
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