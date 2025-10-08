import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GenerateTokenRequest {
  student_id: string;
  org_slug: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { student_id, org_slug }: GenerateTokenRequest = await req.json();

    console.log('[generate-student-activation] Generating token for student:', student_id);

    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[generate-student-activation] User authenticated:', user.id);

    // Verify student exists and user has permission
    const { data: student, error: studentError } = await supabaseClient
      .from('org_students')
      .select('*, organizations!inner(id, slug)')
      .eq('id', student_id)
      .single();

    if (studentError || !student) {
      console.error('[generate-student-activation] Student not found:', studentError);
      return new Response(
        JSON.stringify({ error: 'Student not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate activation token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .rpc('generate_activation_token');

    if (tokenError || !tokenData) {
      console.error('[generate-student-activation] Token generation error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = tokenData;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiration

    // Update student record with activation token
    const { error: updateError } = await supabaseClient
      .from('org_students')
      .update({
        activation_token: token,
        token_expires_at: expiresAt.toISOString(),
        activation_status: 'pending'
      })
      .eq('id', student_id);

    if (updateError) {
      console.error('[generate-student-activation] Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save activation token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log token generation
    await supabaseClient
      .from('activity_log')
      .insert({
        event: 'student_activation_link_generated',
        user_id: user.id,
        org_id: student.org_id,
        metadata: { student_id, token_expires_at: expiresAt.toISOString() }
      });

    const origin = req.headers.get('origin') || 'https://fpkuniversity.com';
    // CRITICAL: Must use /activate route (not /active) - Updated 2025-10-08
    const activationUrl = `${origin}/${org_slug}/activate?token=${token}`;

    console.log('[generate-student-activation] ✅ Token generated successfully', { 
      activationUrl, 
      origin, 
      org_slug, 
      token: token.substring(0, 8) + '...' 
    });

    return new Response(
      JSON.stringify({
        success: true,
        token,
        activation_url: activationUrl,
        expires_at: expiresAt.toISOString(),
        student_name: student.full_name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-student-activation] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});