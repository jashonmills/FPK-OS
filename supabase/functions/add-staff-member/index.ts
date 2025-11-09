import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AddStaffMemberRequest {
  orgId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'instructor' | 'student' | 'instructor_aide' | 'viewer' | 'admin';
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

    // Get Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract JWT and verify user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Add staff member request from user: ${user.id}`);

    // Parse request body
    const { orgId, email, firstName, lastName, role }: AddStaffMemberRequest = await req.json();

    // Validate input
    if (!orgId || !email || !firstName || !lastName || !role) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
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

    // Verify user is org owner or admin
    const { data: membership, error: membershipError } = await supabase
      .from('org_members')
      .select('role, status')
      .eq('org_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership || !['owner', 'admin'].includes(membership.role)) {
      console.error("Permission denied:", membershipError);
      return new Response(
        JSON.stringify({ error: "Only organization owners and admins can add staff members" }),
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
        JSON.stringify({ error: "Organization not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check capacity based on role
    if (role === 'student' && org.seats_used >= org.seat_cap) {
      return new Response(
        JSON.stringify({ error: "Organization has reached maximum student capacity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if ((role === 'instructor' || role === 'instructor_aide') && org.instructors_used >= org.instructor_limit) {
      return new Response(
        JSON.stringify({ error: "Organization has reached maximum instructor capacity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating staff member: ${firstName} ${lastName} (${email}) as ${role}`);

    // Try to create user first, handle "already exists" gracefully
    let newUserId: string;
    let isNewUser = false;

    try {
      // Attempt to create new user
      const tempPassword = crypto.randomUUID();
      
      const { data: newAuthUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: tempPassword,
        email_confirm: false,
        user_metadata: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
        }
      });

      if (createUserError) {
        // Check if user already exists
        if (createUserError.message?.includes('already been registered') || 
            createUserError.code === 'email_exists') {
          console.log(`User ${email} already exists in auth, fetching their ID`);
          
          // Use database function to lookup user ID by email
          const { data: userId, error: fetchError } = await supabase
            .rpc('get_user_id_by_email', { user_email: email.toLowerCase() });
          
          if (fetchError || !userId) {
            console.error('Error fetching user by email:', fetchError);
            throw new Error(`User ${email} exists but could not be fetched: ${fetchError?.message || 'Unknown error'}`);
          }
          
          newUserId = userId;
          isNewUser = false;
          console.log(`Found existing user: ${newUserId}`);
        } else {
          // Different error - throw it
          throw createUserError;
        }
      } else {
        // Successfully created new user
        newUserId = newAuthUser!.user.id;
        isNewUser = true;
        console.log(`Created new auth user: ${newUserId}`);

        // Create profile for new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: newUserId,
            full_name: `${firstName} ${lastName}`,
            display_name: firstName,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
    } catch (authError: any) {
      console.error("Error handling user auth:", authError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to process user account", 
          details: authError?.message 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already a member of this org
    const { data: existingMember } = await supabase
      .from('org_members')
      .select('id, status, role')
      .eq('org_id', orgId)
      .eq('user_id', newUserId)
      .single();

    if (existingMember) {
      if (existingMember.status === 'active') {
        return new Response(
          JSON.stringify({ 
            success: false,
            code: 'ALREADY_MEMBER',
            error: `${firstName} ${lastName} is already an active ${existingMember.role} in this organization`,
            existingRole: existingMember.role
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Reactivate if previously removed/paused
        await supabase
          .from('org_members')
          .update({ status: 'active', role: role })
          .eq('id', existingMember.id);
        
        console.log(`Reactivated existing member with new role: ${role}`);
      }
    }

    // Generate magic link for the user (new or existing)
    let magicLink: string | null = null;
    try {
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email.toLowerCase(),
      });

      if (linkError) {
        console.error('Error generating magic link:', linkError);
      } else {
        magicLink = linkData?.properties?.action_link || null;
        console.log('Magic link generated successfully');
      }
    } catch (linkErr) {
      console.error('Failed to generate magic link:', linkErr);
    }

    // Add user to organization
    const { error: addMemberError } = await supabase
      .from('org_members')
      .insert({
        org_id: orgId,
        user_id: newUserId,
        role: role,
        status: 'active',
      });

    if (addMemberError) {
      console.error("Error adding member:", addMemberError);
      throw new Error("Failed to add member to organization");
    }

    console.log(`Successfully added member to org`);

    // TODO: Send welcome email via Resend when configured
    console.log(`Welcome email would be sent to ${email} (Resend not configured)`);

    // Log to audit_logs
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      organization_id: orgId,
      action_type: 'staff_added',
      resource_type: 'org_member',
      resource_id: newUserId,
      details: {
        added_user_email: email,
        added_user_name: `${firstName} ${lastName}`,
        role: role,
        is_new_user: isNewUser,
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        userId: newUserId,
        isNewUser,
        magicLink,
        email: email.toLowerCase(),
        message: `Successfully added ${firstName} ${lastName} as ${role}`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in add-staff-member function:", error);
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
