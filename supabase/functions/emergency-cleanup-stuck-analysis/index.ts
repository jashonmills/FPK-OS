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
    const { family_id } = await req.json();
    console.log('🚨 Emergency cleanup starting for family:', family_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the automated recovery function
    const { data: recoveryResult, error: recoveryError } = await supabase
      .rpc('detect_and_recover_stuck_queue_items');

    if (recoveryError) {
      console.error('❌ Recovery function error:', recoveryError);
      throw recoveryError;
    }

    console.log('✅ Recovery complete:', recoveryResult);

    // Get current queue stats
    const { data: stats } = await supabase
      .rpc('get_queue_stats', { p_family_id: family_id });

    return new Response(
      JSON.stringify({
        success: true,
        recovery: recoveryResult[0],
        current_stats: stats?.[0] || {},
        message: 'Emergency cleanup completed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Emergency cleanup error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
