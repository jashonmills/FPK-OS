import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

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

    const { email, role, familyId, familyName } = await req.json();

    // Get the invite token from database
    const { data: invite, error: inviteError } = await supabaseClient
      .from('invites')
      .select('token')
      .eq('family_id', familyId)
      .eq('invitee_email', email)
      .eq('status', 'pending')
      .single();

    if (inviteError) {
      console.error('Error fetching invite:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Failed to send invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const inviteUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://your-app.lovable.app'}/accept-invite?token=${invite.token}`;

    console.log(`Invitation created for ${email} to join ${familyName}`);
    console.log(`Invite URL: ${inviteUrl}`);
    console.log(`Role: ${role}`);

    // TODO: Integrate with Resend or another email service
    // For now, just return the invite URL for testing
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation created successfully',
        inviteUrl, // In production, this would be sent via email
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-invitation:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
