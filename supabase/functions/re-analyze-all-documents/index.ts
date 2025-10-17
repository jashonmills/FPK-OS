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
    console.log('🔄 Starting re-analysis job for family:', family_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all documents for this family
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('id, file_name, family_id')
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

    console.log(`📊 Found ${documents.length} documents to re-analyze`);

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
        metadata: { document_count: documents.length }
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error('❌ Error creating job:', jobError);
      throw jobError || new Error('Failed to create job');
    }

    console.log(`✅ Created job: ${job.id}`);

    // Create initial status records for all documents
    const statusRecords = documents.map(doc => ({
      job_id: job.id,
      document_id: doc.id,
      family_id: doc.family_id,
      document_name: doc.file_name,
      status: 'pending'
    }));

    const { error: statusError } = await supabase
      .from('document_analysis_status')
      .insert(statusRecords);

    if (statusError) {
      console.error('❌ Error creating status records:', statusError);
    }

    // Process documents in background using EdgeRuntime.waitUntil
    const backgroundTask = async () => {
      let processedCount = 0;
      let failedCount = 0;

      // Process documents in batches of 3 to avoid overload
      const batchSize = 3;
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (doc) => {
            try {
              console.log(`🔍 Processing ${doc.file_name} (${processedCount + 1}/${documents.length})`);

              // Update status to extracting
              await supabase
                .from('document_analysis_status')
                .update({ 
                  status: 'extracting',
                  started_at: new Date().toISOString()
                })
                .eq('job_id', job.id)
                .eq('document_id', doc.id);

              // Step 1: Extract text with Vision API (force re-extract)
              console.log(`  📄 Extracting text for ${doc.file_name}...`);
              const { error: extractError } = await supabase.functions.invoke(
                'extract-text-with-vision',
                {
                  body: { 
                    document_id: doc.id,
                    force_re_extract: true  // Force fresh extraction
                  }
                }
              );

              if (extractError) {
                throw new Error(`Extraction failed: ${extractError.message}`);
              }

              // Update status to analyzing
              await supabase
                .from('document_analysis_status')
                .update({ status: 'analyzing' })
                .eq('job_id', job.id)
                .eq('document_id', doc.id);

              // Step 2: Analyze document
              console.log(`  🧠 Analyzing ${doc.file_name}...`);
              const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
                'analyze-document',
                {
                  body: { 
                    document_id: doc.id,
                    bypass_limit: true
                  }
                }
              );

              if (analysisError) {
                throw new Error(`Analysis failed: ${analysisError.message}`);
              }

              // Update status to complete
              await supabase
                .from('document_analysis_status')
                .update({ 
                  status: 'complete',
                  metrics_extracted: analysisData?.metrics_count || 0,
                  insights_extracted: analysisData?.insights_count || 0,
                  completed_at: new Date().toISOString()
                })
                .eq('job_id', job.id)
                .eq('document_id', doc.id);

              processedCount++;
              console.log(`✅ Completed ${doc.file_name} (${processedCount}/${documents.length})`);

            } catch (error) {
              console.error(`❌ Failed to process ${doc.file_name}:`, error);
              failedCount++;

              // Update status to failed
              await supabase
                .from('document_analysis_status')
                .update({ 
                  status: 'failed',
                  error_message: error instanceof Error ? error.message : 'Unknown error',
                  completed_at: new Date().toISOString()
                })
                .eq('job_id', job.id)
                .eq('document_id', doc.id);
            }

            // Update job progress
            await supabase
              .from('analysis_jobs')
              .update({
                processed_documents: processedCount,
                failed_documents: failedCount
              })
              .eq('id', job.id);
          })
        );

        // Small delay between batches to avoid rate limits
        if (i + batchSize < documents.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Mark job as complete
      await supabase
        .from('analysis_jobs')
        .update({
          status: failedCount === documents.length ? 'failed' : 'completed',
          completed_at: new Date().toISOString(),
          processed_documents: processedCount,
          failed_documents: failedCount
        })
        .eq('id', job.id);

      console.log(`🎉 Job ${job.id} complete: ${processedCount} processed, ${failedCount} failed`);
    };

    // Start background task (non-blocking)
    // Note: In Deno, we use Promise.resolve to start the background task
    Promise.resolve().then(() => backgroundTask());

    // Return immediately with job ID
    return new Response(
      JSON.stringify({
        success: true,
        job_id: job.id,
        total_documents: documents.length,
        message: 'Re-analysis job started in background'
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
