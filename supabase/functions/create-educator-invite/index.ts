import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CreateEducatorInviteRequest {
  org_id: string;
  full_name: string;
  email: string;
  role?: 'instructor' | 'instructor_aide';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { org_id, full_name, email, role = 'instructor' }: CreateEducatorInviteRequest = await req.json();

    console.log('[create-educator-invite] Creating invite for educator:', email);

    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated and is org owner
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[create-educator-invite] User authenticated:', user.id);

    // Verify org exists and user has permission
    const { data: orgMember, error: orgError } = await supabaseClient
      .from('org_members')
      .select('role')
      .eq('org_id', org_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (orgError || !orgMember || !['owner', 'admin', 'instructor'].includes(orgMember.role)) {
      console.error('[create-educator-invite] Insufficient permissions:', orgError);
      return new Response(
        JSON.stringify({ error: 'Only organization owners, admins, and instructors can invite educators' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate activation token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .rpc('generate_activation_token');

    if (tokenError || !tokenData) {
      console.error('[create-educator-invite] Token generation error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = tokenData;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiration

    // Create educator record
    const { data: educator, error: createError } = await supabaseClient
      .from('org_educators')
      .insert({
        org_id,
        full_name,
        email,
        role,
        activation_token: token,
        activation_expires_at: expiresAt.toISOString(),
        activation_status: 'pending',
        invited_by: user.id,
        status: 'active'
      })
      .select('*, organizations!inner(slug)')
      .single();

    if (createError) {
      console.error('[create-educator-invite] Create error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create educator invite' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log invite generation
    await supabaseClient
      .from('activity_log')
      .insert({
        event: 'educator_invite_created',
        user_id: user.id,
        org_id,
        metadata: { educator_id: educator.id, email, token_expires_at: expiresAt.toISOString() }
      });

    const origin = req.headers.get('origin') || 'https://fpkuniversity.com';
    const orgSlug = educator.organizations.slug;
    const activationUrl = `${origin}/${orgSlug}/activate-educator?token=${token}`;

    console.log('[create-educator-invite] ✅ Invite created successfully', { 
      activationUrl, 
      origin, 
      orgSlug, 
      token: token.substring(0, 8) + '...' 
    });

    return new Response(
      JSON.stringify({
        success: true,
        educator_id: educator.id,
        token,
        activation_url: activationUrl,
        expires_at: expiresAt.toISOString(),
        educator_name: full_name,
        educator_email: email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[create-educator-invite] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});