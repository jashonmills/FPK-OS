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
  pin: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, pin }: ActivateRequest = await req.json();

    console.log('[activate-educator-account] Activation attempt with token:', token);

    // Validate inputs
    if (!token || !pin) {
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

    // Find educator by token
    const { data: educator, error: fetchError } = await supabaseAdmin
      .from('org_educators')
      .select('*, organizations!inner(slug)')
      .eq('activation_token', token)
      .eq('activation_status', 'pending')
      .single();

    if (fetchError || !educator) {
      console.error('[activate-educator-account] Invalid or expired token:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired activation token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    if (new Date(educator.activation_expires_at) < new Date()) {
      await supabaseAdmin
        .from('org_educators')
        .update({ activation_status: 'expired' })
        .eq('id', educator.id);

      return new Response(
        JSON.stringify({ error: 'Activation token has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the PIN
    const pinHash = await hashPin(pin);
    console.log('[activate-educator-account] PIN hashed successfully');

    // Create auth user for educator
    const tempEmail = `educator-${educator.id}@portal.fpkuniversity.com`;
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: tempEmail,
      email_confirm: true,
      user_metadata: {
        educator_id: educator.id,
        org_id: educator.org_id,
        educator_org_slug: educator.organizations.slug,
        is_educator_portal: true,
        role: educator.role
      }
    });

    if (createError) {
      console.error('[activate-educator-account] User creation error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update educator record with PIN hash and linked user
    const { error: updateError } = await supabaseAdmin
      .from('org_educators')
      .update({
        pin_hash: pinHash,
        linked_user_id: newUser.user.id,
        activation_status: 'activated',
        activation_token: null
      })
      .eq('id', educator.id);

    if (updateError) {
      console.error('[activate-educator-account] Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to complete activation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create org membership for the educator
    const { error: membershipError } = await supabaseAdmin
      .from('org_members')
      .insert({
        org_id: educator.org_id,
        user_id: newUser.user.id,
        role: educator.role,
        status: 'active'
      });

    if (membershipError) {
      console.error('[activate-educator-account] Membership creation error:', membershipError);
      // Don't fail the whole flow, but log the error
    }

    // Log activation
    await supabaseAdmin
      .from('activity_log')
      .insert({
        event: 'educator_activated',
        user_id: newUser.user.id,
        org_id: educator.org_id,
        metadata: { educator_id: educator.id, method: 'link', first_activation: true }
      });

    console.log('[activate-educator-account] Activation successful');

    return new Response(
      JSON.stringify({
        success: true,
        educator_id: educator.id,
        org_id: educator.org_id,
        org_slug: educator.organizations.slug
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[activate-educator-account] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});