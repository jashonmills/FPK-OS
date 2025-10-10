import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Client with user JWT for authentication verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Admin client with service role for inserting family members (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { token } = await req.json();

    // Find the invite using admin client
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('invites')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired invitation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invite is expired
    if (new Date(invite.expires_at) < new Date()) {
      await supabaseClient
        .from('invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);

      return new Response(
        JSON.stringify({ error: 'This invitation has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is already a member using admin client
    const { data: existingMember } = await supabaseAdmin
      .from('family_members')
      .select('id')
      .eq('family_id', invite.family_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return new Response(
        JSON.stringify({ error: 'You are already a member of this family' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add user to family using admin client (bypasses RLS)
    const { error: memberError } = await supabaseAdmin
      .from('family_members')
      .insert({
        family_id: invite.family_id,
        user_id: user.id,
        role: invite.role,
        invited_by: invite.inviter_id,
        permissions: invite.role === 'viewer' 
          ? { can_edit: false, can_delete: false, can_invite: false }
          : { can_edit: true, can_delete: false, can_invite: false }
      });

    if (memberError) {
      console.error('Error adding family member:', memberError);
      return new Response(
        JSON.stringify({ error: 'Failed to accept invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark invite as accepted using admin client
    await supabaseAdmin
      .from('invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    // Get family name for response using admin client
    const { data: family } = await supabaseAdmin
      .from('families')
      .select('family_name')
      .eq('id', invite.family_id)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        family_id: invite.family_id,
        family_name: family?.family_name,
        role: invite.role,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing invite:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
