import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the requesting user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { orgId, email, firstName, lastName, role } = await req.json();

    if (!orgId || !email || !firstName || !lastName || !role) {
      throw new Error('Missing required fields');
    }

    // Verify user has permission to add staff to this org
    const { data: membership, error: membershipError } = await supabaseClient
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership || !['owner', 'instructor'].includes(membership.role)) {
      throw new Error('Insufficient permissions to add staff members');
    }

    // Check if user with this email already exists in auth
    const { data: { users: existingAuthUsers }, error: listError } = await supabaseClient.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      throw new Error('Failed to check existing users');
    }

    const existingUser = existingAuthUsers?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    let userId: string;

    if (existingUser) {
      // User exists, just add them to the org
      userId = existingUser.id;

      // Check if already a member
      const { data: existingMember } = await supabaseClient
        .from('org_members')
        .select('id')
        .eq('org_id', orgId)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'This user is already a member of the organization',
            code: 'ALREADY_MEMBER'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    } else {
      // Create a new user account
      const tempPassword = crypto.randomUUID();
      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email: email.toLowerCase(),
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError);
        throw new Error('Failed to create user account');
      }

      userId = newUser.user.id;

      // Update or create profile
      await supabaseClient
        .from('profiles')
        .upsert({
          id: userId,
          full_name: `${firstName} ${lastName}`,
          display_name: `${firstName} ${lastName}`,
        });

      // Send password reset email so they can set their own password
      await supabaseClient.auth.admin.generateLink({
        type: 'magiclink',
        email: email.toLowerCase(),
      });
    }

    // Add user to organization
    const { error: memberError } = await supabaseClient
      .from('org_members')
      .insert({
        org_id: orgId,
        user_id: userId,
        role: role,
        status: 'active',
      });

    if (memberError) {
      console.error('Error adding member:', memberError);
      throw new Error('Failed to add member to organization');
    }

    // Log the action
    await supabaseClient.from('activity_log').insert({
      user_id: user.id,
      org_id: orgId,
      event: 'staff_added_manually',
      metadata: {
        added_user_id: userId,
        role: role,
        email: email,
        name: `${firstName} ${lastName}`,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        userId: userId,
        message: 'Staff member added successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in add-staff-member function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
