import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔄 Queue processor starting...');

    // Get next job
    const { data: job, error: jobError } = await supabase.rpc('get_next_queue_job');
    
    if (jobError) {
      console.error('❌ Error getting next job:', jobError);
      return new Response(
        JSON.stringify({ error: jobError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!job || job.length === 0) {
      console.log('✅ No jobs in queue');
      return new Response(
        JSON.stringify({ message: 'No jobs to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentJob = job[0];
    console.log(`📋 Processing job: ${currentJob.id} (${currentJob.job_type})`);

    // Mark as processing
    await supabase
      .from('document_processing_queue')
      .update({ 
        status: 'processing', 
        started_at: new Date().toISOString() 
      })
      .eq('id', currentJob.id);

    const startTime = Date.now();
    
    try {
      if (currentJob.job_type === 'EXTRACT') {
        await processExtraction(supabase, currentJob);
      } else if (currentJob.job_type === 'ANALYZE') {
        await processAnalysis(supabase, currentJob);
      }

      const processingTime = Date.now() - startTime;

      // Mark as completed
      await supabase
        .from('document_processing_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          processing_time_ms: processingTime
        })
        .eq('id', currentJob.id);

      console.log(`✅ Job completed in ${processingTime}ms`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          job_id: currentJob.id,
          processing_time_ms: processingTime
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error: any) {
      console.error(`❌ Job failed:`, error);
      
      const processingTime = Date.now() - startTime;
      const retryCount = currentJob.retry_count + 1;
      const maxRetries = 5;

      if (retryCount < maxRetries) {
        // Calculate exponential backoff: 5s, 10s, 20s, 40s, 80s
        const backoffSeconds = Math.pow(2, retryCount) * 5;
        const processAfter = new Date(Date.now() + backoffSeconds * 1000).toISOString();

        await supabase
          .from('document_processing_queue')
          .update({
            status: 'queued',
            retry_count: retryCount,
            last_error: { 
              message: error.message,
              timestamp: new Date().toISOString(),
              attempt: retryCount
            },
            process_after: processAfter,
            started_at: null,
            processing_time_ms: processingTime
          })
          .eq('id', currentJob.id);

        console.log(`⏰ Retry scheduled for ${backoffSeconds}s from now (attempt ${retryCount}/${maxRetries})`);
      } else {
        // Max retries exceeded
        await supabase
          .from('document_processing_queue')
          .update({
            status: 'failed',
            last_error: {
              message: `Max retries exceeded: ${error.message}`,
              timestamp: new Date().toISOString(),
              final_attempt: retryCount
            },
            completed_at: new Date().toISOString(),
            processing_time_ms: processingTime
          })
          .eq('id', currentJob.id);

        console.log(`❌ Max retries exceeded`);
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          retry_count: retryCount,
          will_retry: retryCount < maxRetries
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error('💥 Queue processor error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processExtraction(supabase: any, job: any) {
  console.log(`📄 Extracting text from document ${job.document_id}`);

  // Fetch document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', job.document_id)
    .single();

  if (docError || !document) {
    throw new Error(`Document not found: ${docError?.message}`);
  }

  // Download file from storage
  const filePath = document.file_path.split('/family-documents/')[1];
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('family-documents')
    .download(filePath);

  if (downloadError || !fileData) {
    throw new Error(`Failed to download file: ${downloadError?.message}`);
  }

  const fileBytes = new Uint8Array(await fileData.arrayBuffer());
  const base64 = btoa(String.fromCharCode(...fileBytes));
  const mediaType = document.file_type.includes('pdf') ? 'application/pdf' : 'image/jpeg';

  // Call AI Gateway for extraction
  const gatewayUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-gateway`;
  const response = await fetch(gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      job_type: 'extract_text',
      data: {
        base64_file: base64,
        media_type: mediaType
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI Gateway extraction failed: ${error}`);
  }

  const result = await response.json();

  // Update document with extracted content
  await supabase
    .from('documents')
    .update({
      extracted_content: result.text,
      updated_at: new Date().toISOString()
    })
    .eq('id', job.document_id);

  // Create ANALYZE job
  await supabase
    .from('document_processing_queue')
    .insert({
      document_id: job.document_id,
      family_id: job.family_id,
      job_type: 'ANALYZE',
      status: 'queued',
      priority: 0
    });

  // Update queue job with provider used
  await supabase
    .from('document_processing_queue')
    .update({ ai_provider_used: result.provider })
    .eq('id', job.id);

  console.log(`✅ Extraction complete (provider: ${result.provider})`);
}

async function processAnalysis(supabase: any, job: any) {
  console.log(`🔍 Analyzing document ${job.document_id}`);

  // Fetch document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', job.document_id)
    .single();

  if (docError || !document) {
    throw new Error(`Document not found: ${docError?.message}`);
  }

  if (!document.extracted_content) {
    throw new Error('No extracted content available');
  }

  // Call existing analyze-document function
  const analyzeUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/analyze-document`;
  const response = await fetch(analyzeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      document_id: job.document_id,
      bypass_limit: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Analysis failed: ${error}`);
  }

  const result = await response.json();
  console.log(`✅ Analysis complete`);
}
