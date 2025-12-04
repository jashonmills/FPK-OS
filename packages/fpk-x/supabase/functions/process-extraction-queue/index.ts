import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Background processor for extraction queue
 * Processes documents in background with retries and priority handling
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔄 Starting extraction queue processor...');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let processedCount = 0;
    let successCount = 0;
    let failedCount = 0;

    // Process up to 10 items from queue
    const MAX_BATCH_SIZE = 10;

    for (let i = 0; i < MAX_BATCH_SIZE; i++) {
      // Get next job from queue
      const { data: job, error: jobError } = await supabase
        .rpc('get_next_extraction_job')
        .single();

      if (jobError || !job) {
        console.log('📭 Queue empty or error getting job');
        break;
      }

      const jobData = job as {
        queue_id: string;
        document_id: string;
        retry_count: number;
      };

      processedCount++;
      console.log(`📄 Processing job ${jobData.queue_id} for document ${jobData.document_id} (attempt ${jobData.retry_count + 1})`);

      try {
        // Call extract-text-with-vision
        const { data: extractionResult, error: extractionError } = await supabase.functions.invoke(
          'extract-text-with-vision',
          {
            body: {
              document_id: jobData.document_id,
              force_re_extract: jobData.retry_count > 0
            }
          }
        );

        if (extractionError || !extractionResult?.success) {
          throw new Error(extractionResult?.message || extractionError?.message || 'Extraction failed');
        }

        // Mark as completed
        await supabase
          .from('extraction_queue')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            metadata: {
              extracted_length: extractionResult.extracted_length,
              model_used: extractionResult.model_used
            }
          })
          .eq('id', jobData.queue_id);

        successCount++;
        console.log(`✅ Successfully processed document ${jobData.document_id}`);

      } catch (error) {
        failedCount++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Failed to process document ${jobData.document_id}: ${errorMsg}`);

        // Check if should retry
        const shouldRetry = jobData.retry_count < 3;

        if (shouldRetry) {
          // Mark for retry
          await supabase
            .from('extraction_queue')
            .update({
              status: 'pending',
              retry_count: jobData.retry_count + 1,
              error_message: errorMsg,
              started_at: null
            })
            .eq('id', jobData.queue_id);
          
          console.log(`🔄 Queued for retry (attempt ${jobData.retry_count + 2}/3)`);
        } else {
          // Mark as failed
          await supabase
            .from('extraction_queue')
            .update({
              status: 'failed',
              completed_at: new Date().toISOString(),
              error_message: `Max retries exceeded: ${errorMsg}`
            })
            .eq('id', jobData.queue_id);
          
          console.log(`❌ Max retries exceeded, marked as failed`);
        }
      }

      // Small delay between items
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const summary = {
      success: true,
      processed: processedCount,
      succeeded: successCount,
      failed: failedCount,
      timestamp: new Date().toISOString()
    };

    console.log(`📊 Queue processing complete:`, summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Queue processor error:', error);
    
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
