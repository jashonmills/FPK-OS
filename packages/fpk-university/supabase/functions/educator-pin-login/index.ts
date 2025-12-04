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
  email: string;
  pin: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { org_id, email, pin }: LoginRequest = await req.json();

    console.log('[educator-pin-login] Login attempt:', { org_id, email });

    // Validate inputs
    if (!org_id || !email || !pin) {
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

    // Create Supabase admin client (for admin operations)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create regular Supabase client (for user operations)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch educator record to get stored PIN hash
    const { data: educator, error: fetchError } = await supabaseAdmin
      .from('org_educators')
      .select('id, pin_hash, linked_user_id, activation_status, role, organizations!inner(slug)')
      .eq('org_id', org_id)
      .eq('email', email)
      .single();

    if (fetchError || !educator) {
      console.error('[educator-pin-login] Educator not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Invalid email or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is activated
    if (educator.activation_status !== 'activated' || !educator.pin_hash) {
      console.log('[educator-pin-login] Account not activated');
      return new Response(
        JSON.stringify({ error: 'Account not activated. Please complete activation first.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify PIN using crypto hash comparison
    const pinHash = await hashPin(pin);
    const isValidPin = pinHash === educator.pin_hash;

    if (!isValidPin) {
      console.log('[educator-pin-login] Invalid PIN');
      
      // Log failed login attempt
      await supabaseAdmin
        .from('activity_log')
        .insert({
          event: 'educator_pin_login_failed',
          org_id,
          metadata: { email, educator_id: educator.id }
        });

      return new Response(
        JSON.stringify({ error: 'Invalid email or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const educator_id = educator.id;
    const linked_user_id = educator.linked_user_id;
    const orgSlug = educator.organizations.slug;

    console.log('[educator-pin-login] Valid credentials, educator_id:', educator_id);

    // If educator doesn't have a linked user (shouldn't happen), create one
    if (!linked_user_id) {
      return new Response(
        JSON.stringify({ error: 'Account setup incomplete. Please contact support.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user metadata
    await supabaseAdmin.auth.admin.updateUserById(linked_user_id, {
      user_metadata: {
        educator_id,
        org_id,
        educator_org_slug: orgSlug,
        is_educator_portal: true,
        role: educator.role
      }
    });

    // Create a temporary password and sign in to get a valid session
    const tempPassword = crypto.randomUUID();
    const educatorEmail = `educator-${educator_id}@portal.fpkuniversity.com`;

    // Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(linked_user_id, {
      password: tempPassword
    });

    if (updateError) {
      console.error('[educator-pin-login] Password update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sign in with the temporary password using the regular client to get a real session
    const { data: sessionData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: educatorEmail,
      password: tempPassword
    });

    if (signInError || !sessionData.session) {
      console.error('[educator-pin-login] Sign in error:', signInError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log successful login
    await supabaseAdmin
      .from('activity_log')
      .insert({
        event: 'educator_pin_login',
        user_id: linked_user_id,
        org_id,
        metadata: { educator_id, method: 'pin' }
      });

    console.log('[educator-pin-login] Session created successfully');
    
    // Return session for frontend to use
    return new Response(
      JSON.stringify({
        success: true,
        session: sessionData.session,
        educator_id,
        org_id,
        org_slug: orgSlug
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[educator-pin-login] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});