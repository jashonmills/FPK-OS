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
    const { family_id } = await req.json();
    console.log('🔄 Starting queue-based re-analysis for family:', family_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all documents for this family with file sizes
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('id, file_name, family_id, file_size_kb')
      .eq('family_id', family_id)
      .order('created_at', { ascending: true });

    if (docsError) {
      console.error('❌ Error fetching documents:', docsError);
      throw docsError;
    }

    if (!documents || documents.length === 0) {
      console.log('ℹ️ No documents found for family');
      return new Response(
        JSON.stringify({ success: true, message: 'No documents to analyze' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Estimate total processing time based on document sizes
    const totalTokens = documents.reduce((sum, doc) => sum + (doc.file_size_kb || 100) * 150, 0);
    const avgTokensPerDoc = totalTokens / documents.length;
    const estimatedMinutes = avgTokensPerDoc > 5000 
      ? Math.ceil(documents.length * 3)  // Large docs: sequential (3 min each)
      : Math.ceil(documents.length / 3);  // Small docs: 3 at a time
    
    // Create analysis job record
    const { data: job, error: jobError } = await supabase
      .from('analysis_jobs')
      .insert({
        family_id,
        job_type: 're-analysis',
        status: 'processing',
        total_documents: documents.length,
        processed_documents: 0,
        failed_documents: 0,
        started_at: new Date().toISOString(),
        metadata: { 
          document_count: documents.length,
          processing_mode: 'smart_batching',
          estimated_time_minutes: estimatedMinutes,
          total_estimated_tokens: totalTokens
        }
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error('❌ Error creating job:', jobError);
      throw jobError || new Error('Failed to create job');
    }

    console.log(`✅ Created job: ${job.id}`);

    // Queue all documents with token estimates
    const queueRecords = documents.map(doc => {
      const estimatedTokens = (doc.file_size_kb || 100) * 150;
      return {
        family_id: doc.family_id,
        document_id: doc.id,
        job_id: job.id,
        priority: estimatedTokens > 5000 ? 10 : 5, // Higher priority for large docs
        status: 'pending',
        estimated_tokens: estimatedTokens
      };
    });

    const { error: queueError } = await supabase
      .from('analysis_queue')
      .insert(queueRecords);

    if (queueError) {
      console.error('❌ Error queuing documents:', queueError);
      throw queueError;
    }

    console.log(`📦 Queued ${documents.length} documents for smart batching (est. ${estimatedMinutes} min)`);

    // Start queue processor in background using EdgeRuntime.waitUntil
    const processQueue = async () => {
      try {
        console.log('🚀 Starting background queue processor...');
        const { error: processError } = await supabase.functions.invoke(
          'process-analysis-queue',
          {
            body: { 
              family_id,
              job_id: job.id
            }
          }
        );

        if (processError) {
          console.error('❌ Queue processor error:', processError);
          
          // Mark job as failed
          await supabase
            .from('analysis_jobs')
            .update({
              status: 'failed',
              error_message: `Queue processor failed: ${processError.message}`,
              completed_at: new Date().toISOString()
            })
            .eq('id', job.id);
        }
      } catch (error) {
        console.error('❌ Background task error:', error);
      }
    };

    // Use EdgeRuntime.waitUntil for proper background task execution
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(processQueue());
    } else {
      // Fallback for local dev
      processQueue();
    }

    // Return immediately with job ID and queue info
    return new Response(
      JSON.stringify({
        success: true,
        job_id: job.id,
        total_documents: documents.length,
        queued_documents: documents.length,
        estimated_time_minutes: estimatedMinutes,
        processing_mode: 'smart_batching',
        message: 'Documents queued for smart batching (small docs in parallel, large docs sequential)'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
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
