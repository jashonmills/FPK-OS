import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidateInviteRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS for validation
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { token }: ValidateInviteRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Missing invitation token" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Validating invite token: ${token.substring(0, 8)}...`);

    // Try to find invite in user_invites first (email invitations)
    let invite: any = null;
    let isCodeInvite = false;

    const { data: emailInvite, error: emailError } = await supabase
      .from('user_invites')
      .select(`
        id,
        invite_token,
        invited_email,
        org_id,
        created_at,
        expires_at,
        is_used,
        used_at,
        role,
        metadata,
        organizations (
          id,
          name,
          description,
          logo_url,
          plan
        )
      `)
      .eq('invite_token', token)
      .maybeSingle();

    if (emailInvite) {
      invite = emailInvite;
      console.log("Found email invitation");
    } else {
      // Try org_invites table (code invitations)
      const { data: codeInvite, error: codeError } = await supabase
        .from('org_invites')
        .select(`
          id,
          code,
          org_id,
          created_at,
          expires_at,
          uses_count,
          max_uses,
          role,
          metadata,
          organizations (
            id,
            name,
            description,
            logo_url,
            plan
          )
        `)
        .eq('code', token)
        .maybeSingle();

      if (codeInvite) {
        invite = {
          id: codeInvite.id,
          invite_token: codeInvite.code,
          invited_email: null, // Code invites don't have specific email
          org_id: codeInvite.org_id,
          created_at: codeInvite.created_at,
          expires_at: codeInvite.expires_at,
          is_used: codeInvite.uses_count >= codeInvite.max_uses,
          role: codeInvite.role,
          metadata: codeInvite.metadata,
          organizations: codeInvite.organizations
        };
        isCodeInvite = true;
        console.log("Found code invitation");
      }
    }

    if (!invite) {
      console.log("Invite not found in either table");
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid invitation link or code" 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already used
    if (invite.is_used) {
      console.log("Invite already used at:", invite.used_at);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "This invitation has already been accepted" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(invite.expires_at);
    
    if (now > expiresAt) {
      console.log("Invite expired at:", invite.expires_at);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "This invitation has expired" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if organization is still active
    if (!invite.organizations) {
      console.log("Organization not found for invite");
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Organization no longer exists" 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Invite is valid!");

    // Return valid response with organization details
    return new Response(
      JSON.stringify({
        valid: true,
        inviteId: invite.id,
        invitedEmail: invite.invited_email,
        role: invite.role,
        organization: {
          id: invite.organizations.id,
          name: invite.organizations.name,
          description: invite.organizations.description,
          logoUrl: invite.organizations.logo_url,
          plan: invite.organizations.plan
        },
        expiresAt: invite.expires_at,
        createdAt: invite.created_at
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in validate-org-invite:", error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
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
