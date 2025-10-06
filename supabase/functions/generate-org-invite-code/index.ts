import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateCodeRequest {
  orgId: string;
  role: 'student' | 'instructor';
  maxUses?: number;
  expiresDays?: number;
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
        JSON.stringify({ success: false, error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Supabase client with JWT in global headers for RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { 
        headers: { 
          Authorization: authHeader 
        } 
      }
    });

    // Extract JWT from "Bearer <token>"
    const jwt = authHeader.replace('Bearer ', '');
    
    // Verify user is authenticated by passing JWT to getUser
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generate invite code request from user: ${user.id}`);

    // Parse request body
    const { orgId, role, maxUses = 100, expiresDays = 30 }: GenerateCodeRequest = await req.json();

    // Validate input
    if (!orgId || !role) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: orgId, role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!['student', 'instructor'].includes(role)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid role. Must be 'student' or 'instructor'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating invite code for org ${orgId} as ${role} (max uses: ${maxUses}, expires: ${expiresDays} days)`);

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
        JSON.stringify({ success: false, error: "Only organization owners and instructors can create invites" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('name, seat_cap, seats_used, instructor_limit, instructors_used')
      .eq('id', orgId)
      .single();

    if (orgError || !org) {
      console.error("Organization not found:", orgError);
      return new Response(
        JSON.stringify({ success: false, error: "Organization not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check capacity based on role
    if (role === 'student' && org.seats_used >= org.seat_cap) {
      return new Response(
        JSON.stringify({ success: false, error: "Organization has reached maximum student capacity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (role === 'instructor' && org.instructors_used >= org.instructor_limit) {
      return new Response(
        JSON.stringify({ success: false, error: "Organization has reached maximum instructor capacity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate short invite code (8 characters)
    const code = 'inv_' + crypto.randomUUID().replace(/-/g, '').substring(0, 32);
    
    // Calculate expiration
    const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString();

    console.log(`Generated code: ${code.substring(0, 12)}... (expires: ${expiresAt})`);

    // Create invite record in org_invites table
    const { data: invite, error: insertError } = await supabase
      .from('org_invites')
      .insert({
        org_id: orgId,
        created_by: user.id,
        code: code,
        role: role,
        max_uses: maxUses,
        uses_count: 0,
        expires_at: expiresAt,
        status: 'pending',
        metadata: {
          created_by_name: user.email,
          org_name: org.name
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating invite:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create invitation", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Invite code created successfully: ${invite.id}`);

    // Log to audit_logs
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      organization_id: orgId,
      action_type: 'invite_code_created',
      resource_type: 'org_invite',
      resource_id: invite.id,
      details: {
        code: code.substring(0, 12) + '...',
        role: role,
        max_uses: maxUses,
        expires_at: expiresAt
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        inviteToken: code,
        code: code,
        expiresAt: expiresAt,
        maxUses: maxUses,
        message: "Invitation code created successfully"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in generate-org-invite-code:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
