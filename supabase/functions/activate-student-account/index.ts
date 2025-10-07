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

    // Use database function to activate student account
    const { data: activationData, error: activationError } = await supabaseAdmin
      .rpc('activate_student_account', {
        p_token: token,
        p_full_name: full_name,
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

    const { student_id, linked_user_id, org_id } = activationData[0];

    console.log('[activate-student-account] Activation successful, student_id:', student_id);

    // Get organization slug for proper redirect
    const { data: orgData } = await supabaseAdmin
      .from('organizations')
      .select('slug')
      .eq('id', org_id)
      .single();

    const orgSlug = orgData?.slug || org_id;
    const origin = req.headers.get('origin') || Deno.env.get('SUPABASE_URL') || 'https://fpkuniversity.com';
    const redirectUrl = `/org/${orgSlug}/student-portal`;

    // If student has a linked user, generate session
    if (linked_user_id) {
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: `student-${student_id}@portal.fpkuniversity.com`,
        options: {
          redirectTo: `${origin}${redirectUrl}`
        }
      });

      if (sessionError) {
        console.error('[activate-student-account] Session error:', sessionError);
        return new Response(
          JSON.stringify({ error: 'Failed to create session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log activation
      await supabaseAdmin
        .from('activity_log')
        .insert({
          event: 'student_activated',
          user_id: linked_user_id,
          org_id,
          metadata: { student_id, method: 'link' }
        });

      return new Response(
        JSON.stringify({
          success: true,
          session: sessionData,
          student_id,
          org_id,
          redirect_url: redirectUrl
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

    // Generate session with redirect through our edge function
    const callbackUrl = `${origin}/functions/v1/auth-redirect?redirect_uri=${encodeURIComponent(`${origin}${redirectUrl}`)}`;
    
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: tempEmail,
      options: {
        redirectTo: callbackUrl
      }
    });

    if (sessionError) {
      console.error('[activate-student-account] Session generation error:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    console.log('[activate-student-account] Activation and user creation successful');

    // Return the auth link (already includes our callback redirect)
    return new Response(
      JSON.stringify({
        success: true,
        session: sessionData,
        auth_link: sessionData.properties.action_link,
        student_id,
        org_id,
        redirect_url: redirectUrl
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