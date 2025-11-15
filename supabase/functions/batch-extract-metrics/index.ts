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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { client_id, force_reextract } = await req.json();
    
    console.log('🚀 Batch metric extraction started', { client_id, force_reextract });

    // Find all completed documents that haven't been extracted yet
    const query = supabase
      .from('bedrock_documents')
      .select('id, file_name, status, metrics_extracted')
      .eq('status', 'complete');

    if (client_id) {
      query.eq('client_id', client_id);
    }

    if (!force_reextract) {
      query.or('metrics_extracted.is.null,metrics_extracted.eq.false');
    }

    const { data: documents, error: fetchError } = await query;

    if (fetchError) {
      console.error('❌ Error fetching documents:', fetchError);
      throw fetchError;
    }

    if (!documents || documents.length === 0) {
      console.log('✅ No documents need extraction');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No documents need extraction',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${documents.length} documents to extract`);

    const results = {
      total: documents.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each document
    for (const doc of documents) {
      try {
        console.log(`🔄 Extracting metrics from: ${doc.file_name}`);
        
        // Update extraction attempt timestamp
        await supabase
          .from('bedrock_documents')
          .update({ extraction_attempted_at: new Date().toISOString() })
          .eq('id', doc.id);

        // Call bedrock-extract-metrics function
        const { error: extractError } = await supabase.functions.invoke(
          'bedrock-extract-metrics',
          {
            body: { document_id: doc.id }
          }
        );

        if (extractError) {
          console.error(`❌ Extraction failed for ${doc.file_name}:`, extractError);
          results.failed++;
          results.errors.push(`${doc.file_name}: ${extractError.message}`);
        } else {
          console.log(`✅ Successfully extracted metrics from ${doc.file_name}`);
          results.successful++;
          
          // Mark as extracted
          await supabase
            .from('bedrock_documents')
            .update({ metrics_extracted: true })
            .eq('id', doc.id);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error processing ${doc.file_name}:`, error);
        results.failed++;
        results.errors.push(`${doc.file_name}: ${errorMessage}`);
      }
    }

    console.log('🎉 Batch extraction complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        ...results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Batch extraction error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
