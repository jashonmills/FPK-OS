import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  orgId: string;
  parentEmail: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orgId, parentEmail }: InviteRequest = await req.json();

    // Verify the user has permission to create invites for this org
    const jwt = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      throw new Error('No authorization token provided');  
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Check if user is owner or instructor of the organization
    const { data: member, error: memberError } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (memberError || !member || !['owner', 'instructor'].includes(member.role)) {
      throw new Error('Insufficient permissions to create IEP invites');
    }

    // Generate unique invite code
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_iep_invite_code');

    if (codeError) {
      throw new Error('Failed to generate invite code');
    }

    const inviteCode = codeData;

    // Create the invite record
    const { data: invite, error: inviteError } = await supabase
      .from('iep_invites')
      .insert({
        org_id: orgId,
        code: inviteCode,
        created_by: user.id,
        metadata: { parent_email: parentEmail }
      })
      .select()
      .single();

    if (inviteError) {
      throw new Error('Failed to create invite record');
    }

    // Send email invitation if Resend is configured
    if (resend && parentEmail) {
      try {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', orgId)
          .single();

        const orgName = orgData?.name || 'Your School';
        const accessUrl = `${Deno.env.get('SITE_URL') || 'https://fpkuniversity.com'}/iep/parent/${inviteCode}`;

        await resend.emails.send({
          from: 'FPK University <noreply@fpkuniversity.com>',
          to: [parentEmail],
          subject: `IEP Preparation Access - ${orgName}`,
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #1a365d;">IEP Preparation Access</h2>
              <p>Hello,</p>
              <p>You've been invited to participate in the IEP preparation process for your child at <strong>${orgName}</strong>.</p>
              <p>Your access code is: <strong style="font-size: 18px; color: #2b6cb0;">${inviteCode}</strong></p>
              <p>You can also access the forms directly using this link:</p>
              <a href="${accessUrl}" style="background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Access IEP Forms</a>
              <p>This access code will expire in 7 days. Please complete the forms at your earliest convenience to help prepare for your child's IEP meeting.</p>
              <p>If you have any questions, please contact your school directly.</p>
              <p>Thank you,<br>FPK University Team</p>
            </div>
          `
        });

        console.log(`IEP invitation email sent to: ${parentEmail}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inviteCode,
        invite
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in send-iep-invitation:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});