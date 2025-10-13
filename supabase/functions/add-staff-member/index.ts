import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
          
          // Fetch existing user by email using admin.getUserByEmail
          const { data: existingUserData, error: fetchError } = await supabase.auth.admin.getUserByEmail(
            email.toLowerCase()
          );
          
          if (fetchError || !existingUserData.user) {
            console.error('Error fetching user by email:', fetchError);
            throw new Error(`User ${email} exists but could not be fetched: ${fetchError?.message || 'Unknown error'}`);
          }
          
          newUserId = existingUserData.user.id;
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

    // Send welcome email
    try {
      const roleDisplay = role === 'instructor_aide' ? 'Instructor Aide' : 
                         role.charAt(0).toUpperCase() + role.slice(1);

      const emailResult = await resend.emails.send({
        from: "FPK University <noreply@fpkuniversity.com>",
        to: [email],
        subject: `Welcome to ${org.name} on FPK University`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${org.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f6f9fc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 48px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                FPK University
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500;">
                Welcome to ${org.name}!
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <p style="margin: 0 0 8px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                Hi ${firstName}!
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                You've been added as a <strong>${roleDisplay}</strong> to <strong>${org.name}</strong> on FPK University.
              </p>
              
              ${isNewUser ? `
              <p style="margin: 0 0 32px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We've created an account for you. Please check your email for a confirmation link to set up your password and access your account.
              </p>
              ` : `
              <p style="margin: 0 0 32px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                You can now access ${org.name} using your existing FPK University account.
              </p>
              `}
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto 32px auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);">
                    <a href="https://fpkuniversity.com/login" 
                       style="display: inline-block; padding: 18px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px;">
                      Access FPK University →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Card -->
              <div style="margin: 32px 0; padding: 24px; background: linear-gradient(to right, #f7fafc, #edf2f7); border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">
                  📧 <strong>Email:</strong> ${email}
                </p>
                <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">
                  🏫 <strong>Organization:</strong> ${org.name}
                </p>
                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                  👤 <strong>Role:</strong> ${roleDisplay}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #e2e8f0; background-color: #fafbfc;">
              <p style="margin: 0 0 12px 0; color: #718096; font-size: 14px; text-align: center;">
                If you have any questions, please contact your organization administrator.
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} <a href="https://fpkuniversity.com" style="color: #667eea; text-decoration: none;">FPK University</a>
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

      console.log("Welcome email sent successfully:", emailResult);
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

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
