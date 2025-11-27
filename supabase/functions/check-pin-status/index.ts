import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface CheckPinStatusRequest {
  orgId: string;
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

    const { orgId }: CheckPinStatusRequest = await req.json();

    if (!orgId) {
      return new Response(
        JSON.stringify({
          hasPin: false,
          error: 'Organization ID is required.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log(`[check-pin-status] Checking PIN status for user ${user.id} in org ${orgId}`);

    // Query the org_members table
    const { data: member, error: memberError } = await supabase
      .from('org_members')
      .select('pin_hash, role')
      .eq('user_id', user.id)
      .eq('org_id', orgId)
      .eq('status', 'active')
      .single();

    if (memberError) {
      console.error('[check-pin-status] Error fetching member:', memberError.message);
      return new Response(
        JSON.stringify({
          hasPin: false,
          error: 'Not a member of this organization.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    // Check if pin_hash is present and not an empty string
    const hasPin = !!member?.pin_hash;

    console.log(`[check-pin-status] User ${user.id} ${hasPin ? 'has' : 'does not have'} a PIN`);

    return new Response(
      JSON.stringify({
        hasPin,
        role: member.role
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[check-pin-status] Error:', error);
    return new Response(
      JSON.stringify({
        hasPin: false,
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
