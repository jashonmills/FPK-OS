import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { family_id, job_id } = await req.json();
    console.log('🚀 Queue processor starting for family:', family_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process in batches of 5 for optimal parallel processing
    const BATCH_SIZE = 5;
    let totalProcessed = 0;
    let totalFailed = 0;
    let continueProcessing = true;

    while (continueProcessing) {
      // Get next batch from queue using database function
      const { data: queueItems, error: queueError } = await supabase
        .rpc('get_next_queue_items', {
          p_family_id: family_id,
          p_limit: BATCH_SIZE
        });

      if (queueError) {
        console.error('❌ Error fetching queue items:', queueError);
        throw queueError;
      }

      if (!queueItems || queueItems.length === 0) {
        console.log('✅ No more items in queue');
        continueProcessing = false;
        break;
      }

      console.log(`📦 Processing batch of ${queueItems.length} documents`);

      // Process all items in parallel using Promise.allSettled
      const processingPromises = queueItems.map(async (item: any) => {
        const startTime = Date.now();
        
        try {
          // Step 1: Extract text with vision
          console.log(`  📄 Extracting: ${item.document_id}`);
          const { error: extractError } = await supabase.functions.invoke(
            'extract-text-with-vision',
            {
              body: { 
                document_id: item.document_id,
                force_re_extract: true
              }
            }
          );

          if (extractError) {
            throw new Error(`Extraction failed: ${extractError.message}`);
          }

          // Step 2: Analyze document
          console.log(`  🧠 Analyzing: ${item.document_id}`);
          const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
            'analyze-document',
            {
              body: { 
                document_id: item.document_id,
                bypass_limit: true
              }
            }
          );

          if (analysisError) {
            throw new Error(`Analysis failed: ${analysisError.message}`);
          }

          // Mark as completed
          const processingTime = Date.now() - startTime;
          await supabase
            .from('analysis_queue')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              processing_time_ms: processingTime
            })
            .eq('id', item.id);

          console.log(`  ✅ Completed: ${item.document_id} (${processingTime}ms)`);
          return { success: true, item };

        } catch (error: any) {
          console.error(`  ❌ Failed: ${item.document_id}`, error.message);
          
          // Update queue item with error
          const processingTime = Date.now() - startTime;
          const retryCount = item.retry_count + 1;
          
          // Check if we should retry
          if (retryCount < item.max_retries && 
              (error.message?.includes('timeout') || error.message?.includes('rate limit'))) {
            // Reset to pending for retry
            await supabase
              .from('analysis_queue')
              .update({
                status: 'pending',
                retry_count: retryCount,
                error_message: error.message,
                processing_time_ms: processingTime
              })
              .eq('id', item.id);
          } else {
            // Mark as permanently failed
            await supabase
              .from('analysis_queue')
              .update({
                status: 'failed',
                retry_count: retryCount,
                error_message: error.message,
                completed_at: new Date().toISOString(),
                processing_time_ms: processingTime
              })
              .eq('id', item.id);
          }

          return { success: false, item, error: error.message };
        }
      });

      // Wait for all parallel processing to complete
      const results = await Promise.allSettled(processingPromises);
      
      // Count successes and failures
      const batchProcessed = results.filter(r => 
        r.status === 'fulfilled' && r.value.success
      ).length;
      const batchFailed = results.filter(r => 
        r.status === 'fulfilled' && !r.value.success
      ).length;

      totalProcessed += batchProcessed;
      totalFailed += batchFailed;

      console.log(`📊 Batch complete: ${batchProcessed} succeeded, ${batchFailed} failed`);

      // Update job progress
      if (job_id) {
        await supabase
          .from('analysis_jobs')
          .update({
            processed_documents: totalProcessed,
            failed_documents: totalFailed
          })
          .eq('id', job_id);
      }

      // Small delay between batches to prevent overwhelming the system
      if (queueItems.length === BATCH_SIZE) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Mark job as complete if all items processed
    if (job_id) {
      const { data: stats } = await supabase.rpc('get_queue_stats', {
        p_family_id: family_id
      });

      const pendingCount = stats?.[0]?.pending_items || 0;
      const processingCount = stats?.[0]?.processing_items || 0;

      if (pendingCount === 0 && processingCount === 0) {
        await supabase
          .from('analysis_jobs')
          .update({
            status: totalFailed > 0 ? 'completed_with_errors' : 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job_id);

        console.log('🎉 Job complete!');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: totalProcessed,
        failed: totalFailed,
        message: `Queue processing complete: ${totalProcessed} succeeded, ${totalFailed} failed`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Queue processor error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
