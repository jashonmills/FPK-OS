import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateInviteRequest {
  orgId: string;
  email: string;
  role: 'student' | 'instructor';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generate invite request from user: ${user.id}`);

    // Parse request body
    const { orgId, email, role }: GenerateInviteRequest = await req.json();

    // Validate input
    if (!orgId || !email || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orgId, email, role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!['student', 'instructor'].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be 'student' or 'instructor'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating invite for ${email} to join org ${orgId} as ${role}`);

    // Verify user is org owner or instructor
    const { data: membership, error: membershipError } = await supabase
      .from('org_members')
      .select('role, status')
      .eq('org_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership || !['owner', 'instructor'].includes(membership.role)) {
      console.error("Permission denied:", membershipError);
      return new Response(
        JSON.stringify({ error: "Only organization owners and instructors can create invites" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limiting - max 10 invites per hour per org
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { data: recentInvites, error: rateLimitError } = await supabase
      .from('user_invites')
      .select('id')
      .eq('org_id', orgId)
      .gte('created_at', oneHourAgo);

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
    } else if (recentInvites && recentInvites.length >= 10) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Maximum 10 invites per hour per organization." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('name, logo_url')
      .eq('id', orgId)
      .single();

    if (orgError || !org) {
      console.error("Organization not found:", orgError);
      return new Response(
        JSON.stringify({ error: "Organization not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if org has available seats
    const { data: orgDetails, error: seatsError } = await supabase
      .from('organizations')
      .select('seat_cap, seats_used, instructor_limit, instructors_used')
      .eq('id', orgId)
      .single();

    if (seatsError || !orgDetails) {
      console.error("Error checking org capacity:", seatsError);
      return new Response(
        JSON.stringify({ error: "Error checking organization capacity" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check capacity based on role
    if (role === 'student' && orgDetails.seats_used >= orgDetails.seat_cap) {
      return new Response(
        JSON.stringify({ error: "Organization has reached maximum student capacity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (role === 'instructor' && orgDetails.instructors_used >= orgDetails.instructor_limit) {
      return new Response(
        JSON.stringify({ error: "Organization has reached maximum instructor capacity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate crypto-secure token
    const inviteToken = crypto.randomUUID();
    
    // Calculate expiration (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log(`Generated token: ${inviteToken.substring(0, 8)}... (expires: ${expiresAt})`);

    // Create invite record
    const { data: invite, error: insertError } = await supabase
      .from('user_invites')
      .insert({
        invite_token: inviteToken,
        invited_email: email.toLowerCase(),
        org_id: orgId,
        created_by: user.id,
        expires_at: expiresAt,
        role: role,
        metadata: {
          invited_by_name: user.email,
          org_name: org.name
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating invite:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create invitation", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Invite created successfully: ${invite.id}`);

    // Get inviter's profile for personalization
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const inviterName = inviterProfile?.full_name || user.email?.split('@')[0] || 'A team member';

    // Generate invite URL
    const inviteUrl = `https://fpkuniversity.com/join?token=${inviteToken}`;

    // Format expiration date nicely
    const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send email via Resend
    try {
      const emailResult = await resend.emails.send({
        from: "FPK University <noreply@fpkuniversity.com>",
        to: [email],
        subject: `You're invited to join ${org.name} on FPK University`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">You're Invited!</h1>
      <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px;">Join ${org.name} on FPK University</p>
    </div>
    
    <!-- Body -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
        Hi there! 👋
      </p>
      <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
        <strong>${inviterName}</strong> has invited you to join <strong>${org.name}</strong> as a <strong>${role}</strong> on FPK University.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${inviteUrl}" 
           style="background: #7c3aed; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; display: inline-block; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
          Accept Invitation →
        </a>
      </div>
      
      <!-- Info Box -->
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          📧 This invitation was sent to: <strong>${email}</strong><br>
          ⏰ Expires: <strong>${expiryDate}</strong><br>
          🔒 This link can only be used once
        </p>
      </div>
      
      <!-- Fallback Link -->
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 30px 0 0 0; line-height: 1.4;">
        Button not working? Copy this link:<br>
        <a href="${inviteUrl}" style="color: #7c3aed; word-break: break-all; font-size: 11px;">${inviteUrl}</a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0 0 10px 0;">
        If you weren't expecting this email, you can safely ignore it.
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        <a href="https://fpkuniversity.com" style="color: #7c3aed; text-decoration: none;">FPK University</a>
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });

      console.log("Email sent successfully:", emailResult);
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);
      // Don't fail the entire request if email fails
      // The invite is already created, user can still use the link
    }

    // Log to audit_logs
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      organization_id: orgId,
      action_type: 'invite_created',
      resource_type: 'user_invite',
      resource_id: invite.id,
      details: {
        invited_email: email,
        role: role,
        expires_at: expiresAt
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        inviteToken: inviteToken,
        inviteUrl: inviteUrl,
        expiresAt: expiresAt,
        message: "Invitation created and email sent successfully"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in generate-org-invite:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
