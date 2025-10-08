import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AcceptInviteRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization")!;
    
    // Client for auth verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const jwt = authHeader?.replace('Bearer ', '') || '';

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(jwt);
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || 'No user found');
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'AUTH_REQUIRED',
          error: "You must be signed in to accept an invitation" 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[accept-org-invite] Request from user: ${user.id} (${user.email})`);

    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { token }: AcceptInviteRequest = await req.json();

    if (!token) {
      console.error("[accept-org-invite] Missing token in request");
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'MISSING_TOKEN',
          error: "Missing invitation token" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[accept-org-invite] Processing token: ${token.substring(0, 8)}...`);

    // Find invite in user_invites table (email-based invitations only)
    const { data: invite, error: inviteError } = await supabase
      .from('user_invites')
      .select(`
        id,
        invite_token,
        invited_email,
        org_id,
        created_by,
        expires_at,
        is_used,
        role,
        organizations (
          id,
          name,
          slug,
          seat_cap,
          seats_used,
          instructor_limit,
          instructors_used
        )
      `)
      .eq('invite_token', token)
      .maybeSingle();

    if (inviteError) {
      console.error("[accept-org-invite] Error fetching invite:", inviteError);
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'INVITE_ERROR',
          error: "Error fetching invitation" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!invite) {
      console.error("[accept-org-invite] Invite not found");
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'INVITE_NOT_FOUND',
          error: "Invalid invitation link" 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found email invitation in user_invites");

    // Check if already used
    if (invite.is_used) {
      console.log("[accept-org-invite] Invite already used");
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'INVITE_USED',
          error: "This invitation has already been accepted" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(invite.expires_at);
    
    if (now > expiresAt) {
      console.log("[accept-org-invite] Invite expired");
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'INVITE_EXPIRED',
          error: "This invitation has expired" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CRITICAL: Verify email matches invitation
    const userEmail = user.email?.toLowerCase();
    const invitedEmail = invite.invited_email?.toLowerCase();
    
    if (!invitedEmail || userEmail !== invitedEmail) {
      console.error(`Email mismatch: user=${userEmail}, invited=${invitedEmail}`);
      return new Response(
        JSON.stringify({ 
          success: false,
          code: 'EMAIL_MISMATCH',
          error: `This invitation was sent to ${invitedEmail}. Please sign in with that email address.` 
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log("Email verified successfully");

    // Check if organization exists
    if (!invite.organizations) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Organization no longer exists" 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const org = invite.organizations;

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('org_members')
      .select('id, status')
      .eq('org_id', invite.org_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingMember) {
      if (existingMember.status === 'active') {
        console.log("[accept-org-invite] User already an active member");
        // Return 200 (not an error) but with success: false and helpful message
        return new Response(
          JSON.stringify({ 
            success: false,
            code: 'ALREADY_MEMBER',
            error: "You are already a member of this organization",
            org_id: invite.org_id,
            organization_name: org.name
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Reactivate member
        const { error: updateError } = await supabase
          .from('org_members')
          .update({ 
            status: 'active',
            role: invite.role 
          })
          .eq('id', existingMember.id);

        if (updateError) {
          console.error("Error reactivating member:", updateError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Failed to reactivate membership" 
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    } else {
      // Check organization capacity
      if (invite.role === 'student' && org.seats_used >= org.seat_cap) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Organization has reached maximum student capacity" 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (invite.role === 'instructor' && org.instructors_used >= org.instructor_limit) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Organization has reached maximum instructor capacity" 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create org_members record
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: invite.org_id,
          user_id: user.id,
          role: invite.role,
          status: 'active'
        });

      if (memberError) {
        console.error("Error creating org member:", memberError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to create organization membership",
            details: memberError.message 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Created org membership: user=${user.id}, org=${invite.org_id}, role=${invite.role}`);
    }

    // Mark invite as used based on type
    if (isCodeInvite) {
      // For code invites, increment uses_count
      const { error: updateError } = await supabase
        .from('org_invites')
        .update({
          uses_count: (invite.uses_count || 0) + 1
        })
        .eq('id', invite.id);

      if (updateError) {
        console.error("Error incrementing code invite uses:", updateError);
      } else {
        console.log("Code invite uses incremented successfully");
      }
    } else {
      // For email invites, mark as used
      const { error: updateError } = await supabase
        .from('user_invites')
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by: user.id
        })
        .eq('id', invite.id);

      if (updateError) {
        console.error("Error marking email invite as used:", updateError);
      } else {
        console.log("Email invite marked as used successfully");
      }
    }

    // Log to audit_logs
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      organization_id: invite.org_id,
      action_type: 'invite_accepted',
      resource_type: 'user_invite',
      resource_id: invite.id,
      details: {
        role: invite.role,
        invited_by: invite.created_by,
        invite_type: 'email'
      }
    });

    // Return success with proper response structure
    return new Response(
      JSON.stringify({
        success: true,
        org_id: org.id, // Use consistent snake_case for frontend
        orgId: org.id,
        organization_name: org.name,
        orgName: org.name,
        orgSlug: org.slug,
        role: invite.role,
        dashboardUrl: `/org/${org.slug || org.id}/dashboard`,
        message: `Welcome to ${org.name}!`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in accept-org-invite:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Internal server error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
