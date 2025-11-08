import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// FIX #4: Job Recovery Mechanism
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Starting stuck job recovery...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const stuckThresholdMinutes = 10;
    const stuckThreshold = new Date(Date.now() - stuckThresholdMinutes * 60 * 1000).toISOString();

    // Find stuck jobs
    const { data: stuckJobs, error: jobsError } = await supabase
      .from('analysis_jobs')
      .select('*')
      .eq('status', 'processing')
      .lt('started_at', stuckThreshold);

    if (jobsError) {
      throw jobsError;
    }

    console.log(`📊 Found ${stuckJobs?.length || 0} stuck jobs`);

    let recoveredJobs = 0;
    let recoveredQueueItems = 0;
    let recoveredStatusRecords = 0;

    // Recover each stuck job
    for (const job of stuckJobs || []) {
      console.log(`🔄 Recovering job ${job.id}...`);

      // Reset job to pending
      const { error: jobUpdateError } = await supabase
        .from('analysis_jobs')
        .update({
          status: 'pending',
          error_message: `Auto-recovered after being stuck for ${stuckThresholdMinutes}+ minutes`,
          metadata: {
            ...job.metadata,
            recovered_at: new Date().toISOString(),
            recovered_from_stuck: true,
            previous_started_at: job.started_at
          }
        })
        .eq('id', job.id);

      if (jobUpdateError) {
        console.error(`❌ Failed to update job ${job.id}:`, jobUpdateError);
        continue;
      }

      // Reset stuck queue items for this job
      const { data: queueItems, error: queueFetchError } = await supabase
        .from('analysis_queue')
        .select('*')
        .eq('job_id', job.id)
        .in('status', ['processing', 'failed']);

      if (!queueFetchError && queueItems) {
        for (const item of queueItems) {
          const { error: queueUpdateError } = await supabase
            .from('analysis_queue')
            .update({
              status: 'pending',
              error_message: null,
              started_at: null,
              completed_at: null,
              retry_count: (item.retry_count || 0) + 1
            })
            .eq('id', item.id);

          if (!queueUpdateError) {
            recoveredQueueItems++;
          }
        }
      }

      // Reset stuck document_analysis_status records
      const { data: statusRecords, error: statusFetchError } = await supabase
        .from('document_analysis_status')
        .select('*')
        .eq('job_id', job.id)
        .in('status', ['extracting', 'analyzing']);

      if (!statusFetchError && statusRecords) {
        for (const status of statusRecords) {
          const { error: statusUpdateError } = await supabase
            .from('document_analysis_status')
            .update({
              status: 'pending',
              error_message: 'Recovered from stuck state',
              started_at: null
            })
            .eq('id', status.id);

          if (!statusUpdateError) {
            recoveredStatusRecords++;
          }
        }
      }

      recoveredJobs++;
      console.log(`✅ Recovered job ${job.id}`);
    }

    console.log(`✅ Recovery complete: ${recoveredJobs} jobs, ${recoveredQueueItems} queue items, ${recoveredStatusRecords} status records`);

    return new Response(
      JSON.stringify({
        success: true,
        recovered_jobs: recoveredJobs,
        recovered_queue_items: recoveredQueueItems,
        recovered_status_records: recoveredStatusRecords,
        stuck_threshold_minutes: stuckThresholdMinutes
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
