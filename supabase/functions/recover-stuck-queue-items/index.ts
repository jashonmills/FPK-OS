import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { family_id, job_id } = await req.json();

    if (!family_id) {
      throw new Error('family_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔄 Starting recovery for family:', family_id);

    // Find stuck queue items (processing for >5 minutes with no updates)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: stuckItems, error: fetchError } = await supabase
      .from('analysis_queue')
      .select('*')
      .eq('family_id', family_id)
      .eq('status', 'processing')
      .lt('updated_at', fiveMinutesAgo);

    if (fetchError) {
      console.error('❌ Error fetching stuck items:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${stuckItems?.length || 0} stuck items`);

    if (!stuckItems || stuckItems.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          recovered: 0,
          message: 'No stuck items found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Reset stuck items to pending
    const { error: updateError } = await supabase
      .from('analysis_queue')
      .update({
        status: 'pending',
        started_at: null,
        error_message: 'Recovered from stuck state',
        retry_count: 0, // Reset retry count for fresh attempt
        updated_at: new Date().toISOString()
      })
      .in('id', stuckItems.map(item => item.id));

    if (updateError) {
      console.error('❌ Error updating stuck items:', updateError);
      throw updateError;
    }

    console.log(`✅ Reset ${stuckItems.length} stuck items to pending`);

    // Reset document analysis status for these items
    const documentIds = stuckItems.map(item => item.document_id);
    
    const { error: statusError } = await supabase
      .from('document_analysis_status')
      .update({
        status: 'pending',
        error_message: 'Recovered from stuck state',
        progress_percent: 0,
        current_phase: null
      })
      .in('document_id', documentIds);

    if (statusError) {
      console.error('❌ Error updating document status:', statusError);
      // Non-fatal, continue
    }

    // If a specific job_id was provided, reset it
    if (job_id) {
      const { error: jobError } = await supabase
        .from('analysis_jobs')
        .update({
          status: 'pending',
          error_message: 'Recovered from stuck state - restarting',
          updated_at: new Date().toISOString()
        })
        .eq('id', job_id);

      if (jobError) {
        console.error('❌ Error resetting job:', jobError);
        // Non-fatal, continue
      }

      console.log(`✅ Reset job ${job_id} to pending`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        recovered: stuckItems.length,
        document_ids: documentIds,
        message: `Successfully recovered ${stuckItems.length} stuck items`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Recovery error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
