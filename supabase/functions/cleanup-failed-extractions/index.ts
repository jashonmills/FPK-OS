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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Starting cleanup of failed text extractions');

    // Find documents with failed or stuck extraction (older than 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    console.log('📊 Checking for extractions older than:', tenMinutesAgo);
    
    const { data: stuckExtractions, error: fetchError } = await supabase
      .from('document_analysis_status')
      .select('document_id, status, updated_at')
      .in('status', ['extracting', 'failed'])
      .lt('updated_at', tenMinutesAgo);

    if (fetchError) {
      console.error('❌ Error fetching stuck extractions:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database query failed',
          details: fetchError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`📊 Found ${stuckExtractions?.length || 0} stuck extraction(s)`);

    if (!stuckExtractions || stuckExtractions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          cleaned: 0,
          message: 'No stuck extractions found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const documentIds = stuckExtractions.map(item => item.document_id);
    console.log('🗑️ Document IDs to clean:', documentIds);

    // Delete the stuck documents and their related data
    // This will cascade delete related records thanks to foreign keys
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .in('id', documentIds);

    if (deleteError) {
      console.error('❌ Error deleting stuck documents:', deleteError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete documents',
          details: deleteError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`✅ Deleted ${documentIds.length} stuck document(s)`);

    // Also clean up any orphaned document_analysis_status records
    const { error: statusCleanupError } = await supabase
      .from('document_analysis_status')
      .delete()
      .in('document_id', documentIds);

    if (statusCleanupError) {
      console.error('⚠️ Error cleaning up status records:', statusCleanupError);
      // Non-fatal, continue
    }

    // Clean up any related queue items
    const { error: queueCleanupError } = await supabase
      .from('analysis_queue')
      .delete()
      .in('document_id', documentIds);

    if (queueCleanupError) {
      console.error('⚠️ Error cleaning up queue items:', queueCleanupError);
      // Non-fatal, continue
    }

    return new Response(
      JSON.stringify({
        success: true,
        cleaned: documentIds.length,
        document_ids: documentIds,
        message: `Successfully cleaned up ${documentIds.length} stuck extraction(s)`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'UnknownError'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
