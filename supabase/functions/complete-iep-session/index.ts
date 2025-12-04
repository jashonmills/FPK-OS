import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompleteSessionRequest {
  sessionId: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId }: CompleteSessionRequest = await req.json();

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Find the session
    const { data: session, error: sessionError } = await supabase
      .from('parent_iep_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session not found');
    }

    // Mark session as completed
    const { error: updateError } = await supabase
      .from('parent_iep_sessions')
      .update({
        status: 'completed',
        last_activity: new Date().toISOString()
      })
      .eq('id', session.id);

    if (updateError) {
      throw new Error('Failed to complete session');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'IEP preparation form completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in complete-iep-session:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});