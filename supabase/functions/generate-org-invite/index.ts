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
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Supabase client for auth verification (uses anon key)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    // Extract JWT from "Bearer <token>"
    const jwt = authHeader.replace('Bearer ', '');
    
    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(jwt);
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generate invite request from user: ${user.id}`);

    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let orgId, email, role;
    try {
      const body = await req.json();
      orgId = body.orgId;
      email = body.email;
      role = body.role;
      console.log(`Request body parsed:`, { orgId, email, role });
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input
    if (!orgId || !email || !role) {
      console.error("Missing required fields:", { orgId: !!orgId, email: !!email, role: !!role });
      return new Response(
        JSON.stringify({ error: "Missing required fields: orgId, email, role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!['student', 'instructor'].includes(role)) {
      console.error("Invalid role provided:", role);
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be 'student' or 'instructor'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
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

    // Generate invite URL - FIX: Use /org/join instead of /join
    const inviteUrl = `https://fpkuniversity.com/org/join?token=${inviteToken}`;

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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join ${org.name} on FPK University</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f6f9fc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header with Gradient -->
          <tr>
            <td style="padding: 48px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                FPK University
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500;">
                You're Invited!
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <p style="margin: 0 0 8px 0; color: #1a202c; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Join ${org.name}
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                <strong>${inviterName}</strong> has invited you to join <strong>${org.name}</strong> as a <strong>${role}</strong>.
              </p>
              
              <p style="margin: 0 0 32px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Click the button below to accept your invitation and start your learning journey on FPK University.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto 32px auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);">
                    <a href="${inviteUrl}" 
                       style="display: inline-block; padding: 18px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px; letter-spacing: 0.3px;">
                      Accept Invitation →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Card -->
              <div style="margin: 32px 0; padding: 24px; background: linear-gradient(to right, #f7fafc, #edf2f7); border-radius: 8px; border-left: 4px solid #667eea;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0;">
                      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.8;">
                        📧 <strong>Invitation sent to:</strong> ${email}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;">
                      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.8;">
                        👤 <strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;">
                      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.8;">
                        ⏰ <strong>Expires:</strong> ${expiryDate}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;">
                      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.8;">
                        🔒 <strong>Security:</strong> Single-use link
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Expiration Warning -->
              <div style="margin: 24px 0 32px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border: 1px solid #fbbf24;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; text-align: center;">
                  <strong>⚠️ This invitation expires in 7 days.</strong><br>
                  <span style="font-size: 13px;">Please accept it soon to secure your access.</span>
                </p>
              </div>
              
              <!-- Alternative Link -->
              <div style="padding: 20px 0; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 12px 0; color: #718096; font-size: 13px; text-align: center;">
                  Having trouble with the button? Copy and paste this link:
                </p>
                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; text-align: center; font-family: 'Courier New', monospace; background-color: #f7fafc; padding: 12px; border-radius: 4px;">
                  ${inviteUrl}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #e2e8f0; background-color: #fafbfc;">
              <p style="margin: 0 0 12px 0; color: #718096; font-size: 14px; line-height: 1.6; text-align: center;">
                If you weren't expecting this invitation, you can safely ignore this email.
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} <a href="https://fpkuniversity.com" style="color: #667eea; text-decoration: none;">FPK University</a>. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
