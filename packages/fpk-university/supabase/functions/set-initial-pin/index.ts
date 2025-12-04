import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from "../_shared/cors.ts";
import { hashPin } from "../_shared/pin-hasher.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface SetInitialPinRequest {
  orgId: string;
  pin: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authenticated user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    const { orgId, pin }: SetInitialPinRequest = await req.json();

    // Validate inputs
    if (!orgId || !pin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Organization ID and PIN are required.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PIN must be exactly 6 digits.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log(`[set-initial-pin] Setting PIN for user ${user.id} in org ${orgId}`);

    // SECURITY CHECK: First, verify that no PIN is currently set
    const { data: existingMember, error: fetchError } = await supabase
      .from('org_members')
      .select('pin_hash, role')
      .eq('user_id', user.id)
      .eq('org_id', orgId)
      .eq('status', 'active')
      .single();

    if (fetchError || !existingMember) {
      console.error('[set-initial-pin] User is not a member:', fetchError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User is not a member of this organization.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    if (existingMember.pin_hash) {
      console.warn('[set-initial-pin] PIN already exists for this user');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'A PIN is already set for this user. Use the reset flow instead.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409
        }
      );
    }

    // Hash the new PIN
    const pin_hash = await hashPin(pin);

    console.log('[set-initial-pin] PIN hashed successfully, updating database');

    // Update the user's record with the new hash
    const { error: updateError } = await supabase
      .from('org_members')
      .update({ pin_hash })
      .eq('user_id', user.id)
      .eq('org_id', orgId);

    if (updateError) {
      console.error('[set-initial-pin] Update error:', updateError);
      throw updateError;
    }

    // Log the PIN creation
    await supabase.from('activity_log').insert({
      user_id: user.id,
      org_id: orgId,
      event: 'pin_created',
      metadata: { role: existingMember.role }
    });

    console.log(`[set-initial-pin] ✅ PIN created successfully for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'PIN created successfully.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[set-initial-pin] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
