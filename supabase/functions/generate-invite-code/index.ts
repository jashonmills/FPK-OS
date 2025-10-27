import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique invite code
    const { data: codeData, error: codeError } = await supabaseClient
      .rpc('generate_invite_code');

    if (codeError) {
      console.error('Error generating code:', codeError);
      throw codeError;
    }

    // Insert invite record
    const { data: invite, error: insertError } = await supabaseClient
      .from('invites')
      .insert({
        invite_code: codeData,
        created_by_user_id: user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting invite:', insertError);
      throw insertError;
    }

    console.log(`Generated invite code ${invite.invite_code} for user ${user.id}`);

    return new Response(
      JSON.stringify({ invite }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-invite-code:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
