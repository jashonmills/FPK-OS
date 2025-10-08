import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { verifyPin } from "../_shared/pin-hasher.ts";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface VerifyPinRequest {
  userId: string;
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

    const { userId, orgId, pin }: VerifyPinRequest = await req.json();

    // Validate inputs
    if (!userId || !orgId || !pin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: userId, orgId, or pin'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Security: Ensure the requesting user matches the userId
    if (user.id !== userId) {
      console.error(`[verify-context-pin] Auth mismatch: ${user.id} tried to verify PIN for ${userId}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized: Cannot verify PIN for another user'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      );
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid PIN format. Must be 6 digits.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log(`[verify-context-pin] Verifying PIN for user ${userId} in org ${orgId} using PBKDF2`);

    // Fetch the user's membership record with pin_hash
    const { data: membership, error: membershipError } = await supabase
      .from('org_members')
      .select('id, role, pin_hash')
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership) {
      console.error(`[verify-context-pin] Membership not found:`, membershipError);
      
      // Log failed attempt
      await supabase.from('activity_log').insert({
        user_id: userId,
        org_id: orgId,
        event: 'pin_verification_failed',
        metadata: { reason: 'membership_not_found' }
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'You are not an active member of this organization'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    // Check if PIN is set
    if (!membership.pin_hash) {
      console.warn(`[verify-context-pin] User ${userId} has no PIN set for org ${orgId}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PIN not configured. Please contact your administrator.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Verify the PIN using PBKDF2
    const isValidPin = await verifyPin(pin, membership.pin_hash);

    if (!isValidPin) {
      console.warn(`[verify-context-pin] Invalid PIN attempt for user ${userId} in org ${orgId}`);
      
      // Log failed attempt
      await supabase.from('activity_log').insert({
        user_id: userId,
        org_id: orgId,
        event: 'pin_verification_failed',
        metadata: { reason: 'invalid_pin' }
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid PIN. Please try again.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // PIN is valid! Log success
    await supabase.from('activity_log').insert({
      user_id: userId,
      org_id: orgId,
      event: 'pin_verification_success',
      metadata: { role: membership.role }
    });

    console.log(`[verify-context-pin] ✅ PIN verified for user ${userId} with role ${membership.role}`);

    return new Response(
      JSON.stringify({
        success: true,
        role: membership.role,
        message: 'PIN verified successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[verify-context-pin] Error:', error);
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
