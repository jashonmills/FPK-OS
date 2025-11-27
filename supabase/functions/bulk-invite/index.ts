import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkInviteRequest {
  org_id: string;
  invites: Array<{
    email: string;
    full_name: string;
    role: string;
  }>;
}

interface InviteResult {
  email: string;
  success: boolean;
  error?: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const VALID_ROLES = ['student', 'instructor', 'instructor_aide', 'admin', 'viewer'];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { org_id, invites }: BulkInviteRequest = await req.json();

    // Authenticate user
    const jwt = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      throw new Error('No authorization token provided');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Check permissions
    const { data: member, error: memberError } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', org_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (memberError || !member || !['owner', 'admin', 'instructor'].includes(member.role)) {
      throw new Error('Only organization owners, admins, and instructors can send bulk invitations');
    }

    console.log(`[bulk-invite] Processing ${invites.length} invitations for org: ${org_id}`);

    // Get organization details for email
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name, slug')
      .eq('id', org_id)
      .single();

    const orgName = orgData?.name || 'Your Organization';
    const orgSlug = orgData?.slug;

    // Process each invite
    const results: InviteResult[] = [];

    for (const invite of invites) {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(invite.email)) {
          results.push({
            email: invite.email,
            success: false,
            error: 'Invalid email format'
          });
          continue;
        }

        // Validate role
        if (!VALID_ROLES.includes(invite.role.toLowerCase())) {
          results.push({
            email: invite.email,
            success: false,
            error: `Invalid role: ${invite.role}`
          });
          continue;
        }

        // Validate name
        if (!invite.full_name || invite.full_name.trim().length < 2) {
          results.push({
            email: invite.email,
            success: false,
            error: 'Full name required (minimum 2 characters)'
          });
          continue;
        }

        // Check if user already exists in the organization
        const { data: existingMember } = await supabase
          .from('org_members')
          .select('id')
          .eq('org_id', org_id)
          .eq('email', invite.email.toLowerCase())
          .single();

        if (existingMember) {
          results.push({
            email: invite.email,
            success: false,
            error: 'User already a member of this organization'
          });
          continue;
        }

        // Check for existing pending invitation
        const { data: existingInvite } = await supabase
          .from('org_invitations')
          .select('id')
          .eq('org_id', org_id)
          .eq('invited_email', invite.email.toLowerCase())
          .eq('status', 'pending')
          .single();

        if (existingInvite) {
          results.push({
            email: invite.email,
            success: false,
            error: 'Pending invitation already exists'
          });
          continue;
        }

        // Generate invite token
        const inviteToken = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiration

        // Create invitation record
        const { error: insertError } = await supabase
          .from('org_invitations')
          .insert({
            org_id,
            invited_email: invite.email.toLowerCase(),
            invited_full_name: invite.full_name,
            role: invite.role.toLowerCase(),
            invite_token: inviteToken,
            expires_at: expiresAt.toISOString(),
            invited_by: user.id,
            status: 'pending'
          });

        if (insertError) {
          console.error(`[bulk-invite] Failed to create invite for ${invite.email}:`, insertError);
          results.push({
            email: invite.email,
            success: false,
            error: 'Failed to create invitation'
          });
          continue;
        }

        // Send email if Resend is configured
        let emailSent = false;
        if (resend) {
          try {
            const acceptUrl = orgSlug 
              ? `${Deno.env.get('SITE_URL') || 'https://fpkuniversity.com'}/${orgSlug}/accept-invite?token=${inviteToken}`
              : `${Deno.env.get('SITE_URL') || 'https://fpkuniversity.com'}/accept-invite?token=${inviteToken}`;

            await resend.emails.send({
              from: 'FPK University <noreply@fpkuniversity.com>',
              to: [invite.email],
              subject: `You're invited to join ${orgName}`,
              html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                  <h2 style="color: #1a365d;">Join ${orgName} on FPK University</h2>
                  <p>Hello ${invite.full_name},</p>
                  <p>You've been invited to join <strong>${orgName}</strong> as a <strong>${invite.role}</strong>.</p>
                  <p>Click the button below to accept your invitation and get started:</p>
                  <a href="${acceptUrl}" style="background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Accept Invitation</a>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="color: #718096; font-size: 14px; word-break: break-all;">${acceptUrl}</p>
                  <p style="color: #718096; font-size: 12px; margin-top: 24px;">This invitation will expire on ${expiresAt.toLocaleDateString()}.</p>
                  <p>Welcome to FPK University!</p>
                </div>
              `
            });
            emailSent = true;
          } catch (emailError) {
            console.error(`[bulk-invite] Failed to send email to ${invite.email}:`, emailError);
          }
        }

        results.push({
          email: invite.email,
          success: true,
          error: emailSent ? undefined : 'Invitation created but email not sent'
        });

        console.log(`[bulk-invite] ✅ Invitation created for ${invite.email}`);

      } catch (error: any) {
        console.error(`[bulk-invite] Error processing ${invite.email}:`, error);
        results.push({
          email: invite.email,
          success: false,
          error: error.message || 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`[bulk-invite] Complete: ${successCount}/${invites.length} successful`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary: {
          total: invites.length,
          successful: successCount,
          failed: invites.length - successCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[bulk-invite] Error:', error);
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
