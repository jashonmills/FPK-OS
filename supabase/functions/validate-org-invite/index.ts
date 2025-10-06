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

    // Fetch invite with organization details
    const { data: invite, error: inviteError } = await supabase
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
      .single();

    if (inviteError || !invite) {
      console.log("Invite not found:", inviteError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid invitation link" 
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
