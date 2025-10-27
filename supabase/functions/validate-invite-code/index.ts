import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invite_code } = await req.json();

    if (!invite_code) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invite code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch invite code
    const { data: invite, error: inviteError } = await supabaseClient
      .from('invites')
      .select('*')
      .eq('invite_code', invite_code)
      .maybeSingle();

    if (inviteError) {
      console.error('Error fetching invite:', inviteError);
      throw inviteError;
    }

    // Fetch creator's persona if invite exists
    let creatorName = 'A friend';
    if (invite) {
      const { data: persona } = await supabaseClient
        .from('personas')
        .select('display_name')
        .eq('user_id', invite.created_by_user_id)
        .limit(1)
        .maybeSingle();
      
      if (persona?.display_name) {
        creatorName = persona.display_name;
      }
    }

    // Check if code exists
    if (!invite) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid invite code' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invite code has expired' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if max uses exceeded
    if (invite.max_uses && invite.uses_count >= invite.max_uses) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invite code has reached maximum uses' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate uses remaining
    const usesRemaining = invite.max_uses ? invite.max_uses - invite.uses_count : null;

    return new Response(
      JSON.stringify({
        valid: true,
        code: invite.invite_code,
        created_by: {
          display_name: creatorName
        },
        uses_remaining: usesRemaining
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-invite-code:', error);
    return new Response(
      JSON.stringify({ valid: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
