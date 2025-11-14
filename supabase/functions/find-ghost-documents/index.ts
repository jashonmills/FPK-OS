import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[SENTINEL FAILSAFE] Ghost document detection initiated');

    // Initialize Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Execute the Ghost Hunter query to find completed documents missing from embedding queue
    console.log('[SENTINEL FAILSAFE] Executing ghost detection query...');
    
    const { data: ghostDocuments, error: queryError } = await supabaseAdmin
      .from('bedrock_documents')
      .select(`
        id,
        file_name,
        family_id,
        organization_id,
        student_id,
        analyzed_at
      `)
      .eq('status', 'complete')
      .not('id', 'in', 
        supabaseAdmin
          .from('embedding_queue')
          .select('source_id')
          .eq('source_table', 'bedrock_documents')
      );

    if (queryError) {
      console.error('[SENTINEL FAILSAFE] Ghost detection query failed:', queryError);
      throw queryError;
    }

    console.log(`[SENTINEL FAILSAFE] Ghost documents found: ${ghostDocuments?.length || 0}`);

    if (!ghostDocuments || ghostDocuments.length === 0) {
      console.log('[SENTINEL FAILSAFE] No ghost documents detected. Bridge is secure.');
      return new Response(
        JSON.stringify({
          success: true,
          ghostsFound: 0,
          ghostsRequeued: 0,
          message: 'No ghost documents detected. All analyzed documents are queued for embedding.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Prepare embedding queue jobs for all ghost documents
    const embeddingJobs = ghostDocuments.map(doc => ({
      source_table: 'bedrock_documents',
      source_id: doc.id,
      family_id: doc.family_id,
      organization_id: doc.organization_id,
      student_id: doc.student_id,
      status: 'pending',
      metadata: {
        auto_recovered: true,
        recovered_by: 'sentinel-failsafe',
        recovered_at: new Date().toISOString(),
        document_name: doc.file_name,
        original_analysis_date: doc.analyzed_at
      }
    }));

    console.log('[SENTINEL FAILSAFE] Inserting ghost documents into embedding queue...');
    
    const { data: insertedJobs, error: insertError } = await supabaseAdmin
      .from('embedding_queue')
      .insert(embeddingJobs)
      .select();

    if (insertError) {
      console.error('[SENTINEL FAILSAFE] Failed to insert ghost documents:', insertError);
      throw insertError;
    }

    const requeuedCount = insertedJobs?.length || 0;

    console.log(`[SENTINEL FAILSAFE] Successfully re-queued ${requeuedCount} ghost documents`);
    console.log('[SENTINEL FAILSAFE] Ghost document recovery complete');

    // Log details of recovered documents for audit trail
    ghostDocuments.forEach((doc, index) => {
      console.log(`[SENTINEL FAILSAFE] Recovered ghost #${index + 1}: ${doc.file_name} (ID: ${doc.id})`);
    });

    return new Response(
      JSON.stringify({
        success: true,
        ghostsFound: ghostDocuments.length,
        ghostsRequeued: requeuedCount,
        recoveredDocuments: ghostDocuments.map(doc => ({
          id: doc.id,
          fileName: doc.file_name,
          familyId: doc.family_id
        })),
        message: `Successfully recovered ${requeuedCount} ghost documents and queued them for embedding.`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[SENTINEL FAILSAFE] Critical error during ghost detection:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: 'Ghost detection failed due to internal error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
