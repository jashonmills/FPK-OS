import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  email: string;
  fullName: string;
  role: 'admin' | 'member';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user from the auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || roleData?.role !== 'admin') {
      console.error('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'User not allowed' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { email, fullName, role }: InviteRequest = await req.json();

    console.log('Inviting user:', { email, fullName, role });

    // Check if user already exists (case-insensitive email comparison)
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    console.log('Found existing user:', existingUser ? existingUser.id : 'none', 'confirmed:', existingUser?.confirmed_at || 'no');

    let inviteData;

    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      
      // If user is confirmed, return error
      if (existingUser.confirmed_at) {
        return new Response(
          JSON.stringify({ error: 'This user is already an active member. They can log in using their existing credentials.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // User exists but not confirmed - update metadata and resend invite
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            full_name: fullName,
            role: role,
          }
        }
      );

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }

      // Resend invite by using inviteUserByEmail again
      const { data: resendData, error: resendError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          data: {
            full_name: fullName,
            role: role,
          },
          redirectTo: `${req.headers.get('origin')}/auth`,
        }
      );

      // Ignore the error if it's about email already registered
      if (resendError && resendError.message !== 'A user with this email address has already been registered') {
        console.error('Error resending invite:', resendError);
        throw resendError;
      }

      inviteData = updateData;
      console.log('Invitation resent to existing user');
    } else {
      // New user - send invite
      const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          data: {
            full_name: fullName,
            role: role,
          },
          redirectTo: `${req.headers.get('origin')}/auth`,
        }
      );

      if (inviteError) {
        console.error('Error inviting user:', inviteError);
        throw inviteError;
      }

      inviteData = data;
      console.log('User invited successfully:', inviteData);
    }

    return new Response(
      JSON.stringify({ success: true, data: inviteData }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in invite-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to invite user' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
