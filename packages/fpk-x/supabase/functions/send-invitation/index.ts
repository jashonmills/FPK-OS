import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { Resend } from 'https://esm.sh/resend@2.0.0';
import { corsHeaders } from '../_shared/cors.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    // Check if family can add more members based on subscription tier
    const { data: canAdd, error: limitError } = await supabaseClient
      .rpc('can_add_family_member', { _family_id: familyId });

    if (limitError) {
      console.error('Error checking family member limit:', limitError);
      return new Response(
        JSON.stringify({ error: 'Failed to check subscription limits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!canAdd) {
      // Get current tier to provide helpful error message
      const { data: family } = await supabaseClient
        .from('families')
        .select('subscription_tier')
        .eq('id', familyId)
        .single();

      const tierLimits = {
        free: '2 users',
        team: '10 users',
        pro: 'unlimited users'
      };

      const currentLimit = tierLimits[family?.subscription_tier as keyof typeof tierLimits] || '2 users';

      return new Response(
        JSON.stringify({ 
          error: 'User limit reached',
          message: `Your current plan (${family?.subscription_tier || 'free'}) allows ${currentLimit}. Upgrade to add more team members.`,
          upgradeRequired: true,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the invite token from database
    const { data: invite, error: inviteError } = await supabaseClient
      .from('invites')
      .select('token')
      .eq('family_id', familyId)
      .eq('invitee_email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (inviteError) {
      console.error('Error fetching invite:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Failed to find invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the correct app URL - check for custom domain env var or use the Vite URL
    const appUrl = Deno.env.get('APP_URL') || Deno.env.get('VITE_SUPABASE_URL')?.replace('pnxwemmpxldriwaomiey.supabase.co', 'fpx-cns-app-multi-sass.lovable.app') || 'https://fpx-cns-app-multi-sass.lovable.app';
    const inviteUrl = `${appUrl}/accept-invite?token=${invite.token}`;

    const roleDescription = role === 'viewer' 
      ? 'view all data and reports (read-only access)'
      : 'view all data, create and edit logs';

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'FPX My CNS-App <onboarding@resend.dev>',
      to: [email],
      subject: `You've been invited to join ${familyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">You're Invited!</h1>
          <p>You've been invited to join <strong>${familyName}</strong> on FPX My CNS-App.</p>
          
          <p>As a <strong>${role}</strong>, you'll be able to ${roleDescription}.</p>
          
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${inviteUrl}" style="color: #4F46E5;">${inviteUrl}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This invitation will expire in 7 days.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation sent successfully',
        emailId: emailData?.id,
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

